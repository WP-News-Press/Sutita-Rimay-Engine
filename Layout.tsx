
import React from 'react';
import { ViewMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, viewMode, setViewMode }) => {
  const isotipoUrl = "https://raw.githubusercontent.com/elvisherrada/sutitarimay/main/sutita_brain.png"; // Usando placeholder o ruta directa si estuviera disponible, por ahora simulo con la descripción visual.
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E2E8F0] shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-14 h-14 bg-[#E6F0FF] rounded-2xl flex items-center justify-center border-2 border-[#4A90E2] transform group-hover:rotate-3 transition-transform overflow-hidden shadow-inner">
              <img 
                src="https://raw.githubusercontent.com/elvisherrada/sutitarimay/main/sutita_brain.png" 
                alt="Sutita Rimay" 
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/bottts/svg?seed=Sutita&backgroundColor=b6e3f4";
                }}
              />
            </div>
            <div className="absolute -top-1 -right-1 flex gap-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl font-black tracking-tighter text-[#4A90E2]">Sutita</h1>
              <h1 className="text-2xl font-black tracking-tighter text-[#F5D547]">Rimay</h1>
            </div>
            <p className="text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase flex items-center gap-1">
              <i className="fas fa-microchip text-[#4A90E2] text-[8px]"></i>
              HEFE Network Intelligence
            </p>
          </div>
        </div>
        
        <nav className="hidden md:flex gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setViewMode(ViewMode.CITIZEN_CHAT)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === ViewMode.CITIZEN_CHAT ? 'bg-[#4A90E2] text-white shadow-lg' : 'text-slate-500 hover:bg-white hover:text-[#4A90E2]'}`}
          >
            <i className="fas fa-comment-dots mr-2"></i> Hispabot
          </button>
          <button 
            onClick={() => setViewMode(ViewMode.FORENSIC_PANEL)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === ViewMode.FORENSIC_PANEL ? 'bg-[#4A90E2] text-white shadow-lg' : 'text-slate-500 hover:bg-white hover:text-[#4A90E2]'}`}
          >
            <i className="fas fa-microscope mr-2"></i> Forense
          </button>
        </nav>

        <div className="flex md:hidden gap-2">
            <button onClick={() => setViewMode(ViewMode.CITIZEN_CHAT)} className={`p-3 rounded-xl ${viewMode === ViewMode.CITIZEN_CHAT ? 'bg-[#4A90E2] text-white' : 'text-slate-400'}`}>
                <i className="fas fa-comment-dots"></i>
            </button>
            <button onClick={() => setViewMode(ViewMode.FORENSIC_PANEL)} className={`p-3 rounded-xl ${viewMode === ViewMode.FORENSIC_PANEL ? 'bg-[#4A90E2] text-white' : 'text-slate-400'}`}>
                <i className="fas fa-microscope"></i>
            </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative bg-[#F8FAFC]">
        {children}
      </main>

      <footer className="px-6 py-2.5 bg-white border-t border-slate-200 text-[10px] text-slate-400 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="font-black text-slate-500 tracking-tighter">SUTITA RIMAY v2.0</span>
          <span className="h-3 w-[1px] bg-slate-200"></span>
          <span className="font-medium italic">Powered by Elvis Herrada</span>
        </div>
        <div className="flex gap-6 font-bold uppercase tracking-widest text-[9px]">
          <span className="flex items-center gap-1.5"><i className="fas fa-shield-virus text-[#4A90E2]"></i> Anti-Fake</span>
          <span className="flex items-center gap-1.5"><i className="fas fa-project-diagram text-[#F5D547]"></i> Probabilístico</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
