import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PortfolioContent } from '../../shared/types';
import { defaultContent } from '../data/content';
import { api } from './api';

interface AdminContextType {
  draft: PortfolioContent;
  isDirty: boolean;
  isLoading: boolean;
  isSaving: boolean;
  toast: { message: string; type: 'success' | 'error' } | null;
  showPreview: boolean;
  previewKey: number;
  updateDraft: (updater: (prev: PortfolioContent) => PortfolioContent) => void;
  saveChanges: () => Promise<boolean>;
  resetDraft: () => void;
  togglePreview: () => void;
  clearToast: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return ctx;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [saved, setSaved] = useState<PortfolioContent>(defaultContent);
  const [draft, setDraft] = useState<PortfolioContent>(defaultContent);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [previewKey, setPreviewKey] = useState<number>(0);

  const isDirty = JSON.stringify(saved) !== JSON.stringify(draft);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load content from server
  const loadContent = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.content.get();
      setSaved(data);
      setDraft(data);
    } catch (err) {
      console.error('[Admin] Failed to load content:', err);
      showToast('Could not load current content from server', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const updateDraft = useCallback((updater: (prev: PortfolioContent) => PortfolioContent) => {
    setDraft((prev) => updater(prev));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(saved);
  }, [saved]);

  const saveChanges = useCallback(async (): Promise<boolean> => {
    try {
      setIsSaving(true);
      const res = await api.content.save(draft);
      setSaved(res.content);
      setDraft(res.content);
      setPreviewKey((k) => k + 1);
      showToast('Changes saved and backup created successfully!', 'success');
      return true;
    } catch (err) {
      console.error('[Admin] Error saving:', err);
      showToast(err instanceof Error ? err.message : 'Failed to save changes', 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [draft, showToast]);

  const togglePreview = useCallback(() => {
    setShowPreview((p) => !p);
  }, []);

  return (
    <AdminContext.Provider
      value={{
        draft,
        isDirty,
        isLoading,
        isSaving,
        toast,
        showPreview,
        previewKey,
        updateDraft,
        saveChanges,
        resetDraft,
        togglePreview,
        clearToast,
        showToast,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
