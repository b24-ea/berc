import { supabase } from '@/services/supabase/client';
import { uploadMultipleImages } from '@/services/supabase/storage';
import type { OnboardingData } from '@/types/app';
import type { UserRow } from '@/types/database';

export async function completeOnboarding(
  userId: string,
  data: OnboardingData,
  name: string,
  age?: number,
) {
  const photoUrls = await uploadMultipleImages('user-photos', userId, data.photos);

  const { data: profile, error } = await supabase
    .from('users')
    .update({
      name,
      age: age ?? null,
      photos: photoUrls,
      vibe_tags: data.vibeTags,
      bio: data.bio || null,
      city: data.city,
      discovery_radius: data.discoveryRadius,
      weekly_km: data.weeklyKm ?? null,
      average_pace: data.averagePace ?? null,
      favourite_route: data.favouriteRoute ?? null,
      is_onboarded: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return profile;
}

export async function fetchUserProfile(userId: string): Promise<UserRow> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}
