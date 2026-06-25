import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topology } from './entities/topology.entity';

@Injectable()
export class TopologyService {
  constructor(
    @InjectRepository(Topology)
    private readonly topologyRepository: Repository<Topology>,
  ) {}

  async findAll(): Promise<Topology[]> {
    return this.topologyRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Topology> {
    const edge = await this.topologyRepository.findOne({ where: { id } });
    if (!edge) {
      throw new NotFoundException(`Topology edge with ID ${id} not found`);
    }
    return edge;
  }

  async create(data: Partial<Topology>): Promise<Topology> {
    const edge = this.topologyRepository.create(data);
    return this.topologyRepository.save(edge);
  }

  async update(id: number, data: Partial<Topology>): Promise<Topology> {
    const edge = await this.findOne(id);
    Object.assign(edge, data);
    return this.topologyRepository.save(edge);
  }

  async remove(id: number): Promise<void> {
    const edge = await this.findOne(id);
    await this.topologyRepository.remove(edge);
  }

  async findConnections(deviceName: string): Promise<Topology[]> {
    return this.topologyRepository.find({
      where: [
        { source_device: deviceName },
        { target_device: deviceName },
      ],
    });
  }
}
