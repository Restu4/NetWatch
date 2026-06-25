import { Controller, Get, Param, Put, Body, ParseIntPipe } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { Device } from './entities/device.entity';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  async findAll(): Promise<Device[]> {
    return this.devicesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Device> {
    return this.devicesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Device>,
  ): Promise<Device> {
    return this.devicesService.update(id, updateData);
  }

  @Get(':id/metrics')
  async getMetrics(@Param('id', ParseIntPipe) id: number) {
    return this.devicesService.getHealthScore(id);
  }
}
