import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import { api } from '../api';

interface ImageUploaderProps {
  label: string;
  helperText?: string;
  currentUrl: string;
  onUploadSuccess: (url: string) => void;
  aspectHint?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  helperText,
  currentUrl,
  onUploadSuccess,
  aspectHint,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPG, PNG, or WebP images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5 MB.');
      return;
    }

    try {
      setIsUploading(true);
      const res = await api.upload.image(file);
      onUploadSuccess(res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
          {label}
        </label>
        {aspectHint && (
          <span className="text-[11px] text-secondary">{aspectHint}</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Current Image Preview */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden border border-border bg-page-alt flex items-center justify-center group">
          {currentUrl ? (
            <>
              <img
                src={currentUrl}
                alt="Preview"
                className="w-full h-full object-cover object-center"
                style={{ filter: 'grayscale(1) contrast(1.05)' }}
              />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[10px] text-white font-medium uppercase tracking-wider bg-primary/80 px-2 py-0.5 rounded">
                  B&W Preview
                </span>
              </div>
            </>
          ) : (
            <ImageIcon className="w-8 h-8 text-secondary" />
          )}
        </div>

        {/* Upload Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 w-full min-h-[7rem] border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-primary bg-page-alt/70'
              : 'border-border hover:border-primary/50 bg-page/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <Upload className="w-5 h-5 text-secondary mb-1.5" />
          <p className="text-xs font-medium text-primary">
            {isUploading ? 'Uploading...' : 'Click or drag & drop to upload'}
          </p>
          <p className="text-[11px] text-secondary mt-0.5">
            PNG (transparent recommended for Hero cutout), JPG or WebP (max 5MB)
          </p>
        </div>
      </div>

      {helperText && <p className="text-[11px] text-secondary">{helperText}</p>}
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
