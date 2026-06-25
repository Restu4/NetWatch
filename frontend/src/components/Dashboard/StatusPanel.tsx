import { useState, useEffect } from 'react';
import { Activity, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';
import { mockDevices } from '../../utils/mockData';

interface StatusEvent {
  id: number;
  device: string;
  type: 'online' | 'offline' | 'warning';
  message: string;
  timestamp: Date;
}

const statusIcons = {
  online: ArrowUp,
  offline: ArrowDown,
  warning: AlertTriangle,
};

const statusColors = {
  online: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  offline: 'text-red-400 border-red-500/30 bg-red-500/10',
  warning: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
};

const iconBg = {
  online: 'bg-emerald-500/20',
  offline: 'bg-red-500/20',
  warning: 'bg-amber-500/20',
};

export default function StatusPanel() {
  const [events, setEvents] = useState<StatusEvent[]>([]);

  useEffect(() => {
    const initial: StatusEvent[] = mockDevices.slice(0, 10).map((d, i) => ({
      id: i,
      device: d.name,
      type: d.status,
      message:
        d.status === 'online'
          ? 'Device online and operational'
          : d.status === 'offline'
          ? 'Device unreachable'
          : 'Performance degraded',
      timestamp: new Date(Date.now() - Math.random() * 3600000),
    }));
    setEvents(initial);

    const interval = setInterval(() => {
      const device = mockDevices[Math.floor(Math.random() * mockDevices.length)];
      const types: ('online' | 'offline' | 'warning')[] = ['online', 'offline', 'warning'];
      const type = types[Math.floor(Math.random() * types.length)];
      const messages: Record<string, string> = {
        online: 'Device back online',
        offline: 'Connection lost',
        warning: 'High latency detected',
      };
      setEvents(prev => [
        {
          id: Date.now(),
          device: device.name,
          type,
          message: messages[type],
          timestamp: new Date(),
        },
        ...prev.slice(0, 19),
      ]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
          <Activity className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Real-Time Status</h3>
          <p className="text-[10px] text-slate-500">Live device event feed</p>
        </div>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {events.length === 0 && (
          <div className="text-center py-8">
            <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-pulse" />
            <p className="text-sm text-slate-500">Waiting for events...</p>
          </div>
        )}
        {events.map((event, i) => {
          const Icon = statusIcons[event.type];
          return (
            <div
              key={event.id}
              className={`flex items-start gap-3 p-3 rounded-xl border ${statusColors[event.type]} transition-all duration-300 ${
                i === 0 ? 'shadow-lg shadow-black/20' : ''
              }`}
            >
              <div className={`p-2 rounded-full ${iconBg[event.type]} mt-0.5`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${event.type === 'online' ? 'bg-emerald-400' : event.type === 'offline' ? 'bg-red-400' : 'bg-amber-400'}`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${event.type === 'online' ? 'bg-emerald-400' : event.type === 'offline' ? 'bg-red-400' : 'bg-amber-400'}`} />
                  </span>
                  <span className="text-sm font-semibold text-slate-200 truncate">{event.device}</span>
                  <span className="ml-auto text-[10px] text-slate-500 tabular-nums">{event.timestamp.toLocaleTimeString()}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 ml-4">{event.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
