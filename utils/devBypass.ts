import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { MOCK_PROFILE_PHOTOS } from '@/constants/mockFeed';
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

export function enterDevMode() {
  const auth = useAuthStore.getState();
  auth.setDevBypass(true);
  auth.setUser({
    id: DEV_USER_ID,
    email: 'dev@runr.local',
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
