import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  RefreshTokenDto,
} from './dto/auth.dto';

const router = Router();

/**
 * @route  POST /api/auth/register
 * @desc   Đăng ký tài khoản mới
 * @access Public
 */
router.post('/register', validate(RegisterDto), authController.register);

/**
 * @route  POST /api/auth/login
 * @desc   Đăng nhập bằng email + mật khẩu
 * @access Public
 */
router.post('/login', validate(LoginDto), authController.login);

/**
 * @route  POST /api/auth/refresh
 * @desc   Làm mới access token bằng refresh token
 * @access Public
 */
router.post('/refresh', validate(RefreshTokenDto), authController.refresh);

/**
 * @route  POST /api/auth/logout
 * @desc   Đăng xuất (thu hồi refresh token)
 * @access Public
 */
router.post('/logout', validate(RefreshTokenDto), authController.logout);

/**
 * @route  POST /api/auth/forgot-password
 * @desc   Gửi email đặt lại mật khẩu
 * @access Public
 */
router.post('/forgot-password', validate(ForgotPasswordDto), authController.forgotPassword);

/**
 * @route  POST /api/auth/reset-password
 * @desc   Đặt lại mật khẩu bằng token từ email
 * @access Public
 */
router.post('/reset-password', validate(ResetPasswordDto), authController.resetPassword);

/**
 * @route  GET /api/auth/google
 * @desc   Khởi tạo đăng nhập Google OAuth
 * @access Public
 */
router.get('/google', authController.googleAuth);

/**
 * @route  GET /api/auth/google/callback
 * @desc   Google OAuth callback
 * @access Public
 */
router.get('/google/callback', authController.googleCallback);

/**
 * @route  GET /api/auth/me
 * @desc   Lấy thông tin user đang đăng nhập
 * @access Private
 */
router.get('/me', authenticate, authController.me);

export default router;
