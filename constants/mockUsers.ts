import { MOCK_FEED_RUNS } from '@/constants/mockFeed';
import type { UserRow } from '@/types/database';
import type { RunRow } from '@/types/database';

const BIOS: Record<string, string> = {
  'mock-user-1':
    'Marathoner training for Berlin. I love early morning miles and finding new routes through the city. Looking for consistent partners who enjoy tempo work and post-run coffee.',
  'mock-user-2':
    'Trail lover and weekend long-run specialist. Always up for a chill pace.',
  'mock-user-3':
    'Evening tempo sessions and city loops. Training for my next half marathon.',
  'mock-user-4':
    'Sunrise miles before work. Consistent, friendly, and pace-aware.',
  'mock-user-5':
    'Beginner-friendly pacer who believes every run should feel fun.',
  'mock-user-6':
    'Long-distance grinder. Park loops, river paths, and good conversation.',
  'mock-user-7':
    'Night runner in East London. Social runs with a competitive edge.',
  'mock-user-8':
    'Recovery-run advocate. Easy pace, good vibes, no ego.',
  'mock-user-9':
    'River runner who prefers conversation over pace. Richmond loops at sunrise are my happy place.',
  'mock-user-10':
    'Coffee-run enthusiast. Quick sprints, great playlists, always on time.',
};

const STATS: Record<string, { weekly_km: number; average_pace: string; favourite_route: string }> = {
  'mock-user-1': { weekly_km: 45, average_pace: '5:30', favourite_route: 'Prospect Park Loop' },
  'mock-user-2': { weekly_km: 62, average_pace: '5:35', favourite_route: 'Hampstead Heath' },
  'mock-user-3': { weekly_km: 41, average_pace: '4:58', favourite_route: 'Regent Park' },
  'mock-user-4': { weekly_km: 55, average_pace: '5:05', favourite_route: 'Canary Wharf Loop' },
  'mock-user-5': { weekly_km: 32, average_pace: '5:50', favourite_route: 'Chelsea Embankment' },
  'mock-user-6': { weekly_km: 70, average_pace: '4:48', favourite_route: 'Battersea Park' },
  'mock-user-7': { weekly_km: 44, average_pace: '5:18', favourite_route: 'Shoreditch Loop' },
  'mock-user-8': { weekly_km: 28, average_pace: '6:00', favourite_route: 'Hyde Park' },
  'mock-user-9': { weekly_km: 58, average_pace: '5:02', favourite_route: 'Richmond Riverside' },
  'mock-user-10': { weekly_km: 36, average_pace: '4:42', favourite_route: 'Greenwich Park' },
};

function buildMockUser(creatorId: string): UserRow | null {
  const run = MOCK_FEED_RUNS.find((r) => r.creator_id === creatorId);
  if (!run) return null;

  const stats = STATS[creatorId] ?? { weekly_km: 40, average_pace: '5:20', favourite_route: 'London' };
  const now = new Date().toISOString();

  return {
    id: creatorId,
    name: run.creator.name,
    age: run.creator.age,
    city: run.creator.city,
    bio: BIOS[creatorId] ?? 'Runner in London. Always happy to share the road.',
    photos: [run.creator.photos[0], run.image].filter(Boolean) as string[],
    vibe_tags: run.creator.vibe_tags.length > 0 ? run.creator.vibe_tags : run.vibe_tags.slice(0, 3),
    weekly_km: stats.weekly_km,
    average_pace: stats.average_pace,
    favourite_route: stats.favourite_route,
    run_club: 'berc Crew',
    discovery_radius: 10,
    is_onboarded: true,
    last_active_at: now,
    created_at: now,
    updated_at: now,
  };
}

const users = new Map<string, UserRow>();
for (const run of MOCK_FEED_RUNS) {
  if (!users.has(run.creator_id)) {
    const user = buildMockUser(run.creator_id);
    if (user) users.set(run.creator_id, user);
  }
}

export const MOCK_USERS_BY_ID = users;

export function getMockUserById(userId: string): UserRow | null {
  return MOCK_USERS_BY_ID.get(userId) ?? null;
}

export function getMockRunsForUser(userId: string): RunRow[] {
  return MOCK_FEED_RUNS.filter((r) => r.creator_id === userId).map((r) => ({
    id: r.id,
    creator_id: r.creator_id,
    title: r.title,
    location: r.location,
    datetime: r.datetime,
    distance: r.distance,
    pace: r.pace,
    image: r.image,
    vibe_tags: r.vibe_tags,
    note: r.note,
    status: r.status,
    closed_at: r.closed_at,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }));
}

export function isMockUserId(userId: string): boolean {
  return userId.startsWith('mock-user-');
}
