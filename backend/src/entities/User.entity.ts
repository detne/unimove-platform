import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { RefreshToken } from './RefreshToken.entity';
import { Customer } from './Customer.entity';
import { DeviceToken } from './DeviceToken.entity';

export enum UserRole {
  CUSTOMER = 'customer',
  PROVIDER = 'provider',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
  PENDING = 'pending',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  phone: string | null;

  @Column({ name: 'password_hash', type: 'varchar' })
  passwordHash: string;

  @Column({ name: 'full_name', type: 'varchar' })
  fullName: string;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl: string | null;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Column({ name: 'google_id', type: 'varchar', unique: true, nullable: true })
  googleId: string | null;

  @Column({ name: 'email_verified', type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date | null;

  // --- password reset (không có trong DBML gốc, thêm để xử lý forgot password) ---
  @Column({ name: 'reset_password_token', type: 'varchar', nullable: true, select: false })
  resetPasswordToken: string | null;

  @Column({ name: 'reset_password_expires_at', type: 'timestamptz', nullable: true, select: false })
  resetPasswordExpiresAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => RefreshToken, (rt) => rt.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => DeviceToken, (dt) => dt.user)
  deviceTokens: DeviceToken[];

  @OneToOne(() => Customer, (c) => c.user)
  customer: Customer;
}
