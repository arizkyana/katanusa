import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChatMessage, Expert } from '../types';
import { EXPERTS } from '../constants';
import { getAiResponse, startAiCallSession } from '../services/geminiService';
// FIX: Alias Blob from @google/genai to avoid conflict with native Blob type.
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenAIBlob } from '@google/genai';


// Audio Helper Functions
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
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

// FIX: Update function to return the aliased GenAIBlob type.
function createBlob(data: Float32Array): GenAIBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// FIX: The `blob` parameter is now correctly inferred as the native Blob type due to the aliased import.
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // result is "data:image/jpeg;base64,...." -> we only need the part after the comma
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

type CallStatus = 'idle' | 'connecting' | 'active' | 'error';
type TranscriptEntry = { speaker: 'user' | 'ai'; text: string };

const FRAME_RATE = 5; // Send 5 frames per second

const ChatPage: React.FC = () => {
  const { expertId } = useParams<{ expertId: string }>();
  const expert = EXPERTS.find(e => e.id === expertId);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Voice Call State
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [liveTranscript, setLiveTranscript] = useState<TranscriptEntry[]>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Refs for call management
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextAudioStartTimeRef = useRef(0);
  const audioSourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIntervalRef = useRef<number | null>(null);


  useEffect(() => {
    if (expert) {
        setMessages([
            {
              sender: 'ai',
              text: `Selamat datang! Saya adalah asisten AI dari ${expert.name}. Anda bisa bertanya lewat teks atau memulai panggilan suara dengan ikon telepon di atas.`
            }
        ]);
    }
  }, [expert]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading, liveTranscript]);
  
  const handleUserSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!expert) return;

    const trimmedInput = userInput.trim();
    if (!trimmedInput || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: trimmedInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getAiResponse(expert, trimmedInput, messages);
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    } catch (error) {
        setMessages(prev => [...prev, { sender: 'ai', text: "Maaf, terjadi kesalahan. Coba lagi nanti." }]);
    } finally {
        setIsLoading(false);
    }
  };
  
  const startFrameCapture = () => {
    if (frameIntervalRef.current) {
        window.clearInterval(frameIntervalRef.current);
    }
    frameIntervalRef.current = window.setInterval(() => {
        if (!videoRef.current || !canvasRef.current || !sessionPromiseRef.current) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx || video.videoWidth === 0) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            if (blob) {
                const base64Data = await blobToBase64(blob);
                sessionPromiseRef.current?.then((session) => {
                    session.sendRealtimeInput({ media: { data: base64Data, mimeType: 'image/jpeg' } });
                });
            }
        }, 'image/jpeg', 0.8);
    }, 1000 / FRAME_RATE);
  };

  const stopVideoStream = () => {
    console.log("Stopping video stream...");
    if (frameIntervalRef.current) {
      window.clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    if (videoRef.current) {
        videoRef.current.oncanplay = null;
    }
    videoStreamRef.current?.getTracks().forEach(track => track.stop());
    videoStreamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsVideoEnabled(false);
    setIsScreenSharing(false);
  };

  const endCall = async () => {
    setCallStatus(currentStatus => {
      if (currentStatus === 'idle') return 'idle';
      
      console.log('Ending call...');
      stopVideoStream();
      
      if (sessionPromiseRef.current) {
        sessionPromiseRef.current
          .then(session => session.close())
          .catch(e => console.warn("Session might have already failed to connect:", e));
      }
      
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
      scriptProcessorRef.current?.disconnect();
      
      if (inputAudioContextRef.current?.state !== 'closed') inputAudioContextRef.current?.close();
      if (outputAudioContextRef.current?.state !== 'closed') outputAudioContextRef.current?.close();
      
      audioSourcesRef.current.forEach(source => source.stop());
      audioSourcesRef.current.clear();
      
      mediaStreamRef.current = null;
      sessionPromiseRef.current = null;
      inputAudioContextRef.current = null;
      outputAudioContextRef.current = null;
      scriptProcessorRef.current = null;
      
      if (liveTranscript.length > 0) {
        const transcriptText = liveTranscript
          .map(entry => `${entry.speaker === 'user' ? 'Anda' : 'AI'}: ${entry.text}`)
          .join('\n');
        
        setMessages(prev => [
          ...prev,
          { sender: 'ai', text: `Berikut adalah transkrip panggilan suara:\n\n${transcriptText}` }
        ]);
      }
      
      setLiveTranscript([]);
      return 'idle';
    });
  };

  const startCall = async () => {
    if (!expert) return;
    setCallStatus('connecting');
    setLiveTranscript([]);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        nextAudioStartTimeRef.current = 0;
        audioSourcesRef.current.clear();

        const callbacks = {
            onopen: () => {
                console.log('Session opened');
                setCallStatus('active');
                const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                scriptProcessorRef.current = scriptProcessor;

                scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                    const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                    const pcmBlob = createBlob(inputData);
                    sessionPromiseRef.current?.then((session) => {
                        session.sendRealtimeInput({ media: pcmBlob });
                    });
                };

                source.connect(scriptProcessor);
                scriptProcessor.connect(inputAudioContextRef.current!.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
                if (message.serverContent?.inputTranscription) {
                  const text = message.serverContent.inputTranscription.text;
                   setLiveTranscript(prev => {
                      const last = prev[prev.length - 1];
                      if (last && last.speaker === 'user') {
                          return [...prev.slice(0, -1), { ...last, text: last.text + text }];
                      }
                      return [...prev, { speaker: 'user', text }];
                  });
                }
                if (message.serverContent?.outputTranscription) {
                    const text = message.serverContent.outputTranscription.text;
                    setLiveTranscript(prev => {
                        const last = prev[prev.length - 1];
                        if (last && last.speaker === 'ai') {
                            return [...prev.slice(0, -1), { ...last, text: last.text + text }];
                        }
                        return [...prev, { speaker: 'ai', text }];
                    });
                }

                const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                if (base64Audio && outputAudioContextRef.current) {
                    const outputCtx = outputAudioContextRef.current;
                    nextAudioStartTimeRef.current = Math.max(nextAudioStartTimeRef.current, outputCtx.currentTime);
                    
                    const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                    const source = outputCtx.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(outputCtx.destination);
                    
                    source.addEventListener('ended', () => { audioSourcesRef.current.delete(source); });
                    
                    source.start(nextAudioStartTimeRef.current);
                    nextAudioStartTimeRef.current += audioBuffer.duration;
                    audioSourcesRef.current.add(source);
                }
            },
            onclose: () => {
                console.log('Session closed by server.');
                endCall();
            },
            onerror: (e: ErrorEvent) => {
                console.error('Session error:', e);
                alert('Terjadi kesalahan koneksi saat panggilan. Panggilan diakhiri.');
                endCall();
            },
        };

        sessionPromiseRef.current = startAiCallSession(expert, callbacks);
        await sessionPromiseRef.current; 
    } catch (error) {
        console.error('Failed to start call:', error);
        const errorMessage = (error as Error).message.includes("API_KEY") 
            ? "Kunci API tidak ditemukan. Silakan pilih kunci API terlebih dahulu."
            : "Tidak dapat memulai panggilan. Pastikan izin mikrofon diberikan dan periksa koneksi Anda.";
        alert(errorMessage);
        await endCall();
    }
  };

  const handleCallToggle = async () => {
    if (callStatus === 'active' || callStatus === 'connecting') {
      await endCall();
      return;
    }

    if (!(window as any).aistudio) {
        alert("Gagal memuat komponen API. Fitur panggilan tidak tersedia.");
        return;
    }

    try {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await (window as any).aistudio.openSelectKey();
        }
        await startCall();
    } catch (e) {
        console.error("API key selection was cancelled or failed:", e);
        alert("Anda harus memilih kunci API untuk menggunakan fitur panggilan suara.");
        setCallStatus('idle');
    }
  };
  
    const startVideoStream = async (type: 'camera' | 'screen') => {
        stopVideoStream();
        try {
            const stream = type === 'camera'
                ? await navigator.mediaDevices.getUserMedia({ video: true })
                : await navigator.mediaDevices.getDisplayMedia({ video: true });

            videoStreamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play().catch(e => console.error("Error playing video preview:", e));
                videoRef.current.oncanplay = () => {
                    console.log("Video stream is ready to play. Starting frame capture.");
                    startFrameCapture();
                };
            }
            
            stream.getVideoTracks()[0].onended = () => {
                stopVideoStream();
            };

            if (type === 'camera') setIsVideoEnabled(true);
            else setIsScreenSharing(true);
        } catch (err) {
            console.error(`Error starting ${type} stream:`, err);
            alert(`Tidak dapat memulai ${type === 'camera' ? 'kamera' : 'berbagi layar'}. Pastikan izin telah diberikan.`);
        }
    };

    const handleVideoToggle = () => {
        if (isVideoEnabled) {
            stopVideoStream();
        } else {
            startVideoStream('camera');
        }
    };

    const handleScreenShareToggle = () => {
        if (isScreenSharing) {
            stopVideoStream();
        } else {
            startVideoStream('screen');
        }
    };


  useEffect(() => {
    return () => {
      if (callStatus !== 'idle') {
          endCall();
      }
    };
  }, []);


  if (!expert) {
    return <div className="text-center py-20">Pakar tidak ditemukan atau halaman tidak valid.</div>;
  }
  
  const getCallButtonClass = () => {
    switch(callStatus) {
      case 'connecting': return 'text-yellow-500 animate-pulse';
      case 'active': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500 hover:text-gray-800';
    }
  };

  return (
    <div className="flex-grow flex flex-col bg-white relative">
       <canvas ref={canvasRef} className="hidden"></canvas>
      {/* Video Preview */}
      {(isVideoEnabled || isScreenSharing) && (
        <div className="absolute bottom-24 right-6 z-20 w-48 bg-black rounded-lg shadow-lg overflow-hidden border-2 border-white">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-contain"></video>
        </div>
      )}

      {/* Header */}
      <header className="flex-shrink-0 border-b border-gray-200 bg-white z-10">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
                <div className="relative">
                    <img src={expert.avatarUrl} alt={expert.name} className="w-12 h-12 rounded-full object-cover" />
                    <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white ${callStatus === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                </div>
                <div className="ml-4">
                    <h3 className="font-bold text-lg text-gray-800">Asisten AI: {expert.name}</h3>
                     <p className={`text-sm ${callStatus === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                        {callStatus === 'active' ? 'Dalam Panggilan' : callStatus === 'connecting' ? 'Menghubungkan...' : 'Online'}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button 
                  onClick={handleVideoToggle} 
                  disabled={callStatus !== 'active'} 
                  className={`p-2 rounded-full transition-colors ${isVideoEnabled ? 'text-green-500' : 'text-gray-500'} disabled:text-gray-300 disabled:cursor-not-allowed`} 
                  title="Bagikan Kamera"
                >
                    <VideoIcon />
                </button>
                <button 
                  onClick={handleScreenShareToggle} 
                  disabled={callStatus !== 'active'} 
                  className={`p-2 rounded-full transition-colors ${isScreenSharing ? 'text-green-500' : 'text-gray-500'} disabled:text-gray-300 disabled:cursor-not-allowed`} 
                  title="Bagikan Layar"
                >
                    <ScreenShareIcon />
                </button>
                <button onClick={handleCallToggle} className={`p-2 rounded-full transition-colors ${getCallButtonClass()}`} title={callStatus === 'active' ? 'Akhiri Panggilan' : 'Mulai Panggilan Suara'}>
                    <PhoneIcon active={callStatus === 'active'} />
                </button>
                <Link to={`/expert/${expert.id}`} className="p-2 text-gray-500 hover:text-gray-800" title="Kembali ke Profil"><CloseIcon/></Link>
            </div>
        </div>
      </header>

      {/* Chat Body */}
      <main 
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto bg-[#F7F4EB]"
          style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4d0c1' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`}}
      >
        <div className="container mx-auto px-6 py-8">
            {callStatus !== 'idle' ? (
                 <div className="space-y-6">
                    {liveTranscript.map((entry, index) => (
                      <div key={index} className={`flex items-end gap-3 ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {entry.speaker === 'ai' && (
                          <img src={expert.avatarUrl} alt="AI" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                        )}
                        <div className={`px-4 py-3 rounded-2xl max-w-xs md:max-w-xl ${entry.speaker === 'user' ? 'bg-[#FF6F00] text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                          <p className="text-sm leading-relaxed">{entry.text}</p>
                        </div>
                         {entry.speaker === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                            Y
                          </div>
                        )}
                      </div>
                    ))}
                     {liveTranscript.length === 0 && (
                        <div className="text-center text-gray-500 italic py-4">
                            {callStatus === 'connecting' ? 'Menunggu koneksi...' : 'Mulai berbicara untuk melihat transkrip...'}
                        </div>
                    )}
                </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'ai' && (
                      <img src={expert.avatarUrl} alt="AI" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    )}
                    <div className={`px-4 py-3 rounded-2xl max-w-xs md:max-w-xl ${msg.sender === 'user' ? 'bg-[#FF6F00] text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                     {msg.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                        Y
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                   <div className="flex items-end gap-3 justify-start">
                        <img src={expert.avatarUrl} alt="AI" className="w-8 h-8 rounded-full object-cover" />
                        <div className="px-4 py-3 rounded-2xl bg-white text-gray-800 rounded-bl-none shadow-sm flex items-center space-x-2">
                            <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
              </div>
            )}
        </div>
      </main>

      {/* Footer/Input */}
      <footer className="flex-shrink-0 border-t border-gray-200 bg-white z-10">
        <div className="container mx-auto px-6 py-4">
            {callStatus !== 'idle' ? (
                <div className="text-center">
                    <button 
                        onClick={endCall}
                        className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-red-700 transition-all shadow-lg"
                    >
                        Akhiri Panggilan
                    </button>
                </div>
            ) : (
                 <form onSubmit={handleUserSubmit} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Ketik pertanyaanmu di sini..."
                      className="flex-grow p-3 bg-gray-100 rounded-lg border-transparent focus:ring-2 focus:ring-[#2A754B] focus:border-transparent transition"
                      disabled={isLoading}
                      aria-label="Chat input"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !userInput.trim()}
                      className="bg-[#FF6F00] text-white p-3 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all flex-shrink-0"
                      aria-label="Send message"
                    >
                      <SendIcon/>
                    </button>
                  </form>
            )}
        </div>
      </footer>
    </div>
  );
};


const PhoneIcon: React.FC<{ active?: boolean }> = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        {active ? (
            <path d="M17.926 5.464a.5.5 0 01.03.658l-2.1 3.231a.5.5 0 01-.76.152l-1.39-1.042a.5.5 0 00-.616.052c-1.2 1.282-2.73 2.812-4.012 4.012a.5.5 0 00-.052.616l1.043 1.39a.5.5 0 01-.152.76l-3.23 2.1a.5.5 0 01-.659-.029l-1.46-1.46a.5.5 0 01-.06-.572c.32-1.044.882-2.822 1.836-4.63C8.69 8.87 10.468 8.307 11.512 7.988a.5.5 0 01.572.06l1.46 1.46c.196.196.49.232.72.084l.056-.036 2.54-1.65a.5.5 0 01.466-.465l.036-.056c.148-.23.112-.524-.084-.72l-1.46-1.46z"/>
        ) : (
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        )}
    </svg>
);
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const ScreenShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;

export default ChatPage;