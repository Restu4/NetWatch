import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  async findAll(): Promise<Device[]> {
    return this.deviceRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Device> {
    const device = await this.deviceRepository.findOne({ where: { id } });
    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }
    return device;
  }

  async update(id: number, updateData: Partial<Device>): Promise<Device> {
    const device = await this.findOne(id);
    Object.assign(device, updateData);
    return this.deviceRepository.save(device);
  }

  async updateStatus(id: number, status: string): Promise<Device> {
    const device = await this.findOne(id);
    device.status = status;
    if (status === 'online') {
      device.last_seen = new Date();
    }
    return this.deviceRepository.save(device);
  }

  async getHealthScore(id: number): Promise<{ score: number; details: Record<string, number> }> {
    const device = await this.findOne(id);
    const cpuScore = Math.max(0, 100 - (Number(device.cpu_usage) * 1.0));
    const memoryScore = Math.max(0, 100 - (Number(device.memory_usage) * 1.0));
    const latencyScore = Math.max(0, 100 - (Number(device.latency) * 0.5));
    const packetLossScore = Math.max(0, 100 - (Number(device.packet_loss) * 5));
    const uptimeScore = Math.min(100, Number(device.uptime) * 0.5);
    const statusScore = device.status === 'online' ? 100 : device.status === 'warning' ? 50 : 0;

    const score = Math.round(
      (cpuScore * 0.25 + memoryScore * 0.2 + latencyScore * 0.2 + packetLossScore * 0.15 + uptimeScore * 0.1 + statusScore * 0.1),
    );

    return {
      score,
      details: {
        cpu_score: Math.round(cpuScore),
        memory_score: Math.round(memoryScore),
        latency_score: Math.round(latencyScore),
        packet_loss_score: Math.round(packetLossScore),
        uptime_score: Math.round(uptimeScore),
        status_score: statusScore,
      },
    };
  }

  async getUptimePercentage(id: number): Promise<number> {
    const device = await this.findOne(id);
    const totalHours = Date.now() / 3600000;
    const deviceHours = Number(device.uptime);
    if (deviceHours <= 0) return 0;
    const percentage = Math.min(100, Math.round((deviceHours / totalHours) * 10000) / 100);
    return percentage;
  }

  async upsert(deviceData: Partial<Device>): Promise<Device> {
    const existing = await this.deviceRepository.findOne({
      where: { name: deviceData.name },
    });
    if (existing) {
      Object.assign(existing, deviceData);
      return this.deviceRepository.save(existing);
    }
    const device = this.deviceRepository.create(deviceData);
    return this.deviceRepository.save(device);
  }

  async bulkUpdate(devices: Partial<Device>[]): Promise<Device[]> {
    const results: Device[] = [];
    for (const d of devices) {
      const saved = await this.upsert(d);
      results.push(saved);
    }
    return results;
  }
}
