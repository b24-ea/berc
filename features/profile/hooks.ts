import { useMutation } from '@tanstack/react-query';
import { updateProfile } from './api';
import type { UserUpdate } from '@/types/database';

export function useUpdateProfile() {
  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: UserUpdate }) =>
      updateProfile(userId, updates),
  });
}
