import { Device, Metric, Alert, TopologyEdge, Log, DashboardData } from '../types';

const API_BASE = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.statusText}`);
  return res.json();
}

export function fetchDevices(): Promise<Device[]> {
  return fetchJSON<Device[]>('/devices');
}

export function fetchDevice(id: number): Promise<Device> {
  return fetchJSON<Device>(`/devices/${id}`);
}

export function fetchAlerts(): Promise<Alert[]> {
  return fetchJSON<Alert[]>('/alerts');
}

export function fetchAlert(id: number): Promise<Alert> {
  return fetchJSON<Alert>(`/alerts/${id}`);
}

export function updateAlertStatus(id: number, status: string): Promise<Alert> {
  return fetchJSON<Alert>(`/alerts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export function fetchMetrics(deviceId: number): Promise<Metric[]> {
  return fetchJSON<Metric[]>(`/metrics/device/${deviceId}`);
}

export function fetchTraffic(deviceId: number): Promise<Metric[]> {
  return fetchJSON<Metric[]>(`/metrics/device/${deviceId}/traffic`);
}

export function fetchTopology(): Promise<{ nodes: Device[]; edges: TopologyEdge[] }> {
  return fetchJSON<{ nodes: Device[]; edges: TopologyEdge[] }>('/topology');
}

export function fetchLogs(deviceId?: number): Promise<Log[]> {
  const url = deviceId ? `/logs/device/${deviceId}` : '/logs';
  return fetchJSON<Log[]>(url);
}

export function fetchDashboard(): Promise<DashboardData> {
  return fetchJSON<DashboardData>('/dashboard');
}
