import { useCallback, useMemo, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { EmptyState } from '@/components/ui/EmptyState';
import { FeedTopBar } from '@/components/feed/FeedTopBar';
import { FeeldFeedCard } from '@/components/feed/FeeldFeedCard';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useRunsStore } from '@/store/runsStore';
import { useFeedRuns } from '@/features/runs/hooks';
import { useCreateRunRequest } from '@/features/requests/hooks';
import { useChats } from '@/features/chat/hooks';
import { MOCK_FEED_RUNS } from '@/constants/mockFeed';
import type { FeedRun } from '@/types/app';
import { theme } from '@/constants/theme';

export default function FeedScreen() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const isDevBypass = useAuthStore((s) => s.isDevBypass);
  const profile = useUserStore((s) => s.profile);
  const { feedCity, feedRadius } = useUserStore();
  const { activeFilter, genderFilter, distanceFilter } = useRunsStore();
  const createRequest = useCreateRunRequest();
  const { data: chats } = useChats(isDevBypass ? undefined : userId);
  const [mockRequestStatus, setMockRequestStatus] = useState<Record<string, FeedRun['requestStatus']>>({});
  const [reviewedRunIds, setReviewedRunIds] = useState<string[]>([]);

  const MOCK_GENDER_BY_CREATOR: Record<string, 'women' | 'men'> = {
    'mock-user-1': 'women',
    'mock-user-2': 'men',
    'mock-user-3': 'women',
    'mock-user-4': 'men',
    'mock-user-5': 'women',
    'mock-user-6': 'men',
    'mock-user-7': 'women',
    'mock-user-8': 'men',
    'mock-user-9': 'women',
    'mock-user-10': 'men',
  };

  const filters = useMemo(
    () => ({
      city: feedCity || profile?.city || 'Brooklyn',
      radius: feedRadius,
      activeFilter,
    }),
    [feedCity, feedRadius, activeFilter, profile?.city],
  );

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useFeedRuns(isDevBypass ? undefined : userId, filters);

  const apiRuns = useMemo(() => data?.pages.flatMap((p) => p.runs) ?? [], [data]);

  const runs: FeedRun[] = useMemo(() => {
    const sourceRuns =
      isDevBypass || (__DEV__ && apiRuns.length === 0 && !isLoading)
        ? MOCK_FEED_RUNS
        : apiRuns;

    const filtered = sourceRuns.filter((run) => {
      if (reviewedRunIds.includes(run.id)) return false;

      const lowerTags = run.vibe_tags.map((t) => t.toLowerCase());

      const matchesCategory = (() => {
        if (activeFilter === 'nearby') return true;
        switch (activeFilter) {
          case 'beginner':
            return lowerTags.some((t) => t.includes('beginner'));
          case 'coffee':
            return lowerTags.some((t) => t.includes('coffee'));
          case 'social':
            return lowerTags.some((t) => t.includes('social'));
          case 'morning':
            return lowerTags.some((t) => t.includes('morning'));
          case 'evening':
            return lowerTags.some((t) => t.includes('evening'));
          case 'long':
            return lowerTags.some((t) => t.includes('long'));
          case 'easy':
            return lowerTags.some((t) => t.includes('easy') || t.includes('chill'));
          default:
            return true;
        }
      })();

      const matchesGender = (() => {
        if (genderFilter === 'all') return true;
        const creatorGender = MOCK_GENDER_BY_CREATOR[run.creator_id];
        if (!creatorGender) return true;
        return creatorGender === genderFilter;
      })();

      const matchesDistance = (() => {
        if (distanceFilter === 'all') return true;
        const km = run.distance ?? 0;
        if (distanceFilter === 'short') return km > 0 && km <= 6;
        if (distanceFilter === 'medium') return km > 6 && km <= 10;
        return km > 10;
      })();

      return matchesCategory && matchesGender && matchesDistance;
    });

    return filtered.map((run) => ({
      ...run,
      requestStatus: mockRequestStatus[run.id] ?? run.requestStatus,
    }));
  }, [
    isDevBypass,
    apiRuns,
    isLoading,
    activeFilter,
    genderFilter,
    distanceFilter,
    mockRequestStatus,
    reviewedRunIds,
  ]);

  const currentRun = runs[0] ?? null;

  const displayCity = feedCity || profile?.city || 'Brooklyn';
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilter !== 'nearby') count += 1;
    if (genderFilter !== 'all') count += 1;
    if (distanceFilter !== 'all') count += 1;
    if (feedRadius !== 10) count += 1;
    return count;
  }, [activeFilter, genderFilter, distanceFilter, feedRadius]);

  const advanceToNext = useCallback((run: FeedRun) => {
    setReviewedRunIds((prev) => (prev.includes(run.id) ? prev : [...prev, run.id]));
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  const handleJoin = useCallback(
    (run: FeedRun) => {
      if (!userId && !isDevBypass) return;
      const isMockRun = run.id.startsWith('mock-');
      if (isMockRun || isDevBypass) {
        setMockRequestStatus((prev) => ({ ...prev, [run.id]: 'pending' }));
        return;
      }
      createRequest.mutate(
        { runId: run.id, requesterId: userId! },
        {
          onSuccess: () => {
            setMockRequestStatus((prev) => ({ ...prev, [run.id]: 'pending' }));
          },
        },
      );
    },
    [userId, isDevBypass, createRequest],
  );

  const handleOpenChat = useCallback(
    (run: FeedRun) => {
      if (run.id.startsWith('mock-')) {
        router.push('/(tabs)/chats/chat-mock-1');
        return;
      }
      const chat = chats?.find((c) => c.runId === run.id);
      if (chat) router.push(`/(tabs)/chats/${chat.id}`);
    },
    [chats, router],
  );

  return (
    <View className="flex-1 bg-page">
      <FeedTopBar
        city={displayCity}
        onFiltersPress={() => router.push('/feed-filters')}
        filtersActive={activeFilterCount > 0}
      />

      {isLoading && !isDevBypass ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={theme.brand} />
        </View>
      ) : isError && !isDevBypass ? (
        <EmptyState
          title="Something went wrong"
          subtitle="Pull to refresh and try again."
        />
      ) : !currentRun ? (
        <EmptyState
          title={
            reviewedRunIds.length > 0
              ? 'You reviewed everyone for now'
              : activeFilter !== 'nearby'
                ? 'No runs match your filters'
                : 'No runs nearby yet'
          }
          subtitle={
            reviewedRunIds.length > 0
              ? 'Check People to discover more runners.'
              : 'Try adjusting filters or post your own run.'
          }
        />
      ) : (
        <FeeldFeedCard
          key={currentRun.id}
          run={currentRun}
          onJoin={handleJoin}
          onOpenChat={handleOpenChat}
          onAdvance={advanceToNext}
        />
      )}

      {isRefetching ? (
        <View className="absolute top-24 self-center">
          <ActivityIndicator color={theme.brand} size="small" />
        </View>
      ) : null}
    </View>
  );
}
