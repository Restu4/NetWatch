import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { DevicesModule } from './modules/devices/devices.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { TopologyModule } from './modules/topology/topology.module';
import { LogsModule } from './modules/logs/logs.module';
import { MonitoringGateway } from './gateway/monitoring.gateway';
import { MonitoringService } from './engine/monitoring.service';
import { AlertRulesEngine } from './engine/alert.rules';
import { Device } from './modules/devices/entities/device.entity';
import { Alert } from './modules/alerts/entities/alert.entity';
import { Metric } from './modules/metrics/entities/metric.entity';
import { Log } from './modules/logs/entities/log.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig,
    }),
    TypeOrmModule.forFeature([Device, Alert, Metric, Log]),
    DevicesModule,
    AlertsModule,
    MetricsModule,
    TopologyModule,
    LogsModule,
  ],
  providers: [
    MonitoringGateway,
    MonitoringService,
    AlertRulesEngine,
  ],
})
export class AppModule {}
