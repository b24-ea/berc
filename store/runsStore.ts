import { create } from 'zustand';
import type { FilterId } from '@/types/app';
import type {
  FeedInterestId,
  HeightFilterId,
  RelationshipFilterId,
} from '@/constants/feedFilters';

export type GenderFilter = 'all' | 'women' | 'men';
export type DistanceFilter = 'all' | 'short' | 'medium' | 'long';

interface RunsState {
  activeFilter: FilterId;
  genderFilter: GenderFilter;
  distanceFilter: DistanceFilter;
  interestFilters: FeedInterestId[];
  heightFilter: HeightFilterId;
  relationshipFilter: RelationshipFilterId;
  setActiveFilter: (filter: FilterId) => void;
  setGenderFilter: (filter: GenderFilter) => void;
  setDistanceFilter: (filter: DistanceFilter) => void;
  toggleInterestFilter: (interest: FeedInterestId) => void;
  setHeightFilter: (filter: HeightFilterId) => void;
  setRelationshipFilter: (filter: RelationshipFilterId) => void;
  resetFeedFilters: () => void;
}

const DEFAULT_STATE = {
  activeFilter: 'nearby' as FilterId,
  genderFilter: 'all' as GenderFilter,
  distanceFilter: 'all' as DistanceFilter,
  interestFilters: [] as FeedInterestId[],
  heightFilter: 'all' as HeightFilterId,
  relationshipFilter: 'all' as RelationshipFilterId,
};

export const useRunsStore = create<RunsState>((set) => ({
  ...DEFAULT_STATE,
  setActiveFilter: (activeFilter) => set({ activeFilter }),
  setGenderFilter: (genderFilter) => set({ genderFilter }),
  setDistanceFilter: (distanceFilter) => set({ distanceFilter }),
  toggleInterestFilter: (interest) =>
    set((state) => ({
      interestFilters: state.interestFilters.includes(interest)
        ? state.interestFilters.filter((item) => item !== interest)
        : [...state.interestFilters, interest],
    })),
  setHeightFilter: (heightFilter) => set({ heightFilter }),
  setRelationshipFilter: (relationshipFilter) => set({ relationshipFilter }),
  resetFeedFilters: () => set({ ...DEFAULT_STATE }),
}));
