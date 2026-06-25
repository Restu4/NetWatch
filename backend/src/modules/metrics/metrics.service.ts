import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Metric } from './entities/metric.entity';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Metric)
    private readonly metricRepository: Repository<Metric>,
  ) {}

  async create(metricData: Partial<Metric>): Promise<Metric> {
    const metric = this.metricRepository.create(metricData);
    return this.metricRepository.save(metric);
  }

  async findByDevice(deviceId: number, limit: number = 60): Promise<Metric[]> {
    return this.metricRepository.find({
      where: { device_id: deviceId },
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  async getTrafficData(deviceId: number): Promise<{ incoming: number[]; outgoing: number[]; timestamps: string[] }> {
    const metrics = await this.metricRepository.find({
      where: { device_id: deviceId },
      order: { timestamp: 'DESC' },
      take: 30,
    });
    const incoming = metrics.map(m => Number(m.incoming_traffic)).reverse();
    const outgoing = metrics.map(m => Number(m.outgoing_traffic)).reverse();
    const timestamps = metrics.map(m => m.timestamp.toISOString()).reverse();
    return { incoming, outgoing, timestamps };
  }

  async getSummary(): Promise<{
    avgCpu: number;
    avgMemory: number;
    avgLatency: number;
    avgPacketLoss: number;
    totalBandwidth: number;
    totalIncoming: number;
    totalOutgoing: number;
  }> {
    const metrics = await this.metricRepository.find({
      order: { timestamp: 'DESC' },
      take: 100,
    });
    if (metrics.length === 0) {
      return {
        avgCpu: 0,
        avgMemory: 0,
        avgLatency: 0,
        avgPacketLoss: 0,
        totalBandwidth: 0,
        totalIncoming: 0,
        totalOutgoing: 0,
      };
    }
    const count = metrics.length;
    const avgCpu = metrics.reduce((s, m) => s + Number(m.cpu), 0) / count;
    const avgMemory = metrics.reduce((s, m) => s + Number(m.memory), 0) / count;
    const avgLatency = metrics.reduce((s, m) => s + Number(m.latency), 0) / count;
    const avgPacketLoss = metrics.reduce((s, m) => s + Number(m.packet_loss), 0) / count;
    const totalBandwidth = metrics.reduce((s, m) => s + Number(m.bandwidth), 0);
    const totalIncoming = metrics.reduce((s, m) => s + Number(m.incoming_traffic), 0);
    const totalOutgoing = metrics.reduce((s, m) => s + Number(m.outgoing_traffic), 0);
    return {
      avgCpu: Math.round(avgCpu * 100) / 100,
      avgMemory: Math.round(avgMemory * 100) / 100,
      avgLatency: Math.round(avgLatency * 100) / 100,
      avgPacketLoss: Math.round(avgPacketLoss * 100) / 100,
      totalBandwidth: Math.round(totalBandwidth * 100) / 100,
      totalIncoming: Math.round(totalIncoming * 100) / 100,
      totalOutgoing: Math.round(totalOutgoing * 100) / 100,
    };
  }
}
