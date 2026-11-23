import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { loginSchema, changePasswordSchema } from '../../shared/schema';
import { getAdminHash, updateAdminPassword } from '../lib/storage';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Rate limiter for login: 5 attempts per 15 minutes per IP
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again after 15 minutes.' },
});

router.post('/login', loginRateLimiter, async (req: Request, res: Response): Promise<void> => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0]?.message || 'Invalid request' });
    return;
  }

  const { password } = result.data;
  const adminHash = getAdminHash();

  if (!adminHash) {
    res.status(500).json({ error: 'Admin account not initialized' });
    return;
  }

  const isMatch = await bcrypt.compare(password, adminHash);
  if (!isMatch) {
    res.status(401).json({ error: 'Incorrect password' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET || 'fallback_development_secret_change_in_production';
  const token = jwt.sign({ role: 'admin' }, jwtSecret, { expiresIn: '7d' });

  // Set HTTP-only, SameSite strict cookie
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });

  res.json({ authenticated: true, message: 'Signed in successfully' });
});

router.post('/logout', (_req: Request, res: Response): void => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  res.json({ authenticated: false, message: 'Signed out successfully' });
});

router.get('/me', (req: Request, res: Response): void => {
  const token = req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/, '');
  if (!token) {
    res.json({ authenticated: false });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET || 'fallback_development_secret_change_in_production';
  try {
    jwt.verify(token, jwtSecret);
    res.json({ authenticated: true });
  } catch {
    res.json({ authenticated: false });
  }
});

router.post('/change-password', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const result = changePasswordSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0]?.message || 'Invalid input' });
    return;
  }

  const { currentPassword, newPassword } = result.data;
  const adminHash = getAdminHash();

  if (!adminHash) {
    res.status(500).json({ error: 'Admin account error' });
    return;
  }

  const isMatch = await bcrypt.compare(currentPassword, adminHash);
  if (!isMatch) {
    res.status(400).json({ error: 'Current password is incorrect' });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const newHash = await bcrypt.hash(newPassword, salt);
  updateAdminPassword(newHash);

  res.json({ success: true, message: 'Password updated successfully' });
});

export default router;
