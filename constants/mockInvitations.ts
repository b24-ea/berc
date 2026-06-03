import { MOCK_FEED_RUNS } from '@/constants/mockFeed';

export type InvitationDirection = 'received' | 'sent';

export interface InvitationListItem {
  id: string;
  userId: string;
  name: string;
  age?: number | null;
  city?: string | null;
  photo?: string | null;
  vibe?: string | null;
  runTitle: string;
  direction: InvitationDirection;
  status: 'pending' | 'accepted';
  timeLabel: string;
}

const RECEIVED_FROM = ['mock-user-2', 'mock-user-4', 'mock-user-6'];
const SENT_TO = ['mock-user-1', 'mock-user-3', 'mock-user-5'];

function buildItem(
  userId: string,
  direction: InvitationDirection,
  status: 'pending' | 'accepted',
  timeLabel: string,
): InvitationListItem | null {
  const run = MOCK_FEED_RUNS.find((r) => r.creator_id === userId);
  if (!run) return null;
  return {
    id: `${direction}-${userId}`,
    userId,
    name: run.creator.name,
    age: run.creator.age,
    city: run.creator.city,
    photo: run.creator.photos?.[0] ?? null,
    vibe: run.creator.vibe_tags?.[0] ?? null,
    runTitle: run.title,
    direction,
    status,
    timeLabel,
  };
}

export const MOCK_RECEIVED_INVITATIONS: InvitationListItem[] = RECEIVED_FROM.map((id, i) =>
  buildItem(id, 'received', i === 0 ? 'pending' : 'accepted', i === 0 ? '2h ago' : i === 1 ? 'Yesterday' : 'Mon'),
).filter((item): item is InvitationListItem => item != null);

export const MOCK_SENT_INVITATIONS: InvitationListItem[] = SENT_TO.map((id, i) =>
  buildItem(id, 'sent', 'pending', i === 0 ? 'Today' : i === 1 ? 'Yesterday' : 'Mon'),
).filter((item): item is InvitationListItem => item != null);
