import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder_key';

export const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co';

if (!isSupabaseConfigured) {
  console.error('Supabase URL or Anon Key is missing in configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

