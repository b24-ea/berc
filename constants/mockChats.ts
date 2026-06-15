import type { ChatListItem } from '@/types/app';

export type ChatListItemPreview = ChatListItem & {
  preview: string;
  timeLabel: string;
  unread?: boolean;
};

const MAYA_RUN_DATE = '2025-10-24T06:30:00.000Z';

export const MOCK_CHAT_LIST: ChatListItemPreview[] = [
  {
    id: 'chat-mock-1',
    runId: 'mock-run-1',
    runTitle: 'Prospect Park Loop',
    runDate: MAYA_RUN_DATE,
    otherUser: {
      id: 'mock-user-1',
      name: 'Maya',
      photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'],
    },
    lastMessage: "I'll bring the recovery gels for after the run if you want one.",
    lastMessageAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    preview: "I'll bring the recovery gels for aft...",
    timeLabel: '2m ago',
    unread: true,
  },
  {
    id: 'chat-mock-2',
    runId: 'mock-run-9',
    runTitle: 'Richmond Riverside',
    runDate: new Date(Date.now() + 86400000).toISOString(),
    otherUser: {
      id: 'mock-user-9',
      name: 'Daniel',
      photos: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200'],
    },
    lastMessage: 'River path at 6:30 still works for you?',
    lastMessageAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    preview: 'River path at 6:30 still works for you?',
    timeLabel: '15m ago',
  },
  {
    id: 'chat-mock-3',
    runId: 'mock-run-3',
    runTitle: "Regent's Park Tempo",
    runDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    otherUser: {
      id: 'mock-user-3',
      name: 'Priya',
      photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200'],
    },
    lastMessage: 'Easy pace for the first 3k, then we pick it up.',
    lastMessageAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    preview: 'Easy pace for the first 3k, then we pick it up.',
    timeLabel: '3h ago',
  },
];

export interface MockChatMessage {
  id: string;
  text: string;
  isOwn: boolean;
  timeLabel?: string;
  dateSeparator?: string;
}

export const MOCK_CHAT_MESSAGES: Record<string, MockChatMessage[]> = {
  'chat-mock-1': [
    {
      id: 'm1',
      text: 'Still on for Thursday morning?',
      isOwn: false,
      timeLabel: '10:42 AM',
      dateSeparator: 'Today',
    },
    {
      id: 'm2',
      text: 'Yes — Prospect Park loop at 6:30.',
      isOwn: true,
      timeLabel: '10:45 AM',
    },
    {
      id: 'm3',
      text: "I'll bring the recovery gels for after the run if you want one.",
      isOwn: false,
      timeLabel: '2m ago',
    },
  ],
  'chat-mock-2': [
    {
      id: 'm4',
      text: 'River path at 6:30 still works for you?',
      isOwn: false,
      timeLabel: '9:15 AM',
      dateSeparator: 'Today',
    },
    {
      id: 'm5',
      text: 'Perfect. Meet by the bridge.',
      isOwn: true,
      timeLabel: '9:18 AM',
    },
  ],
  'chat-mock-3': [
    {
      id: 'm6',
      text: 'Easy pace for the first 3k, then we pick it up.',
      isOwn: false,
      timeLabel: '8:02 AM',
      dateSeparator: 'Today',
    },
    {
      id: 'm7',
      text: 'Sounds good to me.',
      isOwn: true,
      timeLabel: '8:05 AM',
    },
  ],
};
