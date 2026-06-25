import { useEffect, useState } from 'react';
import { Bell, Circle } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';

export default function Header() {
  const [time, setTime] = useState(new Date());
  const { connected } = useSocket();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-slate-900/70 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-8 z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-netwatch-400 to-netwatch-600 rounded-full" />
          <div>
            <h2 className="text-lg font-semibold text-slate-100 tracking-tight">Dashboard Overview</h2>
            <p className="text-[11px] text-slate-500 -mt-0.5">Real-time network status</p>
          </div>
        </div>
        <span className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-400">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-800/80 border border-slate-700/50 rounded-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${connected ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${connected ? 'bg-emerald-400' : 'bg-red-400'}`} />
          </span>
          <span className="text-xs text-slate-400">{connected ? 'Live' : 'Offline'}</span>
        </div>

        <div className="relative">
          <Bell className="w-5 h-5 text-slate-400 hover:text-slate-200 cursor-pointer transition-all duration-200 hover:scale-110" />
          <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 min-w-[16px] px-1 bg-gradient-to-br from-red-500 to-rose-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-lg shadow-red-500/20">
            3
          </span>
        </div>

        <div className="h-8 w-px bg-slate-700" />

        <div className="text-right">
          <div className="text-sm font-semibold text-slate-200 tabular-nums tracking-tight">
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">System Time</div>
        </div>
      </div>
    </header>
  );
}
