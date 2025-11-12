
import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { Expert, ChatMessage } from '../types';
import { getAiResponse } from '../services/geminiService';

interface ChatModalProps {
  expert: Expert;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ expert, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Selamat datang di KataNusa! Saya adalah asisten AI dari ${expert.name}. Ada yang bisa saya bantu terkait budaya Indonesia?`
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleUserSubmit = async (e: FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[90vh] max-h-[700px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
                <div className="relative">
                    <img src={expert.avatarUrl} alt={expert.name} className="w-12 h-12 rounded-full object-cover" />
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                </div>
                <div className="ml-3">
                    <h3 className="font-bold text-lg">Asisten AI KataNusa</h3>
                    <p className="text-sm text-green-600">Online</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-800"><PhoneIcon/></button>
                <button className="p-2 text-gray-500 hover:text-gray-800"><VideoIcon/></button>
                <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800"><CloseIcon/></button>
            </div>
        </div>

        {/* Chat Body */}
        <div 
            ref={chatContainerRef}
            className="flex-grow p-6 overflow-y-auto bg-[#F7F4EB]"
            style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4d0c1' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`}}
        >
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && (
                  <img src={expert.avatarUrl} alt="AI" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                )}
                <div className={`px-4 py-3 rounded-2xl max-w-xs md:max-w-md ${msg.sender === 'user' ? 'bg-[#FF6F00] text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                  <p className="text-sm">{msg.text}</p>
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
        </div>

        {/* Footer/Input */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <div className="flex-1">
                    <select className="w-full bg-gray-100 border-none rounded-md p-2 text-xs">
                        <option>Suara Penutur: Wanita</option>
                        <option>Suara Penutur: Pria</option>
                    </select>
                </div>
                <div className="flex-1">
                     <select className="w-full bg-gray-100 border-none rounded-md p-2 text-xs">
                        <option>Bahasa: Indonesia</option>
                        <option>Bahasa: English</option>
                    </select>
                </div>
            </div>
          <form onSubmit={handleUserSubmit} className="flex items-center space-x-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ketik pertanyaanmu di sini..."
              className="flex-grow p-3 bg-gray-100 rounded-lg border-transparent focus:ring-2 focus:ring-[#2A754B] focus:border-transparent transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="bg-[#FF6F00] text-white p-3 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all flex-shrink-0"
            >
              <SendIcon/>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>;
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;

export default ChatModal;