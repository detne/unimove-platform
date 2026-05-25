import { Response } from 'express';

export function successResponse<T>(
  res: Response,
  data: T,
  message = 'Thành công',
  statusCode = 200,
): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode = 400,
  errors?: unknown,
): void {
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
}
