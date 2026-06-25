import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Monitor, Router, GitCompare, Wifi, Shield, HardDrive, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { mockDevices } from '../../utils/mockData';
import type { Device, DeviceStatus, DeviceType } from '../../types';

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
  return `${d}d ${h}h`;
}

type SortKey = 'name' | 'type' | 'status' | 'cpu_usage' | 'memory_usage';

export default function DeviceTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<DeviceType | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    let list = [...mockDevices];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(q) || d.ip_address.includes(q));
    }
    if (typeFilter !== 'all') {
      list = list.filter(d => d.type === typeFilter);
    }
    list.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return list;
  }, [search, typeFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />;
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg">
      <div className="p-5 border-b border-slate-700/50 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3">
          <Monitor className="w-5 h-5 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-200">Device Inventory</h3>
        </div>
        <div className="flex-1 min-w-[200px] max-w-sm ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search devices..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-netwatch-500/30 focus:border-netwatch-500/50 transition-all"
            />
          </div>
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as DeviceType | 'all')}
          className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-netwatch-500/30 focus:border-netwatch-500/50 transition-all"
        >
          <option value="all">All Types</option>
          <option value="router">Router</option>
          <option value="switch">Switch</option>
          <option value="server">Server</option>
          <option value="access_point">Access Point</option>
          <option value="firewall">Firewall</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900/30">
              {[
                { key: 'name' as SortKey, label: 'Device' },
                { key: null as any, label: 'IP Address' },
                { key: 'type' as SortKey, label: 'Type' },
                { key: 'status' as SortKey, label: 'Status' },
                { key: 'cpu_usage' as SortKey, label: 'CPU' },
                { key: 'memory_usage' as SortKey, label: 'Memory' },
                { key: null as any, label: 'Uptime' },
                { key: null as any, label: 'Last Seen' },
              ].map((col, i) => (
                <th
                  key={i}
                  className={`px-4 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider ${
                    col.key ? 'cursor-pointer hover:text-slate-300 select-none' : ''
                  }`}
                  onClick={() => col.key && toggleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.key && <SortIcon column={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((device, idx) => {
              const TypeIcon = typeIcons[device.type];
              return (
                <tr
                  key={device.id}
                  onClick={() => navigate(`/device/${device.id}`)}
                  className={`border-t border-slate-700/30 hover:bg-slate-700/20 cursor-pointer transition-all duration-150 group ${
                    idx === filtered.length - 1 ? '' : ''
                  }`}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${statusColors[device.status].split(' ')[0]} group-hover:scale-110 transition-transform`}>
                        <TypeIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-200 text-sm">{device.name}</span>
                        <span className="block text-[10px] text-slate-500">{device.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">{device.ip_address}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-slate-400 capitalize">{device.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[device.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        device.status === 'online' ? 'bg-emerald-400' : device.status === 'offline' ? 'bg-red-400' : 'bg-amber-400'
                      }`} />
                      {device.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            device.cpu_usage > 80 ? 'bg-gradient-to-r from-red-500 to-rose-500' : device.cpu_usage > 60 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-emerald-400 to-green-500'
                          }`}
                          style={{ width: `${device.cpu_usage}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-8 tabular-nums">{Math.round(device.cpu_usage)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            device.memory_usage > 80 ? 'bg-gradient-to-r from-red-500 to-rose-500' : device.memory_usage > 60 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-emerald-400 to-green-500'
                          }`}
                          style={{ width: `${device.memory_usage}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-8 tabular-nums">{Math.round(device.memory_usage)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-slate-400">{formatUptime(device.uptime)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-slate-500">{new Date(device.last_seen).toLocaleTimeString()}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-slate-700/50 flex items-center justify-between bg-slate-900/20">
        <span className="text-xs text-slate-500">Showing <span className="text-slate-300 font-medium">{filtered.length}</span> of <span className="text-slate-300 font-medium">{mockDevices.length}</span> devices</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-600">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
