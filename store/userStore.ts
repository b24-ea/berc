import { create } from 'zustand';
import type { UserRow } from '@/types/database';
import type { OnboardingData } from '@/types/app';

interface UserState {
  profile: UserRow | null;
  onboardingDraft: Partial<OnboardingData>;
  feedCity: string;
  feedRadius: number;
  setProfile: (profile: UserRow | null) => void;
  updateOnboardingDraft: (data: Partial<OnboardingData>) => void;
  clearOnboardingDraft: () => void;
  setFeedFilters: (city: string, radius: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  onboardingDraft: {},
  feedCity: '',
  feedRadius: 10,
  setProfile: (profile) =>
    set((state) => ({
      profile,
      feedCity: profile?.city ?? state.feedCity,
      feedRadius: profile?.discovery_radius ?? state.feedRadius,
    })),
  updateOnboardingDraft: (data) =>
    set((state) => ({
      onboardingDraft: { ...state.onboardingDraft, ...data },
    })),
  clearOnboardingDraft: () => set({ onboardingDraft: {} }),
  setFeedFilters: (feedCity, feedRadius) => set({ feedCity, feedRadius }),
}));
