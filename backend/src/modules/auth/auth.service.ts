import crypto from 'crypto';
import { AppDataSource } from '../../config/database';
import { User, UserRole, UserStatus } from '../../entities/User.entity';
import { RefreshToken } from '../../entities/RefreshToken.entity';
import { Customer } from '../../entities/Customer.entity';
import { hashPassword, comparePassword } from '../../utils/password.util';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  getRefreshTokenExpiry,
} from '../../utils/jwt.util';
import { sendPasswordResetEmail } from '../../utils/email.util';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from './dto/auth.dto';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserPublic {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  avatarUrl: string | null;
  emailVerified: boolean;
}

class AuthService {
  private get userRepo() {
    return AppDataSource.getRepository(User);
  }
  private get refreshTokenRepo() {
    return AppDataSource.getRepository(RefreshToken);
  }
  private get customerRepo() {
    return AppDataSource.getRepository(Customer);
  }

  // ─────────────────────────────────────────────
  // REGISTER
  // ─────────────────────────────────────────────
  async register(input: RegisterInput): Promise<{ user: UserPublic; tokens: AuthTokens }> {
    const existing = await this.userRepo.findOne({ where: { email: input.email } });
    if (existing) {
      throw Object.assign(new Error('Email đã được sử dụng'), { statusCode: 409 });
    }

    if (input.phone) {
      const phoneExists = await this.userRepo.findOne({ where: { phone: input.phone } });
      if (phoneExists) {
        throw Object.assign(new Error('Số điện thoại đã được sử dụng'), { statusCode: 409 });
      }
    }

    const passwordHash = await hashPassword(input.password);

    const user = this.userRepo.create({
      email: input.email,
      passwordHash,
      fullName: input.fullName,
      phone: input.phone ?? null,
      role: input.role as UserRole,
      status: UserStatus.ACTIVE,
      emailVerified: false,
    });
    await this.userRepo.save(user);

    // Tạo profile tương ứng theo role
    if (user.role === UserRole.CUSTOMER) {
      const customer = this.customerRepo.create({ userId: user.id });
      await this.customerRepo.save(customer);
    }

    const tokens = await this.generateAndStoreTokens(user);
    return { user: this.toPublic(user), tokens };
  }

  // ─────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────
  async login(input: LoginInput): Promise<{ user: UserPublic; tokens: AuthTokens }> {
    const user = await this.userRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email: input.email })
      .getOne();

    if (!user) {
      throw Object.assign(new Error('Email hoặc mật khẩu không đúng'), { statusCode: 401 });
    }

    if (user.status === UserStatus.BANNED) {
      throw Object.assign(new Error('Tài khoản đã bị khóa'), { statusCode: 403 });
    }

    const valid = await comparePassword(input.password, user.passwordHash);
    if (!valid) {
      throw Object.assign(new Error('Email hoặc mật khẩu không đúng'), { statusCode: 401 });
    }

    user.lastLoginAt = new Date();
    await this.userRepo.save(user);

    const tokens = await this.generateAndStoreTokens(user, input.deviceInfo);
    return { user: this.toPublic(user), tokens };
  }

  // ─────────────────────────────────────────────
  // REFRESH TOKEN
  // ─────────────────────────────────────────────
  async refreshTokens(rawRefreshToken: string): Promise<AuthTokens> {
    let payload: ReturnType<typeof verifyRefreshToken>;
    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch {
      throw Object.assign(new Error('Refresh token không hợp lệ hoặc đã hết hạn'), { statusCode: 401 });
    }

    const tokenHash = hashToken(rawRefreshToken);
    const storedToken = await this.refreshTokenRepo.findOne({
      where: { id: payload.jti, tokenHash },
      relations: ['user'],
    });

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw Object.assign(new Error('Refresh token không hợp lệ hoặc đã bị thu hồi'), { statusCode: 401 });
    }

    // Revoke token cũ (rotation)
    storedToken.revokedAt = new Date();
    await this.refreshTokenRepo.save(storedToken);

    return this.generateAndStoreTokens(storedToken.user);
  }

  // ─────────────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────────────
  async logout(rawRefreshToken: string): Promise<void> {
    try {
      const payload = verifyRefreshToken(rawRefreshToken);
      const tokenHash = hashToken(rawRefreshToken);
      await this.refreshTokenRepo.update(
        { id: payload.jti, tokenHash },
        { revokedAt: new Date() },
      );
    } catch {
      // Nếu token đã hết hạn hoặc không hợp lệ, coi như đã logout
    }
  }

  // ─────────────────────────────────────────────
  // FORGOT PASSWORD
  // ─────────────────────────────────────────────
  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    const user = await this.userRepo.findOne({ where: { email: input.email } });

    // Luôn trả về thành công để tránh email enumeration
    if (!user) return;

    // Tạo token ngẫu nhiên
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresMinutes = parseInt(process.env.PASSWORD_RESET_EXPIRES_IN_MINUTES || '30');

    user.resetPasswordToken = hashToken(resetToken);
    user.resetPasswordExpiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);
    await this.userRepo.save(user);

    await sendPasswordResetEmail(user.email, user.fullName, resetToken);
  }

  // ─────────────────────────────────────────────
  // RESET PASSWORD
  // ─────────────────────────────────────────────
  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const tokenHash = hashToken(input.token);

    const user = await this.userRepo
      .createQueryBuilder('u')
      .addSelect('u.resetPasswordToken')
      .addSelect('u.resetPasswordExpiresAt')
      .where('u.resetPasswordToken = :tokenHash', { tokenHash })
      .getOne();

    if (!user) {
      throw Object.assign(new Error('Token không hợp lệ'), { statusCode: 400 });
    }

    if (!user.resetPasswordExpiresAt || user.resetPasswordExpiresAt < new Date()) {
      throw Object.assign(new Error('Token đã hết hạn, vui lòng yêu cầu lại'), { statusCode: 400 });
    }

    user.passwordHash = await hashPassword(input.newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;
    await this.userRepo.save(user);

    // Thu hồi tất cả refresh tokens sau khi đổi mật khẩu
    await this.refreshTokenRepo.update(
      { userId: user.id },
      { revokedAt: new Date() },
    );
  }

  // ─────────────────────────────────────────────
  // LOGIN WITH GOOGLE (sau khi passport xác thực)
  // ─────────────────────────────────────────────
  async loginWithGoogle(user: User): Promise<{ user: UserPublic; tokens: AuthTokens }> {
    user.lastLoginAt = new Date();
    await this.userRepo.save(user);

    const tokens = await this.generateAndStoreTokens(user);
    return { user: this.toPublic(user), tokens };
  }

  // ─────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────
  private async generateAndStoreTokens(user: User, deviceInfo?: string): Promise<AuthTokens> {
    // Tạo refresh token record trước để lấy id (dùng làm jti)
    const rtRecord = this.refreshTokenRepo.create({
      userId: user.id,
      tokenHash: '', // tạm, cập nhật sau
      deviceInfo: deviceInfo ?? null,
      expiresAt: getRefreshTokenExpiry(),
    });
    await this.refreshTokenRepo.save(rtRecord);

    const accessToken = signAccessToken({
      sub: user.id,
      role: user.role,
      email: user.email,
    });

    const rawRefreshToken = signRefreshToken({
      sub: user.id,
      jti: rtRecord.id,
    });

    rtRecord.tokenHash = hashToken(rawRefreshToken);
    await this.refreshTokenRepo.save(rtRecord);

    return { accessToken, refreshToken: rawRefreshToken };
  }

  private toPublic(user: User): UserPublic {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
    };
  }
}

export const authService = new AuthService();
