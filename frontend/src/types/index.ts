export type DeviceType = 'router' | 'switch' | 'server' | 'access_point' | 'firewall';
export type DeviceStatus = 'online' | 'offline' | 'warning';
export type AlertSeverity = 'critical' | 'high' | 'warning' | 'info';
export type AlertStatus = 'open' | 'investigating' | 'resolved';

export interface Device {
  id: number;
  name: string;
  ip_address: string;
  type: DeviceType;
  status: DeviceStatus;
  cpu_usage: number;
  memory_usage: number;
  uptime: number;
  latency: number;
  packet_loss: number;
  location: string;
  last_seen: string;
  created_at: string;
}

export interface Metric {
  id: number;
  device_id: number;
  cpu: number;
  memory: number;
  bandwidth: number;
  latency: number;
  packet_loss: number;
  incoming_traffic: number;
  outgoing_traffic: number;
  timestamp: string;
}

export interface Alert {
  id: number;
  device_id: number;
  type: string;
  severity: AlertSeverity;
  message: string;
  status: AlertStatus;
  created_at: string;
}

export interface TopologyEdge {
  id: number;
  source_device: string;
  target_device: string;
  status: string;
  latency: number;
}

export interface Log {
  id: number;
  device_id: number;
  event_type: string;
  message: string;
  timestamp: string;
}

export interface DashboardData {
  totalDevices: number;
  activeDevices: number;
  downDevices: number;
  warningDevices: number;
  networkHealthScore: number;
  totalAlerts: number;
  criticalAlerts: number;
}
