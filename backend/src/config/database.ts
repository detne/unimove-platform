import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import dotenv from 'dotenv';

// Auth entities
import { User } from '../entities/User.entity';
import { RefreshToken } from '../entities/RefreshToken.entity';
import { Customer } from '../entities/Customer.entity';
import { DeviceToken } from '../entities/DeviceToken.entity';

// Provider entities
import { Provider } from '../entities/Provider.entity';
import { ProviderDocument } from '../entities/ProviderDocument.entity';
import { ServicePackage } from '../entities/ServicePackage.entity';
import { ServiceArea } from '../entities/ServiceArea.entity';

// Order entities
import { Order } from '../entities/Order.entity';
import { OrderItem } from '../entities/OrderItem.entity';
import { OrderStatusHistory } from '../entities/OrderStatusHistory.entity';

// Payment
import { Payment } from '../entities/Payment.entity';

// Realtime
import { LocationPing } from '../entities/LocationPing.entity';
import { Conversation } from '../entities/Conversation.entity';
import { Message } from '../entities/Message.entity';

// Admin / misc
import { Review } from '../entities/Review.entity';
import { Dispute } from '../entities/Dispute.entity';
import { Notification } from '../entities/Notification.entity';
import { Broadcast } from '../entities/Broadcast.entity';
import { Banner } from '../entities/Banner.entity';
import { AdminLog } from '../entities/AdminLog.entity';

dotenv.config();

const useSSL = process.env.DB_SSL === 'true';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'postgres',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [
    // Auth
    User,
    RefreshToken,
    Customer,
    DeviceToken,
    // Provider
    Provider,
    ProviderDocument,
    ServicePackage,
    ServiceArea,
    // Order
    Order,
    OrderItem,
    OrderStatusHistory,
    // Payment
    Payment,
    // Realtime
    LocationPing,
    Conversation,
    Message,
    // Admin / misc
    Review,
    Dispute,
    Notification,
    Broadcast,
    Banner,
    AdminLog,
  ],
  migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
  seeds: [__dirname + '/../database/seeds/MainSeeder.ts', __dirname + '/../database/seeds/MainSeeder.js'],
};

export const AppDataSource = new DataSource(options);
