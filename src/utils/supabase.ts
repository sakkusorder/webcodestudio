import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

let client: any;

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

if (supabaseUrl && isValidUrl(supabaseUrl) && supabaseKey) {
  try {
    client = createClient(supabaseUrl, supabaseKey);
  } catch (err: any) {
    console.error('Failed to create Supabase client:', err);
    client = createMockClient(err.message || 'Initialization error');
  }
} else {
  console.warn('Supabase credentials are missing or invalid. Using safe fallback client.');
  client = createMockClient('Supabase URL or Publishable Key is missing or invalid in configuration (.env)');
}

function createMockClient(reason: string) {
  const dummyPromise = () => Promise.resolve({ 
    data: null, 
    error: { 
      message: reason, 
      code: 'CONFIG_ERROR',
      details: 'Check your VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env configuration file.',
      hint: 'Make sure you have created a table named "todos" in your Supabase SQL Editor.'
    } 
  });

  return {
    from: () => ({
      select: dummyPromise,
      insert: dummyPromise,
      update: dummyPromise,
      delete: dummyPromise,
      order: () => ({
        select: dummyPromise,
      }),
      eq: () => ({
        select: dummyPromise,
        update: dummyPromise,
        delete: dummyPromise,
      }),
    }),
  };
}

export const supabase = client;

