import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface AccessTokenPayload {
  sub: string;  // user id
  role: string;
  email: string;
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string; // token id (= refresh_token.id)
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  } as jwt.SignOptions);
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as RefreshTokenPayload;
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function getRefreshTokenExpiry(): Date {
  const days = parseInt((process.env.JWT_REFRESH_EXPIRES_IN || '30d').replace('d', ''));
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
}
