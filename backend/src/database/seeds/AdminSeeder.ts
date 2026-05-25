import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User, UserRole, UserStatus } from '../../entities/User.entity';
import { hashPassword } from '../../utils/password.util';

export default class AdminSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepo = dataSource.getRepository(User);

    const existing = await userRepo.findOne({ where: { email: 'admin@unimove.vn' } });
    if (existing) {
      console.log('  ⏭  Admin đã tồn tại, bỏ qua.');
      return;
    }

    const admin = userRepo.create({
      email: 'admin@unimove.vn',
      passwordHash: await hashPassword('Admin@123456'),
      fullName: 'UniMove Admin',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    });

    await userRepo.save(admin);
    console.log('  ✅ Đã tạo tài khoản admin: admin@unimove.vn / Admin@123456');
  }
}
