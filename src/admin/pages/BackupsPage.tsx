import React, { useState, useEffect } from 'react';
import { History, RotateCcw, AlertTriangle, RefreshCw } from 'lucide-react';
import { api } from '../api';
import { BackupItem } from '../../../shared/types';
import { useAdmin } from '../AdminContext';

export const BackupsPage: React.FC = () => {
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const { showToast, updateDraft } = useAdmin();

  const loadBackups = async () => {
    try {
      setIsLoading(true);
      const list = await api.backups.list();
      setBackups(list);
    } catch {
      showToast('Failed to load backups list', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBackups();
  }, []);

  const handleRestore = async (backup: BackupItem) => {
    const formattedDate = new Date(backup.timestamp).toLocaleString();
    const confirmed = window.confirm(
      `RESTORE BACKUP:\n\nAre you sure you want to restore the snapshot from ${formattedDate}?\n\nYour current content will be safely archived first.`
    );
    if (!confirmed) return;

    try {
      setRestoringId(backup.id);
      const res = await api.backups.restore(backup.id);
      updateDraft(() => res.content);
      showToast('Backup restored successfully!', 'success');
      loadBackups();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Restore failed', 'error');
    } finally {
      setRestoringId(null);
    }
  };

  const formatSize = (bytes: number) => {
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
            Automated Backups
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Before every save, a snapshot of your content is archived. The system retains the 20 most recent revisions.
          </p>
        </div>

        <button
          type="button"
          onClick={loadBackups}
          className="p-2 rounded-xl border border-border bg-card text-secondary hover:text-primary transition-colors shrink-0"
          title="Refresh backup list"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-card rounded-card-lg border border-border overflow-hidden shadow-xs">
        {backups.length > 0 ? (
          <div className="divide-y divide-border">
            {backups.map((b) => (
              <div
                key={b.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-page-alt/50 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-page-alt text-secondary">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      {new Date(b.timestamp).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'medium',
                      })}
                    </p>
                    <p className="text-xs text-secondary font-mono mt-0.5">
                      {b.filename} • {formatSize(b.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRestore(b)}
                  disabled={restoringId === b.id}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-page-alt text-xs font-semibold text-primary transition-colors disabled:opacity-50 cursor-pointer shadow-2xs self-start sm:self-auto"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${restoringId === b.id ? 'animate-spin' : ''}`} />
                  <span>{restoringId === b.id ? 'Restoring...' : 'Restore This Snapshot'}</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <History className="w-8 h-8 text-secondary mx-auto mb-3" />
            <p className="text-sm font-medium text-primary">No backups found yet</p>
            <p className="text-xs text-secondary mt-1">
              Backups will be created automatically whenever you click "Save Changes".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
