import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('metrics')
export class Metric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  device_id: number;

  @Column({ type: 'real', default: 0 })
  cpu: number;

  @Column({ type: 'real', default: 0 })
  memory: number;

  @Column({ type: 'real', default: 0 })
  bandwidth: number;

  @Column({ type: 'real', default: 0 })
  latency: number;

  @Column({ type: 'real', default: 0 })
  packet_loss: number;

  @Column({ type: 'real', default: 0 })
  incoming_traffic: number;

  @Column({ type: 'real', default: 0 })
  outgoing_traffic: number;

  @CreateDateColumn()
  timestamp: Date;
}
