import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  device_id: number;

  @Column({ type: 'text', default: 'info' })
  event_type: string;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn()
  timestamp: Date;
}
