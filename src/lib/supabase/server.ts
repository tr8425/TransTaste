import { createClient } from '@supabase/supabase-js';

/**
 * Service-role client for trusted server code only. There is no anon-key
 * fallback: with the anon key, RLS would silently reject server writes.
 */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Supabase server client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Resolves the Supabase user from a `Authorization: Bearer <access token>` header. */
export async function getUserFromRequest(req: Request) {
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) return null;
  const { data, error } = await createServerClient().auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}
