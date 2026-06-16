import { MOCK_FEED_RUNS } from '@/constants/mockFeed';

export interface MatchListItem {
  id: string;
  userId: string;
  name: string;
  age?: number | null;
  city?: string | null;
  photo?: string | null;
  runTitle: string;
  timeLabel: string;
}

const MATCH_USER_IDS = ['mock-user-1', 'mock-user-9', 'mock-user-4'] as const;
const TIME_LABELS = ['2d ago', 'Yesterday', 'Mon'];

function buildMatch(userId: string, index: number): MatchListItem | null {
  const run = MOCK_FEED_RUNS.find((r) => r.creator_id === userId);
  if (!run) return null;

  return {
    id: `match-${userId}`,
    userId,
    name: run.creator.name,
    age: run.creator.age,
    city: run.creator.city,
    photo: run.creator.photos?.[0] ?? null,
    runTitle: run.title,
    timeLabel: TIME_LABELS[index] ?? 'Recently',
  };
}

export const MOCK_MATCHES: MatchListItem[] = MATCH_USER_IDS.flatMap((userId, index) => {
  const item = buildMatch(userId, index);
  return item ? [item] : [];
});
