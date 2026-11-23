import { PortfolioContent, BackupItem, MediaItem } from '../../shared/types';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    let errMsg = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data.error) errMsg = data.error;
    } catch {
      // ignored
    }
    throw new ApiError(res.status, errMsg);
  }

  return res.json();
}

export const api = {
  auth: {
    login: (password: string) =>
      request<{ authenticated: boolean; message: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
      }),

    logout: () =>
      request<{ authenticated: boolean; message: string }>('/api/auth/logout', {
        method: 'POST',
      }),

    me: () =>
      request<{ authenticated: boolean }>('/api/auth/me'),

    changePassword: (currentPassword: string, newPassword: string) =>
      request<{ success: boolean; message: string }>('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
  },

  content: {
    get: () => request<PortfolioContent>('/api/content'),

    save: (content: PortfolioContent) =>
      request<{ success: boolean; content: PortfolioContent }>('/api/content', {
        method: 'PUT',
        body: JSON.stringify(content),
      }),

    reset: () =>
      request<{ success: boolean; content: PortfolioContent }>('/api/content/reset', {
        method: 'POST',
      }),
  },

  upload: {
    image: async (file: File): Promise<{ url: string; filename: string }> => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) {
        let errMsg = 'Upload failed';
        try {
          const data = await res.json();
          if (data.error) errMsg = data.error;
        } catch {
          // ignore
        }
        throw new ApiError(res.status, errMsg);
      }

      return res.json();
    },
  },

  media: {
    list: () => request<MediaItem[]>('/api/upload/media'),
    delete: (filename: string) =>
      request<{ success: boolean; message: string }>(`/api/upload/media/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      }),
  },

  backups: {
    list: () => request<BackupItem[]>('/api/backups'),
    restore: (id: string) =>
      request<{ success: boolean; message: string; content: PortfolioContent }>(
        `/api/backups/${encodeURIComponent(id)}/restore`,
        { method: 'POST' }
      ),
  },
};
