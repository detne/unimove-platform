import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import { initPassport } from './config/passport';
import authRoutes from './modules/auth/auth.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// ─── Security ────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
);

// ─── Parsing ─────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Logging ─────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Passport ────────────────────────────────
initPassport();
app.use(passport.initialize());

// ─── Routes ──────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── Health check ────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 ─────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Không tìm thấy endpoint' });
});

// ─── Global error handler ────────────────────
app.use(errorHandler);

export default app;
