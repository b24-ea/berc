import { useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { RunnerProfileView } from '@/components/profile/RunnerProfileView';
import { useAuthStore } from '@/store/authStore';
import { useCurrentProfile } from '@/hooks/useCurrentProfile';
import { useUserRuns } from '@/features/runs/hooks';
import { getMockRunsForUser, isMockUserId } from '@/constants/mockUsers';
import { MOCK_FEED_RUNS } from '@/constants/mockFeed';
import { isSupabaseConfigured } from '@/services/supabase/client';
import type { RunRow } from '@/types/database';
import { View } from 'react-native';

function mapFeedRunToRunRow(run: (typeof MOCK_FEED_RUNS)[number]): RunRow {
  return {
    id: run.id,
    creator_id: run.creator_id,
    title: run.title,
    location: run.location,
    datetime: run.datetime,
    distance: run.distance,
    pace: run.pace,
    image: run.image,
    vibe_tags: run.vibe_tags,
    note: run.note,
    status: run.status,
    closed_at: run.closed_at,
    created_at: run.created_at,
    updated_at: run.updated_at,
  };
}

export default function RunnerProfileScreen() {
  const router = useRouter();
  const isDevBypass = useAuthStore((s) => s.isDevBypass);
  const { profile, isLoading, refetch } = useCurrentProfile();
  const shouldFetchRuns = Boolean(profile && !isMockUserId(profile.id) && isSupabaseConfigured);
  const { data: fetchedRuns } = useUserRuns(shouldFetchRuns ? profile?.id : undefined);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const runs: RunRow[] = useMemo(() => {
    if (!profile) return [];
    if (isMockUserId(profile.id)) return getMockRunsForUser(profile.id);
    if (isDevBypass) {
      return MOCK_FEED_RUNS.slice(0, 2).map(mapFeedRunToRunRow);
    }
    return fetchedRuns ?? [];
  }, [profile, isDevBypass, fetchedRuns]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!profile) {
    return (
      <View className="flex-1 bg-page">
        <EmptyState
          title="Profile unavailable"
          subtitle="Sign in to view your runner profile."
        />
      </View>
    );
  }

  return (
    <RunnerProfileView
      user={profile}
      runs={runs}
      isOwnProfile
      onBack={() => router.back()}
      onEdit={() => router.push('/(tabs)/profile/edit')}
    />
  );
}
