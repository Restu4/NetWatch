import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopologyController } from './topology.controller';
import { TopologyService } from './topology.service';
import { Topology } from './entities/topology.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Topology])],
  controllers: [TopologyController],
  providers: [TopologyService],
  exports: [TopologyService],
})
export class TopologyModule {}
