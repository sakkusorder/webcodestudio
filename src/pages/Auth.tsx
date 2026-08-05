import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, ArrowRight, ShieldCheck, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgot' | 'verify-otp' | 'reset-password';

export function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // OTP State
  const [otpMode, setOtpMode] = useState<'signup' | 'magiclink' | 'recovery'>('magiclink');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [countdown, setCountdown] = useState(0);

  const { signInWithPassword, signInWithOtp, signUp, verifyOtp, sendPasswordReset, updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!password) {
          // Magic link flow
          const { error: err } = await signInWithOtp(email);
          if (err) throw err;
          setOtpMode('magiclink');
          setMode('verify-otp');
          setSuccess('OTP sent to your email.');
          setCountdown(60);
        } else {
          // Password login
          const { error: err } = await signInWithPassword(email, password);
          if (err) throw err;
          if (email === 'webcodestudio10@gmail.com') {
            localStorage.setItem('wcs_admin_access', 'true');
            navigate('/admin', { replace: true });
          } else {
            navigate(from, { replace: true });
          }
        }
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const { error: err } = await signUp(email, password, fullName);
        if (err) throw err;
        setOtpMode('signup');
        setMode('verify-otp');
        setSuccess('Verification code sent to your email.');
        setCountdown(60);
      } else if (mode === 'forgot') {
        const { error: err } = await sendPasswordReset(email);
        if (err) throw err;
        setOtpMode('recovery');
        setMode('verify-otp');
        setSuccess('Password reset code sent to your email.');
        setCountdown(60);
      } else if (mode === 'reset-password') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const { error: err } = await updatePassword(password);
        if (err) throw err;
        setSuccess('Password updated successfully. You can now log in.');
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    
    clearMessages();
    setLoading(true);
    
    try {
      const { error: err } = await verifyOtp(email, code, otpMode);
      if (err) throw err;
      
      if (otpMode === 'recovery') {
        setMode('reset-password');
        setSuccess('Code verified successfully. Please enter a new password.');
        setPassword('');
        setConfirmPassword('');
      } else {
        if (email === 'webcodestudio10@gmail.com') {
          localStorage.setItem('wcs_admin_access', 'true');
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple chars unless paste
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter') {
      handleVerifyOtp();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = [...otp];
    pastedData.forEach((char, i) => {
      if (i < 6 && /^\d$/.test(char)) {
        newOtp[i] = char;
      }
    });
    setOtp(newOtp);
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    otpInputRefs.current[focusIndex]?.focus();
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    clearMessages();
    setLoading(true);
    try {
      if (otpMode === 'recovery') {
        const { error: err } = await sendPasswordReset(email);
        if (err) throw err;
      } else {
        const { error: err } = await signInWithOtp(email);
        if (err) throw err;
      }
      setSuccess('Code resent successfully.');
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (newMode: AuthMode) => {
    clearMessages();
    setMode(newMode);
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black text-white tracking-tight">
          {mode === 'login' && 'Sign in to your account'}
          {mode === 'register' && 'Create your account'}
          {mode === 'forgot' && 'Reset your password'}
          {mode === 'verify-otp' && 'Verify your email'}
          {mode === 'reset-password' && 'Set new password'}
        </h2>
        
        {mode !== 'verify-otp' && mode !== 'reset-password' && (
          <p className="mt-3 text-center text-sm font-medium text-neutral-400">
            {mode === 'login' ? (
              <>
                New to Web Code Studio?{' '}
                <button onClick={() => toggleMode('register')} className="font-bold text-indigo-400 hover:text-indigo-300">
                  Create an account
                </button>
              </>
            ) : mode === 'register' ? (
              <>
                Already have an account?{' '}
                <button onClick={() => toggleMode('login')} className="font-bold text-indigo-400 hover:text-indigo-300">
                  Sign in instead
                </button>
              </>
            ) : (
              <>
                Remember your password?{' '}
                <button onClick={() => toggleMode('login')} className="font-bold text-indigo-400 hover:text-indigo-300">
                  Back to sign in
                </button>
              </>
            )}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-neutral-800 py-8 px-4 shadow-2xl shadow-black/50 rounded-3xl sm:px-10 border border-neutral-700">
          
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="ml-3 text-sm font-medium text-red-200">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-start">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="ml-3 text-sm font-medium text-emerald-200">{success}</p>
            </div>
          )}

          {mode === 'verify-otp' ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm font-medium text-neutral-300 mb-6">
                  We sent a 6-digit verification code to <br/>
                  <span className="font-bold text-white">{email}</span>
                </p>
                
                <div className="flex justify-between max-w-xs mx-auto mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => otpInputRefs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-14 text-center text-xl font-bold bg-neutral-900 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full flex justify-center py-3.5 px-4 text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-indigo-500 transition-all shadow-md shadow-indigo-900/50 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
                
                <div className="text-sm">
                  <button
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || loading}
                    className="font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {countdown > 0 ? `Resend code in ${countdown}s` : "Didn't receive a code? Resend"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-bold text-neutral-300 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-neutral-500" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-neutral-600 rounded-xl bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium sm:text-sm transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-neutral-300 mb-1">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-600 rounded-xl bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium sm:text-sm transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {(mode === 'login' || mode === 'register' || mode === 'reset-password') && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-bold text-neutral-300">
                      {mode === 'reset-password' ? 'New Password' : 'Password'}
                    </label>
                    {mode === 'login' && (
                      <span className="text-xs font-medium text-neutral-500">Optional for magic link</span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-500" />
                    </div>
                    <input
                      type={mode === 'login' ? 'password' : 'password'}
                      required={mode !== 'login'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-neutral-600 rounded-xl bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium sm:text-sm transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}
              
              {(mode === 'register' || mode === 'reset-password') && (
                <div>
                  <label className="block text-sm font-bold text-neutral-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-500" />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-neutral-600 rounded-xl bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium sm:text-sm transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 bg-neutral-900 border-neutral-600 rounded text-indigo-600 focus:ring-indigo-500 focus:ring-offset-neutral-800 cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-neutral-300 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <button type="button" onClick={() => toggleMode('forgot')} className="font-bold text-indigo-400 hover:text-indigo-300">
                      Forgot password?
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3.5 px-4 text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-indigo-500 transition-all shadow-md shadow-indigo-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : (
                    <>
                      {mode === 'login' ? (password ? 'Sign in with Password' : 'Send Magic Link') : ''}
                      {mode === 'register' && 'Create account'}
                      {mode === 'forgot' && 'Send recovery code'}
                      {mode === 'reset-password' && 'Update password'}
                      <ArrowRight className="ml-2 -mr-1 h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
