import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Monitor,
  Network,
  Bell,
  BarChart3,
  ScrollText,
  Settings,
  Activity,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/devices', icon: Monitor, label: 'Devices' },
  { to: '/topology', icon: Network, label: 'Topology' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/logs', icon: ScrollText, label: 'Logs' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50">
      <div className="relative p-6 border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-netwatch-500/5 to-transparent pointer-events-none" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-netwatch-400 via-netwatch-500 to-netwatch-700 flex items-center justify-center shadow-lg shadow-netwatch-500/20 ring-1 ring-netwatch-400/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">NetWatch</h1>
            <div className="flex items-center gap-1.5 -mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[11px] text-slate-500">System Online</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
        <p className="px-4 pb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Menu</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-netwatch-500/15 to-transparent text-netwatch-400 border-l-[3px] border-netwatch-500 shadow-sm shadow-netwatch-500/5'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-l-[3px] border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-netwatch-500/20' : 'group-hover:bg-slate-700/50'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-netwatch-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                </div>
                <span>{label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-netwatch-400 shadow-sm shadow-netwatch-400/50" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative p-4 border-t border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-t from-netwatch-500/5 to-transparent pointer-events-none" />
        <div className="relative flex items-center gap-3 px-3 py-2.5 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
            NW
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">NetWatch Admin</p>
            <p className="text-[11px] text-slate-400 truncate">admin@netwatch.io</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
        </div>
      </div>
    </aside>
  );
}
