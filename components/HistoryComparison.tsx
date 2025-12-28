
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, ComposedChart 
} from 'recharts';
import { FishingSession, CalculatedStats } from '../types';

interface HistoryComparisonProps {
  sessions: FishingSession[];
  calculateStats: (data: FishingSession | FishingSession[]) => CalculatedStats;
}

const HistoryComparison: React.FC<HistoryComparisonProps> = ({ sessions, calculateStats }) => {
  // Agrupar e calcular estatísticas por dia
  const dataByDay = React.useMemo(() => {
    const groups: Record<string, FishingSession[]> = {};
    sessions.forEach(s => {
      if (!groups[s.date]) groups[s.date] = [];
      groups[s.date].push(s);
    });

    return Object.keys(groups).sort((a, b) => {
        const dateA = a.split('/').reverse().join('-');
        const dateB = b.split('/').reverse().join('-');
        return dateA.localeCompare(dateB);
    }).map(date => {
      const stats = calculateStats(groups[date]);
      return {
        date: date.split('/')[0] + '/' + date.split('/')[1],
        efficiency: parseFloat((stats.efficiency * 100).toFixed(1)),
        castsPerHour: Math.round(stats.castsPerHour),
        hookupRate: parseFloat((stats.hookupRate * 100).toFixed(1)),
        fishPerHour: parseFloat(stats.fishPerHour.toFixed(1)),
        originalDate: date
      };
    });
  }, [sessions, calculateStats]);

  const averages = React.useMemo(() => {
    if (dataByDay.length === 0) return null;
    return {
      efficiency: (dataByDay.reduce((acc, curr) => acc + curr.efficiency, 0) / dataByDay.length).toFixed(1),
      castsPerHour: Math.round(dataByDay.reduce((acc, curr) => acc + curr.castsPerHour, 0) / dataByDay.length),
      hookupRate: (dataByDay.reduce((acc, curr) => acc + curr.hookupRate, 0) / dataByDay.length).toFixed(1),
      fishPerHour: (dataByDay.reduce((acc, curr) => acc + curr.fishPerHour, 0) / dataByDay.length).toFixed(1)
    };
  }, [dataByDay]);

  if (dataByDay.length < 2) return null;

  return (
    <div className="bg-white/95 backdrop-blur-md p-6 rounded-[2.5rem] shadow-xl border border-white/50 mb-8 overflow-hidden">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Estatísticas Comparativas</h3>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Evolução de Performance</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
            <span className="text-[9px] font-black text-blue-600 uppercase">Escala Esq: Taxas (%)</span>
          </div>
          <div className="px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
            <span className="text-[9px] font-black text-emerald-600 uppercase">Escala Dir: Arremessos/H</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={dataByDay} margin={{ top: 10, right: 25, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
              dy={10}
            />
            {/* Eixo Esquerdo para Porcentagens (Eficiência e Fisgada) */}
            <YAxis 
              yAxisId="left"
              orientation="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 800, fill: '#3b82f6' }}
              domain={[0, 100]}
            />
            {/* Eixo Direito para Arremessos por Hora - VERDE */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 800, fill: '#10b981' }}
              domain={[0, 'auto']}
              label={{ 
                value: 'Arremessos/H', 
                angle: -90, 
                position: 'insideRight', 
                offset: -5,
                style: { fontSize: '9px', fontWeight: '900', fill: '#10b981', textTransform: 'uppercase' } 
              }}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
              itemStyle={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 0' }}
              labelStyle={{ fontWeight: '900', color: '#1e293b', marginBottom: '8px', fontSize: '12px' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle" 
              wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }} 
            />
            
            {/* Eficiência (Area) - Escala Esquerda (Azul) */}
            <Area 
              yAxisId="left"
              name="Eficiência Total (%)" 
              type="monotone" 
              dataKey="efficiency" 
              stroke="#3b82f6" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorEff)"
              dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            
            {/* Efetividade Fisgada (Line) - Escala Esquerda (Laranja) */}
            <Line 
              yAxisId="left"
              name="Efetividade Fisgada (%)" 
              type="monotone" 
              dataKey="hookupRate" 
              stroke="#f59e0b" 
              strokeWidth={3} 
              strokeDasharray="5 5"
              dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
            />

            {/* Arremessos / h (Line) - Escala Direita (Verde) */}
            <Line 
              yAxisId="right"
              name="Arremessos / h" 
              type="monotone" 
              dataKey="castsPerHour" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <StatSummaryCard 
          label="Eficiência Total" 
          value={`${averages?.efficiency}%`} 
          sub="Capturas/Arremessos" 
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatSummaryCard 
          label="Arremessos / h" 
          value={averages?.castsPerHour.toString() || '0'} 
          sub="Volume de Trabalho" 
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatSummaryCard 
          label="Efetividade Fisgada" 
          value={`${averages?.hookupRate}%`} 
          sub="Ataques Convertidos" 
          color="text-amber-600"
          bg="bg-amber-50"
        />
        <StatSummaryCard 
          label="Peixes / h" 
          value={averages?.fishPerHour.toString() || '0'} 
          sub="Ritmo de Captura" 
          color="text-indigo-600"
          bg="bg-indigo-50"
        />
      </div>
    </div>
  );
};

const StatSummaryCard: React.FC<{ label: string; value: string; sub: string; color: string; bg: string }> = ({ label, value, sub, color, bg }) => (
  <div className={`${bg} p-4 rounded-3xl border border-white flex flex-col items-center text-center transition-transform active:scale-95 shadow-sm`}>
    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-xl font-black ${color} leading-none mb-1`}>{value}</p>
    <p className="text-[9px] font-bold text-slate-400 opacity-80">{sub}</p>
  </div>
);

export default HistoryComparison;
