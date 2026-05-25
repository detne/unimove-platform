import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Provider } from './Provider.entity';

export enum DocumentType {
  CCCD_FRONT = 'cccd_front',
  CCCD_BACK = 'cccd_back',
  DRIVER_LICENSE = 'driver_license',
  VEHICLE_REGISTRATION = 'vehicle_registration',
  VEHICLE_PHOTO = 'vehicle_photo',
}

@Entity('provider_documents')
export class ProviderDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'provider_id', type: 'uuid' })
  providerId: string;

  @Column({ name: 'doc_type', type: 'enum', enum: DocumentType })
  docType: DocumentType;

  @Column({ name: 'file_url', type: 'text' })
  fileUrl: string;

  @Column({ name: 'cloudinary_id', type: 'varchar', nullable: true })
  cloudinaryId: string | null;

  @Column({ name: 'uploaded_at', type: 'timestamptz', default: () => 'now()' })
  uploadedAt: Date;

  @ManyToOne(() => Provider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;
}
