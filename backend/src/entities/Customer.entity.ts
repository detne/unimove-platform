import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity('customers')
export class Customer {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'default_address', type: 'text', nullable: true })
  defaultAddress: string | null;

  @Column({ name: 'default_lat', type: 'double precision', nullable: true })
  defaultLat: number | null;

  @Column({ name: 'default_lng', type: 'double precision', nullable: true })
  defaultLng: number | null;

  @Column({ name: 'total_orders', type: 'integer', default: 0 })
  totalOrders: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToOne(() => User, (user) => user.customer)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
