import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { supabase } from '../utils/supabase';

type AuthMode = 'login' | 'register' | 'forgot' | 'verify-signup' | 'verify-forgot' | 'reset-password';

export function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated && mode !== 'reset-password') {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
             throw new Error('We could not find an account with that email and password. Please check your credentials or create a new account.');
          }
          throw error;
        }
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: fullName
            }
          }
        });
        if (error) throw error;
        
        setSuccess('Registration successful! Please check your email for a 6-digit verification code.');
        setMode('verify-signup');
      } else if (mode === 'verify-signup') {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'signup'
        });
        if (error) throw error;
        
        // After verify, user is usually logged in automatically.
      } else if (mode === 'forgot') {
        // Send OTP to email for password reset
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        
        setSuccess('Password reset code sent to your email.');
        setMode('verify-forgot');
      } else if (mode === 'verify-forgot') {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'recovery'
        });
        if (error) throw error;
        
        setSuccess('Code verified! Please enter your new password.');
        setMode('reset-password');
      } else if (mode === 'reset-password') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const { error } = await supabase.auth.updateUser({
          password
        });
        if (error) throw error;
        
        setSuccess('Password updated successfully! You can now log in.');
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => {
    switch (mode) {
      case 'login': return 'Welcome back';
      case 'register': return 'Create your account';
      case 'forgot': return 'Reset your password';
      case 'verify-signup': 
      case 'verify-forgot': return 'Enter verification code';
      case 'reset-password': return 'Set new password';
    }
  };

  const renderSubHeader = () => {
    if (mode === 'login') {
      return (
        <>
          Don't have an account?{' '}
          <button onClick={() => setMode('register')} type="button" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
            Sign up
          </button>
        </>
      );
    } else if (mode === 'register') {
      return (
        <>
          Already have an account?{' '}
          <button onClick={() => setMode('login')} type="button" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
            Log in
          </button>
        </>
      );
    } else if (mode === 'forgot' || mode === 'verify-signup' || mode === 'verify-forgot' || mode === 'reset-password') {
      return (
        <button onClick={() => setMode('login')} type="button" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
          Back to login
        </button>
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border border-neutral-200 shadow-xl shadow-neutral-200/50">
        <div>
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-200 mb-6">
            <span className="text-3xl font-black">W</span>
          </div>
          <h2 className="text-center text-3xl font-black text-neutral-900 tracking-tight">
            {renderHeader()}
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-500 font-medium">
            {renderSubHeader()}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold border border-rose-100 flex items-start gap-2">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-bold border border-emerald-100 flex items-start gap-2">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-xl bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent font-medium sm:text-sm transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-xl bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent font-medium sm:text-sm transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {(mode === 'login' || mode === 'register' || mode === 'reset-password') && (
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">
                  {mode === 'reset-password' ? 'New Password' : 'Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-xl bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent font-medium sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}
            
            {(mode === 'register' || mode === 'reset-password') && (
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-xl bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent font-medium sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {(mode === 'verify-signup' || mode === 'verify-forgot') && (
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">6-Digit Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-xl bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent font-medium sm:text-sm transition-all tracking-[0.5em] font-mono text-center"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
              </div>
            )}
          </div>

          {mode === 'login' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-neutral-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-neutral-700 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button type="button" onClick={() => setMode('forgot')} className="font-bold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </button>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-md shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                'Processing...'
              ) : (
                <>
                  {mode === 'login' && 'Sign in'}
                  {mode === 'register' && 'Create account'}
                  {mode === 'forgot' && 'Send code'}
                  {(mode === 'verify-signup' || mode === 'verify-forgot') && 'Verify code'}
                  {mode === 'reset-password' && 'Update password'}
                  <ArrowRight className="ml-2 -mr-1 h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

