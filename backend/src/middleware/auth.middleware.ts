import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User.entity';
import { errorResponse } from '../utils/response.util';

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    errorResponse(res, 'Không có token xác thực', 401);
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: payload.sub } });

    if (!user) {
      errorResponse(res, 'Người dùng không tồn tại', 401);
      return;
    }
    if (user.status === 'banned') {
      errorResponse(res, 'Tài khoản đã bị khóa', 403);
      return;
    }

    req.user = user;
    next();
  } catch {
    errorResponse(res, 'Token không hợp lệ hoặc đã hết hạn', 401);
  }
}
