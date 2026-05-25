import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { authService } from './auth.service';
import { successResponse, errorResponse } from '../../utils/response.util';
import { User } from '../../entities/User.entity';

export const authController = {
  // POST /api/auth/register
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      successResponse(res, result, 'Đăng ký thành công', 201);
    } catch (err) {
      const e = err as Error & { statusCode?: number };
      if (e.statusCode) {
        errorResponse(res, e.message, e.statusCode);
      } else {
        next(err);
      }
    }
  },

  // POST /api/auth/login
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      successResponse(res, result, 'Đăng nhập thành công');
    } catch (err) {
      const e = err as Error & { statusCode?: number };
      if (e.statusCode) {
        errorResponse(res, e.message, e.statusCode);
      } else {
        next(err);
      }
    }
  },

  // POST /api/auth/refresh
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tokens = await authService.refreshTokens(req.body.refreshToken);
      successResponse(res, tokens, 'Làm mới token thành công');
    } catch (err) {
      const e = err as Error & { statusCode?: number };
      if (e.statusCode) {
        errorResponse(res, e.message, e.statusCode);
      } else {
        next(err);
      }
    }
  },

  // POST /api/auth/logout
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.logout(req.body.refreshToken);
      successResponse(res, null, 'Đăng xuất thành công');
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/forgot-password
  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.forgotPassword(req.body);
      successResponse(
        res,
        null,
        'Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu',
      );
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/reset-password
  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.resetPassword(req.body);
      successResponse(res, null, 'Đặt lại mật khẩu thành công');
    } catch (err) {
      const e = err as Error & { statusCode?: number };
      if (e.statusCode) {
        errorResponse(res, e.message, e.statusCode);
      } else {
        next(err);
      }
    }
  },

  // GET /api/auth/google
  googleAuth: passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }),

  // GET /api/auth/google/callback
  googleCallback(req: Request, res: Response, next: NextFunction): void {
    passport.authenticate('google', { session: false }, async (err: Error, user: User) => {
      if (err || !user) {
        errorResponse(res, 'Đăng nhập Google thất bại', 401);
        return;
      }
      try {
        const result = await authService.loginWithGoogle(user);
        // Redirect về FE kèm token (FE sẽ lấy từ query param)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(
          `${frontendUrl}/auth/callback?accessToken=${result.tokens.accessToken}&refreshToken=${result.tokens.refreshToken}`,
        );
      } catch (e) {
        next(e);
      }
    })(req, res, next);
  },

  // GET /api/auth/me  (cần authenticate middleware)
  async me(req: Request, res: Response): Promise<void> {
    successResponse(res, req.user, 'Lấy thông tin thành công');
  },
};
