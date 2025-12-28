
import React from 'react';

interface HeaderProps {
  userEmail: string | null;
  onLoginClick: () => void;
  onLogout: () => void;
  isOnline: boolean;
  syncing: boolean;
}

const Header: React.FC<HeaderProps> = ({ userEmail, onLoginClick, onLogout, isOnline, syncing }) => {
  return (
    <header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm border-b border-gray-100 sticky top-0 z-[60]">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-xl">
          <i className="fas fa-fish-fins text-blue-600 text-2xl"></i>
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none flex items-center">
            Chuva de iscas<span className="text-blue-600 ml-1">Pro</span>
          </h1>
          <div className="flex items-center mt-0.5">
            {syncing ? (
              <span className="flex items-center text-[8px] font-black text-blue-500 uppercase tracking-widest animate-pulse">
                <i className="fas fa-sync-alt fa-spin mr-1"></i> Sincronizando
              </span>
            ) : isOnline ? (
              <span className="flex items-center text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                <i className="fas fa-cloud-check mr-1"></i> Nuvem Ativa
              </span>
            ) : (
              <span className="flex items-center text-[8px] font-black text-amber-500 uppercase tracking-widest">
                <i className="fas fa-cloud-slash mr-1"></i> Modo Offline
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {userEmail ? (
          <div className="flex items-center space-x-2">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase leading-none">PESCADOR</p>
              <p className="text-[11px] font-bold text-slate-700 truncate max-w-[100px]">{userEmail.split('@')[0]}</p>
            </div>
            <button 
              onClick={onLogout}
              className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
              title="Sair"
            >
              <i className="fas fa-sign-out-alt text-xs"></i>
            </button>
          </div>
        ) : (
          <button 
            onClick={onLoginClick}
            className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all group"
            title="Fazer Login"
          >
            <i className="fas fa-user text-sm group-hover:scale-110 transition-transform"></i>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
