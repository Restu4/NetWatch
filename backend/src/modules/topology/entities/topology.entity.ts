import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('topology')
export class Topology {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  source_device: string;

  @Column({ type: 'text' })
  target_device: string;

  @Column({ type: 'text', default: 'active' })
  status: string;

  @Column({ type: 'real', default: 0 })
  latency: number;
}
