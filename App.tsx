
import React, { useState, useEffect, useMemo } from 'react';
import { FishingSession, CalculatedStats } from './types';
import Header from './components/Header';
import Counter from './components/Counter';
import StatsCharts from './components/StatsCharts';
import CastCalculator from './components/CastCalculator';
import LoginModal from './components/LoginModal';
import HistoryComparison from './components/HistoryComparison';
import Forecast from './components/Forecast';
import { getFishingInsights, FishingInsight } from './services/gemini';

const STORAGE_KEY = 'chuva_de_iscas_pro_v1';
const USER_KEY = 'chuva_de_iscas_user';

const FISHING_ROD_ICON = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNNTA4LjUgNTA4LjVjLTQuNyA0LjctMTIuMyA0LjctMTcgMEwxNzEuNSAxNzEuNWMtNC43LTQuNy00LjctMTIuMyAwLTE3TDUwOC41IDMuNWM0LjctNC43IDEyLjMtNC43IDE3IDBMMTAuMyAxNzhjNC43IDQuNyA0LjctMTIuMyAwIDE3IDAtLjF6IiBmaWxsPSIjRkZGRkZGIi8+PHBhdGggZD0iTTUwOC41IDUuNWM0LjcgNC43IDEyLjMgNC43IDE3IDBsLTQ5NiA0OTZjLTQuNyA0LjctMTIuMyA0LjctMTcgMEw1MDguNSA1LjV6IiBmaWxsPSIjRkZGRkZGIi8+PHBhdGggZD0iTTMwMCAyMDBsLTMwIDMwbC0zMC0zMGwzMC0zMHoiIGZpbGw9IiNGRkZGRkYiLz48cGF0aCBkPSJNMjAwIDMwMGwtMzAgMzBsLTMwLTMwbDMwLTMweiIgZmlsbD0iI0ZGRkZGRiIvPjxwYXRoIGQ9Ik0xMDAgNDAwbC0zMCAzMGwtMzAtMzBsMzAtMzB6IiBmaWxsPSIjRkZGRkZGIi8+PC9zdmc+";

const MOCK_SESSIONS: FishingSession[] = [
  {
    id: 'mock-1',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    startTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    species: 'Tucunaré Amarelo',
    metrics: { casts: 320, attacks: 45, hookups: 28, landed: 22, lost: 6 },
    notes: 'Dia produtivo na Represa do Jaguari. Vento sul moderado e água limpa.'
  },
  {
    id: 'mock-2',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    species: 'Robalo Peva',
    metrics: { casts: 180, attacks: 12, hookups: 8, landed: 7, lost: 1 },
    notes: 'Maré vazante, água um pouco turva. Iscas soft cor chá renderam melhor.'
  },
  {
    id: 'mock-3',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    species: 'Traíra',
    metrics: { casts: 210, attacks: 55, hookups: 32, landed: 18, lost: 14 },
    notes: 'Muitos ataques na superfície em área de vegetação, mas errando muito a fisgada devido à estrutura.'
  },
  {
    id: 'mock-4',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 8 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    species: 'Tucunaré Azul',
    metrics: { casts: 450, attacks: 38, hookups: 22, landed: 20, lost: 2 },
    notes: 'Dia de sol forte o dia todo. Peixes ativos no visual.'
  },
  {
    id: 'mock-5',
    date: new Date().toLocaleDateString('pt-BR'),
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date().toISOString(),
    species: 'Black Bass',
    metrics: { casts: 120, attacks: 5, hookups: 3, landed: 2, lost: 1 },
    notes: 'Pescaria rápida de fim de tarde. Pouca atividade.'
  }
];

const App: React.FC = () => {
  const [sessions, setSessions] = useState<FishingSession[]>([]);
  const [activeSession, setActiveSession] = useState<FishingSession | null>(null);
  const [view, setView] = useState<'home' | 'active' | 'stats' | 'history' | 'forecast'>('home');
  const [insights, setInsights] = useState<FishingInsight | string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // Lógica de Conectividade e Sincronização
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  
  const [metricsHistory, setMetricsHistory] = useState<FishingSession['metrics'][]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSessions(JSON.parse(saved));
    } else {
      saveSessions(MOCK_SESSIONS);
    }
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      setUserEmail(savedUser);
    }

    // Monitoramento de Conexão
    const handleOnline = () => {
      setIsOnline(true);
      performSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const performSync = async () => {
    if (!navigator.onLine) return;
    setSyncing(true);
    // Simula tempo de upload para a nuvem
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSyncing(false);
    console.log("Dados sincronizados com sucesso.");
  };

  const saveSessions = (updated: FishingSession[]) => {
    setSessions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Tenta sincronizar se estiver online
    if (isOnline) {
      performSync();
    }
  };

  const handleLogin = (email: string, password: string) => {
    setUserEmail(email);
    localStorage.setItem(USER_KEY, email);
    performSync();
  };

  const handleLogout = () => {
    setUserEmail(null);
    localStorage.removeItem(USER_KEY);
  };

  const startSession = () => {
    const newSession: FishingSession = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      startTime: new Date().toISOString(),
      species: '',
      metrics: { casts: 0, attacks: 0, hookups: 0, landed: 0, lost: 0 },
      notes: ''
    };
    setActiveSession(newSession);
    setMetricsHistory([]);
    setView('active');
    setInsights(null);
  };

  const updateMetric = (key: keyof FishingSession['metrics'], value: number) => {
    if (!activeSession) return;
    setMetricsHistory(prev => [...prev, { ...activeSession.metrics }].slice(-20));
    setActiveSession({
      ...activeSession,
      metrics: { ...activeSession.metrics, [key]: value }
    });
  };

  const undoLastAction = () => {
    if (metricsHistory.length === 0 || !activeSession) return;
    const previousMetrics = metricsHistory[metricsHistory.length - 1];
    setMetricsHistory(prev => prev.slice(0, -1));
    setActiveSession({
      ...activeSession,
      metrics: previousMetrics
    });
  };

  const finishSession = () => {
    if (!activeSession) return;
    const finishedSession = { ...activeSession, endTime: new Date().toISOString() };
    saveSessions([finishedSession, ...sessions]);
    setActiveSession(null);
    setSelectedDay(finishedSession.date);
    setView('stats');
  };

  const calculateStats = (data: FishingSession | FishingSession[]): CalculatedStats => {
    const sessionList = Array.isArray(data) ? data : [data];
    const now = Date.now();
    const totals = sessionList.reduce((acc, s) => {
      const sessionDurationMs = s.manualDurationMinutes 
        ? s.manualDurationMinutes * 60000 
        : (s.endTime 
            ? (new Date(s.endTime).getTime() - new Date(s.startTime).getTime())
            : (now - new Date(s.startTime).getTime())
          );
      return {
        casts: acc.casts + s.metrics.casts,
        attacks: acc.attacks + s.metrics.attacks,
        hookups: acc.hookups + s.metrics.hookups,
        landed: acc.landed + s.metrics.landed,
        lost: acc.lost + s.metrics.lost,
        duration: acc.duration + sessionDurationMs
      };
    }, { casts: 0, attacks: 0, hookups: 0, landed: 0, lost: 0, duration: 0 });

    const durationHours = totals.duration / 3600000;
    const durationMinutesFloat = totals.duration / 60000;
    const effectiveHoursForRate = durationHours > 0.0166 ? durationHours : 8;
    
    return {
      attackRate: totals.casts > 0 ? totals.attacks / totals.casts : 0,
      hookupRate: totals.attacks > 0 ? totals.hookups / totals.attacks : 0,
      landingRate: totals.hookups > 0 ? totals.landed / totals.hookups : 0,
      efficiency: totals.casts > 0 ? totals.landed / totals.casts : 0,
      castsPerFish: totals.landed > 0 ? totals.casts / totals.landed : totals.casts,
      attacksPer100Casts: totals.casts > 0 ? (totals.attacks / totals.casts) * 100 : 0,
      durationMinutes: Math.round(durationMinutesFloat),
      fishPerHour: totals.landed / effectiveHoursForRate,
      castsPerHour: totals.casts / effectiveHoursForRate
    };
  };

  const dailyGroups = useMemo(() => {
    const groups: Record<string, FishingSession[]> = {};
    sessions.forEach(s => {
      if (!groups[s.date]) groups[s.date] = [];
      groups[s.date].push(s);
    });
    return groups;
  }, [sessions]);

  const currentStats = useMemo(() => {
    if (activeSession) return calculateStats(activeSession);
    if (selectedDay && dailyGroups[selectedDay]) return calculateStats(dailyGroups[selectedDay]);
    if (sessions.length > 0) return calculateStats(dailyGroups[sessions[0].date]);
    return null;
  }, [activeSession, selectedDay, dailyGroups, sessions]);

  const generateAIInsights = async () => {
    if (!isOnline) {
      alert("A inteligência artificial requer conexão com a internet.");
      return;
    }
    const targetData = activeSession || (selectedDay ? dailyGroups[selectedDay] : sessions[0]);
    if (!targetData || !currentStats) return;
    setLoadingInsights(true);
    try {
      const dummySession = Array.isArray(targetData) ? {
        ...targetData[0],
        metrics: targetData.reduce((acc, s) => ({
          casts: acc.casts + s.metrics.casts,
          attacks: acc.attacks + s.metrics.attacks,
          hookups: acc.hookups + s.metrics.hookups,
          landed: acc.landed + s.metrics.landed,
          lost: acc.lost + s.metrics.lost,
        }), { casts: 0, attacks: 0, hookups: 0, landed: 0, lost: 0 }),
        notes: targetData.map(s => s.notes).filter(n => n).join(" | ")
      } : targetData;
      const result = await getFishingInsights(dummySession, currentStats);
      setInsights(result);
    } finally {
      setLoadingInsights(false);
    }
  };

  const formatWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-blue-900 font-black">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 bg-transparent">
      <Header 
        userEmail={userEmail} 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        onLogout={handleLogout}
        isOnline={isOnline}
        syncing={syncing}
      />
      
      {!isOnline && (
        <div className="bg-amber-100/80 backdrop-blur-sm border-b border-amber-200 px-4 py-1.5 flex items-center justify-center space-x-2 sticky top-[64px] z-50">
          <i className="fas fa-wifi-slash text-amber-600 text-[10px]"></i>
          <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">
            Trabalhando Offline - Sincronização Automática ao Voltar
          </span>
        </div>
      )}

      <main className="flex-1 container mx-auto px-4 pt-6">
        {view === 'home' && (
          <div className="flex flex-col items-center justify-center space-y-8 py-8">
            <div className="w-48 h-48 bg-white/40 backdrop-blur-xl rounded-[3.5rem] flex items-center justify-center text-blue-600 shadow-2xl relative overflow-hidden group border border-white/50">
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <i className="fas fa-fish-fins text-8xl animate-pulse relative z-10 drop-shadow-lg"></i>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-400/20 blur-2xl rounded-full"></div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-sky-400/20 blur-2xl rounded-full"></div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Como esta a Pescaria?</h2>
              <p className="text-slate-600 max-w-xs mx-auto font-medium">Sincronize seus arremessos e transforme ataques em conquistas com Chuva de iscas.</p>
            </div>
            
            <button 
              onClick={startSession}
              className="w-full max-w-sm py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 transition-all flex items-center justify-center space-x-4 active:scale-95 group hover:bg-blue-700"
            >
              <i className="fas fa-anchor group-hover:rotate-12 transition-transform"></i>
              <span className="tracking-wide">LANÇAR DADOS</span>
            </button>

            {Object.keys(dailyGroups).length > 0 && (
              <div className="w-full max-w-sm mt-8">
                <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Diário de Chuvas</h3>
                {Object.keys(dailyGroups).slice(0, 3).map(date => (
                  <DayCard 
                    key={date} 
                    date={date} 
                    sessions={dailyGroups[date]} 
                    onClick={() => { setSelectedDay(date); setView('stats'); }} 
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'active' && activeSession && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-xl">
              <div>
                <h2 className="text-lg font-black text-slate-800">Pesca em Curso</h2>
                <div className="flex items-center text-blue-600 font-bold text-sm">
                  <i className="fas fa-clock mr-2 text-xs"></i>
                  {activeSession.manualDurationMinutes 
                    ? `${Math.floor(activeSession.manualDurationMinutes / 60)}h ${activeSession.manualDurationMinutes % 60}m (Manual)`
                    : new Date(activeSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={undoLastAction}
                  disabled={metricsHistory.length === 0}
                  className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center hover:bg-slate-200 disabled:opacity-30 active:scale-90 transition-all"
                  title="Desfazer última ação"
                >
                  <i className="fas fa-rotate-left"></i>
                </button>
                <button 
                  onClick={finishSession}
                  className="px-6 py-3 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-100 hover:bg-red-600 active:scale-95 transition-all"
                >
                  FINALIZAR
                </button>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/50">
              <label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2 px-1">Espécie de peixe capturada</label>
              <input 
                type="text"
                placeholder="Ex: Tucunaré, Robalo, Traíra..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={activeSession.species || ''}
                onChange={(e) => setActiveSession({...activeSession, species: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1 relative">
                <Counter label="Arremessos" value={activeSession.metrics.casts} icon={FISHING_ROD_ICON} color="bg-blue-600" onChange={(v) => updateMetric('casts', v)} />
                <button 
                  onClick={() => setIsCalculatorOpen(true)}
                  className="absolute top-2 right-2 w-7 h-7 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-sm hover:bg-blue-100 transition-colors"
                  title="Calcular Volume"
                >
                  <i className="fas fa-calculator text-[10px]"></i>
                </button>
              </div>
              <Counter label="Ataques" value={activeSession.metrics.attacks} icon="fa-fish-fins" color="bg-amber-500" onChange={(v) => updateMetric('attacks', v)} />
              <Counter label="Fisgadas" value={activeSession.metrics.hookups} icon="fa-hand-fist" color="bg-pink-600" onChange={(v) => updateMetric('hookups', v)} />
              <Counter label="Capturados" value={activeSession.metrics.landed} icon="fa-fish" color="bg-emerald-600" onChange={(v) => updateMetric('landed', v)} />
              <div className="col-span-2">
                <Counter label="Perdidos" value={activeSession.metrics.lost} icon="fa-circle-xmark" color="bg-slate-400" onChange={(v) => updateMetric('lost', v)} />
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/50">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Relato da Pescaria</label>
              <textarea 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="Ex: Chuva de iscas na maré baixa, cor prateada rendeu mais..."
                value={activeSession.notes}
                onChange={(e) => setActiveSession({...activeSession, notes: e.target.value})}
              />
            </div>
          </div>
        )}

        {view === 'stats' && currentStats && (
          <div className="space-y-6 pb-12">
            <div className="flex justify-between items-center bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/50">
              <div>
                <h2 className="text-2xl font-black text-slate-800">
                  {selectedDay || activeSession?.date || 'Desempenho'}
                </h2>
                <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">Métricas Chuva de iscas</p>
              </div>
              <button 
                onClick={generateAIInsights}
                disabled={loadingInsights || !isOnline}
                className={`p-3 rounded-2xl font-bold flex items-center shadow-xl active:scale-95 transition-all ${!isOnline ? 'bg-slate-200 text-slate-400' : 'bg-blue-600 text-white'}`}
                title={!isOnline ? "Indisponível offline" : "Gerar Insights de IA"}
              >
                <i className={`fas ${loadingInsights ? 'fa-spinner fa-spin' : 'fa-brain'}`}></i>
              </button>
            </div>

            {insights && (
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 text-slate-800 shadow-2xl relative overflow-hidden border border-blue-100">
                <div className="absolute top-4 right-4 opacity-10 bg-blue-600 p-2 rounded-full">
                  <i className="fas fa-wand-magic-sparkles text-xl text-blue-600"></i>
                </div>
                
                <h3 className="text-lg font-black mb-3 flex items-center gap-2 text-blue-700">
                  <i className="fas fa-chess"></i>
                  Análise Estratégica
                </h3>

                {typeof insights === 'string' ? (
                  <p className="text-sm leading-relaxed font-medium whitespace-pre-line relative z-10">{insights}</p>
                ) : (
                  <div className="space-y-6 relative z-10">
                    <p className="text-sm font-medium opacity-90">{insights.intro}</p>
                    
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                      <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 text-blue-600">ANÁLISE DE DESEMPENHO</h4>
                      <p className="text-sm leading-relaxed text-slate-700">{formatWithBold(insights.performanceAnalysis)}</p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600">FOQUE NESTES 3 PONTOS:</h4>
                      {insights.recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-4 group">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border-2 ${
                            i === 0 ? 'border-blue-500 text-blue-500' : 
                            i === 1 ? 'border-amber-500 text-amber-500' : 
                            'border-emerald-500 text-emerald-500'
                          }`}>
                            {i + 1}
                          </div>
                          <div className="space-y-1">
                            <h5 className={`font-black text-sm tracking-tight ${
                              i === 0 ? 'text-blue-700' : 
                              i === 1 ? 'text-amber-700' : 
                              'text-emerald-700'
                            }`}>{rec.title}</h5>
                            <p className="text-xs font-medium leading-relaxed text-slate-600 group-hover:text-slate-800 transition-colors">
                              {rec.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-sm italic font-bold text-blue-600 pt-2 border-t border-blue-50">{insights.conclusion}</p>
                  </div>
                )}
                <button onClick={() => setInsights(null)} className="mt-6 text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Fechar Análise</button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
               <StatHighlight label="Proporção de Captura" value={`${currentStats.castsPerFish.toFixed(1)}`} sub="arremessos/peixe" icon="fa-arrows-rotate" color="text-blue-600" />
               <StatHighlight label="Poder de Atração" value={`${currentStats.attacksPer100Casts.toFixed(1)}%`} sub="ataques/100 casts" icon="fa-magnet" color="text-amber-600" />
            </div>

            <StatsCharts stats={currentStats} session={activeSession || (selectedDay ? dailyGroups[selectedDay][0] : sessions[0])} isDaily={!!selectedDay} dailyData={selectedDay ? dailyGroups[selectedDay] : []} />
          </div>
        )}

        {view === 'history' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 mb-2">Seu Histórico Pro</h2>
            
            <HistoryComparison sessions={sessions} calculateStats={calculateStats} />

            {Object.keys(dailyGroups).length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <i className="fas fa-folder-open text-6xl mb-6 block opacity-20"></i>
                <p className="font-bold">Ainda não há dados por aqui.</p>
              </div>
            ) : (
              Object.keys(dailyGroups).map(date => (
                <DayCard key={date} date={date} sessions={dailyGroups[date]} onClick={() => { setSelectedDay(date); setView('stats'); }} />
              ))
            )}
          </div>
        )}

        {view === 'forecast' && (
          <Forecast isOnline={isOnline} />
        )}
      </main>

      {/* Modals */}
      {isCalculatorOpen && (
        <CastCalculator 
          onApply={(total, hours) => {
            if (!activeSession) return;
            setActiveSession({
              ...activeSession,
              manualDurationMinutes: hours * 60,
              metrics: { ...activeSession.metrics, casts: total }
            });
          }} 
          onClose={() => setIsCalculatorOpen(false)} 
        />
      )}

      {isLoginModalOpen && (
        <LoginModal 
          onLogin={handleLogin}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-blue-100 flex justify-around items-center py-4 px-2 shadow-xl z-50">
        <NavButton active={view === 'home' || view === 'active'} icon="fa-house" label="Home" onClick={() => setView(activeSession ? 'active' : 'home')} />
        <NavButton active={view === 'stats'} icon="fa-chart-simple" label="Stats" onClick={() => setView('stats')} />
        <NavButton active={view === 'forecast'} icon="fa-cloud-sun-rain" label="Previsões" onClick={() => setView('forecast')} />
        <NavButton active={view === 'history'} icon="fa-book" label="Histórico" onClick={() => setView('history')} />
      </nav>
    </div>
  );
};

const StatHighlight: React.FC<{ label: string; value: string; sub: string; icon: string; color: string }> = ({ label, value, sub, icon, color }) => (
  <div className="bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-white/50 shadow-xl flex flex-col items-center text-center">
    <div className={`w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center ${color} mb-3`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
    <span className={`text-2xl font-black ${color}`}>{value}</span>
    <span className="text-[9px] font-bold text-slate-400 mt-1">{sub}</span>
  </div>
);

const NavButton: React.FC<{ active: boolean; icon: string; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center space-y-1 transition-all min-w-[70px] ${active ? 'text-blue-600 scale-110 font-black' : 'text-slate-400 font-bold'}`}>
    <i className={`fas ${icon} text-lg`}></i>
    <span className="text-[8px] uppercase tracking-widest">{label}</span>
  </button>
);

const DayCard: React.FC<{ date: string; sessions: FishingSession[]; onClick: () => void }> = ({ date, sessions, onClick }) => {
  const totalLanded = sessions.reduce((sum, s) => sum + s.metrics.landed, 0);
  const totalCasts = sessions.reduce((sum, s) => sum + s.metrics.casts, 0);
  
  return (
    <div onClick={onClick} className="bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-xl border border-white/50 flex items-center justify-between mb-4 active:bg-blue-50 transition-all cursor-pointer group">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
          <span className="text-xs font-black uppercase leading-none">{date.split('/')[0]}</span>
          <span className="text-[10px] font-bold opacity-60">{date.split('/')[1] === '01' ? 'JAN' : date.split('/')[1] === '02' ? 'FEV' : 'MÊS'}</span>
        </div>
        <div>
          <div className="font-black text-slate-800">{date}</div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
            <span className="text-emerald-600">{totalLanded} Peixes</span> • {totalCasts} Arremessos
          </div>
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-blue-600 transition-all">
        <i className="fas fa-chevron-right text-xs"></i>
      </div>
    </div>
  );
};

export default App;
