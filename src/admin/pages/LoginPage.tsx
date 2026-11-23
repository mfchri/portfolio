import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { api, ApiError } from '../api';
import { useAdminAuth } from '../hooks/useAdminAuth';

export const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, isLoading, checkAuth } = useAdminAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password) {
      setError('Please enter your admin password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.auth.login(password);
      await checkAuth();
      navigate('/admin', { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-page flex flex-col justify-center items-center px-4 sm:px-6">
      <div className="w-full max-w-md bg-card rounded-card-lg border border-border p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Portfolio Administration
          </h1>
          <p className="text-xs text-secondary">
            Sign in to manage your portfolio content, media, and credentials.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-primary"
            >
              Admin Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-page-alt border border-border text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <span>{isSubmitting ? 'Verifying...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <a
            href="/"
            className="text-xs font-medium text-secondary hover:text-primary transition-colors"
          >
            ← Return to public website
          </a>
        </div>
      </div>
    </div>
  );
};
