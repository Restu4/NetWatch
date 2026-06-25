import { useNavigate } from 'react-router-dom';
import { AlertTriangle, AlertCircle, Info, ShieldAlert, ArrowRight, CheckCircle } from 'lucide-react';
import { mockAlerts, mockDevices } from '../../utils/mockData';
import type { AlertSeverity } from '../../types';

const severityConfig: Record<AlertSeverity, { icon: any; color: string; bg: string }> = {
  critical: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
  high: { icon: ShieldAlert, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  warning: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
};

export default function AlertPanel() {
  const navigate = useNavigate();
  const recentAlerts = mockAlerts.slice(0, 5);

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Recent Alerts</h3>
            <p className="text-[10px] text-slate-500">Latest notifications & warnings</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/alerts')}
          className="flex items-center gap-1 px-3 py-1.5 bg-netwatch-500/10 border border-netwatch-500/20 rounded-lg text-xs text-netwatch-400 hover:bg-netwatch-500/20 transition-all"
        >
          View All
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      <div className="space-y-2">
        {recentAlerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          const device = mockDevices.find(d => d.id === alert.device_id);
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3.5 rounded-xl border ${config.bg} hover:shadow-lg transition-all duration-200`}
            >
              <div className={`p-2 rounded-lg ${config.bg.split(' ')[0]}`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${config.color} ${config.bg.split(' ')[0]}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {device?.name || `Device #${alert.device_id}`}
                  </span>
                </div>
                <p className="text-sm text-slate-200 mt-1 leading-snug">{alert.message}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-slate-600">{new Date(alert.created_at).toLocaleString()}</span>
                  <span className={`text-[10px] font-medium ${alert.status === 'open' ? 'text-red-400' : alert.status === 'investigating' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    • {alert.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {recentAlerts.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="w-8 h-8 text-emerald-400/50 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No recent alerts</p>
          </div>
        )}
      </div>
    </div>
  );
}
