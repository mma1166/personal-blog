import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only initialize when BOTH values look like real URLs (start with http)
// This prevents crashes from placeholder text or missing env vars
const isValid = supabaseUrl.startsWith('http') && supabaseAnonKey.length > 10;

export const supabase = isValid
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null as any;
