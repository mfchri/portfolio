import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { PortfolioContent, BackupItem, MediaItem } from '../../shared/types';
import { defaultContent } from '../../src/data/content';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
const UPLOADS_DIR = path.resolve(process.cwd(), 'server', 'uploads');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

/**
 * Ensures all required storage directories and seed files exist
 */
export function initStorage(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  // 1. Seed content.json if missing
  if (!fs.existsSync(CONTENT_FILE)) {
    console.log('[Storage] Seeding initial content.json from default content...');
    atomicWriteJson(CONTENT_FILE, defaultContent);
  }

  // 2. Seed admin.json if missing
  if (!fs.existsSync(ADMIN_FILE)) {
    let password = process.env.ADMIN_PASSWORD;
    if (!password) {
      password = crypto.randomBytes(6).toString('hex');
      console.log('\n======================================================');
      console.log(' [CMS SECURITY] NO ADMIN_PASSWORD SET IN .ENV!');
      console.log(` Generated Temporary Admin Password: ${password}`);
      console.log(' Log in at /admin and change it immediately in Settings.');
      console.log('======================================================\n');
    } else {
      console.log('[CMS Security] Setting initial admin password from .env');
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    atomicWriteJson(ADMIN_FILE, {
      passwordHash: hash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

/**
 * Atomic write helper: writes to a .tmp file then renames
 */
export function atomicWriteJson(filePath: string, data: unknown): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tempPath = `${filePath}.${Date.now()}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, filePath);
}

/**
 * Get current portfolio content
 */
export function getContent(): PortfolioContent {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const raw = fs.readFileSync(CONTENT_FILE, 'utf-8');
      return JSON.parse(raw) as PortfolioContent;
    }
  } catch (err) {
    console.error('[Storage] Error reading content.json, falling back to defaultContent:', err);
  }
  return defaultContent;
}

/**
 * Save new portfolio content with automatic backup and pruning
 */
export function saveContent(content: PortfolioContent): void {
  // 1. Create timestamped backup of existing content before overwriting
  if (fs.existsSync(CONTENT_FILE)) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(BACKUPS_DIR, `backup-${timestamp}.json`);
      fs.copyFileSync(CONTENT_FILE, backupPath);
      pruneOldBackups(20);
    } catch (err) {
      console.error('[Storage] Failed to create backup before saving:', err);
    }
  }

  // 2. Atomically write updated content
  atomicWriteJson(CONTENT_FILE, content);
}

/**
 * Maintain at most maxCount backups (newest first)
 */
function pruneOldBackups(maxCount: number = 20): void {
  try {
    const files = fs.readdirSync(BACKUPS_DIR)
      .filter((file) => file.startsWith('backup-') && file.endsWith('.json'))
      .map((file) => ({
        file,
        time: fs.statSync(path.join(BACKUPS_DIR, file)).mtimeMs,
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length > maxCount) {
      const toDelete = files.slice(maxCount);
      for (const item of toDelete) {
        fs.unlinkSync(path.join(BACKUPS_DIR, item.file));
      }
    }
  } catch (err) {
    console.error('[Storage] Error pruning backups:', err);
  }
}

/**
 * List the last 20 backups
 */
export function getBackups(): BackupItem[] {
  try {
    if (!fs.existsSync(BACKUPS_DIR)) return [];
    const files = fs.readdirSync(BACKUPS_DIR)
      .filter((file) => file.startsWith('backup-') && file.endsWith('.json'))
      .map((file) => {
        const fullPath = path.join(BACKUPS_DIR, file);
        const stat = fs.statSync(fullPath);
        return {
          id: file,
          filename: file,
          timestamp: new Date(stat.mtimeMs).toISOString(),
          size: stat.size,
        };
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);

    return files;
  } catch (err) {
    console.error('[Storage] Error listing backups:', err);
    return [];
  }
}

/**
 * Restore a specific backup file
 */
export function restoreBackup(backupId: string): PortfolioContent {
  // Prevent path traversal
  const safeFilename = path.basename(backupId);
  const backupPath = path.join(BACKUPS_DIR, safeFilename);

  if (!fs.existsSync(backupPath)) {
    throw new Error('Backup file not found');
  }

  // Create safety backup of current content
  if (fs.existsSync(CONTENT_FILE)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const preRestoreBackup = path.join(BACKUPS_DIR, `backup-prerestore-${timestamp}.json`);
    fs.copyFileSync(CONTENT_FILE, preRestoreBackup);
  }

  const raw = fs.readFileSync(backupPath, 'utf-8');
  const restored = JSON.parse(raw) as PortfolioContent;
  atomicWriteJson(CONTENT_FILE, restored);
  return restored;
}

/**
 * Reset content to defaultContent
 */
export function resetContentToDefault(): PortfolioContent {
  saveContent(defaultContent);
  return defaultContent;
}

/**
 * Admin credentials management
 */
export function getAdminHash(): string | null {
  try {
    if (fs.existsSync(ADMIN_FILE)) {
      const raw = fs.readFileSync(ADMIN_FILE, 'utf-8');
      const data = JSON.parse(raw);
      return data.passwordHash || null;
    }
  } catch (err) {
    console.error('[Storage] Error reading admin.json:', err);
  }
  return null;
}

export function updateAdminPassword(newPasswordHash: string): void {
  atomicWriteJson(ADMIN_FILE, {
    passwordHash: newPasswordHash,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * List uploaded media files and check if they are in use in content.json
 */
export function getMediaList(): MediaItem[] {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) return [];
    const content = getContent();
    const contentStr = JSON.stringify(content);

    const files = fs.readdirSync(UPLOADS_DIR).map((file) => {
      const filePath = path.join(UPLOADS_DIR, file);
      const stat = fs.statSync(filePath);
      const url = `/uploads/${file}`;
      const isUsed = contentStr.includes(url) || contentStr.includes(file);

      return {
        filename: file,
        url,
        size: stat.size,
        createdAt: new Date(stat.mtimeMs).toISOString(),
        isUsed,
      };
    });

    return files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('[Storage] Error getting media list:', err);
    return [];
  }
}

/**
 * Delete an uploaded file
 */
export function deleteMediaFile(filename: string): boolean {
  try {
    const safeFilename = path.basename(filename);
    const filePath = path.join(UPLOADS_DIR, safeFilename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch (err) {
    console.error('[Storage] Error deleting media file:', err);
  }
  return false;
}
