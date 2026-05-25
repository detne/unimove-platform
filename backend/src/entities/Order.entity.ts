import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './Customer.entity';
import { Provider } from './Provider.entity';
import { ServicePackage } from './ServicePackage.entity';
import { User } from './User.entity';

export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  PROVIDER_ARRIVING = 'provider_arriving',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_code', type: 'varchar', unique: true })
  orderCode: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @Column({ name: 'provider_id', type: 'uuid', nullable: true })
  providerId: string | null;

  @Column({ name: 'service_package_id', type: 'uuid', nullable: true })
  servicePackageId: string | null;

  @Column({ name: 'pickup_address', type: 'text' })
  pickupAddress: string;

  @Column({ name: 'pickup_lat', type: 'double precision' })
  pickupLat: number;

  @Column({ name: 'pickup_lng', type: 'double precision' })
  pickupLng: number;

  @Column({ name: 'dropoff_address', type: 'text' })
  dropoffAddress: string;

  @Column({ name: 'dropoff_lat', type: 'double precision' })
  dropoffLat: number;

  @Column({ name: 'dropoff_lng', type: 'double precision' })
  dropoffLng: number;

  @Column({ name: 'distance_km', type: 'decimal', precision: 8, scale: 2, nullable: true })
  distanceKm: number | null;

  @Column({ name: 'scheduled_at', type: 'timestamptz', nullable: true })
  scheduledAt: Date | null;

  @Column({ name: 'accepted_at', type: 'timestamptz', nullable: true })
  acceptedAt: Date | null;

  @Column({ name: 'started_at', type: 'timestamptz', nullable: true })
  startedAt: Date | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt: Date | null;

  @Column({ name: 'cancel_reason', type: 'text', nullable: true })
  cancelReason: string | null;

  @Column({ name: 'cancelled_by', type: 'uuid', nullable: true })
  cancelledBy: string | null;

  @Column({ name: 'base_amount', type: 'decimal', precision: 12, scale: 2, nullable: true })
  baseAmount: number | null;

  @Column({ name: 'extra_fee', type: 'decimal', precision: 12, scale: 2, default: 0 })
  extraFee: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2, nullable: true })
  totalAmount: number | null;

  @Column({ name: 'deposit_amount', type: 'decimal', precision: 12, scale: 2, nullable: true })
  depositAmount: number | null;

  @Column({ name: 'platform_fee', type: 'decimal', precision: 12, scale: 2, nullable: true })
  platformFee: number | null;

  @Column({ name: 'provider_earnings', type: 'decimal', precision: 12, scale: 2, nullable: true })
  providerEarnings: number | null;

  @Column({ name: 'customer_note', type: 'text', nullable: true })
  customerNote: string | null;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Customer, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'userId' })
  customer: Customer;

  @ManyToOne(() => Provider, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'provider_id', referencedColumnName: 'userId' })
  provider: Provider | null;

  @ManyToOne(() => ServicePackage, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'service_package_id' })
  servicePackage: ServicePackage | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'cancelled_by' })
  cancelledByUser: User | null;
}
