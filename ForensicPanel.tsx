
import React, { useState } from 'react';
import { VerificationResult } from '../types';
import { analyzeContent } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ForensicPanel: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleAudit = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const report = await analyzeContent(input, undefined, true);
      setResult(report);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = result ? [
    { name: 'Confianza', value: result.score },
    { name: 'Riesgo', value: 100 - result.score },
  ] : [];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <i className="fas fa-search-plus text-[#4A90E2]"></i>
              Análisis Avanzado
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Herramientas de auditoría profunda para periodistas e investigadores.
            </p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inserte texto, scripts o descripción de metadatos..."
              className="w-full h-56 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 focus:border-[#4A90E2] focus:ring-1 focus:ring-[#4A90E2] outline-none resize-none transition-all"
            />
            <button
              onClick={handleAudit}
              disabled={isLoading}
              className="w-full py-4 bg-[#4A90E2] hover:bg-[#357ABD] disabled:bg-slate-300 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#4A90E2]/20"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-cog animate-spin"></i>
                  PROCESANDO...
                </>
              ) : (
                <>
                  <i className="fas fa-fingerprint"></i>
                  AUDITAR CONTENIDO
                </>
              )}
            </button>
          </div>

          {result && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clasificación DISARM</h3>
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  result.threatLevel === 'Critical' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                  result.threatLevel === 'High' ? 'bg-orange-500' : 
                  result.threatLevel === 'Medium' ? 'bg-[#F5D547]' : 'bg-green-500'
                }`}></div>
                <span className="text-3xl font-black text-slate-800 italic">{result.threatLevel}</span>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Section */}
        <div className="lg:col-span-2 space-y-6">
          {!result && !isLoading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center">
              <div className="w-24 h-24 bg-[#E6F0FF] rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-brain text-4xl text-[#4A90E2]"></i>
              </div>
              <h4 className="text-xl font-black text-slate-800 mb-2">Panel Forense Sutita Rimay</h4>
              <p className="text-slate-500 max-w-sm text-sm">
                Inicie una auditoría para desplegar el mapa de razonamiento probabilístico y detección de patrones oscuros.
              </p>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-72">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest">Score de Integridad</h4>
                   <ResponsiveContainer width="100%" height="80%">
                     <BarChart data={chartData} layout="vertical">
                        <XAxis type="number" hide domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} fontStyle="bold" />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#4A90E2' : '#F5D547'} />
                          ))}
                        </Bar>
                     </BarChart>
                   </ResponsiveContainer>
                </div>

                <div className="bg-[#4A90E2] text-white rounded-3xl p-6 shadow-xl space-y-4 h-72 overflow-auto">
                   <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest">Intención del Actor</h4>
                   <p className="text-base font-bold leading-relaxed italic">"{result.intentAnalysis}"</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-8">
                <div>
                  <h4 className="text-[#4A90E2] font-black mb-4 flex items-center gap-3 text-lg">
                    <i className="fas fa-microchip"></i> REPORTE DE RAZONAMIENTO
                  </h4>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 text-sm leading-loose">
                    {result.reasoning}
                  </div>
                </div>

                {result.multimodalChecks && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border-2 border-slate-50">
                      <h5 className="text-[10px] font-black text-[#4A90E2] uppercase mb-3 tracking-widest flex items-center gap-2">
                        <i className="fas fa-waveform"></i> Señales Bio-Detección
                      </h5>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{result.multimodalChecks.audioDeepfake || "Auditoría de audio: Sin manipulaciones detectadas."}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border-2 border-slate-50">
                      <h5 className="text-[10px] font-black text-[#F5D547] uppercase mb-3 tracking-widest flex items-center gap-2">
                        <i className="fas fa-ghost"></i> Patrones Oscuros (Dark Patterns)
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {result.multimodalChecks.darkPatterns?.map((p, i) => (
                          <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black border border-red-100">
                            {p}
                          </span>
                        )) || <span className="text-[11px] text-slate-400 italic font-medium">Limpio de interfaces engañosas.</span>}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-slate-400 font-black mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em]">
                    CORROBORACIÓN EXTERNA (GROUNDING)
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {result.sources.map((source, i) => (
                      <a 
                        key={i} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#4A90E2] hover:bg-[#F8FAFC] transition-all group shadow-sm"
                      >
                        <span className="text-xs font-bold text-slate-600 group-hover:text-[#4A90E2] truncate max-w-[80%]">{source.title}</span>
                        <i className="fas fa-chevron-right text-[10px] text-slate-300 group-hover:translate-x-1 transition-transform"></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForensicPanel;
