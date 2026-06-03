import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { config } from '@/constants/config';
import { createRun, fetchFeedRuns, fetchRunById, fetchUserRuns } from './api';
import type { CreateRunFormData, FeedFilters } from '@/types/app';

export function useFeedRuns(userId: string | undefined, filters: FeedFilters) {
  return useInfiniteQuery({
    queryKey: ['feed', userId, filters],
    queryFn: ({ pageParam = 0 }) =>
      fetchFeedRuns({ userId: userId!, filters, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    enabled: !!userId,
    staleTime: config.feedStaleTime,
  });
}

export function useCreateRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: CreateRunFormData }) =>
      createRun(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['user-runs'] });
    },
  });
}

export function useUserRuns(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-runs', userId],
    queryFn: () => fetchUserRuns(userId!),
    enabled: !!userId,
  });
}

export function useRun(runId: string | undefined) {
  return useQuery({
    queryKey: ['run', runId],
    queryFn: () => fetchRunById(runId!),
    enabled: !!runId,
  });
}
