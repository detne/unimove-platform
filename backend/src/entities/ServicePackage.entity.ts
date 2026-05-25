import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Provider } from './Provider.entity';

@Entity('service_packages')
export class ServicePackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'provider_id', type: 'uuid' })
  providerId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'base_price', type: 'decimal', precision: 12, scale: 2 })
  basePrice: number;

  @Column({ name: 'price_per_km', type: 'decimal', precision: 12, scale: 2 })
  pricePerKm: number;

  @Column({ name: 'min_distance_km', type: 'decimal', precision: 8, scale: 2, nullable: true })
  minDistanceKm: number | null;

  @Column({ name: 'max_distance_km', type: 'decimal', precision: 8, scale: 2, nullable: true })
  maxDistanceKm: number | null;

  @Column({ name: 'helper_included', type: 'boolean', default: false })
  helperIncluded: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Provider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;
}
