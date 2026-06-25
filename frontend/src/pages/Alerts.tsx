import { useState, useMemo } from 'react';
import { AlertTriangle, AlertCircle, Info, ShieldAlert, Search, Filter } from 'lucide-react';
import { mockAlerts, mockDevices } from '../utils/mockData';
import type { AlertSeverity, AlertStatus } from '../types';

const severityConfig: Record<AlertSeverity, { icon: any; color: string; bg: string; label: string }> = {
  critical: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Critical' },
  high: { icon: ShieldAlert, color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'High' },
  warning: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Warning' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Info' },
};

const statusColors: Record<AlertStatus, string> = {
  open: 'bg-red-500/10 text-red-400 border-red-500/30',
  investigating: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
};

export default function Alerts() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');
  const [alerts, setAlerts] = useState(mockAlerts);

  const filtered = useMemo(() => {
    let list = [...alerts];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.message.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q)
      );
    }
    if (severityFilter !== 'all') list = list.filter(a => a.severity === severityFilter);
    if (statusFilter !== 'all') list = list.filter(a => a.status === statusFilter);
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [search, severityFilter, statusFilter, alerts]);

  const handleStatusChange = (id: number, newStatus: AlertStatus) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-netwatch-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value as AlertSeverity | 'all')}
            className="px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-netwatch-500/50"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as AlertStatus | 'all')}
            className="px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-netwatch-500/50"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Severity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Message</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Device</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((alert) => {
              const config = severityConfig[alert.severity];
              const Icon = config.icon;
              const device = mockDevices.find(d => d.id === alert.device_id);
              return (
                <tr key={alert.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded ${config.bg}`}>
                        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                      </div>
                      <span className={`text-xs font-semibold ${config.color}`}>{config.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{alert.type}</td>
                  <td className="px-4 py-3 text-slate-400 max-w-[300px] truncate">{alert.message}</td>
                  <td className="px-4 py-3">
                    <span className="text-netwatch-400 text-xs">{device?.name || 'Unknown'}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {new Date(alert.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[alert.status]}`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {alert.status !== 'investigating' && (
                        <button
                          onClick={() => handleStatusChange(alert.id, 'investigating')}
                          className="px-2.5 py-1 text-[10px] bg-amber-500/10 text-amber-400 rounded-md hover:bg-amber-500/20 transition-colors"
                        >
                          Investigate
                        </button>
                      )}
                      {alert.status !== 'resolved' && (
                        <button
                          onClick={() => handleStatusChange(alert.id, 'resolved')}
                          className="px-2.5 py-1 text-[10px] bg-emerald-500/10 text-emerald-400 rounded-md hover:bg-emerald-500/20 transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No alerts matching your criteria</p>
          </div>
        )}
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Alert Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'CPU > 80%', severity: 'Warning', type: 'Resource' },
            { name: 'Memory > 85%', severity: 'Warning', type: 'Resource' },
            { name: 'Device Offline > 5m', severity: 'Critical', type: 'Availability' },
            { name: 'Latency > 50ms', severity: 'Warning', type: 'Performance' },
            { name: 'Packet Loss > 2%', severity: 'High', type: 'Performance' },
            { name: 'Bandwidth Spike', severity: 'Info', type: 'Traffic' },
          ].map((rule, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
              <div>
                <p className="text-sm text-slate-200">{rule.name}</p>
                <p className="text-[10px] text-slate-500">{rule.type}</p>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                rule.severity === 'Critical' ? 'bg-red-500/10 text-red-400' :
                rule.severity === 'High' ? 'bg-orange-500/10 text-orange-400' :
                rule.severity === 'Warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
              }`}>{rule.severity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
