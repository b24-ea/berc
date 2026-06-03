import { useMutation, useQuery } from '@tanstack/react-query';
import { completeOnboarding, fetchUserProfile } from './api';
import type { OnboardingData } from '@/types/app';
import type { UserRow } from '@/types/database';

export function useCompleteOnboarding() {
  return useMutation({
    mutationFn: ({
      userId,
      data,
      name,
      age,
    }: {
      userId: string;
      data: OnboardingData;
      name: string;
      age?: number;
    }) => completeOnboarding(userId, data, name, age),
  });
}

export function useUserProfile(userId: string | undefined) {
  return useQuery<UserRow>({
    queryKey: ['profile', userId],
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId,
  });
}
