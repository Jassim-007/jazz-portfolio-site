import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = supabaseUrl && supabasePublishableKey
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;

export async function loadPortfolioMedia(kind) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('portfolio_media')
    .select('id, kind, title, description, alt_text, storage_path, cover_path, youtube_id, sort_order')
    .eq('kind', kind)
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return (data || []).map((item) => ({
    ...item,
    src: item.storage_path
      ? supabase.storage.from('portfolio-media').getPublicUrl(item.storage_path).data.publicUrl
      : '',
    cover_src: item.cover_path
      ? supabase.storage.from('portfolio-media').getPublicUrl(item.cover_path).data.publicUrl
      : '',
    alt: item.alt_text || item.title,
  }));
}
