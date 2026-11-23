import { Router, Request, Response } from 'express';
import { portfolioContentSchema, sanitizeString } from '../../shared/schema';
import { getContent, saveContent, resetContentToDefault } from '../lib/storage';
import { requireAuth } from '../middleware/auth';

const router = Router();

function sanitizeObject<T>(obj: T): T {
  if (typeof obj === 'string') {
    return sanitizeString(obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object') {
    const res: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      res[key] = sanitizeObject(val);
    }
    return res as T;
  }
  return obj;
}

// Public: GET current content
router.get('/', (_req: Request, res: Response): void => {
  try {
    const content = getContent();
    res.json(content);
  } catch (err) {
    console.error('[API] Error getting content:', err);
    res.status(500).json({ error: 'Failed to retrieve content' });
  }
});

// Protected: PUT updated content
router.put('/', requireAuth, (req: Request, res: Response): void => {
  try {
    const sanitizedBody = sanitizeObject(req.body);
    const result = portfolioContentSchema.safeParse(sanitizedBody);

    if (!result.success) {
      const errorMsg = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      res.status(400).json({ error: `Validation error: ${errorMsg}` });
      return;
    }

    saveContent(result.data);
    res.json({ success: true, content: result.data });
  } catch (err) {
    console.error('[API] Error saving content:', err);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

// Protected: Reset content to default
router.post('/reset', requireAuth, (_req: Request, res: Response): void => {
  try {
    const reset = resetContentToDefault();
    res.json({ success: true, content: reset });
  } catch (err) {
    console.error('[API] Error resetting content:', err);
    res.status(500).json({ error: 'Failed to reset content' });
  }
});

export default router;
