import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { AppDataSource } from './database';
import { User, UserRole, UserStatus } from '../entities/User.entity';
import { Customer } from '../entities/Customer.entity';

export function initPassport(): void {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const userRepo = AppDataSource.getRepository(User);
          const customerRepo = AppDataSource.getRepository(Customer);

          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('Google account không có email'), undefined);
          }

          // Tìm user theo google_id trước, sau đó theo email
          let user = await userRepo.findOne({
            where: [{ googleId: profile.id }, { email }],
          });

          if (!user) {
            // Tạo user mới
            user = userRepo.create({
              email,
              fullName: profile.displayName,
              avatarUrl: profile.photos?.[0]?.value ?? null,
              googleId: profile.id,
              passwordHash: '', // Google user không có password
              role: UserRole.CUSTOMER,
              status: UserStatus.ACTIVE,
              emailVerified: true,
            });
            user = await userRepo.save(user);

            // Tạo customer profile
            const customer = customerRepo.create({ userId: user.id });
            await customerRepo.save(customer);
          } else {
            // Cập nhật google_id nếu login qua email lần đầu
            if (!user.googleId) {
              user.googleId = profile.id;
              await userRepo.save(user);
            }
          }

          return done(null, user);
        } catch (err) {
          return done(err as Error, undefined);
        }
      },
    ),
  );
}
