import { useState } from 'react';
import { Settings as SettingsIcon, RefreshCw, Palette, Bell, Shield, Server, Save } from 'lucide-react';

export default function Settings() {
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [theme, setTheme] = useState('dark');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:3001');
  const [apiKey, setApiKey] = useState('nw-api-key-****-****');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-xl font-bold text-slate-100">Settings</h1>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <RefreshCw className="w-5 h-5 text-netwatch-400" />
          <h2 className="text-base font-semibold text-slate-200">General Settings</h2>
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-200">Refresh Interval</p>
              <p className="text-xs text-slate-400">How often to poll for updates</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRefreshInterval(i => Math.max(5, i - 5))}
                className="px-2.5 py-1 bg-slate-700/50 rounded text-slate-400 hover:text-slate-200"
              >-</button>
              <span className="text-sm text-slate-200 w-16 text-center">{refreshInterval}s</span>
              <button
                onClick={() => setRefreshInterval(i => Math.min(120, i + 5))}
                className="px-2.5 py-1 bg-slate-700/50 rounded text-slate-400 hover:text-slate-200"
              >+</button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-200">Theme</p>
              <p className="text-xs text-slate-400">Application appearance</p>
            </div>
            <select
              value={theme}
              onChange={e => setTheme(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-netwatch-500/50"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-semibold text-slate-200">Alert Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Email Alerts', desc: 'Receive alert notifications via email', value: emailAlerts, set: setEmailAlerts },
            { label: 'Push Notifications', desc: 'Browser push notifications for critical alerts', value: pushAlerts, set: setPushAlerts },
            { label: 'SMS Alerts', desc: 'SMS notifications for critical alerts only', value: smsAlerts, set: setSmsAlerts },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <button
                onClick={() => item.set(!item.value)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  item.value ? 'bg-netwatch-500' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    item.value ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Server className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-semibold text-slate-200">API Configuration</h2>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">API Endpoint</label>
            <input
              type="text"
              value={apiEndpoint}
              onChange={e => setApiEndpoint(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-netwatch-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-netwatch-500/50"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <button
          onClick={() => {
            setRefreshInterval(30);
            setTheme('dark');
            setEmailAlerts(true);
            setPushAlerts(true);
            setSmsAlerts(false);
            setApiEndpoint('http://localhost:3001');
            setApiKey('nw-api-key-****-****');
          }}
          className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          Reset to Default
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-netwatch-500/10 text-netwatch-400 rounded-lg text-sm font-medium hover:bg-netwatch-500/20 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
