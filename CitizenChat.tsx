
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, VerificationResult } from '../types';
import { analyzeContent } from '../services/geminiService';

const CitizenChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy Sutita Rimay, tu cerebrito aliado de HEFE Network contra la desinformación. 🧠✨\n\n¿Qué link, imagen o rumor de WhatsApp quieres que analicemos hoy para proteger a nuestra comunidad?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !file) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await analyzeContent(input, file || undefined, false);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.reasoning,
        timestamp: Date.now(),
        result
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: '¡Ups! Mi cerebrito tuvo un pequeño cortocircuito. ¿Podrías intentar enviármelo de nuevo?',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
      setFile(null);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFile(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-8">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-8 pb-32 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {msg.role === 'assistant' && (
              <div className="w-10 h-10 rounded-2xl bg-[#E6F0FF] border-2 border-[#4A90E2] flex-shrink-0 flex items-center justify-center shadow-sm overflow-hidden transform -rotate-3">
                 <img 
                    src="https://raw.githubusercontent.com/elvisherrada/sutitarimay/main/sutita_brain.png" 
                    alt="Sutita" 
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/bottts/svg?seed=Sutita";
                    }}
                 />
              </div>
            )}
            <div className={`relative max-w-[85%] rounded-[24px] px-6 py-4 shadow-sm border ${
              msg.role === 'user' 
                ? 'bg-[#4A90E2] text-white border-[#357ABD] rounded-tr-none' 
                : 'bg-white text-slate-800 border-slate-200 rounded-tl-none'
            }`}>
              <p className="text-[16px] leading-relaxed font-medium whitespace-pre-wrap">{msg.content}</p>
              
              {msg.result && (
                <div className={`mt-5 pt-5 border-t ${msg.role === 'user' ? 'border-white/20' : 'border-slate-100'} space-y-4`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60">Probabilidad de Verdad</span>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-black ${
                      msg.result.score > 70 ? 'bg-green-100 text-green-700' : 
                      msg.result.score > 40 ? 'bg-[#F5D547]/20 text-yellow-800' : 'bg-red-100 text-red-700'
                    }`}>
                      {msg.result.score}% SEGURIDAD
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner p-[2px]">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        msg.result.score > 70 ? 'bg-green-500' : 
                        msg.result.score > 40 ? 'bg-[#F5D547]' : 'bg-red-500'
                      }`} 
                      style={{ width: `${msg.result.score}%` }}
                    ></div>
                  </div>
                  
                  {msg.result.threatLevel !== 'Low' && (
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-2xl border border-red-100 animate-pulse">
                      <i className="fas fa-exclamation-circle text-red-500 text-lg"></i>
                      <div>
                        <p className="text-[11px] font-black text-red-800 uppercase tracking-widest leading-none">Riesgo {msg.result.threatLevel}</p>
                        <p className="text-[10px] font-bold text-red-600">¡Cuidado! Este contenido podría ser dañino.</p>
                      </div>
                    </div>
                  )}

                  {msg.result.sources.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fuentes que respaldan mi análisis:</p>
                      <div className="grid gap-2">
                        {msg.result.sources.map((s, idx) => (
                            <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" 
                               className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-[#4A90E2] hover:bg-[#E6F0FF] transition-all group">
                              <i className="fas fa-link text-[10px] text-slate-300 group-hover:text-[#4A90E2]"></i>
                              <span className="truncate">{s.title}</span>
                            </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <span className={`absolute bottom-[-20px] text-[9px] font-bold uppercase tracking-tighter opacity-40 ${msg.role === 'user' ? 'right-0' : 'left-0'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#E6F0FF] border-2 border-[#4A90E2] flex items-center justify-center animate-bounce">
               <img src="https://raw.githubusercontent.com/elvisherrada/sutitarimay/main/sutita_brain.png" alt="loading" className="w-8 h-8 object-contain" />
            </div>
            <div className="bg-white border border-slate-200 rounded-[24px] rounded-tl-none p-5 flex gap-2 shadow-sm items-center">
              <div className="w-2 h-2 bg-[#4A90E2] rounded-full animate-ping"></div>
              <span className="text-[11px] font-black text-[#4A90E2] uppercase tracking-[0.3em]">Cerebrito analizando...</span>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC] to-transparent pb-8 pt-12 z-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative group">
            {file && (
              <div className="absolute -top-24 left-0 flex items-center gap-4 bg-white p-3 rounded-[20px] shadow-2xl border-2 border-[#4A90E2] animate-in zoom-in duration-300">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-inner">
                    <img src={file} className="w-full h-full object-cover" alt="upload preview" />
                </div>
                <div>
                    <p className="text-[11px] font-black text-slate-800 uppercase leading-none">Imagen Lista</p>
                    <p className="text-[9px] text-slate-400 font-bold">Iniciando análisis multimodal...</p>
                </div>
                <button onClick={() => setFile(null)} className="w-8 h-8 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
            <div className="flex items-center gap-3 bg-white border-2 border-slate-200 rounded-[28px] px-6 py-3 shadow-xl focus-within:border-[#4A90E2] focus-within:ring-4 focus-within:ring-[#4A90E2]/5 transition-all">
              <label className="cursor-pointer text-slate-400 hover:text-[#4A90E2] p-2 transition-transform hover:scale-110 active:scale-95">
                <i className="fas fa-camera-retro text-2xl"></i>
                <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="Pega un rumor o noticia sospechosa de WhatsApp..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-300 py-3 resize-none h-14 min-h-[56px] max-h-40 font-bold text-lg leading-snug"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-[#4A90E2] hover:bg-[#357ABD] disabled:bg-slate-200 text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-[#4A90E2]/20 active:scale-90"
              >
                <i className="fas fa-paper-plane text-xl"></i>
              </button>
            </div>
          </div>
          <p className="text-center mt-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Defensa Democrática Multimodal</p>
        </div>
      </div>
    </div>
  );
};

export default CitizenChat;
