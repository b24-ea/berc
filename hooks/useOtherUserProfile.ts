import { useMemo } from 'react';
import { useUserProfile } from '@/features/onboarding/hooks';
import { useUserRuns } from '@/features/runs/hooks';
import { getMockUserById, getMockRunsForUser, isMockUserId } from '@/constants/mockUsers';
import { isSupabaseConfigured } from '@/services/supabase/client';
import type { RunRow, UserRow } from '@/types/database';

export function useOtherUserProfile(userId: string | undefined) {
  const isMock = Boolean(userId && isMockUserId(userId));
  const mockUser = userId && isMock ? getMockUserById(userId) : null;
  const mockRuns = userId && isMock ? getMockRunsForUser(userId) : [];

  const shouldFetch = Boolean(userId && !isMock && isSupabaseConfigured);

  const { data: fetchedUser, isLoading: userLoading, isError } = useUserProfile(
    shouldFetch ? userId : undefined,
  );
  const { data: fetchedRuns, isLoading: runsLoading } = useUserRuns(
    shouldFetch ? userId : undefined,
  );

  const profile: UserRow | null = useMemo(() => {
    if (mockUser) return mockUser;
    return fetchedUser ?? null;
  }, [mockUser, fetchedUser]);

  const runs: RunRow[] = useMemo(() => {
    if (isMock) return mockRuns;
    return fetchedRuns ?? [];
  }, [isMock, mockRuns, fetchedRuns]);

  return {
    profile,
    runs,
    isLoading: shouldFetch && (userLoading || runsLoading) && !profile,
    isError: shouldFetch && isError && !profile,
    isMock,
  };
}
