import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'wouter';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import type { Project, Message, Language, InvestorFeedback } from '@/features/idea/types';
import { ideaStorage } from '@/features/idea/storage';
import { geminiService, decode, decodeAudioData, encode } from '@/features/idea/gemini';
import { INITIAL_PLAN_TEMPLATE, getDisplayProjectName, getDisplayPlanContent } from '@/features/idea/constants';
import { IconPlus, IconSend, SectionHeader, IdeaButton, IdeaAvatar, LoadingDot, IconMeet, IconMic, IconKeyboard, IconMenu, IconSidebar, IconX, IconArrowRight } from '@/features/idea/components/IdeaUi';
import logoImg from '@/assets/logo.png';

function i18nLangToIdeaLang(lng: string): Language {
  return (lng && (lng.startsWith('zh') || lng === 'cn')) ? 'cn' : 'en';
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const VoiceBar = ({ audioUrl, isModel, labelVoice, labelPlaying }: { audioUrl: string; isModel: boolean; labelVoice: string; labelPlaying: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
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
          ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
          : 'bg-muted/50 border-border text-foreground hover:bg-muted'
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
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isModel ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-foreground'}`}>
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
            style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 shrink-0">
        {isPlaying ? labelPlaying : labelVoice}
      </span>
    </div>
  );
};

export default function Idea() {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>(() => i18nLangToIdeaLang(i18n.language || ''));
  const [inputValue, setInputValue] = useState('');
  const [isMentorLoading, setIsMentorLoading] = useState(false);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [isInvestorLoading, setIsInvestorLoading] = useState(false);
  const [planMode, setPlanMode] = useState<'view' | 'edit'>('view');
  const [mobileView, setMobileView] = useState<'chat' | 'projects' | 'plan'>('chat');
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState<'idle' | 'listening' | 'thinking'>('idle');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentProject = projects.find(p => p.id === currentProjectId) || null;

  // 与首页语言设置同步：i18n 变化时更新 Idea 页语言（用于 API/业务逻辑）并持久化
  useEffect(() => {
    const next = i18nLangToIdeaLang(i18n.language || '');
    setLanguage(next);
    ideaStorage.saveLanguage(next);
  }, [i18n.language]);

  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const liveSessionRef = useRef<{ sessionPromise: Promise<{ close: () => void; sendRealtimeInput: (x: unknown) => void }>; inputCtx: AudioContext; stream: MediaStream } | null>(null);
  const liveUserTranscript = useRef<string>("");
  const liveModelTranscript = useRef<string>("");

  useEffect(() => {
    const savedProjects = ideaStorage.getProjects();
    const savedLastId = ideaStorage.getLastProjectId();
    const initialLang = i18nLangToIdeaLang(i18n.language || '');
    setLanguage(initialLang);
    ideaStorage.saveLanguage(initialLang);

    if (savedProjects && savedProjects.length > 0) {
      setProjects(savedProjects);
      const lastProject = savedProjects.find(p => p.id === savedLastId);
      setCurrentProjectId(lastProject ? lastProject.id : savedProjects[0].id);
    } else {
      createNewProject(initialLang, []);
    }
  }, []);

  useEffect(() => {
    if (projects.length > 0) ideaStorage.saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    if (currentProjectId) ideaStorage.saveLastProjectId(currentProjectId);
  }, [currentProjectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentProject?.messages, isMentorLoading]);

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
    setMobileView('chat');
  }, [language, projects]);

  const updateProject = useCallback((updated: Project) => {
    if (!updated?.id) return;
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  }, []);

  const handlePlanEdit = useCallback((newContent: string) => {
    if (!currentProject) return;
    updateProject({ ...currentProject, currentPlan: newContent });
  }, [currentProject, updateProject]);

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
      if (base64) return `data:audio/mp3;base64,${base64}`;
    } catch (e) { console.error("TTS Error", e); }
    return "";
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64 || '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSendMessage = async (isVoice = false, audioBlob?: Blob, audioUrl?: string) => {
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
      audioUrl
    };

    const updatedHistory = [...(currentProject.messages || []), userMsg];
    updateProject({ ...currentProject, messages: updatedHistory });
    setInputValue('');
    setIsMentorLoading(true);

    try {
      const mentorMsgId = generateId();
      const mentorMsgPlaceholder: Message = {
        id: mentorMsgId,
        role: 'model',
        content: "",
        timestamp: Date.now(),
        isVoice
      };

      setProjects(prev => prev.map(p => p.id === currentProjectId
        ? { ...p, messages: [...p.messages, mentorMsgPlaceholder] }
        : p
      ));

      setIsMentorLoading(false);

      let accumulatedText = "";
      const stream = await geminiService.chatWithMentor(updatedHistory, currentProject.currentPlan, language);

      for await (const chunk of stream) {
        const chunkText = (chunk as { text?: string }).text || "";
        accumulatedText += chunkText;
        setProjects(prev => prev.map(p => p.id === currentProjectId ? {
          ...p,
          messages: p.messages.map(m => m.id === mentorMsgId ? { ...m, content: accumulatedText } : m)
        } : p));
      }

      if (isVoice && accumulatedText) {
        const modelAudioUrl = await playTTS(accumulatedText);
        setProjects(prev => prev.map(p => p.id === currentProjectId ? {
          ...p,
          messages: p.messages.map(m => m.id === mentorMsgId ? { ...m, audioUrl: modelAudioUrl } : m)
        } : p));
      }

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

  const startMeeting = async () => {
    if (!currentProject) return;
    setIsMeetingOpen(true);
    setMeetingStatus('listening');
    if (!outputAudioContextRef.current) {
      outputAudioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = outputAudioContextRef.current;
    liveUserTranscript.current = "";
    liveModelTranscript.current = "";

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)({ sampleRate: 16000 });

      const sessionPromise = geminiService.connectLive({
        lang: language,
        currentPlan: currentProject.currentPlan || "",
        history: currentProject.messages || [],
        callbacks: {
          onOpen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e: AudioProcessingEvent) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onMessage: async (msg: unknown) => {
            const m = msg as { serverContent?: { inputTranscription?: { text?: string }; outputTranscription?: { text?: string }; modelTurn?: { parts?: Array<{ inlineData?: { data?: string } }> }; turnComplete?: boolean } };
            if (m.serverContent?.inputTranscription) {
              liveUserTranscript.current += m.serverContent.inputTranscription.text || '';
            }
            if (m.serverContent?.outputTranscription) {
              liveModelTranscript.current += m.serverContent.outputTranscription.text || '';
            }

            if (m.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
              setMeetingStatus('thinking');
              if (liveUserTranscript.current.trim()) {
                const text = liveUserTranscript.current.trim();
                liveUserTranscript.current = "";
                setProjects(prev => {
                  const active = prev.find(p => p.id === currentProjectId);
                  if (!active) return prev;
                  if (active.messages.length > 0 && active.messages[active.messages.length - 1].role === 'user' && active.messages[active.messages.length - 1].content === text) return prev;
                  const userMsg: Message = { id: generateId(), role: 'user', content: text, timestamp: Date.now(), isVoice: true };
                  return prev.map(p => p.id === active.id ? { ...p, messages: [...p.messages, userMsg] } : p);
                });
              }
              const audioData = decode(m.serverContent.modelTurn.parts[0].inlineData.data!);
              const audioBuffer = await decodeAudioData(audioData, ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
            }

            if (m.serverContent?.turnComplete) {
              setMeetingStatus('listening');
              if (liveModelTranscript.current.trim()) {
                const text = liveModelTranscript.current.trim();
                liveModelTranscript.current = "";
                setProjects(prev => {
                  const active = prev.find(p => p.id === currentProjectId);
                  if (!active) return prev;
                  const modelMsg: Message = { id: generateId(), role: 'model', content: text, timestamp: Date.now(), isVoice: true };
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
    } catch (err) {
      console.error(err);
      setIsMeetingOpen(false);
    }
  };

  const endMeeting = useCallback(() => {
    setIsMeetingOpen(false);
    if (liveSessionRef.current) {
      const { sessionPromise, inputCtx, stream } = liveSessionRef.current;
      sessionPromise.then((s: { close: () => void }) => s.close()).catch(console.error);
      if (inputCtx?.state !== 'closed') inputCtx.close().catch(console.error);
      stream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      liveSessionRef.current = null;
    }
  }, []);

  if (!currentProject) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-muted-foreground">
        <div className="flex flex-col items-center gap-4">
          <LoadingDot />
          <span className="text-xs uppercase tracking-widest font-semibold">{t('idea.initialising')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      {/* Navbar - 官网风格：深色、红色强调 */}
      <nav className="h-14 border-b border-border bg-card/80 backdrop-blur flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <IdeaButton variant="ghost" className="p-1" onClick={() => setMobileView('projects')}>
              <IconMenu />
            </IdeaButton>
          </div>
          <Link href="/">
            <span className="flex items-center gap-3 cursor-pointer group shrink-0">
              <div className="relative w-8 h-8 overflow-hidden rounded-full shadow-[0_0_10px_rgba(192,0,0,0.5)] border border-primary/30 group-hover:border-primary/60 transition-colors">
                <img src={logoImg} alt="NowBuild" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground font-cinzel hidden sm:inline">NowBuild</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <Link href="/waitlist">
              <IdeaButton variant="primary" className="bg-primary text-primary-foreground hover:bg-primary/90">{t('idea.nav_execute')}</IdeaButton>
            </Link>
          </div>
          <div className="md:hidden">
            <IdeaButton variant="ghost" className="p-1" onClick={() => setMobileView('plan')}>
              <IconSidebar />
            </IdeaButton>
          </div>
          <div className="hidden md:block">
            <IdeaAvatar />
          </div>
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden relative">
        <aside className={`
          w-64 border-r border-border bg-card/30 flex-col shrink-0 transition-transform duration-300
          ${mobileView === 'projects' ? 'fixed inset-0 z-50 flex w-full bg-card' : 'hidden md:flex'}
        `}>
          <div className="md:hidden h-14 flex items-center justify-between px-4 border-b border-border">
            <span className="font-bold text-foreground">{t('idea.col_projects')}</span>
            <IdeaButton variant="ghost" onClick={() => setMobileView('chat')}><IconX /></IdeaButton>
          </div>
          <SectionHeader title={t('idea.col_projects')} action={<button onClick={() => createNewProject()} className="p-1 text-muted-foreground hover:text-foreground"><IconPlus /></button>} />
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {projects.map(p => (
              <div key={p.id} onClick={() => setCurrentProjectId(p.id)} className={`p-3 rounded-md cursor-pointer text-sm transition-all ${p.id === currentProjectId ? 'bg-primary/10 border border-primary/30 text-foreground font-medium' : 'text-muted-foreground hover:bg-muted/50'}`}>
                <div className="truncate">{getDisplayProjectName(p.name || '', language)}</div>
              </div>
            ))}
          </div>
        </aside>

        <section className="flex-1 flex flex-col border-r border-border bg-background relative max-w-2xl w-full">
          <SectionHeader
            title={t('idea.col_mentor')}
            action={
              <button onClick={startMeeting} className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors">
                <IconMeet /> {t('idea.nav_meet')}
              </button>
            }
          />
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {(currentProject.messages || []).map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed space-y-3 ${msg.role === 'user' ? 'bg-primary/10 border border-primary/20 text-foreground' : 'bg-card border border-border text-foreground'}`}>
                  {msg.role === 'model' && <div className="text-[10px] font-bold text-primary tracking-wider uppercase">{t('idea.mentor_label')}</div>}
                  {msg.audioUrl && <VoiceBar audioUrl={msg.audioUrl} isModel={msg.role === 'model'} labelVoice={t('idea.voice_label')} labelPlaying={t('idea.voice_playing')} />}
                  <div className={msg.isVoice ? 'text-xs text-muted-foreground italic' : ''}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isMentorLoading && <div className="text-xs text-muted-foreground flex items-center gap-2">{t('idea.mentor_label')} <LoadingDot /></div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border bg-card/30">
            <div className="flex items-center gap-3">
              <button onClick={() => setInputMode(inputMode === 'text' ? 'voice' : 'text')} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                {inputMode === 'text' ? <IconMic /> : <IconKeyboard />}
              </button>
              {inputMode === 'text' ? (
                <div className="relative flex-1">
                  <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all" placeholder={t('idea.col_mentor_placeholder')} />
                  <button onClick={() => handleSendMessage()} className="absolute right-2 top-2 p-1.5 text-muted-foreground hover:text-foreground"><IconSend /></button>
                </div>
              ) : (
                <div className="flex-1 relative">
                  <button onMouseDown={startVoiceInput} onMouseUp={stopAndSendVoice} onTouchStart={startVoiceInput} onTouchEnd={stopAndSendVoice} className={`w-full py-3 text-sm font-medium rounded-lg border-2 border-dashed transition-all active:scale-95 ${isVoiceRecording ? 'bg-destructive/10 border-destructive text-destructive' : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted'}`}>
                    {isVoiceRecording ? t('idea.voice_release_to_send') : t('idea.voice_hold_to_talk')}
                  </button>
                  {isTranscribing && (
                    <div className="absolute -top-8 left-0 right-0 text-center animate-pulse">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t('idea.voice_transcribing')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className={`
          flex-1 flex flex-col bg-card/20 relative md:min-w-[400px] transition-transform duration-300
          ${mobileView === 'plan' ? 'fixed inset-0 z-50 flex w-full bg-card' : 'hidden md:flex'}
        `}>
          <div className="md:hidden h-14 flex items-center justify-between px-4 border-b border-border">
            <span className="font-bold text-foreground">{t('idea.col_plan')}</span>
            <IdeaButton variant="ghost" onClick={() => setMobileView('chat')}><IconX /></IdeaButton>
          </div>
          <SectionHeader title={t('idea.col_plan')} action={
            <div className="flex bg-muted/50 rounded p-0.5">
              <button onClick={() => setPlanMode('view')} className={`px-3 py-1 text-[10px] font-bold uppercase transition-all ${planMode === 'view' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}>{t('idea.col_plan_view')}</button>
              <button onClick={() => setPlanMode('edit')} className={`px-3 py-1 text-[10px] font-bold uppercase transition-all ${planMode === 'edit' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}>{t('idea.col_plan_edit')}</button>
            </div>
          } />
          <div className="flex-1 overflow-y-auto p-6 flex flex-col">
            <div className="bg-card border border-border rounded-lg p-6 min-h-[400px] flex-1">
              {planMode === 'view' ? (
                <div className="prose prose-sm max-w-none prose-invert prose-headings:text-foreground prose-p:text-muted-foreground"><ReactMarkdown>{getDisplayPlanContent(currentProject.currentPlan || '', language)}</ReactMarkdown></div>
              ) : (
                <textarea className="w-full h-[400px] outline-none text-sm font-mono text-foreground bg-transparent leading-relaxed resize-none" value={currentProject.currentPlan || ''} onChange={(e) => handlePlanEdit(e.target.value)} />
              )}
            </div>
            {currentProject.investorFeedback && (
              <div className="mt-6 p-5 bg-card border border-primary/30 rounded-lg shadow-lg">
                <div className="text-4xl font-light mb-4 tracking-tighter text-foreground">{currentProject.investorFeedback.score} <span className="text-xs text-muted-foreground tracking-normal">/ 100</span></div>
                <h4 className="text-[10px] font-bold uppercase text-primary mb-2 tracking-widest">{t('idea.col_investor_questions')}</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {currentProject.investorFeedback.questions.map((q, i) => <li key={i} className="pl-3 border-l border-primary/50">{q}</li>)}
                </ul>
              </div>
            )}
            {/* 去落地：回到 waitlist */}
            <div className="mt-6 flex justify-end">
              <Link href="/waitlist">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm transition-colors shadow-lg shadow-primary/20">
                  {t('idea.btn_execute_plan')} <IconArrowRight />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {isMeetingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="max-w-xl w-full p-8 text-center space-y-12">
            <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">{t('idea.voice_meeting_title')}</div>
            <div className="relative flex justify-center">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${meetingStatus === 'listening' ? 'bg-primary/20 scale-110 shadow-[0_0_50px_rgba(192,0,0,0.15)]' : 'bg-muted scale-100'}`}>
                <div className={`w-4 h-4 rounded-full transition-all duration-300 ${meetingStatus === 'listening' ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`}></div>
              </div>
              {meetingStatus === 'listening' && <div className="absolute inset-0 flex items-center justify-center"><div className="w-40 h-40 border border-primary/30 rounded-full animate-ping opacity-20"></div></div>}
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-light tracking-tight text-foreground uppercase">{meetingStatus === 'listening' ? t('idea.voice_meeting_status_listening') : t('idea.voice_meeting_status_thinking')}</h2>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">{t('idea.voice_meeting_hint')}</p>
            </div>
            <div className="pt-8"><IdeaButton onClick={endMeeting} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 mx-auto py-3 px-8 rounded-full">{t('idea.voice_meeting_close')}</IdeaButton></div>
          </div>
        </div>
      )}
    </div>
  );
}
