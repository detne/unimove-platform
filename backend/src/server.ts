import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { AppDataSource } from './config/database';

const PORT = parseInt(process.env.PORT || '3000');

async function bootstrap(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
