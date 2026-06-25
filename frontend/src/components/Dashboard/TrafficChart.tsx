import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { mockMetrics } from '../../utils/mockData';

export default function TrafficChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const sorted = [...mockMetrics].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const aggregated: Record<string, { time: string; incoming: number; outgoing: number; count: number }> = {};
    sorted.forEach(m => {
      const key = new Date(m.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
      });
      if (!aggregated[key]) {
        aggregated[key] = { time: key, incoming: 0, outgoing: 0, count: 0 };
      }
      aggregated[key].incoming += m.incoming_traffic;
      aggregated[key].outgoing += m.outgoing_traffic;
      aggregated[key].count += 1;
    });
    const chartData = Object.entries(aggregated)
      .slice(-24)
      .map(([_, v]) => ({
        time: v.time,
        incoming: parseFloat((v.incoming / v.count).toFixed(1)),
        outgoing: parseFloat((v.outgoing / v.count).toFixed(1)),
      }));
    setData(chartData);
  }, []);

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-netwatch-500/20 to-blue-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-netwatch-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Network Traffic</h3>
            <p className="text-[10px] text-slate-500">Bandwidth utilization over time</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-netwatch-400" />
            <span className="text-[10px] text-slate-500">In</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-slate-500">Out</span>
          </div>
        </div>
      </div>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              unit=" Mbps"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                color: '#f1f5f9',
                fontSize: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
            />
            <Line
              type="monotone"
              dataKey="incoming"
              stroke="#0ea5e9"
              strokeWidth={2.5}
              dot={false}
              name="Incoming"
            />
            <Line
              type="monotone"
              dataKey="outgoing"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={false}
              name="Outgoing"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
