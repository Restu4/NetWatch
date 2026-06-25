import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  async create(logData: Partial<Log>): Promise<Log> {
    const log = this.logRepository.create(logData);
    return this.logRepository.save(log);
  }

  async findAll(page: number = 1, limit: number = 50): Promise<{ data: Log[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.logRepository.findAndCount({
      order: { timestamp: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findByDevice(deviceId: number, page: number = 1, limit: number = 50): Promise<{ data: Log[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.logRepository.findAndCount({
      where: { device_id: deviceId },
      order: { timestamp: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Log | null> {
    return this.logRepository.findOne({ where: { id } }) ?? null;
  }
}
