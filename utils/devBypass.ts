import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { MOCK_PROFILE_PHOTOS } from '@/constants/mockFeed';
import type { OnboardingData } from '@/types/app';
import type { UserRow } from '@/types/database';

export const DEV_USER_ID = '00000000-0000-0000-0000-000000000001';

export const DEV_MOCK_PROFILE: UserRow = {
  id: DEV_USER_ID,
  name: 'Sarah Mitchell',
  age: 28,
  city: 'London',
  bio:
    'Marathoner, morning coffee enthusiast, and trail seeker. I run for the silence and the stories. Currently training for the Thames Path Ultra. Let\'s hit the miles!',
  photos: MOCK_PROFILE_PHOTOS,
  vibe_tags: ['Trail Run', 'Marathoner', 'Social'],
  weekly_km: 52.4,
  average_pace: '4:55',
  favourite_route: 'Thames Path',
  run_club: 'Elite Club',
  discovery_radius: 10,
  is_onboarded: true,
  last_active_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function finishLocalOnboarding(draft: Partial<OnboardingData>) {
  const name =
    [draft.firstName, draft.lastName].filter(Boolean).join(' ').trim() ||
    DEV_MOCK_PROFILE.name;

  const profile: UserRow = {
    ...DEV_MOCK_PROFILE,
    name,
    photos: draft.photos?.length ? draft.photos : DEV_MOCK_PROFILE.photos,
    vibe_tags: draft.vibeTags?.length ? draft.vibeTags : DEV_MOCK_PROFILE.vibe_tags,
    city: draft.city ?? DEV_MOCK_PROFILE.city,
    bio: draft.bio ?? DEV_MOCK_PROFILE.bio,
    weekly_km: draft.weeklyKm ?? DEV_MOCK_PROFILE.weekly_km,
    average_pace: draft.averagePace ?? DEV_MOCK_PROFILE.average_pace,
    favourite_route: draft.favouriteRoute ?? DEV_MOCK_PROFILE.favourite_route,
    discovery_radius: draft.discoveryRadius ?? DEV_MOCK_PROFILE.discovery_radius,
    is_onboarded: true,
    updated_at: new Date().toISOString(),
  };

  const auth = useAuthStore.getState();
  auth.setDevBypass(true);
  auth.setUser({
    id: DEV_USER_ID,
    email: draft.email ?? 'dev@berc.local',
    app_metadata: {},
    user_metadata: { name },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  });
  auth.setLoading(false);

  const userStore = useUserStore.getState();
  userStore.setProfile(profile);
  userStore.setFeedFilters(profile.city ?? 'London', profile.discovery_radius);
}

export function enterDevMode() {
  const auth = useAuthStore.getState();
  auth.setDevBypass(true);
  auth.setUser({
    id: DEV_USER_ID,
    email: 'dev@berc.local',
    app_metadata: {},
    user_metadata: { name: DEV_MOCK_PROFILE.name },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  });
  auth.setLoading(false);
  const userStore = useUserStore.getState();
  userStore.setProfile(DEV_MOCK_PROFILE);
  userStore.setFeedFilters('London', 10);
}

export function exitDevMode() {
  useAuthStore.getState().setDevBypass(false);
  useAuthStore.getState().reset();
  useUserStore.getState().setProfile(null);
}
