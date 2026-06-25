import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../modules/devices/entities/device.entity';
import { Metric } from '../modules/metrics/entities/metric.entity';
import { Alert } from '../modules/alerts/entities/alert.entity';
import { Log } from '../modules/logs/entities/log.entity';
import { AlertRulesEngine } from './alert.rules';

interface MockDeviceDef {
  name: string;
  ip_address: string;
  type: string;
  location: string;
  baseCpu: number;
  baseMemory: number;
  baseLatency: number;
  basePacketLoss: number;
}

@Injectable()
export class MonitoringService implements OnModuleInit {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private deviceIds: number[] = [];
  private readonly simulationFactor: number = 1;

  private readonly mockDevices: MockDeviceDef[] = [
    { name: 'Core-Router-01', ip_address: '10.0.0.1', type: 'router', location: 'Data Center A', baseCpu: 45, baseMemory: 55, baseLatency: 5, basePacketLoss: 0.1 },
    { name: 'Core-Router-02', ip_address: '10.0.0.2', type: 'router', location: 'Data Center B', baseCpu: 50, baseMemory: 60, baseLatency: 8, basePacketLoss: 0.2 },
    { name: 'Edge-Router-01', ip_address: '10.0.1.1', type: 'router', location: 'Branch Office 1', baseCpu: 35, baseMemory: 40, baseLatency: 15, basePacketLoss: 0.5 },
    { name: 'Edge-Router-02', ip_address: '10.0.1.2', type: 'router', location: 'Branch Office 2', baseCpu: 30, baseMemory: 45, baseLatency: 20, basePacketLoss: 0.3 },
    { name: 'Core-Switch-01', ip_address: '10.0.2.1', type: 'switch', location: 'Data Center A', baseCpu: 25, baseMemory: 35, baseLatency: 2, basePacketLoss: 0.05 },
    { name: 'Core-Switch-02', ip_address: '10.0.2.2', type: 'switch', location: 'Data Center B', baseCpu: 28, baseMemory: 38, baseLatency: 3, basePacketLoss: 0.05 },
    { name: 'Access-Switch-01', ip_address: '10.0.3.1', type: 'switch', location: 'Floor 1', baseCpu: 20, baseMemory: 30, baseLatency: 4, basePacketLoss: 0.1 },
    { name: 'Access-Switch-02', ip_address: '10.0.3.2', type: 'switch', location: 'Floor 2', baseCpu: 22, baseMemory: 32, baseLatency: 5, basePacketLoss: 0.15 },
    { name: 'Access-Switch-03', ip_address: '10.0.3.3', type: 'switch', location: 'Floor 3', baseCpu: 18, baseMemory: 28, baseLatency: 4, basePacketLoss: 0.1 },
    { name: 'Web-Server-01', ip_address: '192.168.1.10', type: 'server', location: 'Data Center A', baseCpu: 60, baseMemory: 70, baseLatency: 10, basePacketLoss: 0.2 },
    { name: 'Web-Server-02', ip_address: '192.168.1.11', type: 'server', location: 'Data Center A', baseCpu: 65, baseMemory: 75, baseLatency: 12, basePacketLoss: 0.3 },
    { name: 'App-Server-01', ip_address: '192.168.2.10', type: 'server', location: 'Data Center B', baseCpu: 55, baseMemory: 65, baseLatency: 8, basePacketLoss: 0.1 },
    { name: 'App-Server-02', ip_address: '192.168.2.11', type: 'server', location: 'Data Center B', baseCpu: 58, baseMemory: 68, baseLatency: 9, basePacketLoss: 0.15 },
    { name: 'DB-Server-01', ip_address: '192.168.3.10', type: 'server', location: 'Data Center A', baseCpu: 70, baseMemory: 80, baseLatency: 3, basePacketLoss: 0.05 },
    { name: 'DB-Server-02', ip_address: '192.168.3.11', type: 'server', location: 'Data Center B', baseCpu: 72, baseMemory: 82, baseLatency: 4, basePacketLoss: 0.05 },
    { name: 'File-Server-01', ip_address: '192.168.4.10', type: 'server', location: 'Data Center A', baseCpu: 40, baseMemory: 60, baseLatency: 15, basePacketLoss: 0.3 },
    { name: 'AP-01-Floor1', ip_address: '10.0.10.1', type: 'access_point', location: 'Floor 1', baseCpu: 15, baseMemory: 25, baseLatency: 30, basePacketLoss: 1.0 },
    { name: 'AP-02-Floor2', ip_address: '10.0.10.2', type: 'access_point', location: 'Floor 2', baseCpu: 18, baseMemory: 28, baseLatency: 35, basePacketLoss: 1.5 },
    { name: 'AP-03-Floor3', ip_address: '10.0.10.3', type: 'access_point', location: 'Floor 3', baseCpu: 12, baseMemory: 20, baseLatency: 40, basePacketLoss: 2.0 },
    { name: 'AP-04-Lobby', ip_address: '10.0.10.4', type: 'access_point', location: 'Lobby', baseCpu: 10, baseMemory: 18, baseLatency: 25, basePacketLoss: 0.8 },
    { name: 'FW-Primary', ip_address: '10.0.99.1', type: 'firewall', location: 'Data Center A', baseCpu: 35, baseMemory: 45, baseLatency: 5, basePacketLoss: 0.1 },
    { name: 'FW-Secondary', ip_address: '10.0.99.2', type: 'firewall', location: 'Data Center B', baseCpu: 32, baseMemory: 42, baseLatency: 6, basePacketLoss: 0.1 },
    { name: 'FW-Branch-01', ip_address: '10.0.99.10', type: 'firewall', location: 'Branch Office 1', baseCpu: 20, baseMemory: 30, baseLatency: 25, basePacketLoss: 0.5 },
    { name: 'FW-Branch-02', ip_address: '10.0.99.11', type: 'firewall', location: 'Branch Office 2', baseCpu: 22, baseMemory: 32, baseLatency: 28, basePacketLoss: 0.6 },
    { name: 'Mail-Server-01', ip_address: '192.168.5.10', type: 'server', location: 'Data Center A', baseCpu: 45, baseMemory: 55, baseLatency: 10, basePacketLoss: 0.2 },
  ];

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(Metric)
    private readonly metricRepository: Repository<Metric>,
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
    private readonly alertRulesEngine: AlertRulesEngine,
  ) {}

  async onModuleInit() {
    await this.seedDevices();
    this.startSimulation();
  }

  private async seedDevices() {
    for (const def of this.mockDevices) {
      const existing = await this.deviceRepository.findOne({ where: { name: def.name } });
      if (!existing) {
        const device = this.deviceRepository.create({
          name: def.name,
          ip_address: def.ip_address,
          type: def.type,
          status: 'online',
          cpu_usage: def.baseCpu + this.randomFluctuation(10),
          memory_usage: def.baseMemory + this.randomFluctuation(10),
          uptime: Math.random() * 720,
          latency: def.baseLatency + this.randomFluctuation(5),
          packet_loss: def.basePacketLoss + Math.random() * 0.5,
          location: def.location,
          last_seen: new Date(),
        });
        const saved = await this.deviceRepository.save(device);
        this.deviceIds.push(saved.id);
      } else {
        this.deviceIds.push(existing.id);
      }
    }
  }

  private startSimulation() {
    this.intervalId = setInterval(async () => {
      await this.simulationTick();
    }, 5000);
  }

  private async simulationTick() {
    const devices = await this.deviceRepository.find();
    const newAlerts: import('./alert.rules').AlertCandidate[] = [];

    for (const device of devices) {
      const def = this.mockDevices.find(d => d.name === device.name);
      if (!def) continue;

      const shouldFail = Math.random() < 0.02;
      if (shouldFail) {
        device.status = 'offline';
        device.cpu_usage = 0;
        device.memory_usage = 0;
        device.latency = 0;
        device.packet_loss = 100;
      } else {
        device.status = 'online';
        device.cpu_usage = Math.round((def.baseCpu + this.randomFluctuation(15)) * 100) / 100;
        device.memory_usage = Math.round((def.baseMemory + this.randomFluctuation(12)) * 100) / 100;
        device.cpu_usage = Math.max(0, Math.min(100, Math.round(device.cpu_usage * 100) / 100));
        device.memory_usage = Math.max(0, Math.min(100, Math.round(device.memory_usage * 100) / 100));

        const cpuSpike = Math.random() < 0.05;
        if (cpuSpike) {
          device.cpu_usage = Math.min(100, device.cpu_usage + 40 + Math.random() * 20);
        }

        device.latency = Math.max(0, Math.round((def.baseLatency + this.randomFluctuation(10)) * 100) / 100);
        device.packet_loss = Math.max(0, Math.min(100, Math.round((def.basePacketLoss + Math.random() * 3) * 100) / 100));

        if (device.status === 'online') {
          device.uptime = Math.round((Number(device.uptime) + 5 / 3600) * 100) / 100;
        }
        device.last_seen = new Date();
      }

      const metric = this.metricRepository.create({
        device_id: device.id,
        cpu: device.cpu_usage,
        memory: device.memory_usage,
        bandwidth: Math.round((Math.random() * 1000) * 100) / 100,
        latency: device.latency,
        packet_loss: device.packet_loss,
        incoming_traffic: Math.round((Math.random() * 10000) * 100) / 100,
        outgoing_traffic: Math.round((Math.random() * 8000) * 100) / 100,
        timestamp: new Date(),
      });

      const candidateAlerts = this.alertRulesEngine.evaluateDevice(device);
      for (const candidate of candidateAlerts) {
        const exists = await this.alertRepository.findOne({
          where: {
            device_id: candidate.device_id,
            type: candidate.type,
            status: 'open',
          },
        });
        if (!exists) {
          newAlerts.push(candidate);
        }
      }

      await this.metricRepository.save(metric);
      const prevStatus = device.status;
      await this.deviceRepository.save(device);

      if (newAlerts.length > 0) {
        const logEntry = this.logRepository.create({
          device_id: device.id,
          event_type: 'alert_triggered',
          message: `${newAlerts.length} alert(s) triggered for ${device.name}`,
        });
        await this.logRepository.save(logEntry);
      }

      const statusLog = this.logRepository.create({
        device_id: device.id,
        event_type: 'performance',
        message: `Device ${device.name} - CPU: ${device.cpu_usage}%, MEM: ${device.memory_usage}%, LAT: ${device.latency}ms, PL: ${device.packet_loss}%`,
      });
      await this.logRepository.save(statusLog);
    }

    for (const candidate of newAlerts) {
      const alert = this.alertRepository.create({
        device_id: candidate.device_id,
        type: candidate.type,
        severity: candidate.severity,
        message: candidate.message,
        status: 'open',
      });
      await this.alertRepository.save(alert);
    }
  }

  private randomFluctuation(max: number): number {
    return (Math.random() - 0.5) * 2 * max;
  }

  async getSimulatedDevices(): Promise<Device[]> {
    return this.deviceRepository.find({ order: { id: 'ASC' } });
  }

  async getDeviceIds(): Promise<number[]> {
    if (this.deviceIds.length === 0) {
      const devices = await this.deviceRepository.find({ select: ['id'] });
      this.deviceIds = devices.map(d => d.id);
    }
    return this.deviceIds;
  }
}
