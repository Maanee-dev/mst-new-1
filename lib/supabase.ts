
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Using mock data fallback.');
}

export const supabase = createClient(
  supabaseUrl || 'https://zocncwchaakjtsvlscmd.supabase.co',
  supabaseAnonKey || 'sb_publishable_Ot34P55l4JGe2RjZywLovA_UokWsJ0I'
);
