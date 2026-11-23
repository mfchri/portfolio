import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/, '');

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET || 'fallback_development_secret_change_in_production';

  try {
    const decoded = jwt.verify(token, jwtSecret) as { role: string };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session token' });
  }
}
