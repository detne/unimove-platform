import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity('admin_logs')
export class AdminLog {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'admin_id', type: 'uuid' })
  adminId: string;

  @Column({ type: 'varchar' })
  action: string;

  @Column({ name: 'target_table', type: 'varchar' })
  targetTable: string;

  @Column({ name: 'target_id', type: 'uuid', nullable: true })
  targetId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  payload: Record<string, unknown> | null;

  @Column({ name: 'ip_address', type: 'varchar', nullable: true })
  ipAddress: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'admin_id' })
  admin: User;
}
