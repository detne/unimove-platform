import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager, runSeeders } from 'typeorm-extension';
import UsersSeed from './001_users_seed';
import ProvidersSeed from './002_providers_seed';

export default class MainSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    await runSeeders(dataSource, {
      seeds: [UsersSeed, ProvidersSeed],
      factories: [],
    });
  }
}
