import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { Metric } from './entities/metric.entity';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post()
  async create(@Body() metricData: Partial<Metric>): Promise<Metric> {
    return this.metricsService.create(metricData);
  }

  @Get('device/:deviceId')
  async findByDevice(
    @Param('deviceId', ParseIntPipe) deviceId: number,
  ): Promise<Metric[]> {
    return this.metricsService.findByDevice(deviceId);
  }

  @Get('device/:deviceId/traffic')
  async getTrafficData(@Param('deviceId', ParseIntPipe) deviceId: number) {
    return this.metricsService.getTrafficData(deviceId);
  }

  @Get('summary')
  async getSummary() {
    return this.metricsService.getSummary();
  }
}
