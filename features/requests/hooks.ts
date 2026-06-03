import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { config } from '@/constants/config';
import {
  acceptRunRequest,
  createRunRequest,
  declineRunRequest,
  fetchIncomingRequests,
} from './api';

export function useCreateRunRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ runId, requesterId }: { runId: string; requesterId: string }) =>
      createRunRequest(runId, requesterId),
    onMutate: async ({ runId }) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}

export function useIncomingRequests(userId: string | undefined) {
  return useQuery({
    queryKey: ['requests', userId],
    queryFn: () => fetchIncomingRequests(userId!),
    enabled: !!userId,
    staleTime: config.requestsStaleTime,
    refetchInterval: config.requestsStaleTime,
  });
}

export function useAcceptRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      requestId: string;
      runId: string;
      creatorId: string;
      requesterId: string;
      runTitle: string;
      runDate: string;
    }) => acceptRunRequest(
      params.requestId,
      params.runId,
      params.creatorId,
      params.requesterId,
      params.runTitle,
      params.runDate,
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}

export function useDeclineRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => declineRunRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}
