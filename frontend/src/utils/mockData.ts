import { Device, Alert, TopologyEdge, Log, Metric, DashboardData } from '../types';

function randomIp(): string {
  return `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.random() * daysAgo);
  return d.toISOString();
}

export const mockDevices: Device[] = [
  { id: 1, name: 'Router-Main', ip_address: '10.0.0.1', type: 'router', status: 'online', cpu_usage: randomFloat(20, 60), memory_usage: randomFloat(30, 70), uptime: randomInt(500000, 2000000), latency: randomFloat(1, 5), packet_loss: randomFloat(0, 0.5), location: 'Data Center - Main', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 2, name: 'Router-Branch-1', ip_address: '10.0.1.1', type: 'router', status: 'online', cpu_usage: randomFloat(15, 55), memory_usage: randomFloat(25, 65), uptime: randomInt(300000, 1500000), latency: randomFloat(5, 15), packet_loss: randomFloat(0, 1), location: 'Branch Office 1', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 3, name: 'Router-Branch-2', ip_address: '10.0.2.1', type: 'router', status: 'warning', cpu_usage: randomFloat(70, 90), memory_usage: randomFloat(75, 95), uptime: randomInt(100000, 500000), latency: randomFloat(20, 50), packet_loss: randomFloat(2, 5), location: 'Branch Office 2', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 4, name: 'Switch-Core-1', ip_address: '10.0.0.2', type: 'switch', status: 'online', cpu_usage: randomFloat(10, 40), memory_usage: randomFloat(20, 50), uptime: randomInt(800000, 2500000), latency: randomFloat(0.5, 2), packet_loss: randomFloat(0, 0.1), location: 'Data Center - Core', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 5, name: 'Switch-Core-2', ip_address: '10.0.0.3', type: 'switch', status: 'online', cpu_usage: randomFloat(10, 40), memory_usage: randomFloat(20, 50), uptime: randomInt(800000, 2500000), latency: randomFloat(0.5, 2), packet_loss: randomFloat(0, 0.1), location: 'Data Center - Core', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 6, name: 'Switch-Access-1', ip_address: '10.0.0.4', type: 'switch', status: 'online', cpu_usage: randomFloat(20, 50), memory_usage: randomFloat(30, 60), uptime: randomInt(400000, 1000000), latency: randomFloat(1, 3), packet_loss: randomFloat(0, 0.3), location: 'Floor 1 - Wiring Closet', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 7, name: 'Switch-Access-2', ip_address: '10.0.0.5', type: 'switch', status: 'offline', cpu_usage: 0, memory_usage: 0, uptime: 0, latency: 0, packet_loss: 100, location: 'Floor 2 - Wiring Closet', last_seen: randomDate(2), created_at: randomDate(365) },
  { id: 8, name: 'Switch-DMZ', ip_address: '10.0.0.6', type: 'switch', status: 'online', cpu_usage: randomFloat(15, 35), memory_usage: randomFloat(25, 45), uptime: randomInt(600000, 1800000), latency: randomFloat(0.5, 1.5), packet_loss: randomFloat(0, 0.05), location: 'DMZ Network', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 9, name: 'Server-Web-01', ip_address: '10.0.10.1', type: 'server', status: 'online', cpu_usage: randomFloat(30, 70), memory_usage: randomFloat(40, 80), uptime: randomInt(200000, 800000), latency: randomFloat(2, 8), packet_loss: randomFloat(0, 0.2), location: 'Data Center - Rack A1', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 10, name: 'Server-Web-02', ip_address: '10.0.10.2', type: 'server', status: 'online', cpu_usage: randomFloat(25, 65), memory_usage: randomFloat(35, 75), uptime: randomInt(200000, 800000), latency: randomFloat(2, 8), packet_loss: randomFloat(0, 0.2), location: 'Data Center - Rack A2', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 11, name: 'Server-DB-01', ip_address: '10.0.20.1', type: 'server', status: 'online', cpu_usage: randomFloat(40, 85), memory_usage: randomFloat(50, 90), uptime: randomInt(300000, 1000000), latency: randomFloat(1, 4), packet_loss: randomFloat(0, 0.1), location: 'Data Center - Rack B1', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 12, name: 'Server-DB-02', ip_address: '10.0.20.2', type: 'server', status: 'warning', cpu_usage: randomFloat(80, 95), memory_usage: randomFloat(85, 98), uptime: randomInt(100000, 400000), latency: randomFloat(5, 15), packet_loss: randomFloat(1, 3), location: 'Data Center - Rack B2', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 13, name: 'Server-Mail', ip_address: '10.0.30.1', type: 'server', status: 'online', cpu_usage: randomFloat(20, 50), memory_usage: randomFloat(30, 60), uptime: randomInt(400000, 1200000), latency: randomFloat(2, 6), packet_loss: randomFloat(0, 0.2), location: 'Data Center - Rack C1', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 14, name: 'Server-DNS', ip_address: '10.0.30.2', type: 'server', status: 'online', cpu_usage: randomFloat(10, 30), memory_usage: randomFloat(20, 40), uptime: randomInt(900000, 2000000), latency: randomFloat(1, 3), packet_loss: randomFloat(0, 0.1), location: 'Data Center - Rack C2', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 15, name: 'Server-DHCP', ip_address: '10.0.30.3', type: 'server', status: 'offline', cpu_usage: 0, memory_usage: 0, uptime: 0, latency: 0, packet_loss: 100, location: 'Data Center - Rack C3', last_seen: randomDate(1), created_at: randomDate(365) },
  { id: 16, name: 'Server-File', ip_address: '10.0.40.1', type: 'server', status: 'online', cpu_usage: randomFloat(15, 45), memory_usage: randomFloat(25, 55), uptime: randomInt(500000, 1500000), latency: randomFloat(2, 5), packet_loss: randomFloat(0, 0.2), location: 'Data Center - Rack D1', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 17, name: 'Server-Backup', ip_address: '10.0.40.2', type: 'server', status: 'online', cpu_usage: randomFloat(5, 20), memory_usage: randomFloat(10, 30), uptime: randomInt(700000, 2000000), latency: randomFloat(1, 3), packet_loss: randomFloat(0, 0.1), location: 'Data Center - Rack D2', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 18, name: 'Server-Monitoring', ip_address: '10.0.0.100', type: 'server', status: 'online', cpu_usage: randomFloat(25, 55), memory_usage: randomFloat(35, 65), uptime: randomInt(300000, 900000), latency: randomFloat(1, 4), packet_loss: randomFloat(0, 0.1), location: 'Data Center - Management', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 19, name: 'AP-Floor-1', ip_address: '10.0.100.1', type: 'access_point', status: 'online', cpu_usage: randomFloat(20, 50), memory_usage: randomFloat(30, 55), uptime: randomInt(200000, 600000), latency: randomFloat(10, 30), packet_loss: randomFloat(0, 1), location: 'Floor 1 - Conference Room', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 20, name: 'AP-Floor-2', ip_address: '10.0.100.2', type: 'access_point', status: 'online', cpu_usage: randomFloat(25, 55), memory_usage: randomFloat(35, 60), uptime: randomInt(200000, 600000), latency: randomFloat(10, 30), packet_loss: randomFloat(0, 1), location: 'Floor 2 - Open Area', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 21, name: 'AP-Floor-3', ip_address: '10.0.100.3', type: 'access_point', status: 'warning', cpu_usage: randomFloat(60, 85), memory_usage: randomFloat(65, 90), uptime: randomInt(50000, 200000), latency: randomFloat(40, 80), packet_loss: randomFloat(3, 8), location: 'Floor 3 - Executive Suite', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 22, name: 'AP-Lobby', ip_address: '10.0.100.4', type: 'access_point', status: 'online', cpu_usage: randomFloat(10, 30), memory_usage: randomFloat(15, 35), uptime: randomInt(300000, 800000), latency: randomFloat(15, 40), packet_loss: randomFloat(0, 0.5), location: 'Main Lobby', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 23, name: 'Firewall-Main', ip_address: '10.0.0.254', type: 'firewall', status: 'online', cpu_usage: randomFloat(20, 50), memory_usage: randomFloat(30, 60), uptime: randomInt(900000, 2500000), latency: randomFloat(0.5, 2), packet_loss: randomFloat(0, 0.05), location: 'Network Perimeter', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 24, name: 'Firewall-Internal', ip_address: '10.0.0.253', type: 'firewall', status: 'online', cpu_usage: randomFloat(15, 40), memory_usage: randomFloat(25, 50), uptime: randomInt(700000, 2000000), latency: randomFloat(0.5, 2), packet_loss: randomFloat(0, 0.05), location: 'Internal Network', last_seen: new Date().toISOString(), created_at: randomDate(365) },
  { id: 25, name: 'Router-Backup', ip_address: '10.0.0.254', type: 'router', status: 'offline', cpu_usage: 0, memory_usage: 0, uptime: 0, latency: 0, packet_loss: 100, location: 'Data Center - Backup', last_seen: randomDate(3), created_at: randomDate(365) },
];

export const mockAlerts: Alert[] = [
  { id: 1, device_id: 3, type: 'High CPU Usage', severity: 'warning', message: 'Router-Branch-2 CPU usage at 85%', status: 'open', created_at: randomDate(1) },
  { id: 2, device_id: 12, type: 'Memory Leak', severity: 'high', message: 'Server-DB-02 memory usage at 95%', status: 'investigating', created_at: randomDate(1) },
  { id: 3, device_id: 7, type: 'Device Offline', severity: 'critical', message: 'Switch-Access-2 has been offline for 2 hours', status: 'open', created_at: randomDate(2) },
  { id: 4, device_id: 15, type: 'Device Offline', severity: 'critical', message: 'Server-DHCP has been offline for 24 hours', status: 'open', created_at: randomDate(1) },
  { id: 5, device_id: 25, type: 'Device Offline', severity: 'high', message: 'Router-Backup is not reachable', status: 'resolved', created_at: randomDate(5) },
  { id: 6, device_id: 21, type: 'High Latency', severity: 'warning', message: 'AP-Floor-3 latency at 75ms', status: 'open', created_at: randomDate(1) },
  { id: 7, device_id: 9, type: 'High Traffic', severity: 'info', message: 'Server-Web-01 traffic spike detected', status: 'open', created_at: randomDate(1) },
  { id: 8, device_id: 3, type: 'Packet Loss', severity: 'warning', message: 'Router-Branch-2 experiencing 4% packet loss', status: 'investigating', created_at: randomDate(1) },
  { id: 9, device_id: 23, type: 'Firewall Rule Change', severity: 'info', message: 'Firewall-Main configuration updated', status: 'resolved', created_at: randomDate(3) },
  { id: 10, device_id: 11, type: 'High CPU Usage', severity: 'warning', message: 'Server-DB-01 CPU at 82%', status: 'open', created_at: randomDate(1) },
  { id: 11, device_id: 2, type: 'Latency Warning', severity: 'info', message: 'Router-Branch-1 latency at 12ms', status: 'resolved', created_at: randomDate(4) },
  { id: 12, device_id: 19, type: 'Connection Drops', severity: 'high', message: 'AP-Floor-1 frequent disconnections reported', status: 'open', created_at: randomDate(1) },
];

export const mockEdges: TopologyEdge[] = [
  { id: 1, source_device: 'Firewall-Main', target_device: 'Router-Main', status: 'active', latency: 0.5 },
  { id: 2, source_device: 'Firewall-Main', target_device: 'Router-Branch-1', status: 'active', latency: 2.0 },
  { id: 3, source_device: 'Firewall-Main', target_device: 'Router-Branch-2', status: 'degraded', latency: 8.0 },
  { id: 4, source_device: 'Firewall-Main', target_device: 'Router-Backup', status: 'down', latency: 0 },
  { id: 5, source_device: 'Firewall-Main', target_device: 'Firewall-Internal', status: 'active', latency: 0.3 },
  { id: 6, source_device: 'Router-Main', target_device: 'Switch-Core-1', status: 'active', latency: 0.5 },
  { id: 7, source_device: 'Router-Main', target_device: 'Switch-Core-2', status: 'active', latency: 0.5 },
  { id: 8, source_device: 'Router-Main', target_device: 'Switch-DMZ', status: 'active', latency: 0.8 },
  { id: 9, source_device: 'Firewall-Internal', target_device: 'Switch-Access-1', status: 'active', latency: 0.4 },
  { id: 10, source_device: 'Firewall-Internal', target_device: 'Switch-Access-2', status: 'down', latency: 0 },
  { id: 11, source_device: 'Switch-Core-1', target_device: 'Server-Web-01', status: 'active', latency: 0.3 },
  { id: 12, source_device: 'Switch-Core-1', target_device: 'Server-Web-02', status: 'active', latency: 0.3 },
  { id: 13, source_device: 'Switch-Core-1', target_device: 'Server-Mail', status: 'active', latency: 0.4 },
  { id: 14, source_device: 'Switch-Core-2', target_device: 'Server-DB-01', status: 'active', latency: 0.3 },
  { id: 15, source_device: 'Switch-Core-2', target_device: 'Server-DB-02', status: 'degraded', latency: 2.0 },
  { id: 16, source_device: 'Switch-Core-2', target_device: 'Server-DNS', status: 'active', latency: 0.2 },
  { id: 17, source_device: 'Switch-Core-2', target_device: 'Server-DHCP', status: 'down', latency: 0 },
  { id: 18, source_device: 'Switch-Core-2', target_device: 'Server-File', status: 'active', latency: 0.3 },
  { id: 19, source_device: 'Switch-Core-2', target_device: 'Server-Backup', status: 'active', latency: 0.3 },
  { id: 20, source_device: 'Switch-Core-2', target_device: 'Server-Monitoring', status: 'active', latency: 0.2 },
  { id: 21, source_device: 'Switch-Access-1', target_device: 'AP-Floor-1', status: 'active', latency: 1.0 },
  { id: 22, source_device: 'Switch-Access-1', target_device: 'AP-Floor-2', status: 'active', latency: 1.2 },
  { id: 23, source_device: 'Switch-Access-1', target_device: 'AP-Floor-3', status: 'degraded', latency: 5.0 },
  { id: 24, source_device: 'Switch-Access-1', target_device: 'AP-Lobby', status: 'active', latency: 0.8 },
];

export const mockLogs: Log[] = Array.from({ length: 50 }, (_, i) => {
  const device = mockDevices[Math.floor(Math.random() * mockDevices.length)];
  const eventTypes = ['INFO', 'WARN', 'ERROR', 'DEBUG', 'CRITICAL'];
  const messages = [
    'Device status changed to online',
    'Device status changed to offline',
    'CPU threshold exceeded',
    'Memory usage warning',
    'Connection established',
    'Connection lost',
    'Configuration updated',
    'Firmware upgrade completed',
    'SNMP query timeout',
    'Interface flap detected',
    'Routing table updated',
    'ARP cache cleared',
    'DNS query failure',
    'DHCP lease renewal',
    'Firewall rule applied',
  ];
  return {
    id: i + 1,
    device_id: device.id,
    event_type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    timestamp: randomDate(7),
  };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export const mockMetrics: Metric[] = Array.from({ length: 168 }, (_, i) => {
  const deviceId = (i % 25) + 1;
  const hoursAgo = 168 - i;
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  return {
    id: i + 1,
    device_id: deviceId,
    cpu: randomFloat(10, 90),
    memory: randomFloat(20, 95),
    bandwidth: randomFloat(10, 1000),
    latency: randomFloat(0.5, 100),
    packet_loss: randomFloat(0, 10),
    incoming_traffic: randomFloat(50, 950),
    outgoing_traffic: randomFloat(30, 800),
    timestamp: d.toISOString(),
  };
});

export const mockDashboardData: DashboardData = {
  totalDevices: 25,
  activeDevices: mockDevices.filter(d => d.status === 'online').length,
  downDevices: mockDevices.filter(d => d.status === 'offline').length,
  warningDevices: mockDevices.filter(d => d.status === 'warning').length,
  networkHealthScore: 82,
  totalAlerts: 12,
  criticalAlerts: mockAlerts.filter(a => a.severity === 'critical').length,
};
