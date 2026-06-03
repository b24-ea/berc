import { create } from 'zustand';
import type { FilterId } from '@/types/app';

interface RunsState {
  activeFilter: FilterId;
  setActiveFilter: (filter: FilterId) => void;
}

export const useRunsStore = create<RunsState>((set) => ({
  activeFilter: 'nearby',
  setActiveFilter: (activeFilter) => set({ activeFilter }),
}));
