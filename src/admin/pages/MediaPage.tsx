import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Copy, Check, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { api } from '../api';
import { MediaItem } from '../../../shared/types';
import { useAdmin } from '../AdminContext';

export const MediaPage: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useAdmin();

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      const items = await api.media.list();
      setMedia(items);
    } catch {
      showToast('Failed to load media list', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    try {
      setUploading(true);
      await api.upload.image(file);
      showToast('Image uploaded successfully', 'success');
      loadMedia();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload failed', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    showToast('Image URL copied to clipboard');
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDelete = async (item: MediaItem) => {
    if (item.isUsed) {
      const confirmUsed = window.confirm(
        `WARNING: "${item.filename}" is currently referenced in your website content!\n\nAre you sure you want to permanently delete it?`
      );
      if (!confirmUsed) return;
    } else {
      const confirmDelete = window.confirm(`Delete image "${item.filename}"?`);
      if (!confirmDelete) return;
    }

    try {
      await api.media.delete(item.filename);
      showToast('File deleted successfully');
      setMedia((prev) => prev.filter((m) => m.filename !== item.filename));
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
            Media Library
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Browse and manage all uploaded imagery stored on the server.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadMedia}
            className="p-2 rounded-xl border border-border bg-card text-secondary hover:text-primary transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 shadow-sm transition-all shrink-0 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Grid of uploaded images */}
      {media.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div
              key={item.filename}
              className="rounded-card bg-card border border-border overflow-hidden flex flex-col justify-between shadow-xs hover:border-primary/40 transition-colors"
            >
              {/* Image Preview with B&W styling */}
              <div className="relative aspect-square w-full bg-page-alt border-b border-border overflow-hidden group">
                <img
                  src={item.url}
                  alt={item.filename}
                  className="w-full h-full object-cover object-center"
                  style={{ filter: 'grayscale(1) contrast(1.05)' }}
                />

                {/* Status badge */}
                <div className="absolute top-2 left-2">
                  {item.isUsed ? (
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full shadow-xs">
                      In Use
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold bg-page text-secondary border border-border px-2 py-0.5 rounded-full shadow-xs">
                      Unused
                    </span>
                  )}
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-primary/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Open full image in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Meta details & Action buttons */}
              <div className="p-3.5 space-y-2">
                <p className="text-xs font-medium text-primary truncate" title={item.filename}>
                  {item.filename}
                </p>
                <div className="flex items-center justify-between text-[11px] text-secondary">
                  <span>{formatSize(item.size)}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.url)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-page-alt hover:bg-page border border-border text-xs font-medium text-primary transition-colors"
                  >
                    {copiedUrl === item.url ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-secondary" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded-lg text-secondary hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                    title="Delete image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-card-lg border border-dashed border-border bg-card">
          <Upload className="w-8 h-8 text-secondary mx-auto mb-3" />
          <p className="text-sm font-medium text-primary">No images uploaded yet</p>
          <p className="text-xs text-secondary mt-1">
            Uploaded images for hero and profile sections will appear here.
          </p>
        </div>
      )}
    </div>
  );
};
