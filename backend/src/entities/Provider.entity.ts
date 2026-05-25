import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User.entity';

export enum VerifyStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  RESUBMIT = 'resubmit',
}

export enum VehicleType {
  MOTORBIKE = 'motorbike',
  VAN_500KG = 'van_500kg',
  VAN_1000KG = 'van_1000kg',
  TRUCK_1500KG = 'truck_1500kg',
  TRUCK_2500KG = 'truck_2500kg',
}

@Entity('providers')
export class Provider {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'verify_status', type: 'enum', enum: VerifyStatus, default: VerifyStatus.PENDING })
  verifyStatus: VerifyStatus;

  @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
  verifiedAt: Date | null;

  @Column({ name: 'verified_by', type: 'uuid', nullable: true })
  verifiedBy: string | null;

  @Column({ name: 'reject_reason', type: 'text', nullable: true })
  rejectReason: string | null;

  @Column({ name: 'vehicle_type', type: 'enum', enum: VehicleType, nullable: true })
  vehicleType: VehicleType | null;

  @Column({ name: 'vehicle_plate', type: 'varchar', unique: true, nullable: true })
  vehiclePlate: string | null;

  @Column({ name: 'vehicle_brand', type: 'varchar', nullable: true })
  vehicleBrand: string | null;

  @Column({ name: 'vehicle_model', type: 'varchar', nullable: true })
  vehicleModel: string | null;

  @Column({ name: 'vehicle_year', type: 'integer', nullable: true })
  vehicleYear: number | null;

  @Column({ name: 'vehicle_capacity_kg', type: 'integer', nullable: true })
  vehicleCapacityKg: number | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ name: 'rating_avg', type: 'decimal', precision: 3, scale: 2, nullable: true })
  ratingAvg: number | null;

  @Column({ name: 'rating_count', type: 'integer', default: 0 })
  ratingCount: number;

  @Column({ name: 'total_orders', type: 'integer', default: 0 })
  totalOrders: number;

  @Column({ name: 'total_earnings', type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalEarnings: number;

  @Column({ name: 'is_online', type: 'boolean', default: false })
  isOnline: boolean;

  @Column({ name: 'current_lat', type: 'double precision', nullable: true })
  currentLat: number | null;

  @Column({ name: 'current_lng', type: 'double precision', nullable: true })
  currentLng: number | null;

  @Column({ name: 'last_active_at', type: 'timestamptz', nullable: true })
  lastActiveAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'verified_by' })
  verifier: User | null;
}
