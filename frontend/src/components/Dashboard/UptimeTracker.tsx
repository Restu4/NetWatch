import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { mockDevices } from '../../utils/mockData';
import type { DeviceType } from '../../types';

const typeColors: Record<DeviceType, string> = {
  router: '#0ea5e9',
  switch: '#8b5cf6',
  server: '#22c55e',
  access_point: '#eab308',
  firewall: '#ef4444',
};

export default function UptimeTracker() {
  const data = useMemo(() => {
    const groups: Record<string, { total: number; up: number }> = {};
    mockDevices.forEach(d => {
      if (!groups[d.type]) groups[d.type] = { total: 0, up: 0 };
      groups[d.type].total++;
      if (d.status === 'online') groups[d.type].up++;
    });
    return Object.entries(groups).map(([type, stats]) => ({
      type: type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
      uptime: parseFloat(((stats.up / stats.total) * 100).toFixed(1)),
      color: typeColors[type as DeviceType],
    }));
  }, []);

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Uptime by Device Type</h3>
          <p className="text-[10px] text-slate-500">Availability across device categories</p>
        </div>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              unit="%"
            />
            <YAxis
              type="category"
              dataKey="type"
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={100}
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
              formatter={(value: number) => [`${value}%`, 'Uptime']}
            />
            <Bar dataKey="uptime" radius={[0, 6, 6, 0]} barSize={24}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
