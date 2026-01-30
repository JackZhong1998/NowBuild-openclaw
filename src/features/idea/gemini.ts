import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { Message, Language, InvestorFeedback } from './types';
import { SYSTEM_PROMPTS } from './constants';

const getClient = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    console.error("VITE_GEMINI_API_KEY missing");
    throw new Error("VITE_GEMINI_API_KEY missing");
  }
  return new GoogleGenAI({ apiKey: key });
};

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const geminiService = {
  chatWithMentor: async (history: Message[], currentPlan: string, lang: Language) => {
    const ai = getClient();
    const contents = history.slice(-20).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));
    return await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_PROMPTS.mentor(lang) + `\n\nContext from Business Plan:\n${currentPlan.substring(0, 3000)}`
      }
    });
  },

  transcribeAudio: async (base64Audio: string, mimeType: string, lang: Language): Promise<string> => {
    const ai = getClient();
    const prompt = lang === 'cn' ? "请将这段语音转写为文字。只需返回转写结果，不要包含任何其他说明。" : "Please transcribe this audio. Return only the transcription text, no extra explanation.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      contents: {
        parts: [
          { inlineData: { data: base64Audio, mimeType } },
          { text: prompt }
        ]
      }
    });
    return (response as { text?: string }).text || "";
  },

  updateBusinessPlan: async (history: Message[], currentPlan: string, lang: Language): Promise<string> => {
    const ai = getClient();
    const recentHistoryText = history.slice(-10).map(m => `${m.role}: ${m.content}`).join('\n');
    const prompt = `Current Plan:\n${currentPlan}\n\nRecent Conversation:\n${recentHistoryText}\n\nInstructions: Update the plan based on the conversation.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { systemInstruction: SYSTEM_PROMPTS.assistant(lang) }
    });
    return (response as { text?: string }).text || currentPlan;
  },

  reviewPlan: async (plan: string, lang: Language): Promise<InvestorFeedback> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Review this plan:\n${plan}`,
      config: {
        systemInstruction: SYSTEM_PROMPTS.investor(lang),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            questions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "questions"]
        }
      }
    });
    const text = (response as { text?: string }).text;
    if (!text) return { score: 0, questions: ["Error"], lastUpdated: Date.now() };
    try {
      const json = JSON.parse(text);
      return { score: json.score || 0, questions: json.questions || [], lastUpdated: Date.now() };
    } catch {
      return { score: 0, questions: ["Error"], lastUpdated: Date.now() };
    }
  },

  generateTTS: async (text: string, voice: string = 'Kore'): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
        },
      },
    });
    const res = response as unknown as Record<string, unknown>;
    const candidates = res?.candidates as Array<Record<string, unknown>> | undefined;
    const part = candidates?.[0]?.content as Record<string, unknown> | undefined;
    const parts = part?.parts as Array<Record<string, unknown>> | undefined;
    const inline = parts?.[0]?.inlineData as Record<string, unknown> | undefined;
    return (inline?.data as string | undefined) ?? "";
  },

  connectLive: (config: {
    lang: Language;
    currentPlan: string;
    history: Message[];
    callbacks: {
      onMessage: (message: unknown) => void;
      onOpen: () => void;
      onClose: () => void;
      onError: (e: unknown) => void;
    }
  }) => {
    const ai = getClient();
    const historyContext = config.history.slice(-10).map(m => `${m.role === 'user' ? 'User' : 'Mentor'}: ${m.content}`).join('\n');

    return ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: config.callbacks.onOpen,
        onmessage: config.callbacks.onMessage,
        onclose: config.callbacks.onClose,
        onerror: config.callbacks.onError,
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction: SYSTEM_PROMPTS.mentor(config.lang) + `\n\nExisting Business Plan:\n${config.currentPlan}\n\nPrevious Conversation History:\n${historyContext}`,
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      }
    });
  }
};
