import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { requireAuth } from '../middleware/auth';
import { getMediaList, deleteMediaFile } from '../lib/storage';

const router = Router();
const UPLOADS_DIR = path.resolve(process.cwd(), 'server', 'uploads');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `img_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedExt = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMime.includes(file.mimetype) && allowedExt.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and WebP images up to 5MB are accepted'));
    }
  },
});

// Single image upload route
router.post(
  '/',
  requireAuth,
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('file')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({ error: 'File size exceeds maximum allowed limit (5MB)' });
          return;
        }
        res.status(400).json({ error: `Upload error: ${err.message}` });
        return;
      }
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      next();
    });
  },
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: 'No image file uploaded' });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  }
);

// Get list of all media uploads
router.get('/media', requireAuth, (_req: Request, res: Response): void => {
  try {
    const media = getMediaList();
    res.json(media);
  } catch (err) {
    console.error('[API] Error listing media:', err);
    res.status(500).json({ error: 'Failed to retrieve media library' });
  }
});

// Delete a specific media upload
router.delete('/media/:filename', requireAuth, (req: Request, res: Response): void => {
  try {
    const filename = req.params.filename;
    const deleted = deleteMediaFile(filename);
    if (!deleted) {
      res.status(404).json({ error: 'File not found or could not be removed' });
      return;
    }
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (err) {
    console.error('[API] Error deleting media file:', err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;
