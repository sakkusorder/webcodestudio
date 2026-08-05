import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, password?: string, fullName?: string) => Promise<{ data: any; error: AuthError | null }>;
  signInWithPassword: (email: string, password: string) => Promise<{ data: any; error: AuthError | null }>;
  signInWithOtp: (email: string) => Promise<{ data: any; error: AuthError | null }>;
  verifyOtp: (email: string, token: string, type: 'signup' | 'magiclink' | 'recovery' | 'email_change') => Promise<{ data: any; error: AuthError | null }>;
  sendPasswordReset: (email: string) => Promise<{ data: any; error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ data: any; error: AuthError | null }>;
  updateEmail: (email: string) => Promise<{ data: any; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkConfig = () => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Supabase configuration is missing. If you are on Vercel, please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Environment Variables.', status: 400, name: 'ConfigError' } as any };
    }
    return null;
  };

  const signUp = async (email: string, password?: string, fullName?: string) => {
    const configError = checkConfig();
    if (configError) return configError;
    if (password) {
      return supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
    } else {
      // OTP sign up (no password)
      return supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            full_name: fullName,
          },
        }
      });
    }
  };

  const signInWithPassword = async (email: string, password: string) => {
    const configError = checkConfig();
    if (configError) return configError;
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const signInWithOtp = async (email: string) => {
    const configError = checkConfig();
    if (configError) return configError;
    return supabase.auth.signInWithOtp({
      email,
    });
  };

  const verifyOtp = async (email: string, token: string, type: 'signup' | 'magiclink' | 'recovery' | 'email_change') => {
    const configError = checkConfig();
    if (configError) return configError;
    return supabase.auth.verifyOtp({
      email,
      token,
      type,
    });
  };

  const sendPasswordReset = async (email: string) => {
    const configError = checkConfig();
    if (configError) return configError;
    return supabase.auth.resetPasswordForEmail(email);
  };

  const updatePassword = async (password: string) => {
    const configError = checkConfig();
    if (configError) return configError;
    return supabase.auth.updateUser({ password });
  };

  const updateEmail = async (email: string) => {
    const configError = checkConfig();
    if (configError) return configError;
    return supabase.auth.updateUser({ email });
  };

  const signOut = async () => {
    const configError = checkConfig();
    if (configError) return configError;
    return supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    signUp,
    signInWithPassword,
    signInWithOtp,
    verifyOtp,
    sendPasswordReset,
    updatePassword,
    updateEmail,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
