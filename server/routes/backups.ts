import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { getBackups, restoreBackup } from '../lib/storage';

const router = Router();

router.get('/', requireAuth, (_req: Request, res: Response): void => {
  try {
    const backups = getBackups();
    res.json(backups);
  } catch (err) {
    console.error('[API] Error listing backups:', err);
    res.status(500).json({ error: 'Failed to list backups' });
  }
});

router.post('/:id/restore', requireAuth, (req: Request, res: Response): void => {
  try {
    const backupId = req.params.id;
    const restoredContent = restoreBackup(backupId);
    res.json({ success: true, message: 'Backup restored successfully', content: restoredContent });
  } catch (err) {
    console.error('[API] Error restoring backup:', err);
    res.status(400).json({ error: err instanceof Error ? err.message : 'Failed to restore backup' });
  }
});

export default router;
