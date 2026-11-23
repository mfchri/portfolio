import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.auth.me();
      setIsAuthenticated(res.authenticated);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = async () => {
    try {
      await api.auth.logout();
    } finally {
      setIsAuthenticated(false);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    checkAuth,
    logout,
  };
}
