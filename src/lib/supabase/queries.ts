import { supabase } from './client';

// User settings
export async function getUserSettings(userId: string) {
  const { data } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  return data;
}

export async function updateUserSettings(userId: string, settings: {
  output_language?: string;
  menu_language?: string;
  allergen_preset?: string[];
  dietary_beliefs?: string[];
}) {
  return supabase
    .from('user_settings')
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
}

// Credits
export async function getUserCredits(userId: string) {
  const { data } = await supabase
    .from('users')
    .select('credits_remaining')
    .eq('id', userId)
    .single();
  return data?.credits_remaining ?? 0;
}

export async function deductCredit(userId: string) {
  const credits = await getUserCredits(userId);
  if (credits <= 0) return false;
  await supabase
    .from('users')
    .update({ credits_remaining: credits - 1 })
    .eq('id', userId);
  return true;
}

export async function addCredits(userId: string, amount: number) {
  const credits = await getUserCredits(userId);
  return supabase
    .from('users')
    .update({ credits_remaining: credits + amount })
    .eq('id', userId);
}

// Active pass check
export async function getActivePass(userId: string) {
  const { data } = await supabase
    .from('passes')
    .select('*')
    .eq('user_id', userId)
    .gte('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: false })
    .limit(1)
    .single();
  return data;
}

// Scan history
export async function saveScanHistory(userId: string, entry: {
  dish_hash: string;
  menu_language: string;
  restaurant_type: string;
  items_count: number;
  result_preview: object;
}) {
  return supabase.from('scan_history').insert({ user_id: userId, ...entry });
}

export async function getScanHistory(userId: string, limit = 20) {
  const { data } = await supabase
    .from('scan_history')
    .select('*')
    .eq('user_id', userId)
    .order('scanned_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}
