import type { FeedInterestId, RelationshipGoal } from '@/constants/feedFilters';

export interface MockCreatorFilterMeta {
  heightCm: number;
  relationshipGoal: RelationshipGoal;
  interests: FeedInterestId[];
}

export const MOCK_CREATOR_FILTER_META: Record<string, MockCreatorFilterMeta> = {
  'mock-user-1': {
    heightCm: 168,
    relationshipGoal: 'long_term',
    interests: ['run', 'marathon', 'training'],
  },
  'mock-user-2': {
    heightCm: 182,
    relationshipGoal: 'just_training',
    interests: ['run', 'social', 'training'],
  },
  'mock-user-3': {
    heightCm: 172,
    relationshipGoal: 'short_term',
    interests: ['run', 'marathon', 'training'],
  },
  'mock-user-4': {
    heightCm: 178,
    relationshipGoal: 'life_partner',
    interests: ['run', 'ironman', 'training'],
  },
  'mock-user-5': {
    heightCm: 163,
    relationshipGoal: 'short_term',
    interests: ['run', 'social'],
  },
  'mock-user-6': {
    heightCm: 188,
    relationshipGoal: 'long_term',
    interests: ['run', 'marathon', 'ironman'],
  },
  'mock-user-7': {
    heightCm: 170,
    relationshipGoal: 'short_term',
    interests: ['run', 'hyrox', 'training'],
  },
  'mock-user-8': {
    heightCm: 176,
    relationshipGoal: 'just_training',
    interests: ['run', 'social', 'training'],
  },
  'mock-user-9': {
    heightCm: 180,
    relationshipGoal: 'life_partner',
    interests: ['run', 'marathon', 'social'],
  },
  'mock-user-10': {
    heightCm: 174,
    relationshipGoal: 'just_training',
    interests: ['run', 'hyrox', 'training'],
  },
};

export function getMockCreatorFilterMeta(creatorId: string): MockCreatorFilterMeta | null {
  return MOCK_CREATOR_FILTER_META[creatorId] ?? null;
}
