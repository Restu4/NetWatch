import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, BarChart3, Activity, TrendingUp, CheckCircle } from 'lucide-react';
import { mockDevices, mockAlerts, mockMetrics } from '../../utils/mockData';

export default function PerformanceAnalytics() {
  const topData = useMemo(() => {
    const unstable = [...mockDevices]
      .sort((a, b) => b.latency - a.latency)
      .slice(0, 5)
      .map(d => ({ name: d.name, value: d.latency, metric: 'Latency (ms)' }));

    const traffic = [...mockDevices]
      .sort((a, b) => b.cpu_usage - a.cpu_usage)
      .slice(0, 5)
      .map(d => ({ name: d.name, value: d.cpu_usage, metric: 'CPU %' }));

    return { unstable, traffic };
  }, []);

  const failurePoint = useMemo(() => {
    const counts: Record<string, number> = {};
    mockAlerts.forEach(a => {
      const device = mockDevices.find(d => d.id === a.device_id);
      if (device) {
        counts[device.name] = (counts[device.name] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Most Unstable</h3>
            <p className="text-[10px] text-slate-500">Highest latency devices</p>
          </div>
        </div>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topData.unstable} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} tickLine={false} axisLine={false} width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f1f5f9', fontSize: '11px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                {topData.unstable.map((_, i) => (
                  <Cell key={i} fill="#f97316" fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Highest CPU</h3>
            <p className="text-[10px] text-slate-500">Top resource consumers</p>
          </div>
        </div>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topData.traffic} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} tickLine={false} axisLine={false} width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f1f5f9', fontSize: '11px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                {topData.traffic.map((_, i) => (
                  <Cell key={i} fill="#e11d48" fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Most Failures</h3>
            <p className="text-[10px] text-slate-500">Frequent failure points</p>
          </div>
        </div>
        <div className="space-y-2">
          {failurePoint.map(([device, count], i) => (
            <div
              key={device}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-700/30 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                  i === 0 ? 'bg-red-500/20 text-red-400' : i === 1 ? 'bg-orange-500/20 text-orange-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {i + 1}
                </div>
                <span className="text-sm text-slate-200 font-medium">{device}</span>
              </div>
              <span className="text-xs font-bold text-red-400">{count}</span>
            </div>
          ))}
          {failurePoint.length === 0 && (
            <div className="text-center py-6">
              <CheckCircle className="w-8 h-8 text-emerald-400/50 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No failures recorded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
