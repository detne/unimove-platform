import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { runSeeders } from 'typeorm-extension';
import UsersSeed from './seeds/001_users_seed';
import ProvidersSeed from './seeds/002_providers_seed';

AppDataSource.initialize()
  .then(async (ds) => {
    console.log('Database connected, running seeders...');
    await runSeeders(ds, {
      seeds: [UsersSeed, ProvidersSeed],
      factories: [],
    });
    console.log('All seeders complete!');
    await ds.destroy();
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
