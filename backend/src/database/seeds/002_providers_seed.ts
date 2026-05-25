import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../../entities/User.entity';
import { Provider, VerifyStatus, VehicleType } from '../../entities/Provider.entity';
import { ServicePackage } from '../../entities/ServicePackage.entity';
import { ServiceArea } from '../../entities/ServiceArea.entity';

export default class ProvidersSeed implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepo = dataSource.getRepository(User);
    const providerRepo = dataSource.getRepository(Provider);
    const servicePackageRepo = dataSource.getRepository(ServicePackage);
    const serviceAreaRepo = dataSource.getRepository(ServiceArea);

    // Tìm provider user đã tạo ở seed 001
    const providerUser = await userRepo.findOne({ where: { email: 'provider@unimove.vn' } });
    if (!providerUser) {
      console.log('  [seed] Provider user not found, skipping provider profile seed.');
      return;
    }

    // --- Provider profile ---
    const existingProvider = await providerRepo.findOne({ where: { userId: providerUser.id } });
    if (!existingProvider) {
      const provider = providerRepo.create({
        userId: providerUser.id,
        verifyStatus: VerifyStatus.APPROVED,
        verifiedAt: new Date(),
        vehicleType: VehicleType.VAN_500KG,
        vehiclePlate: '51F-99999',
        vehicleBrand: 'Hyundai',
        vehicleModel: 'Porter H100',
        vehicleYear: 2021,
        vehicleCapacityKg: 500,
        bio: 'Tài xế chuyên nghiệp, kinh nghiệm 5 năm vận chuyển tại TP.HCM.',
        ratingAvg: 4.8,
        ratingCount: 0,
        totalOrders: 0,
        totalEarnings: 0,
        isOnline: false,
        currentLat: 10.7769,
        currentLng: 106.7009,
      });
      await providerRepo.save(provider);
      console.log('  [seed] Created provider profile for provider@unimove.vn');

      // --- Service package ---
      const existingPackage = await servicePackageRepo.findOne({
        where: { providerId: providerUser.id, name: 'Chuyển nhà cơ bản' },
      });
      if (!existingPackage) {
        const pkg = servicePackageRepo.create({
          providerId: providerUser.id,
          name: 'Chuyển nhà cơ bản',
          description: 'Dịch vụ chuyển đồ với xe tải 500kg, phù hợp hộ gia đình nhỏ.',
          basePrice: 200000,
          pricePerKm: 15000,
          minDistanceKm: 1,
          maxDistanceKm: 50,
          helperIncluded: false,
          isActive: true,
        });
        await servicePackageRepo.save(pkg);
        console.log('  [seed] Created service package: Chuyen nha co ban');
      }

      // --- Service area ---
      const existingArea = await serviceAreaRepo.findOne({
        where: { providerId: providerUser.id, city: 'Ho Chi Minh City' },
      });
      if (!existingArea) {
        const area = serviceAreaRepo.create({
          providerId: providerUser.id,
          city: 'Ho Chi Minh City',
          district: null,
        });
        await serviceAreaRepo.save(area);
        console.log('  [seed] Created service area: Ho Chi Minh City');
      }
    } else {
      console.log('  [seed] Provider profile already exists, skipping.');
    }
  }
}
