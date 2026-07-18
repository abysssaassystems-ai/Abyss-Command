import { createBrowserClient } from '@supabase/ssr';

// This client automatically syncs its auth state with cookies for Next.js Middleware
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);