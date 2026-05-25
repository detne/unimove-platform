import { z } from 'zod';

export const RegisterDto = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số'),
  fullName: z.string().min(2, 'Họ tên tối thiểu 2 ký tự').max(100),
  phone: z.string().regex(/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ').optional(),
  role: z.enum(['customer', 'provider']).default('customer'),
});

export const LoginDto = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  deviceInfo: z.string().optional(),
});

export const ForgotPasswordDto = z.object({
  email: z.string().email('Email không hợp lệ'),
});

export const ResetPasswordDto = z.object({
  token: z.string().min(1, 'Token không hợp lệ'),
  newPassword: z
    .string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số'),
});

export const RefreshTokenDto = z.object({
  refreshToken: z.string().min(1, 'Refresh token không hợp lệ'),
});

export type RegisterInput = z.infer<typeof RegisterDto>;
export type LoginInput = z.infer<typeof LoginDto>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordDto>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordDto>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenDto>;
