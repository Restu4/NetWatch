import { Server, CheckCircle, XCircle, AlertTriangle, HeartPulse, TrendingUp, Monitor, Wifi, HardDrive } from 'lucide-react';
import { mockDashboardData, mockDevices } from '../../utils/mockData';

const cards = [
  {
    label: 'Total Devices',
    value: mockDashboardData.totalDevices,
    icon: Server,
    iconColor: 'text-netwatch-400',
    accent: 'from-netwatch-400 to-blue-500',
    shadow: 'shadow-netwatch-500/10',
    gradient: 'from-netwatch-500/10 via-transparent to-transparent',
    sub: [
      { label: 'Online', count: mockDashboardData.activeDevices, color: 'text-emerald-400' },
      { label: 'Offline', count: mockDashboardData.downDevices, color: 'text-red-400' },
    ],
  },
  {
    label: 'Active',
    value: mockDashboardData.activeDevices,
    icon: CheckCircle,
    iconColor: 'text-emerald-400',
    accent: 'from-emerald-400 to-green-500',
    shadow: 'shadow-emerald-500/10',
    gradient: 'from-emerald-500/10 via-transparent to-transparent',
    sub: [
      { label: 'Uptime Rate', value: `${Math.round(mockDashboardData.activeDevices / mockDashboardData.totalDevices * 100)}%`, color: 'text-emerald-400' },
    ],
    barPercent: Math.round(mockDashboardData.activeDevices / mockDashboardData.totalDevices * 100),
    barColor: 'bg-emerald-400',
  },
  {
    label: 'Down',
    value: mockDashboardData.downDevices,
    icon: XCircle,
    iconColor: 'text-red-400',
    accent: 'from-red-400 to-rose-500',
    shadow: 'shadow-red-500/10',
    gradient: 'from-red-500/10 via-transparent to-transparent',
    sub: [
      { label: 'Affected', value: `${mockDashboardData.downDevices > 0 ? mockDashboardData.downDevices + ' devices' : 'None'}`, color: mockDashboardData.downDevices > 0 ? 'text-red-400' : 'text-emerald-400' },
    ],
    barPercent: mockDashboardData.downDevices > 0 ? Math.round(mockDashboardData.downDevices / mockDashboardData.totalDevices * 100) : 0,
    barColor: 'bg-red-400',
  },
  {
    label: 'Warning',
    value: mockDashboardData.warningDevices,
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    accent: 'from-amber-400 to-orange-500',
    shadow: 'shadow-amber-500/10',
    gradient: 'from-amber-500/10 via-transparent to-transparent',
    sub: [
      { label: 'High CPU', value: mockDevices.filter(d => d.cpu_usage > 80).length + ' devices', color: 'text-amber-400' },
    ],
    barPercent: mockDashboardData.warningDevices > 0 ? Math.round(mockDashboardData.warningDevices / mockDashboardData.totalDevices * 100) : 0,
    barColor: 'bg-amber-400',
  },
  {
    label: 'Health Score',
    value: `${mockDashboardData.networkHealthScore}%`,
    icon: HeartPulse,
    iconColor: 'text-purple-400',
    accent: 'from-purple-400 to-violet-500',
    shadow: 'shadow-purple-500/10',
    gradient: 'from-purple-500/10 via-transparent to-transparent',
    badge: `${mockDashboardData.networkHealthScore >= 80 ? 'Good' : mockDashboardData.networkHealthScore >= 60 ? 'Fair' : 'Poor'}`,
    badgeColor: mockDashboardData.networkHealthScore >= 80 ? 'text-emerald-400 bg-emerald-500/10' : mockDashboardData.networkHealthScore >= 60 ? 'text-amber-400 bg-amber-500/10' : 'text-red-400 bg-red-500/10',
    barPercent: mockDashboardData.networkHealthScore,
    barColor: mockDashboardData.networkHealthScore >= 80 ? 'bg-emerald-400' : mockDashboardData.networkHealthScore >= 60 ? 'bg-amber-400' : 'bg-red-400',
  },
];

export default function OverviewPanel() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Dashboard</h2>
          <p className="text-sm text-slate-400 mt-0.5">Network infrastructure overview & real-time status</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-300">All systems <span className="text-emerald-400 font-medium">{Math.round(mockDashboardData.activeDevices / mockDashboardData.totalDevices * 100)}%</span> operational</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`relative group overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/50 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${card.shadow}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{card.label}</p>
                <div className={`p-2 rounded-xl bg-slate-800/80 border border-slate-700/50 group-hover:border-slate-600/50 transition-colors`}>
                  <card.icon className={`w-4 h-4 ${card.iconColor}`} />
                </div>
              </div>
              <p className={`text-3xl font-bold bg-gradient-to-r ${card.accent} bg-clip-text text-transparent`}>
                {card.value}
              </p>
              {'badge' in card && (
                <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded-full ${(card as any).badgeColor}`}>
                  {(card as any).badge}
                </span>
              )}
              {(card as any).sub && (
                <div className="flex gap-3 mt-2.5">
                  {(card as any).sub.map((s: any, i: number) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-600">{s.label}:</span>
                      <span className={`text-[11px] font-semibold ${s.color}`}>{s.count ?? s.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {'barPercent' in card && (
                <div className="mt-3 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${(card as any).barColor}`}
                    style={{ width: `${(card as any).barPercent}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
