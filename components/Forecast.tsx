
import React, { useState, useEffect } from 'react';

interface ForecastProps {
  isOnline: boolean;
}

const Forecast: React.FC<ForecastProps> = ({ isOnline }) => {
  const [location, setLocation] = useState('Represa do Jaguari, SP');
  const [showMap, setShowMap] = useState(true);

  // Dados simulados para a previsão
  const weatherData = {
    temp: 26,
    condition: 'Ensolarado com poucas nuvens',
    rainProb: 15,
    windSpeed: 12,
    windDir: 'Norte',
    pressure: '1014 hPa',
    pressureTrend: 'Estável',
    sunrise: '05:42',
    sunset: '18:55',
    moonrise: '19:12',
    moonset: '06:15',
    moonPhase: 'Crescente (72%)',
    moonIcon: 'fa-moon'
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/50">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Previsões</h2>
          <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">Janela de Oportunidade</p>
        </div>
        <div className="bg-white/90 p-3 rounded-2xl shadow-sm border border-blue-50">
          <i className="fas fa-cloud-sun-rain text-blue-600 text-xl"></i>
        </div>
      </div>

      {/* Busca de Localidade */}
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/50">
        <label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2 px-1">Localização para Previsão</label>
        <div className="relative">
          <i className="fas fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"></i>
          <input 
            type="text"
            placeholder="Cidade, Represa ou Coordenadas..."
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-transform">
            <i className="fas fa-search text-[10px]"></i>
          </button>
        </div>
      </div>

      {/* Mapa em Tempo Real */}
      <div className="bg-white/95 backdrop-blur-md p-2 rounded-[2.5rem] shadow-xl border border-white/50 overflow-hidden relative h-64 group">
        <div className="absolute inset-0 z-0">
          {/* Usando um mapa estático estilizado/iframe para simular o mapa em tempo real solicitado */}
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            style={{ border: 0, filter: 'hue-rotate(-20deg) saturate(0.8) brightness(1.05)' }} 
            src={`https://www.openstreetmap.org/export/embed.html?bbox=-46.5,-23.5,-46.0,-23.0&layer=mapnik`}
            allowFullScreen
          ></iframe>
          <div className="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>
        </div>
        
        {/* Overlays de Informação no Mapa */}
        <div className="absolute top-4 right-4 z-10 space-y-2">
            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">Radar Ativo</span>
            </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
            <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white max-w-[180px]">
                <p className="text-[8px] font-black uppercase text-blue-400 mb-1">Ponto de Monitoramento</p>
                <p className="text-[10px] font-bold truncate">{location || "Localização Atual"}</p>
                <div className="mt-2 flex items-center space-x-3">
                    <div className="flex flex-col">
                        <span className="text-[7px] font-black text-slate-400 uppercase">Vento</span>
                        <span className="text-[10px] font-black">{weatherData.windSpeed}km/h</span>
                    </div>
                    <div className="w-px h-4 bg-white/20"></div>
                    <div className="flex flex-col">
                        <span className="text-[7px] font-black text-slate-400 uppercase">Pressão</span>
                        <span className="text-[10px] font-black">{weatherData.pressure}</span>
                    </div>
                </div>
            </div>
            
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-xl border border-blue-50 active:scale-90 transition-transform">
                <i className="fas fa-crosshairs"></i>
            </button>
        </div>
      </div>

      {!isOnline && (
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start space-x-3">
          <i className="fas fa-circle-exclamation text-amber-500 mt-0.5"></i>
          <p className="text-xs font-bold text-amber-800 leading-tight">
            Você está offline. Os dados abaixo são baseados na última sincronização válida.
          </p>
        </div>
      )}

      {/* Seção de Clima e Vento */}
      <div className="grid grid-cols-2 gap-4">
        <ForecastCard 
          icon="fa-cloud-rain" 
          label="Precipitação" 
          value={`${weatherData.rainProb}%`} 
          sub="Prob. de Chuva"
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <ForecastCard 
          icon="fa-wind" 
          label="Vento" 
          value={`${weatherData.windSpeed} km/h`} 
          sub={`Direção ${weatherData.windDir}`}
          color="text-indigo-600"
          bg="bg-indigo-50"
        />
      </div>

      {/* Seção de Sol e Lua */}
      <div className="bg-white/95 backdrop-blur-md p-6 rounded-[2.5rem] shadow-xl border border-white/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <i className="fas fa-sun text-8xl"></i>
        </div>
        
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Efemerides do Dia</h3>
        
        <div className="space-y-8">
          {/* Sol */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                <i className="fas fa-sun text-xl"></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sol</p>
                <p className="text-sm font-black text-slate-800">Ciclo Solar</p>
              </div>
            </div>
            <div className="flex space-x-6">
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Nascer</p>
                <p className="text-sm font-black text-slate-700">{weatherData.sunrise}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Pôr</p>
                <p className="text-sm font-black text-slate-700">{weatherData.sunset}</p>
              </div>
            </div>
          </div>

          {/* Lua */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500">
                <i className="fas fa-moon text-xl"></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lua</p>
                <p className="text-sm font-black text-slate-800">{weatherData.moonPhase}</p>
              </div>
            </div>
            <div className="flex space-x-6">
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Nascer</p>
                <p className="text-sm font-black text-slate-700">{weatherData.moonrise}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Pôr</p>
                <p className="text-sm font-black text-slate-700">{weatherData.moonset}</p>
              </div>
            </div>
          </div>

          {/* Pressão Barométrica */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                <i className="fas fa-gauge-high text-xl"></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Barômetro</p>
                <p className="text-sm font-black text-slate-800">Pressão do Ar</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Atual</p>
              <p className="text-sm font-black text-slate-700">{weatherData.pressure}</p>
              <p className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">{weatherData.pressureTrend}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50">
            <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-2xl border border-blue-50">
                <div className="flex items-center space-x-3">
                    <i className="fas fa-fish-fins text-blue-500 text-sm"></i>
                    <span className="text-[11px] font-black text-blue-700 uppercase tracking-tight">Maior atividade dos peixes:</span>
                </div>
                <span className="text-sm font-black text-blue-800">17:45 - 19:15</span>
            </div>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/50 text-center">
        <p className="text-[10px] font-bold text-slate-500 italic">
          "O pescador de sucesso não luta contra a natureza, ele a entende."
        </p>
      </div>
    </div>
  );
};

const ForecastCard: React.FC<{ icon: string; label: string; value: string; sub: string; color: string; bg: string }> = ({ icon, label, value, sub, color, bg }) => (
  <div className={`bg-white/95 backdrop-blur-md p-5 rounded-[2.5rem] shadow-xl border border-white/50 flex flex-col items-center text-center transition-transform active:scale-95`}>
    <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center ${color} mb-3`}>
      <i className={`fas ${icon} text-xl`}></i>
    </div>
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
    <span className={`text-xl font-black ${color}`}>{value}</span>
    <span className="text-[10px] font-bold text-slate-400 mt-1">{sub}</span>
  </div>
);

export default Forecast;
