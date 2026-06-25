import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { TopologyService } from './topology.service';
import { Topology } from './entities/topology.entity';

@Controller('topology')
export class TopologyController {
  constructor(private readonly topologyService: TopologyService) {}

  @Get()
  async findAll(): Promise<Topology[]> {
    return this.topologyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Topology> {
    return this.topologyService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<Topology>): Promise<Topology> {
    return this.topologyService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Topology>,
  ): Promise<Topology> {
    return this.topologyService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.topologyService.remove(id);
  }
}
