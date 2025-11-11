import { GoogleGenAI, GenerateContentResponse, LiveServerMessage, Modality, Blob } from "@google/genai";
import { Expert, ChatMessage } from '../types';

export const getAiResponse = async (
  expert: Expert,
  userMessage: string,
  chatHistory: ChatMessage[]
): Promise<string> => {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.error("API_KEY is not set in environment variables. AI features will not work.");
    return "Maaf, layanan AI saat ini tidak tersedia karena masalah konfigurasi. Silakan coba lagi nanti.";
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const model = 'gemini-2.5-flash';

    const systemInstruction = `Anda adalah Asisten AI dari ${expert.name}, seorang ${expert.title}. ${expert.bio}. Anda harus selalu berbicara sebagai ${expert.name} (gunakan sudut pandang orang pertama "saya"). Jawab pertanyaan pengguna terkait budaya Indonesia dengan ramah, informatif, dan sesuai dengan keahlian Anda (${expert.specialties.join(', ')}). Jaga agar jawaban tetap ringkas dan mudah dipahami. Jangan pernah mengungkapkan bahwa Anda adalah seorang AI.`;

    // Map our internal chat history to the format expected by the Gemini API.
    // The role for AI messages is 'model'.
    const history = chatHistory.map(message => ({
      role: message.sender === 'user' ? 'user' : 'model',
      parts: [{ text: message.text }],
    }));

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
      },
      history,
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message: userMessage });

    return response.text;

  } catch (error) {
    console.error("Error getting AI response:", error);
    return "Maaf, terjadi sedikit kendala. Bisakah Anda mengulangi pertanyaan Anda?";
  }
};


export interface AiCallCallbacks {
  onopen: () => void;
  onmessage: (message: LiveServerMessage) => Promise<void>;
  onerror: (e: ErrorEvent) => void;
  onclose: (e: CloseEvent) => void;
}

export const startAiCallSession = (expert: Expert, callbacks: AiCallCallbacks) => {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    throw new Error("API_KEY is not set in environment variables. AI features will not work.");
  }
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const systemInstruction = `Anda adalah Asisten AI dari ${expert.name}, seorang ${expert.title}. ${expert.bio}. Anda harus selalu berbicara sebagai ${expert.name} (gunakan sudut pandang orang pertama "saya"). Anda sedang dalam panggilan suara dan video langsung. Jawab pertanyaan pengguna dengan ramah dan informatif, sesuai keahlian Anda (${expert.specialties.join(', ')}). Pengguna mungkin akan membagikan kamera atau layar mereka; berikan bantuan berdasarkan apa yang Anda lihat. Jangan pernah mengungkapkan bahwa Anda adalah AI.`;

  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      inputAudioTranscription: {},
      outputAudioTranscription: {},
      systemInstruction,
    },
  });

  return sessionPromise;
};