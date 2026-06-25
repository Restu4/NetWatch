import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  Legend,
} from 'recharts';
import { TrendingUp, Activity, BarChart3, AlertTriangle, Calendar } from 'lucide-react';
import { mockDevices, mockMetrics, mockAlerts } from '../utils/mockData';

export default function Analytics() {
  const [range, setRange] = useState<'7d' | '24h' | '30d'>('7d');

  const cpuTrend = useMemo(() => {
    const grouped: Record<string, { cpu: number[]; memory: number[] }> = {};
    mockMetrics.forEach(m => {
      const key = new Date(m.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      if (!grouped[key]) grouped[key] = { cpu: [], memory: [] };
      grouped[key].cpu.push(m.cpu);
      grouped[key].memory.push(m.memory);
    });
    return Object.entries(grouped).slice(-14).map(([date, vals]) => ({
      date,
      cpu: parseFloat((vals.cpu.reduce((a, b) => a + b, 0) / vals.cpu.length).toFixed(1)),
      memory: parseFloat((vals.memory.reduce((a, b) => a + b, 0) / vals.memory.length).toFixed(1)),
    }));
  }, []);

  const trafficOverTime = useMemo(() => {
    const grouped: Record<string, { in: number[]; out: number[] }> = {};
    mockMetrics.forEach(m => {
      const key = new Date(m.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      if (!grouped[key]) grouped[key] = { in: [], out: [] };
      grouped[key].in.push(m.incoming_traffic);
      grouped[key].out.push(m.outgoing_traffic);
    });
    return Object.entries(grouped).slice(-14).map(([date, vals]) => ({
      date,
      incoming: parseFloat((vals.in.reduce((a, b) => a + b, 0) / vals.in.length).toFixed(1)),
      outgoing: parseFloat((vals.out.reduce((a, b) => a + b, 0) / vals.out.length).toFixed(1)),
    }));
  }, []);

  const unstable = useMemo(() => {
    return [...mockDevices]
      .sort((a, b) => b.latency - a.latency)
      .slice(0, 8)
      .map(d => ({ name: d.name, latency: d.latency, packetLoss: d.packet_loss }));
  }, []);

  const highTraffic = useMemo(() => {
    return [...mockDevices]
      .sort((a, b) => b.cpu_usage - a.cpu_usage)
      .slice(0, 8)
      .map(d => ({ name: d.name, cpu: d.cpu_usage, memory: d.memory_usage }));
  }, []);

  const failureCount = useMemo(() => {
    const counts: Record<string, number> = {};
    mockAlerts.forEach(a => {
      const device = mockDevices.find(d => d.id === a.device_id);
      if (device) counts[device.name] = (counts[device.name] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-100">Analytics</h1>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          {(['24h', '7d', '30d'] as const).map(period => (
            <button
              key={period}
              onClick={() => setRange(period)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                range === period
                  ? 'bg-netwatch-500/10 text-netwatch-400'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-netwatch-400" />
            <h3 className="text-sm font-semibold text-slate-200">CPU Trend</h3>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#334155' }} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Area type="monotone" dataKey="cpu" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.1} name="CPU" />
                <Area type="monotone" dataKey="memory" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} name="Memory" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-200">Traffic Over Time</h3>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#334155' }} unit=" Mbps" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Line type="monotone" dataKey="incoming" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Incoming" />
                <Line type="monotone" dataKey="outgoing" stroke="#22c55e" strokeWidth={2} dot={false} name="Outgoing" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-semibold text-slate-200">Most Unstable (Latency)</h3>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={unstable} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={false} width={85} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '10px' }} />
                <Bar dataKey="latency" radius={[0, 3, 3, 0]} barSize={10}>
                  {unstable.map((_, i) => (
                    <Cell key={i} fill={i < 3 ? '#f97316' : '#0ea5e9'} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-slate-200">Highest Resource Usage</h3>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={highTraffic} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={false} width={85} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '10px' }} />
                <Bar dataKey="cpu" radius={[0, 3, 3, 0]} barSize={10}>
                  {highTraffic.map((_, i) => (
                    <Cell key={i} fill={i < 3 ? '#e11d48' : '#0ea5e9'} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-200">Most Frequent Failures</h3>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failureCount} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={false} width={85} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '10px' }} />
                <Bar dataKey="count" radius={[0, 3, 3, 0]} barSize={10}>
                  {failureCount.map((_, i) => (
                    <Cell key={i} fill={i < 3 ? '#eab308' : '#0ea5e9'} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
