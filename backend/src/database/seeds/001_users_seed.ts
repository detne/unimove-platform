import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User, UserRole, UserStatus } from '../../entities/User.entity';
import { Customer } from '../../entities/Customer.entity';
import { hashPassword } from '../../utils/password.util';

export default class UsersSeed implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepo = dataSource.getRepository(User);
    const customerRepo = dataSource.getRepository(Customer);

    // --- Admin ---
    const adminEmail = 'admin@unimove.vn';
    const existingAdmin = await userRepo.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const admin = userRepo.create({
        email: adminEmail,
        passwordHash: await hashPassword('Admin@123456'),
        fullName: 'UniMove Admin',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      });
      await userRepo.save(admin);
      console.log('  [seed] Created admin: admin@unimove.vn / Admin@123456');
    } else {
      console.log('  [seed] Admin already exists, skipping.');
    }

    // --- Customer mẫu ---
    const customerEmail = 'customer@unimove.vn';
    const existingCustomer = await userRepo.findOne({ where: { email: customerEmail } });
    if (!existingCustomer) {
      const customerUser = userRepo.create({
        email: customerEmail,
        phone: '0901000001',
        passwordHash: await hashPassword('Customer@123456'),
        fullName: 'Nguyen Van A',
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      });
      const savedCustomerUser = await userRepo.save(customerUser);

      const customerProfile = customerRepo.create({
        userId: savedCustomerUser.id,
        defaultAddress: '123 Nguyen Hue, Quan 1, Ho Chi Minh City',
        defaultLat: 10.7769,
        defaultLng: 106.7009,
        totalOrders: 0,
      });
      await customerRepo.save(customerProfile);
      console.log('  [seed] Created customer: customer@unimove.vn / Customer@123456');
    } else {
      console.log('  [seed] Customer sample already exists, skipping.');
    }

    // --- Provider mẫu (chỉ user, profile tạo ở seed 002) ---
    const providerEmail = 'provider@unimove.vn';
    const existingProvider = await userRepo.findOne({ where: { email: providerEmail } });
    if (!existingProvider) {
      const providerUser = userRepo.create({
        email: providerEmail,
        phone: '0901000002',
        passwordHash: await hashPassword('Provider@123456'),
        fullName: 'Tran Van B',
        role: UserRole.PROVIDER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      });
      await userRepo.save(providerUser);
      console.log('  [seed] Created provider user: provider@unimove.vn / Provider@123456');
    } else {
      console.log('  [seed] Provider user already exists, skipping.');
    }
  }
}
