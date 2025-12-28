
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList 
} from 'recharts';
import { CalculatedStats, FishingSession } from '../types';

interface StatsChartsProps {
  stats: CalculatedStats;
  session: FishingSession;
  isDaily?: boolean;
  dailyData?: FishingSession[];
}

const StatsCharts: React.FC<StatsChartsProps> = ({ stats, session, isDaily, dailyData = [] }) => {
  // Funil de conversão para cada 100 arremessos
  const metricFunnel = [
    { name: 'Arremessos', val: 100, label: 'Lançados', color: '#3b82f6' },
    { name: 'Ataques', val: stats.attackRate * 100, label: 'Atraídos', color: '#60a5fa' },
    { name: 'Fisgadas', val: (stats.attackRate * stats.hookupRate) * 100, label: 'Fisgados', color: '#93c5fd' },
    { name: 'Capturas', val: (stats.attackRate * stats.hookupRate * stats.landingRate) * 100, label: 'Sucesso', color: '#bfdbfe' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Funil de 100 Arremessos</h3>
          <span className="text-[9px] font-bold text-slate-400 italic">Conversão técnica</span>
        </div>
        <div className="h-72 w-full pr-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={metricFunnel} 
              layout="vertical" 
              margin={{ left: -15, right: 40, top: 10, bottom: 10 }}
            >
              <XAxis type="number" hide domain={[0, 110]} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100} 
                tick={{ fontSize: 11, fontWeight: 800, fill: '#1e293b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc', radius: 10 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-800 text-white p-2 rounded-xl text-[10px] font-bold shadow-xl border border-slate-700">
                        {Number(payload[0].value).toFixed(1)} a cada 100 arremessos
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="val" 
                radius={[0, 12, 12, 0]} 
                fill="#3b82f6" 
                barSize={32}
              >
                <LabelList 
                  dataKey="val" 
                  position="right" 
                  formatter={(v: number) => v.toFixed(1)} 
                  style={{ fontSize: '12px', fontWeight: '900', fill: '#3b82f6' }} 
                  offset={10}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center px-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Eficiência Total</span>
            <span className="text-sm font-black text-emerald-600">{(stats.efficiency * 100).toFixed(2)}%</span>
          </div>
          <i className="fas fa-filter text-slate-200"></i>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">TAXAS DE SUCESSO</h3>
        <div className="space-y-5">
          <EfficiencyMetric 
            label="Aproveitamento de Arremessos" 
            desc="Quantos arremessos viram ataques"
            value={stats.attackRate} 
            color="bg-blue-500" 
          />
          <EfficiencyMetric 
            label="Efetividade da Fisgada" 
            desc="Conversão de ataques em fisgadas"
            value={stats.hookupRate} 
            color="bg-amber-500" 
          />
          <EfficiencyMetric 
            label="Segurança na Luta" 
            desc="Conversão de fisgadas em embarque"
            value={stats.landingRate} 
            color="bg-emerald-500" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">RITMO DE CAPTURA</div>
          <div className="text-3xl font-black text-slate-800 tracking-tight">{stats.fishPerHour.toFixed(1)}</div>
          <div className="text-[9px] font-bold text-slate-400 mt-1">peixes / hora</div>
        </div>
        
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">VOLUME DE TRABALHO</div>
          <div className="text-3xl font-black text-blue-600 tracking-tight">{Math.round(stats.castsPerHour)}</div>
          <div className="text-[9px] font-bold text-slate-400 mt-1">arremessos / hora</div>
        </div>
      </div>
    </div>
  );
};

const EfficiencyMetric: React.FC<{ label: string; desc: string; value: number; color: string }> = ({ label, desc, value, color }) => (
  <div>
    <div className="flex justify-between items-end mb-1.5">
      <div>
        <span className="text-xs font-black text-slate-800 block leading-tight">{label}</span>
        <span className="text-[9px] font-bold text-slate-400">{desc}</span>
      </div>
      <span className="text-sm font-black text-slate-800">{(value * 100).toFixed(1)}%</span>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
      <div 
        className={`${color} h-full rounded-full transition-all duration-700 shadow-sm`} 
        style={{ width: `${Math.min(100, value * 100)}%` }}
      ></div>
    </div>
  </div>
);

export default StatsCharts;
