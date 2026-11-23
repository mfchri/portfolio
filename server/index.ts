import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { initStorage } from './lib/storage';
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';
import uploadRoutes from './routes/upload';
import backupRoutes from './routes/backups';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const isProd = process.env.NODE_ENV === 'production';

// Initialize persistent directories and seed content
initStorage();

// Security and middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Managed for dev iframe preview
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded images statically
const uploadsDir = path.resolve(process.cwd(), 'server', 'uploads');
app.use('/uploads', express.static(uploadsDir));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/backups', backupRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Production: serve built Vite client
if (isProd) {
  const distDir = path.resolve(process.cwd(), 'dist');
  app.use(express.static(distDir));

  // Catch-all route to serve SPA index.html
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[Server] CMS backend running on http://localhost:${PORT}`);
  console.log(`[Server] Uploads served from ${uploadsDir}`);
});
