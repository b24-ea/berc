import { create } from 'zustand';
import type { FilterId } from '@/types/app';

export type GenderFilter = 'all' | 'women' | 'men';
export type DistanceFilter = 'all' | 'short' | 'medium' | 'long';

interface RunsState {
  activeFilter: FilterId;
  genderFilter: GenderFilter;
  distanceFilter: DistanceFilter;
  setActiveFilter: (filter: FilterId) => void;
  setGenderFilter: (filter: GenderFilter) => void;
  setDistanceFilter: (filter: DistanceFilter) => void;
  resetFeedFilters: () => void;
}

export const useRunsStore = create<RunsState>((set) => ({
  activeFilter: 'nearby',
  genderFilter: 'all',
  distanceFilter: 'all',
  setActiveFilter: (activeFilter) => set({ activeFilter }),
  setGenderFilter: (genderFilter) => set({ genderFilter }),
  setDistanceFilter: (distanceFilter) => set({ distanceFilter }),
  resetFeedFilters: () =>
    set({ activeFilter: 'nearby', genderFilter: 'all', distanceFilter: 'all' }),
}));
