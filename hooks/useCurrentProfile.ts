import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useUserProfile } from '@/features/onboarding/hooks';
import { isSupabaseConfigured } from '@/services/supabase/client';
import { DEV_MOCK_PROFILE } from '@/utils/devBypass';
import type { UserRow } from '@/types/database';

export function useCurrentProfile() {
  const userId = useAuthStore((s) => s.user?.id);
  const isDevBypass = useAuthStore((s) => s.isDevBypass);
  const storeProfile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);

  const shouldFetch = Boolean(userId && isSupabaseConfigured && !isDevBypass);

  const { data: fetchedProfile, isLoading, refetch } = useUserProfile(
    shouldFetch ? userId : undefined,
  );

  useEffect(() => {
    if (fetchedProfile) {
      setProfile(fetchedProfile);
    }
  }, [fetchedProfile, setProfile]);

  let profile: UserRow | null = storeProfile ?? fetchedProfile ?? null;

  if (isDevBypass) {
    profile = storeProfile ?? DEV_MOCK_PROFILE;
  } else if (!profile && userId && !isSupabaseConfigured && __DEV__) {
    profile = DEV_MOCK_PROFILE;
  }

  return {
    profile,
    isLoading: shouldFetch && isLoading && !profile,
    refetch,
  };
}
