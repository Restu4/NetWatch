import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../modules/devices/entities/device.entity';
import { Alert } from '../modules/alerts/entities/alert.entity';
import { Metric } from '../modules/metrics/entities/metric.entity';
import { AlertRulesEngine } from '../engine/alert.rules';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/monitoring',
})
export class MonitoringGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private broadcastInterval: ReturnType<typeof setInterval> | null = null;
  private connectedClients: Set<string> = new Set();

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    @InjectRepository(Metric)
    private readonly metricRepository: Repository<Metric>,
    private readonly alertRulesEngine: AlertRulesEngine,
  ) {}

  async handleConnection(client: Socket) {
    this.connectedClients.add(client.id);
    console.log(`Client connected: ${client.id}`);

    client.emit('connected', { message: 'Connected to NetWatch monitoring' });
    await this.sendInitialData(client);

    if (!this.broadcastInterval) {
      this.startBroadcast();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);

    if (this.connectedClients.size === 0 && this.broadcastInterval) {
      clearInterval(this.broadcastInterval);
      this.broadcastInterval = null;
    }
  }

  private async sendInitialData(client: Socket) {
    const devices = await this.deviceRepository.find({ order: { id: 'ASC' } });
    const alerts = await this.alertRepository.find({
      where: { status: 'open' },
      order: { created_at: 'DESC' },
      take: 50,
    });
    const totalDevices = devices.length;
    const onlineDevices = devices.filter(d => d.status === 'online').length;
    const offlineDevices = devices.filter(d => d.status === 'offline').length;
    const warningDevices = devices.filter(d => d.status === 'warning').length;
    const openAlerts = alerts.length;

    client.emit('initialData', {
      devices,
      alerts,
      dashboard: {
        totalDevices,
        onlineDevices,
        offlineDevices,
        warningDevices,
        openAlerts,
      },
    });
  }

  private startBroadcast() {
    this.broadcastInterval = setInterval(async () => {
      try {
        const devices = await this.deviceRepository.find({ order: { id: 'ASC' } });
        this.server.emit('deviceUpdate', devices);

        const recentAlerts = await this.alertRepository.find({
          order: { created_at: 'DESC' },
          take: 10,
        });
        this.server.emit('alertUpdate', recentAlerts);

        const totalDevices = devices.length;
        const onlineDevices = devices.filter(d => d.status === 'online').length;
        const offlineDevices = devices.filter(d => d.status === 'offline').length;
        const warningDevices = devices.filter(d => d.status === 'warning').length;
        const openAlerts = await this.alertRepository.count({ where: { status: 'open' } });

        const latestMetrics = await this.metricRepository
          .createQueryBuilder('metric')
          .select('AVG(metric.cpu)', 'avgCpu')
          .addSelect('AVG(metric.memory)', 'avgMemory')
          .addSelect('AVG(metric.latency)', 'avgLatency')
          .addSelect('AVG(metric.packet_loss)', 'avgPacketLoss')
          .addSelect('SUM(metric.incoming_traffic)', 'totalIncoming')
          .addSelect('SUM(metric.outgoing_traffic)', 'totalOutgoing')
          .where("metric.timestamp > :since", { since: new Date(Date.now() - 5 * 60 * 1000) })
          .getRawOne();

        this.server.emit('dashboardUpdate', {
          totalDevices,
          onlineDevices,
          offlineDevices,
          warningDevices,
          openAlerts,
          avgCpu: latestMetrics ? Math.round(Number(latestMetrics.avgCpu) * 100) / 100 : 0,
          avgMemory: latestMetrics ? Math.round(Number(latestMetrics.avgMemory) * 100) / 100 : 0,
          avgLatency: latestMetrics ? Math.round(Number(latestMetrics.avgLatency) * 100) / 100 : 0,
          avgPacketLoss: latestMetrics ? Math.round(Number(latestMetrics.avgPacketLoss) * 100) / 100 : 0,
          totalIncoming: latestMetrics ? Math.round(Number(latestMetrics.totalIncoming) * 100) / 100 : 0,
          totalOutgoing: latestMetrics ? Math.round(Number(latestMetrics.totalOutgoing) * 100) / 100 : 0,
        });
      } catch (err) {
        console.error('Broadcast error:', err);
      }
    }, 5000);
  }

  @SubscribeMessage('simulateCpuSpike')
  async handleCpuSpike(client: Socket, payload: { deviceId: number }) {
    const device = await this.deviceRepository.findOne({ where: { id: payload.deviceId } });
    if (device) {
      device.cpu_usage = Math.min(100, Number(device.cpu_usage) + 50);
      await this.deviceRepository.save(device);

      const alerts = this.alertRulesEngine.evaluateDevice(device);
      for (const alertCandidate of alerts) {
        const existing = await this.alertRepository.findOne({
          where: { device_id: alertCandidate.device_id, type: alertCandidate.type, status: 'open' },
        });
        if (!existing) {
          const alert = this.alertRepository.create({
            device_id: alertCandidate.device_id,
            type: alertCandidate.type,
            severity: alertCandidate.severity,
            message: alertCandidate.message,
            status: 'open',
          });
          await this.alertRepository.save(alert);
          this.server.emit('newAlert', alert);
        }
      }
      this.server.emit('deviceUpdate', [device]);
      client.emit('actionResult', { success: true, message: `CPU spike simulated on ${device.name}` });
    }
  }

  @SubscribeMessage('simulateOffline')
  async handleSimulateOffline(client: Socket, payload: { deviceId: number }) {
    const device = await this.deviceRepository.findOne({ where: { id: payload.deviceId } });
    if (device) {
      device.status = 'offline';
      device.packet_loss = 100;
      device.latency = 0;
      await this.deviceRepository.save(device);

      const alerts = this.alertRulesEngine.evaluateDevice(device);
      for (const alertCandidate of alerts) {
        const existing = await this.alertRepository.findOne({
          where: { device_id: alertCandidate.device_id, type: alertCandidate.type, status: 'open' },
        });
        if (!existing) {
          const alert = this.alertRepository.create({
            device_id: alertCandidate.device_id,
            type: alertCandidate.type,
            severity: alertCandidate.severity,
            message: alertCandidate.message,
            status: 'open',
          });
          await this.alertRepository.save(alert);
          this.server.emit('newAlert', alert);
        }
      }
      this.server.emit('deviceUpdate', [device]);
      client.emit('actionResult', { success: true, message: `${device.name} set to offline` });
    }
  }

  @SubscribeMessage('simulateLatencySpike')
  async handleLatencySpike(client: Socket, payload: { deviceId: number }) {
    const device = await this.deviceRepository.findOne({ where: { id: payload.deviceId } });
    if (device) {
      device.latency = 300 + Math.random() * 200;
      await this.deviceRepository.save(device);

      const alerts = this.alertRulesEngine.evaluateDevice(device);
      for (const alertCandidate of alerts) {
        const existing = await this.alertRepository.findOne({
          where: { device_id: alertCandidate.device_id, type: alertCandidate.type, status: 'open' },
        });
        if (!existing) {
          const alert = this.alertRepository.create({
            device_id: alertCandidate.device_id,
            type: alertCandidate.type,
            severity: alertCandidate.severity,
            message: alertCandidate.message,
            status: 'open',
          });
          await this.alertRepository.save(alert);
          this.server.emit('newAlert', alert);
        }
      }
      this.server.emit('deviceUpdate', [device]);
      client.emit('actionResult', { success: true, message: `Latency spike simulated on ${device.name}` });
    }
  }

  @SubscribeMessage('getDeviceDetail')
  async handleDeviceDetail(client: Socket, payload: { deviceId: number }) {
    const device = await this.deviceRepository.findOne({ where: { id: payload.deviceId } });
    const metrics = await this.metricRepository.find({
      where: { device_id: payload.deviceId },
      order: { timestamp: 'DESC' },
      take: 60,
    });
    const alerts = await this.alertRepository.find({
      where: { device_id: payload.deviceId },
      order: { created_at: 'DESC' },
      take: 20,
    });
    client.emit('deviceDetail', { device, metrics, alerts });
  }
}
