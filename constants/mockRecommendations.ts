import { MOCK_FEED_RUNS } from '@/constants/mockFeed';
import type { FeedRun } from '@/types/app';

export type RecommendedRunner = {
  run: FeedRun;
  reason: string;
  prompt: string;
  answer: string;
};

const STANDOUT_ORDER = ['mock-user-9', 'mock-user-1', 'mock-user-3', 'mock-user-5'] as const;

const STANDOUTS: Record<
  string,
  { reason: string; prompt: string; answer: string }
> = {
  'mock-user-9': {
    reason: "Today's pick",
    prompt: 'My ideal run',
    answer: '8k along the river, no watch, real conversation',
  },
  'mock-user-1': {
    reason: 'Similar pace',
    prompt: 'My ideal run',
    answer: 'Sunrise miles with tempo work and post-run coffee.',
  },
  'mock-user-3': {
    reason: 'Training match',
    prompt: 'Currently training for',
    answer: 'A half marathon — evening tempo sessions are my thing.',
  },
  'mock-user-5': {
    reason: 'Great vibe match',
    prompt: 'What I love about running',
    answer: 'Keeping it beginner-friendly and ending with a flat white.',
  },
};

export const MOCK_RECOMMENDATIONS: RecommendedRunner[] = STANDOUT_ORDER.map(
  (creatorId) => {
    const run = MOCK_FEED_RUNS.find((r) => r.creator_id === creatorId);
    const standout = STANDOUTS[creatorId];
    if (!run || !standout) return null;
    return { run, ...standout };
  },
).filter((item): item is RecommendedRunner => item !== null);
