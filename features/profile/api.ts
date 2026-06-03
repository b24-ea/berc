import { supabase } from '@/services/supabase/client';
import { uploadMultipleImages } from '@/services/supabase/storage';
import type { UserUpdate } from '@/types/database';

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: UserUpdate) {
  const { data, error } = await supabase
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfilePhotos(userId: string, localUris: string[]) {
  const urls = await uploadMultipleImages('user-photos', userId, localUris);
  return updateProfile(userId, { photos: urls });
}
