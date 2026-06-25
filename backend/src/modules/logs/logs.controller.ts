import { Controller, Get, Post, Param, Query, Body, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { LogsService } from './logs.service';
import { Log } from './entities/log.entity';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.logsService.findAll(page, limit);
  }

  @Get('device/:deviceId')
  async findByDevice(
    @Param('deviceId', ParseIntPipe) deviceId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.logsService.findByDevice(deviceId, page, limit);
  }

  @Post()
  async create(@Body() logData: Partial<Log>): Promise<Log> {
    return this.logsService.create(logData);
  }
}
