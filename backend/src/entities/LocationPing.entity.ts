import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './Order.entity';
import { Provider } from './Provider.entity';

@Entity('location_pings')
export class LocationPing {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({ name: 'provider_id', type: 'uuid' })
  providerId: string;

  @Column({ type: 'double precision' })
  lat: number;

  @Column({ type: 'double precision' })
  lng: number;

  @Column({ name: 'speed_kmh', type: 'real', nullable: true })
  speedKmh: number | null;

  @Column({ type: 'real', nullable: true })
  heading: number | null;

  @Column({ name: 'recorded_at', type: 'timestamptz', default: () => 'now()' })
  recordedAt: Date;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Provider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_id', referencedColumnName: 'userId' })
  provider: Provider;
}
