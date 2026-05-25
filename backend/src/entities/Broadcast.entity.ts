import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User.entity';
import { UserRole } from './User.entity';

@Entity('broadcasts')
export class Broadcast {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ name: 'target_role', type: 'enum', enum: UserRole, nullable: true })
  targetRole: UserRole | null;

  @Column({ name: 'sent_by', type: 'uuid', nullable: true })
  sentBy: string | null;

  @Column({ name: 'sent_at', type: 'timestamptz', nullable: true })
  sentAt: Date | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sent_by' })
  sentByUser: User | null;
}
