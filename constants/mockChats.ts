import type { ChatListItem } from '@/types/app';

export type ChatListItemPreview = ChatListItem & {
  subtitle: string;
  preview: string;
  timeLabel: string;
  unread?: boolean;
};

const now = new Date();

export const MOCK_CHAT_LIST: ChatListItemPreview[] = [
  {
    id: 'chat-mock-1',
    runId: 'run-mock-1',
    runTitle: 'Sunset Trail Run',
    runDate: now.toISOString(),
    otherUser: {
      id: 'mock-chat-user-1',
      name: 'Alex Rivers',
      photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'],
    },
    lastMessage: 'Just arrived at the trailhead. Meet by the north entrance?',
    lastMessageAt: now.toISOString(),
    subtitle: 'Sunset Trail Run — Griffith Park',
    preview: 'Just arrived at the trailhead. M...',
    timeLabel: '09:41 AM',
    unread: true,
  },
  {
    id: 'chat-mock-2',
    runId: 'run-mock-2',
    runTitle: 'Interval Training',
    runDate: new Date(now.getTime() - 86400000).toISOString(),
    otherUser: {
      id: 'mock-chat-user-2',
      name: 'Marcus Chen',
      photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'],
    },
    lastMessage: 'Great session today! Your pace was super consistent.',
    lastMessageAt: new Date(now.getTime() - 86400000).toISOString(),
    subtitle: 'Interval Training — Downtown Track',
    preview: 'Great session today! Your pace w...',
    timeLabel: 'Yesterday',
  },
  {
    id: 'chat-mock-3',
    runId: 'run-mock-3',
    runTitle: 'Morning Tempo',
    runDate: new Date(now.getTime() - 2 * 86400000).toISOString(),
    otherUser: {
      id: 'mock-chat-user-3',
      name: 'Sienna Watts',
      photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200'],
    },
    lastMessage: 'See you at 6:30 AM?',
    lastMessageAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
    subtitle: 'Morning Tempo — Ocean Drive',
    preview: 'See you at 6:30 AM?',
    timeLabel: 'Mon',
  },
];

export interface MockChatMessage {
  id: string;
  text: string;
  isOwn: boolean;
}

export const MOCK_CHAT_MESSAGES: Record<string, MockChatMessage[]> = {
  'chat-mock-1': [
    { id: 'm1', text: 'Hey! Are you close?', isOwn: false },
    { id: 'm2', text: 'Yep, 5 mins away.', isOwn: true },
    { id: 'm3', text: 'Great, meet by the north entrance.', isOwn: false },
  ],
  'chat-mock-2': [
    { id: 'm4', text: 'Great session today!', isOwn: false },
    { id: 'm5', text: 'Thanks! Loved the interval set.', isOwn: true },
    { id: 'm6', text: 'Let’s do tempo next Tuesday?', isOwn: false },
  ],
  'chat-mock-3': [
    { id: 'm7', text: 'See you at 6:30 AM?', isOwn: false },
    { id: 'm8', text: 'Perfect, I’ll be there.', isOwn: true },
  ],
};
