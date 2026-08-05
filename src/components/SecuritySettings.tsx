import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, AlertCircle, CheckCircle2, Save } from 'lucide-react';

export default function SecuritySettings() {
  const { updatePassword, updateEmail, user } = useAuth();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await updatePassword(newPassword);
      if (error) throw error;
      
      setPasswordSuccess('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);
    
    if (!newEmail || newEmail === user?.email) {
      setEmailError('Please enter a new email address');
      return;
    }

    setIsUpdatingEmail(true);
    try {
      const { error } = await updateEmail(newEmail);
      if (error) throw error;
      
      setEmailSuccess('Confirmation link sent to both old and new email addresses');
      setNewEmail('');
    } catch (err: any) {
      setEmailError(err.message || 'Failed to update email');
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Change Password Section */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
            <Lock className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Change Password</h3>
            <p className="text-sm text-neutral-400">Update your account password</p>
          </div>
        </div>

        {passwordError && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 p-3 rounded-xl flex items-start">
            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="ml-2 text-sm font-medium text-red-200">{passwordError}</p>
          </div>
        )}

        {passwordSuccess && (
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-start">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <p className="ml-2 text-sm font-medium text-emerald-200">{passwordSuccess}</p>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdatingPassword || !newPassword || !confirmPassword}
              className="flex items-center justify-center px-6 py-2.5 text-sm font-bold rounded-xl text-white bg-neutral-700 hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-neutral-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingPassword ? 'Updating...' : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Change Email Section */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
            <Mail className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Change Email</h3>
            <p className="text-sm text-neutral-400">Update your account email address</p>
          </div>
        </div>

        {emailError && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 p-3 rounded-xl flex items-start">
            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="ml-2 text-sm font-medium text-red-200">{emailError}</p>
          </div>
        )}

        {emailSuccess && (
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-start">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <p className="ml-2 text-sm font-medium text-emerald-200">{emailSuccess}</p>
          </div>
        )}

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Current Email</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="block w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-700/50 rounded-xl text-neutral-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">New Email</label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="block w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="new@example.com"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdatingEmail || !newEmail}
              className="flex items-center justify-center px-6 py-2.5 text-sm font-bold rounded-xl text-white bg-neutral-700 hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-neutral-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingEmail ? 'Updating...' : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Email
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
