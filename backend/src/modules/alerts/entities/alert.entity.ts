import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  device_id: number;

  @Column({ type: 'text', default: 'network' })
  type: string;

  @Column({ type: 'text', default: 'warning' })
  severity: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text', default: 'open' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
