import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Monitor,
  Router,
  GitCompare,
  Wifi,
  Shield,
  HardDrive,
  Clock,
  Activity,
  WifiOff,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { mockDevices, mockMetrics, mockAlerts, mockLogs } from '../utils/mockData';
import type { DeviceType, DeviceStatus } from '../types';

const typeIcons: Record<DeviceType, any> = {
  router: Router,
  switch: GitCompare,
  server: HardDrive,
  access_point: Wifi,
  firewall: Shield,
};

const statusColors: Record<DeviceStatus, string> = {
  online: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  offline: 'bg-red-500/10 text-red-400 border-red-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
};

function formatUptime(seconds: number): string {
  if (seconds === 0) return 'N/A';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

export default function DeviceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const device = mockDevices.find(d => d.id === Number(id));

  if (!device) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <WifiOff className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold text-slate-300 mb-2">Device Not Found</h2>
        <p className="text-slate-400 mb-6">The device you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/devices')}
          className="px-4 py-2 bg-netwatch-500/10 text-netwatch-400 rounded-lg text-sm hover:bg-netwatch-500/20 transition-colors"
        >
          Back to Devices
        </button>
      </div>
    );
  }

  const TypeIcon = typeIcons[device.type];
  const deviceMetrics = mockMetrics.filter(m => m.device_id === device.id).slice(-24);
  const deviceAlerts = mockAlerts.filter(a => a.device_id === device.id);
  const deviceLogs = mockLogs.filter(l => l.device_id === device.id).slice(0, 20);

  const trafficData = deviceMetrics.map(m => ({
    time: new Date(m.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    incoming: m.incoming_traffic,
    outgoing: m.outgoing_traffic,
    cpu: m.cpu,
    memory: m.memory,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/devices')}
          className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-100">{device.name}</h1>
          <p className="text-sm text-slate-400">{device.ip_address} &middot; {device.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${statusColors[device.status].split(' ')[0]}`}>
              <TypeIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Type</p>
              <p className="text-sm font-medium text-slate-200 capitalize">{device.type.replace('_', ' ')}</p>
            </div>
          </div>
          <div>
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[device.status]}`}>
              {device.status}
            </span>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-netwatch-400" />
            <p className="text-xs text-slate-400">CPU Usage</p>
          </div>
          <p className={`text-2xl font-bold ${device.cpu_usage > 80 ? 'text-red-400' : device.cpu_usage > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {device.cpu_usage}%
          </p>
          <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${device.cpu_usage > 80 ? 'bg-red-400' : device.cpu_usage > 60 ? 'bg-amber-400' : 'bg-emerald-400'}`}
              style={{ width: `${device.cpu_usage}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <p className="text-xs text-slate-400">Memory Usage</p>
          </div>
          <p className={`text-2xl font-bold ${device.memory_usage > 80 ? 'text-red-400' : device.memory_usage > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {device.memory_usage}%
          </p>
          <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${device.memory_usage > 80 ? 'bg-red-400' : device.memory_usage > 60 ? 'bg-amber-400' : 'bg-emerald-400'}`}
              style={{ width: `${device.memory_usage}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <p className="text-xs text-slate-400">Uptime</p>
          </div>
          <p className="text-lg font-bold text-slate-200">{formatUptime(device.uptime)}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
            <span>Latency: {device.latency}ms</span>
            <span>Pkt Loss: {device.packet_loss}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">CPU & Memory Trend</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#334155' }} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '11px' }} />
                <Area type="monotone" dataKey="cpu" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.1} name="CPU" />
                <Area type="monotone" dataKey="memory" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} name="Memory" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Traffic (In/Out)</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#334155' }} unit=" Mbps" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '11px' }} />
                <Line type="monotone" dataKey="incoming" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Incoming" />
                <Line type="monotone" dataKey="outgoing" stroke="#22c55e" strokeWidth={2} dot={false} name="Outgoing" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Alert History</h3>
          {deviceAlerts.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No alerts for this device</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {deviceAlerts.map(alert => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                    alert.severity === 'critical' ? 'text-red-400' :
                    alert.severity === 'high' ? 'text-orange-400' :
                    alert.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold uppercase ${
                        alert.severity === 'critical' ? 'text-red-400' :
                        alert.severity === 'high' ? 'text-orange-400' :
                        alert.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'
                      }`}>{alert.severity}</span>
                      <span className="text-xs text-slate-400">{alert.type}</span>
                    </div>
                    <p className="text-sm text-slate-200 truncate">{alert.message}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{new Date(alert.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Logs</h3>
          {deviceLogs.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No logs for this device</p>
          ) : (
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {deviceLogs.map(log => (
                <div key={log.id} className="flex items-start gap-2 p-2 rounded hover:bg-slate-700/20 text-xs">
                  <span className="text-slate-500 font-mono w-16 flex-shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`font-semibold w-16 flex-shrink-0 ${
                    log.event_type === 'ERROR' || log.event_type === 'CRITICAL' ? 'text-red-400' :
                    log.event_type === 'WARN' ? 'text-amber-400' :
                    log.event_type === 'INFO' ? 'text-emerald-400' : 'text-slate-400'
                  }`}>{log.event_type}</span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
