import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Alert } from './entities/alert.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
  ) {}

  async findAll(status?: string): Promise<Alert[]> {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    return this.alertRepository.find({ where, order: { created_at: 'DESC' } });
  }

  async findOne(id: number): Promise<Alert> {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }
    return alert;
  }

  async create(alertData: Partial<Alert>): Promise<Alert> {
    const alert = this.alertRepository.create(alertData);
    return this.alertRepository.save(alert);
  }

  async update(id: number, updateData: Partial<Alert>): Promise<Alert> {
    const alert = await this.findOne(id);
    Object.assign(alert, updateData);
    return this.alertRepository.save(alert);
  }

  async findByDevice(deviceId: number): Promise<Alert[]> {
    return this.alertRepository.find({
      where: { device_id: deviceId },
      order: { created_at: 'DESC' },
    });
  }

  async getOpenAlertsCount(): Promise<number> {
    return this.alertRepository.count({ where: { status: 'open' } });
  }

  async getRecentAlerts(minutes: number): Promise<Alert[]> {
    const since = new Date(Date.now() - minutes * 60000);
    return this.alertRepository.find({
      where: { created_at: MoreThanOrEqual(since) },
      order: { created_at: 'DESC' },
    });
  }
}
