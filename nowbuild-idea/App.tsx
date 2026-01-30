
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Project, Message, Language, InvestorFeedback } from './types';
import { storage } from './services/storage';
import { geminiService, decode, decodeAudioData, encode } from './services/gemini';
import { TEXTS, INITIAL_PLAN_TEMPLATE, getDisplayProjectName, getDisplayPlanContent } from './constants';
import { IconPlus, IconSend, SectionHeader, Button, Avatar, LoadingDot, IconMeet, IconMic, IconKeyboard, IconMenu, IconSidebar, IconX } from './components/ui';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Reusable Voice Bar Component
const VoiceBar = ({ audioUrl, isModel }: { audioUrl: string; isModel: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  if (!audioUrl) return null;

  return (
    <div 
      onClick={togglePlay}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all border ${
        isModel 
          ? 'bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100' 
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
      }`}
    >
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        onPlay={() => setIsPlaying(true)} 
        onPause={() => setIsPlaying(false)} 
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isModel ? 'bg-blue-600 text-white' : 'bg-gray-900 text-white'}`}>
        {isPlaying ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        )}
      </div>
      <div className="flex-1 h-4 flex items-center gap-1 min-w-[60px]">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className={`w-1 rounded-full bg-current opacity-40 ${isPlaying ? 'animate-pulse' : ''}`}
            style={{ 
              height: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 shrink-0">
        {isPlaying ? 'Playing' : 'Voice'}
      </span>
    </div>
  );
};

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [inputValue, setInputValue] = useState('');
  const [isMentorLoading, setIsMentorLoading] = useState(false);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [isInvestorLoading, setIsInvestorLoading] = useState(false);
  const [planMode, setPlanMode] = useState<'view' | 'edit'>('view');
  
  // Mobile View State
  const [mobileView, setMobileView] = useState<'chat' | 'projects' | 'plan'>('chat');
  
  // Voice UI States
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState<'idle' | 'listening' | 'thinking'>('idle');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentProject = projects.find(p => p.id === currentProjectId) || null;
  const t = TEXTS[language];

  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const liveSessionRef = useRef<any>(null);

  // Live Transcription Buffers
  const liveUserTranscript = useRef<string>("");
  const liveModelTranscript = useRef<string>("");

  useEffect(() => {
    const savedProjects = storage.getProjects();
    const savedLastId = storage.getLastProjectId();
    const savedLang = storage.getLanguage();
    let initialLang: Language = savedLang || (navigator.language.toLowerCase().includes('zh') ? 'cn' : 'en');
    setLanguage(initialLang);
    storage.saveLanguage(initialLang);
    
    if (savedProjects && savedProjects.length > 0) {
      setProjects(savedProjects);
      const lastProject = savedProjects.find(p => p.id === savedLastId);
      setCurrentProjectId(lastProject ? lastProject.id : savedProjects[0].id);
    } else {
      createNewProject(initialLang, []);
    }
  }, []);

  useEffect(() => { 
    if (projects.length > 0) storage.saveProjects(projects); 
  }, [projects]);

  useEffect(() => { 
    if (currentProjectId) storage.saveLastProjectId(currentProjectId); 
  }, [currentProjectId]);

  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [currentProject?.messages, isMentorLoading]);

  // Reset mobile view to chat when a project is selected
  useEffect(() => {
    setMobileView('chat');
  }, [currentProjectId]);

  const createNewProject = useCallback((lang: Language = language, currentList = projects) => {
    const newProject: Project = {
      id: generateId(),
      name: lang === 'cn' ? '新创业项目' : 'New Venture',
      createdAt: Date.now(),
      messages: [],
      currentPlan: INITIAL_PLAN_TEMPLATE(lang),
      planHistory: [],
      investorFeedback: null
    };
    setProjects([newProject, ...currentList]);
    setCurrentProjectId(newProject.id);
    setMobileView('chat'); // Switch to chat automatically on new project
  }, [language, projects]);

  const updateProject = useCallback((updated: Project) => {
    if (!updated || !updated.id) return;
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  }, []);

  const handlePlanEdit = useCallback((newContent: string) => {
    if (!currentProject) return;
    updateProject({ ...currentProject, currentPlan: newContent });
  }, [currentProject, updateProject]);

  // --- Voice Input Logic (Hold to Talk) ---
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startVoiceInput = async () => {
    try {
      setIsVoiceRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.start();
    } catch (err) {
      console.error("Failed to start recording", err);
      setIsVoiceRecording(false);
    }
  };

  const stopAndSendVoice = async () => {
    if (!mediaRecorderRef.current) return;
    setIsVoiceRecording(false);
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      handleSendMessage(true, audioBlob, audioUrl);
    };
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
  };

  const playTTS = async (text: string): Promise<string> => {
    try {
      const base64 = await geminiService.generateTTS(text);
      if (base64) {
        return `data:audio/mp3;base64,${base64}`;
      }
    } catch (e) { console.error("TTS Error", e); }
    return "";
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSendMessage = async (isVoice: boolean = false, audioBlob?: Blob, audioUrl?: string) => {
    let text = inputValue;
    if (isVoice && audioBlob) {
      setIsTranscribing(true);
      try {
        const base64 = await blobToBase64(audioBlob);
        text = await geminiService.transcribeAudio(base64, audioBlob.type, language);
      } catch (e) {
        console.error("Transcription failed", e);
        text = "Transcription failed";
      }
      setIsTranscribing(false);
    }

    if (!text.trim() || !currentProject) return;

    const userMsg: Message = { 
      id: generateId(), 
      role: 'user', 
      content: text, 
      timestamp: Date.now(), 
      isVoice,
      audioUrl: audioUrl
    };
    
    // Add user message to state
    const updatedHistory = [...(currentProject.messages || []), userMsg];
    updateProject({ ...currentProject, messages: updatedHistory });
    setInputValue('');
    setIsMentorLoading(true);

    try {
      // Create empty mentor message placeholder
      const mentorMsgId = generateId();
      const mentorMsgPlaceholder: Message = { 
        id: mentorMsgId, 
        role: 'model', 
        content: "", 
        timestamp: Date.now(),
        isVoice: isVoice
      };
      
      setProjects(prev => prev.map(p => p.id === currentProjectId 
        ? { ...p, messages: [...p.messages, mentorMsgPlaceholder] } 
        : p
      ));
      
      setIsMentorLoading(false); // Stop loading indicator once streaming starts

      let accumulatedText = "";
      const stream = await geminiService.chatWithMentor(updatedHistory, currentProject.currentPlan, language);
      
      for await (const chunk of stream) {
        const chunkText = chunk.text || "";
        accumulatedText += chunkText;
        
        // Update the mentor message with accumulated text
        setProjects(prev => prev.map(p => p.id === currentProjectId ? {
          ...p,
          messages: p.messages.map(m => m.id === mentorMsgId ? { ...m, content: accumulatedText } : m)
        } : p));
      }

      // After streaming is complete, generate TTS if in voice mode
      if (isVoice && accumulatedText) {
        const modelAudioUrl = await playTTS(accumulatedText);
        setProjects(prev => prev.map(p => p.id === currentProjectId ? {
          ...p,
          messages: p.messages.map(m => m.id === mentorMsgId ? { ...m, audioUrl: modelAudioUrl } : m)
        } : p));
      }

      // Trigger background updates with the final full text
      const finalHistory = [...updatedHistory, { ...mentorMsgPlaceholder, content: accumulatedText }];
      
      setIsAssistantLoading(true);
      const newPlan = await geminiService.updateBusinessPlan(finalHistory, currentProject.currentPlan, language);
      setProjects(prev => prev.map(p => p.id === currentProjectId ? { ...p, currentPlan: newPlan } : p));
      setIsAssistantLoading(false);

      setIsInvestorLoading(true);
      const feedback = await geminiService.reviewPlan(newPlan, language);
      setProjects(prev => prev.map(p => p.id === currentProjectId ? { ...p, investorFeedback: feedback } : p));
      setIsInvestorLoading(false);
      
    } catch (error) {
      console.error(error);
      setIsMentorLoading(false);
      setIsAssistantLoading(false);
      setIsInvestorLoading(false);
    }
  };

  // --- Meeting Logic (Live API) ---
  const startMeeting = async () => {
    if (!currentProject) return;
    setIsMeetingOpen(true);
    setMeetingStatus('listening');
    if (!outputAudioContextRef.current) {
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = outputAudioContextRef.current;
    
    // Reset transcripts
    liveUserTranscript.current = "";
    liveModelTranscript.current = "";

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const sessionPromise = geminiService.connectLive({
        lang: language,
        currentPlan: currentProject.currentPlan || "",
        history: currentProject.messages || [],
        callbacks: {
          onOpen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onMessage: async (msg) => {
            // 1. Handle Transcriptions
            if (msg.serverContent?.inputTranscription) {
               liveUserTranscript.current += msg.serverContent.inputTranscription.text;
            }
            if (msg.serverContent?.outputTranscription) {
               liveModelTranscript.current += msg.serverContent.outputTranscription.text;
            }

            // 2. Handle Audio Output
            if (msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
              setMeetingStatus('thinking');
              
              // If model starts speaking and we have a user transcript pending, commit it.
              if (liveUserTranscript.current.trim()) {
                 const text = liveUserTranscript.current.trim();
                 liveUserTranscript.current = ""; // Clear buffer
                 
                 setProjects(prev => {
                    const active = prev.find(p => p.id === currentProjectId);
                    if (!active) return prev;
                    if (active.messages.length > 0 && active.messages[active.messages.length - 1].role === 'user' && active.messages[active.messages.length - 1].content === text) return prev;
                    
                    const userMsg: Message = { 
                      id: generateId(), 
                      role: 'user', 
                      content: text, 
                      timestamp: Date.now(), 
                      isVoice: true 
                    };
                    return prev.map(p => p.id === active.id ? { ...p, messages: [...p.messages, userMsg] } : p);
                 });
              }

              const audioData = decode(msg.serverContent.modelTurn.parts[0].inlineData.data);
              const audioBuffer = await decodeAudioData(audioData, ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
            }

            // 3. Handle Turn Complete (Model finished)
            if (msg.serverContent?.turnComplete) {
              setMeetingStatus('listening');
              
              // Commit Model transcript
              if (liveModelTranscript.current.trim()) {
                 const text = liveModelTranscript.current.trim();
                 liveModelTranscript.current = "";
                 
                 setProjects(prev => {
                    const active = prev.find(p => p.id === currentProjectId);
                    if (!active) return prev;
                    
                    const modelMsg: Message = { 
                      id: generateId(), 
                      role: 'model', 
                      content: text, 
                      timestamp: Date.now(), 
                      isVoice: true 
                    };
                    return prev.map(p => p.id === active.id ? { ...p, messages: [...p.messages, modelMsg] } : p);
                 });
              }
            }
          },
          onClose: () => { 
            stream.getTracks().forEach(t => t.stop()); 
            if (inputCtx.state !== 'closed') inputCtx.close().catch(console.error);
          },
          onError: (e) => { console.error(e); setIsMeetingOpen(false); }
        }
      });
      liveSessionRef.current = { sessionPromise, inputCtx, stream };
    } catch (err) { console.error(err); setIsMeetingOpen(false); }
  };

  const endMeeting = useCallback(() => {
    setIsMeetingOpen(false);
    if (liveSessionRef.current) {
      const { sessionPromise, inputCtx, stream } = liveSessionRef.current;
      sessionPromise.then((s: any) => s.close()).catch(console.error);
      if (inputCtx && inputCtx.state !== 'closed') inputCtx.close().catch(console.error);
      if (stream) stream.getTracks().forEach((t: any) => t.stop());
      liveSessionRef.current = null;
    }
  }, []);

  if (!currentProject) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-gray-400">
        <div className="flex flex-col items-center gap-4">
          <LoadingDot />
          <span className="text-xs uppercase tracking-widest font-semibold">Initialising Workspace</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gray-50">
      {/* Navbar */}
      <nav className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          {/* Mobile Projects Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" className="p-1" onClick={() => setMobileView('projects')}>
               <IconMenu />
            </Button>
          </div>
          
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold rounded-md">N</div>
          <span className="font-semibold text-gray-900 tracking-tight">NowBuild</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <Button variant="primary">{t.nav_execute}</Button>
          </div>
          {/* Mobile Plan Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" className="p-1" onClick={() => setMobileView('plan')}>
               <IconSidebar />
            </Button>
          </div>
          <div className="hidden md:block">
            <Avatar />
          </div>
        </div>
      </nav>

      {/* Main Grid */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Projects Column - Hidden on mobile unless toggled */}
        <aside className={`
          w-64 border-r border-gray-200 bg-gray-50/50 flex-col shrink-0 transition-transform duration-300
          ${mobileView === 'projects' ? 'fixed inset-0 z-50 flex w-full bg-white' : 'hidden md:flex'}
        `}>
          {/* Mobile Header with Close */}
          <div className="md:hidden h-14 flex items-center justify-between px-4 border-b border-gray-100">
            <span className="font-bold text-gray-900">{t.col_projects}</span>
            <Button variant="ghost" onClick={() => setMobileView('chat')}><IconX /></Button>
          </div>

          <SectionHeader title={t.col_projects} action={<button onClick={() => createNewProject()}><IconPlus /></button>} />
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {projects.map(p => (
              <div key={p.id} onClick={() => setCurrentProjectId(p.id)} className={`p-3 rounded-md cursor-pointer text-sm transition-all ${p.id === currentProjectId ? 'bg-white shadow-sm border border-gray-200 font-medium text-gray-900' : 'text-gray-500 hover:bg-gray-200/50'}`}>
                <div className="truncate">{getDisplayProjectName(p.name || '', language)}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Column - Always visible on Desktop, Center of attention on Mobile */}
        <section className="flex-1 flex flex-col border-r border-gray-200 bg-white relative max-w-2xl w-full">
          <SectionHeader 
            title={t.col_mentor} 
            action={
              <button onClick={startMeeting} className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors">
                <IconMeet /> {t.nav_meet}
              </button>
            } 
          />
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {(currentProject.messages || []).map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed space-y-3 ${msg.role === 'user' ? 'bg-gray-100 text-gray-900' : 'bg-white border text-gray-800'}`}>
                  {msg.role === 'model' && <div className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">MENTOR</div>}
                  
                  {/* Voice Bar */}
                  {msg.audioUrl && <VoiceBar audioUrl={msg.audioUrl} isModel={msg.role === 'model'} />}
                  
                  {/* Content */}
                  <div className={msg.isVoice ? 'text-xs text-gray-500 italic' : ''}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isMentorLoading && <div className="text-xs text-gray-400 flex items-center gap-2">MENTOR <LoadingDot /></div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              <button onClick={() => setInputMode(inputMode === 'text' ? 'voice' : 'text')} className="p-2 text-gray-400 hover:text-black transition-colors">
                {inputMode === 'text' ? <IconMic /> : <IconKeyboard />}
              </button>
              
              {inputMode === 'text' ? (
                <div className="relative flex-1">
                  <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all" placeholder={t.col_mentor_placeholder} />
                  <button onClick={() => handleSendMessage()} className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-gray-900"><IconSend /></button>
                </div>
              ) : (
                <div className="flex-1 relative">
                  <button onMouseDown={startVoiceInput} onMouseUp={stopAndSendVoice} onTouchStart={startVoiceInput} onTouchEnd={stopAndSendVoice} className={`w-full py-3 text-sm font-medium rounded-lg border-2 border-dashed transition-all active:scale-95 ${isVoiceRecording ? 'bg-red-50 border-red-500 text-red-600' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>
                    {isVoiceRecording ? t.voice_release_to_send : t.voice_hold_to_talk}
                  </button>
                  {isTranscribing && (
                    <div className="absolute -top-8 left-0 right-0 text-center animate-pulse">
                      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{t.voice_transcribing}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Business Plan Column - Hidden on mobile unless toggled */}
        <section className={`
          flex-1 flex flex-col bg-gray-50 relative md:min-w-[400px] transition-transform duration-300
          ${mobileView === 'plan' ? 'fixed inset-0 z-50 flex w-full bg-white' : 'hidden md:flex'}
        `}>
          {/* Mobile Header with Close */}
          <div className="md:hidden h-14 flex items-center justify-between px-4 border-b border-gray-100">
             <span className="font-bold text-gray-900">{t.col_plan}</span>
             <Button variant="ghost" onClick={() => setMobileView('chat')}><IconX /></Button>
          </div>

          <SectionHeader title={t.col_plan} action={
            <div className="flex bg-gray-200/50 rounded p-0.5">
              <button onClick={() => setPlanMode('view')} className={`px-3 py-1 text-[10px] font-bold uppercase transition-all ${planMode === 'view' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>{t.col_plan_view}</button>
              <button onClick={() => setPlanMode('edit')} className={`px-3 py-1 text-[10px] font-bold uppercase transition-all ${planMode === 'edit' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>{t.col_plan_edit}</button>
            </div>
          } />
          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm min-h-[500px]">
              {planMode === 'view' ? <div className="prose prose-sm max-w-none prose-gray"><ReactMarkdown>{getDisplayPlanContent(currentProject.currentPlan || '', language)}</ReactMarkdown></div> : <textarea className="w-full h-[600px] outline-none text-sm font-mono text-gray-700 leading-relaxed resize-none" value={currentProject.currentPlan || ''} onChange={(e) => handlePlanEdit(e.target.value)} />}
            </div>
            {currentProject.investorFeedback && (
              <div className="mt-6 p-5 bg-black text-white rounded-lg shadow-xl border border-gray-800">
                <div className="text-4xl font-light mb-4 tracking-tighter">{currentProject.investorFeedback.score} <span className="text-xs text-gray-500 tracking-normal">/ 100</span></div>
                <h4 className="text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">{t.col_investor_questions}</h4>
                <ul className="space-y-3 text-sm text-gray-300">
                  {currentProject.investorFeedback.questions.map((q, i) => <li key={i} className="pl-3 border-l border-red-500/50">{q}</li>)}
                </ul>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Live Meeting Modal */}
      {isMeetingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="max-w-xl w-full p-8 text-center space-y-12">
            <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">{t.voice_meeting_title}</div>
            <div className="relative flex justify-center">
               <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${meetingStatus === 'listening' ? 'bg-blue-50 scale-110 shadow-[0_0_50px_rgba(59,130,246,0.1)]' : 'bg-gray-50 scale-100'}`}>
                 <div className={`w-4 h-4 rounded-full transition-all duration-300 ${meetingStatus === 'listening' ? 'bg-blue-600 animate-pulse' : 'bg-gray-300'}`}></div>
               </div>
               {meetingStatus === 'listening' && <div className="absolute inset-0 flex items-center justify-center"><div className="w-40 h-40 border border-blue-200 rounded-full animate-ping opacity-20"></div></div>}
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-light tracking-tight text-gray-900 uppercase">{meetingStatus === 'listening' ? t.voice_meeting_status_listening : t.voice_meeting_status_thinking}</h2>
              <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">Gemini Live is active. Speak naturally, the mentor will respond automatically after a pause.</p>
            </div>
            <div className="pt-8"><Button onClick={endMeeting} variant="outline" className="border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 mx-auto py-3 px-8 rounded-full shadow-sm">{t.voice_meeting_close}</Button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
