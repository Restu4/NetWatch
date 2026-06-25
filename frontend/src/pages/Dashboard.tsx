import OverviewPanel from '../components/Dashboard/OverviewPanel';
import DeviceTable from '../components/Dashboard/DeviceTable';
import StatusPanel from '../components/Dashboard/StatusPanel';
import TrafficChart from '../components/Dashboard/TrafficChart';
import TopologyView from '../components/Dashboard/TopologyView';
import AlertPanel from '../components/Dashboard/AlertPanel';
import UptimeTracker from '../components/Dashboard/UptimeTracker';
import PerformanceAnalytics from '../components/Dashboard/PerformanceAnalytics';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <OverviewPanel />
      <DeviceTable />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusPanel />
        <TrafficChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertPanel />
        <UptimeTracker />
      </div>
      <PerformanceAnalytics />
      <TopologyView />
    </div>
  );
}
