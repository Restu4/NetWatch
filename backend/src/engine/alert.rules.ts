import { Injectable } from '@nestjs/common';
import { Device } from '../modules/devices/entities/device.entity';

export interface AlertCandidate {
  device_id: number;
  type: string;
  severity: string;
  message: string;
}

interface DeviceFailureRecord {
  deviceId: number;
  offlineTimestamps: number[];
}

@Injectable()
export class AlertRulesEngine {
  private failureHistory: Map<number, number[]> = new Map();
  private highCpuSince: Map<number, number> = new Map();

  evaluateDevice(device: Device): AlertCandidate[] {
    const alerts: AlertCandidate[] = [];
    const cpu = Number(device.cpu_usage);
    const latency = Number(device.latency);
    const packetLoss = Number(device.packet_loss);
    const now = Date.now();

    if (cpu > 85) {
      const cpuStart = this.highCpuSince.get(device.id) || now;
      if (!this.highCpuSince.has(device.id)) {
        this.highCpuSince.set(device.id, now);
      }
      if (now - cpuStart >= 300000) {
        alerts.push({
          device_id: device.id,
          type: 'cpu',
          severity: 'warning',
          message: `Device ${device.name} CPU usage at ${cpu}% for over 5 minutes`,
        });
      }
    } else {
      this.highCpuSince.delete(device.id);
    }

    if (device.status === 'offline') {
      alerts.push({
        device_id: device.id,
        type: 'network',
        severity: 'critical',
        message: `Device ${device.name} is offline (ping failed)`,
      });
      const history = this.failureHistory.get(device.id) || [];
      history.push(now);
      this.failureHistory.set(device.id, history.filter(t => now - t < 3600000));
    } else {
      const history = this.failureHistory.get(device.id) || [];
      const recentFailures = history.filter(t => now - t < 3600000).length;
      if (recentFailures >= 3) {
        alerts.push({
          device_id: device.id,
          type: 'repeated_failure',
          severity: 'critical',
          message: `Device ${device.name} has gone offline 3 or more times in the past hour`,
        });
        this.failureHistory.delete(device.id);
      }
    }

    if (latency > 200) {
      alerts.push({
        device_id: device.id,
        type: 'latency',
        severity: 'warning',
        message: `Device ${device.name} latency is ${latency}ms (threshold: 200ms)`,
      });
    }

    if (packetLoss > 10) {
      alerts.push({
        device_id: device.id,
        type: 'packet_loss',
        severity: 'high',
        message: `Device ${device.name} packet loss at ${packetLoss}% (threshold: 10%)`,
      });
    }

    return alerts;
  }
}
