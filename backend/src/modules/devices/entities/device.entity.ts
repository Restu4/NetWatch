import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ip_address: string;

  @Column({ type: 'text', default: 'router' })
  type: string;

  @Column({ type: 'text', default: 'online' })
  status: string;

  @Column({ type: 'real', default: 0 })
  cpu_usage: number;

  @Column({ type: 'real', default: 0 })
  memory_usage: number;

  @Column({ type: 'real', default: 0 })
  uptime: number;

  @Column({ type: 'real', default: 0 })
  latency: number;

  @Column({ type: 'real', default: 0 })
  packet_loss: number;

  @Column({ type: 'text', default: 'N/A' })
  location: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'datetime', nullable: true })
  last_seen: Date;
}
