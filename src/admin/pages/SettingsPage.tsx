import React, { useState } from 'react';
import { Lock, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../api';
import { useAdmin } from '../AdminContext';

export const SettingsPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [isResetting, setIsResetting] = useState(false);
  const { showToast, updateDraft } = useAdmin();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    try {
      setIsChangingPassword(true);
      await api.auth.changePassword(currentPassword, newPassword);
      setPasswordSuccess('Password changed successfully! Keep your new password secure.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Admin password updated successfully', 'success');
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleResetToDefault = async () => {
    const confirm1 = window.confirm(
      'DANGER ZONE:\n\nAre you sure you want to reset all portfolio content to factory defaults?'
    );
    if (!confirm1) return;

    const confirm2 = window.prompt(
      'Type RESET in all capital letters below to confirm complete content reset:'
    );
    if (confirm2 !== 'RESET') {
      alert('Reset aborted. The confirmation word did not match.');
      return;
    }

    try {
      setIsResetting(true);
      const res = await api.content.reset();
      updateDraft(() => res.content);
      showToast('All portfolio content has been reset to defaults', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Reset failed', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
          Settings &amp; Security
        </h1>
        <p className="text-xs sm:text-sm text-secondary mt-1">
          Manage administrator authentication credentials and system reset operations.
        </p>
      </div>

      {/* Change Password Card */}
      <div className="bg-card rounded-card-lg border border-border p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="p-2.5 rounded-xl bg-page-alt text-primary">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-primary">Change Administrator Password</h2>
            <p className="text-xs text-secondary">
              Update the single admin account password stored securely on the server.
            </p>
          </div>
        </div>

        {passwordError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {passwordError}
          </div>
        )}
        {passwordSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
            {passwordSuccess}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-primary">
              Current Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-primary">
              New Password (min 6 characters)
            </label>
            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-primary">
              Confirm New Password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isChangingPassword ? 'Updating...' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="bg-card rounded-card-lg border border-red-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-red-700">Danger Zone: Reset Content</h2>
            <p className="text-xs text-secondary">
              Overwrites your active content.json with the original baseline content from content.ts.
            </p>
          </div>
        </div>

        <p className="text-xs text-secondary leading-relaxed">
          A backup of your current content will be archived automatically before resetting.
        </p>

        <button
          type="button"
          onClick={handleResetToDefault}
          disabled={isResetting}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 transition-colors cursor-pointer"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          <span>{isResetting ? 'Resetting...' : 'Reset All Content to Defaults'}</span>
        </button>
      </div>
    </div>
  );
};
