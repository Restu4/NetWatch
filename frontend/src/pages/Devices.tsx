import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Monitor, Router, GitCompare, Wifi, Shield, HardDrive, Filter } from 'lucide-react';
import { mockDevices } from '../utils/mockData';
import type { DeviceType, DeviceStatus, Device } from '../types';

const typeIcons: Record<DeviceType, any> = {
  router: Router,
  switch: GitCompare,
  server: HardDrive,
  access_point: Wifi,
  firewall: Shield,
};

const typeLabels: Record<DeviceType, string> = {
  router: 'Router',
  switch: 'Switch',
  server: 'Server',
  access_point: 'Access Point',
  firewall: 'Firewall',
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
  return `${d}d ${h}h`;
}

export default function Devices() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<DeviceType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | 'all'>('all');

  const filtered = useMemo(() => {
    let list = [...mockDevices];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(q) || d.ip_address.includes(q));
    }
    if (typeFilter !== 'all') list = list.filter(d => d.type === typeFilter);
    if (statusFilter !== 'all') list = list.filter(d => d.status === statusFilter);
    return list;
  }, [search, typeFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or IP..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-netwatch-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as DeviceType | 'all')}
            className="px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-netwatch-500/50"
          >
            <option value="all">All Types</option>
            <option value="router">Router</option>
            <option value="switch">Switch</option>
            <option value="server">Server</option>
            <option value="access_point">Access Point</option>
            <option value="firewall">Firewall</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as DeviceStatus | 'all')}
            className="px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-netwatch-500/50"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="warning">Warning</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((device) => {
          const TypeIcon = typeIcons[device.type];
          return (
            <div
              key={device.id}
              onClick={() => navigate(`/device/${device.id}`)}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${statusColors[device.status].split(' ')[0]}`}>
                  <TypeIcon className="w-5 h-5" />
                </div>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[device.status]}`}>
                  {device.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">{device.name}</h3>
              <p className="text-xs text-slate-400 font-mono mb-3">{device.ip_address}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">{typeLabels[device.type]}</p>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">CPU</span>
                    <span className="text-slate-300">{device.cpu_usage}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        device.cpu_usage > 80 ? 'bg-red-400' : device.cpu_usage > 60 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${device.cpu_usage}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Memory</span>
                    <span className="text-slate-300">{device.memory_usage}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        device.memory_usage > 80 ? 'bg-red-400' : device.memory_usage > 60 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${device.memory_usage}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/50">
                <span className="text-[10px] text-slate-500">Uptime: {formatUptime(device.uptime)}</span>
                <span className="text-[10px] text-slate-500">{device.location}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Monitor className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No devices found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
