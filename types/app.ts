import type { RequestStatus, RunRow, RunStatus, UserRow } from './database';

export type RunWithCreator = RunRow & {
  creator: Pick<UserRow, 'id' | 'name' | 'age' | 'city' | 'photos' | 'vibe_tags'>;
};

export type FeedRun = RunWithCreator & {
  requestStatus?: RequestStatus | null;
  requestId?: string | null;
  distanceKm?: number | null;
};

export type RunCardCTAState =
  | 'default'
  | 'requested'
  | 'accepted'
  | 'expired'
  | 'declined';

export interface OnboardingData {
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  photos: string[];
  runningPhotoIndices: number[];
  vibeTags: string[];
  bio: string;
  city: string;
  discoveryRadius: number;
  weeklyKm?: number;
  averagePace?: string;
  favouriteRoute?: string;
}

export interface CreateRunFormData {
  title: string;
  location: string;
  date: string;
  time: string;
  distance?: number;
  pace?: string;
  vibeTags: string[];
  note?: string;
  imageUri: string;
}

export interface ChatListItem {
  id: string;
  runId: string;
  runTitle: string;
  runDate: string;
  otherUser: Pick<UserRow, 'id' | 'name' | 'photos'>;
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface AuthSession {
  userId: string;
  email?: string;
}

export type FilterId =
  | 'nearby'
  | 'beginner'
  | 'coffee'
  | 'social'
  | 'morning'
  | 'evening'
  | 'long'
  | 'easy';

export interface FeedFilters {
  city: string;
  radius: number;
  activeFilter: FilterId;
}
