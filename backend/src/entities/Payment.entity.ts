import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './Order.entity';
import { User } from './User.entity';

export enum PaymentType {
  DEPOSIT = 'deposit',
  FINAL = 'final',
  REFUND = 'refund',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  PAYOS = 'payos',
  QR = 'qr',
  CASH = 'cash',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({ name: 'payment_type', type: 'enum', enum: PaymentType })
  paymentType: PaymentType;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ name: 'payos_order_code', type: 'bigint', unique: true, nullable: true })
  payosOrderCode: string | null;

  @Column({ name: 'payos_payment_id', type: 'varchar', nullable: true })
  payosPaymentId: string | null;

  @Column({ name: 'payos_checkout_url', type: 'text', nullable: true })
  payosCheckoutUrl: string | null;

  @Column({ name: 'payos_qr_code', type: 'text', nullable: true })
  payosQrCode: string | null;

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt: Date | null;

  @Column({ name: 'failure_reason', type: 'text', nullable: true })
  failureReason: string | null;

  @Column({ name: 'refunded_amount', type: 'decimal', precision: 12, scale: 2, nullable: true })
  refundedAmount: number | null;

  @Column({ name: 'refund_reason', type: 'text', nullable: true })
  refundReason: string | null;

  @Column({ name: 'refunded_by', type: 'uuid', nullable: true })
  refundedBy: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Order, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'refunded_by' })
  refundedByUser: User | null;
}
