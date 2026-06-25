import { Controller, Get, Post, Put, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { Alert } from './entities/alert.entity';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async findAll(@Query('status') status?: string): Promise<Alert[]> {
    return this.alertsService.findAll(status);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Alert> {
    return this.alertsService.findOne(id);
  }

  @Post()
  async create(@Body() alertData: Partial<Alert>): Promise<Alert> {
    return this.alertsService.create(alertData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Alert>,
  ): Promise<Alert> {
    return this.alertsService.update(id, updateData);
  }
}
