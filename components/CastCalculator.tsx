
import React, { useState, useEffect } from 'react';

interface CastCalculatorProps {
  onApply: (total: number, hours: number) => void;
  onClose: () => void;
}

const CastCalculator: React.FC<CastCalculatorProps> = ({ onApply, onClose }) => {
  const [castsPerHour, setCastsPerHour] = useState<number>(55);
  const [totalHours, setTotalHours] = useState<number>(8);
  const [result, setResult] = useState<number>(440);

  useEffect(() => {
    setResult(Math.round(castsPerHour * totalHours));
  }, [castsPerHour, totalHours]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-black text-slate-800 leading-tight">
              Estimativa de arremeso<br />por hora
            </h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] mt-1">
              CALCULE SEU VOLUME DE ARREMESSOS
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors" aria-label="Fechar">
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        <div className="space-y-8">
          {/* Ritmo Input */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RITMO (CASTS/HORA)</label>
              <input 
                type="number"
                value={castsPerHour === 0 ? '' : castsPerHour}
                onChange={(e) => setCastsPerHour(parseInt(e.target.value) || 0)}
                className="text-blue-600 font-black text-xl w-20 text-right bg-transparent border-b-2 border-transparent focus:border-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <input 
              type="range" 
              min="1" 
              max="200" 
              value={castsPerHour} 
              onChange={(e) => setCastsPerHour(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Horas Input */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TEMPO TOTAL (HORAS)</label>
              <div className="flex items-center">
                <input 
                  type="number"
                  step="0.5"
                  value={totalHours === 0 ? '' : totalHours}
                  onChange={(e) => setTotalHours(parseFloat(e.target.value) || 0)}
                  className="text-blue-600 font-black text-xl w-16 text-right bg-transparent border-b-2 border-transparent focus:border-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-blue-600 font-black text-xl ml-0.5">h</span>
              </div>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="12" 
              step="0.5"
              value={totalHours} 
              onChange={(e) => setTotalHours(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Resultado Display */}
          <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3">TOTAL ESTIMADO</span>
            <div className="text-6xl font-black text-slate-800 leading-none mb-2">{result}</div>
            <span className="text-[11px] font-bold text-slate-400">Arremessos Realizados</span>
          </div>

          <button 
            onClick={() => {
              onApply(result, totalHours);
              onClose();
            }}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center"
          >
            APLICAR À SESSÃO
          </button>
        </div>
      </div>
    </div>
  );
};

export default CastCalculator;
