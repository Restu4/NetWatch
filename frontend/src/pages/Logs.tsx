import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Filter, ScrollText, ArrowDown } from 'lucide-react';
import { mockLogs, mockDevices } from '../utils/mockData';

export default function Logs() {
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [deviceFilter, setDeviceFilter] = useState<number | 'all'>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const [logs, setLogs] = useState(mockLogs);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const device = mockDevices[Math.floor(Math.random() * mockDevices.length)];
      const eventTypes = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
      const messages = [
        'Heartbeat received',
        'SNMP query successful',
        'Interface status changed',
        'Route updated',
        'ARP entry added',
      ];
      const newLog = {
        id: Date.now(),
        device_id: device.id,
        event_type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        timestamp: new Date().toISOString(),
      };
      setLogs(prev => [newLog, ...prev.slice(0, 199)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs, autoScroll]);

  const filtered = useMemo(() => {
    let list = [...logs];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(l => l.message.toLowerCase().includes(q));
    }
    if (eventFilter !== 'all') list = list.filter(l => l.event_type === eventFilter);
    if (deviceFilter !== 'all') list = list.filter(l => l.device_id === deviceFilter);
    return list;
  }, [search, eventFilter, deviceFilter, logs]);

  const eventColors: Record<string, string> = {
    INFO: 'text-emerald-400',
    WARN: 'text-amber-400',
    ERROR: 'text-red-400',
    DEBUG: 'text-slate-400',
    CRITICAL: 'text-rose-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search log messages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-netwatch-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={eventFilter}
            onChange={e => setEventFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-netwatch-500/50"
          >
            <option value="all">All Events</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
            <option value="DEBUG">DEBUG</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
          <select
            value={deviceFilter}
            onChange={e => setDeviceFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-netwatch-500/50"
          >
            <option value="all">All Devices</option>
            {mockDevices.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs transition-colors ${
              autoScroll ? 'bg-netwatch-500/10 text-netwatch-400' : 'bg-slate-700/50 text-slate-400'
            }`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
            Auto-scroll
          </button>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-700">
          <ScrollText className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">
            {filtered.length} log entries
            {filtered.length !== logs.length && ` (filtered from ${logs.length})`}
          </span>
          <span className="text-[10px] text-slate-500">
            Auto-updating every 5s
          </span>
        </div>
        <div
          ref={scrollRef}
          className="overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 320px)' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider w-[80px]">Timestamp</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider w-[70px]">Type</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider">Message</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider w-[120px]">Device</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => {
                const device = mockDevices.find(d => d.id === log.device_id);
                return (
                  <tr key={log.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                    <td className="px-4 py-2 text-[11px] text-slate-500 font-mono whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`text-[11px] font-semibold ${eventColors[log.event_type] || 'text-slate-400'}`}>
                        {log.event_type}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-[12px] text-slate-300">{log.message}</td>
                    <td className="px-4 py-2 text-[11px] text-netwatch-400">{device?.name || 'Unknown'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <ScrollText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No log entries found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
