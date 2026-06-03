export type RunStatus = 'open' | 'closed' | 'expired';
export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'expired';

export interface UserRow {
  id: string;
  name: string;
  age: number | null;
  city: string | null;
  bio: string | null;
  photos: string[];
  vibe_tags: string[];
  weekly_km: number | null;
  average_pace: string | null;
  favourite_route: string | null;
  run_club: string | null;
  discovery_radius: number;
  is_onboarded: boolean;
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
}

export type UserInsert = {
  id: string;
  name: string;
  age?: number | null;
  city?: string | null;
  bio?: string | null;
  photos?: string[];
  vibe_tags?: string[];
  weekly_km?: number | null;
  average_pace?: string | null;
  favourite_route?: string | null;
  run_club?: string | null;
  discovery_radius?: number;
  is_onboarded?: boolean;
  last_active_at?: string | null;
};

export type UserUpdate = Partial<Omit<UserRow, 'id' | 'created_at'>>;

export interface RunRow {
  id: string;
  creator_id: string;
  title: string;
  location: string;
  datetime: string;
  distance: number | null;
  pace: string | null;
  image: string;
  vibe_tags: string[];
  note: string | null;
  status: RunStatus;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type RunInsert = {
  creator_id: string;
  title: string;
  location: string;
  datetime: string;
  image: string;
  distance?: number | null;
  pace?: string | null;
  vibe_tags?: string[];
  note?: string | null;
  status?: RunStatus;
};

export type RunUpdate = Partial<Omit<RunRow, 'id' | 'creator_id' | 'created_at'>>;

export interface RunRequestRow {
  id: string;
  run_id: string;
  requester_id: string;
  status: RequestStatus;
  expires_at: string;
  created_at: string;
}

export type RunRequestInsert = {
  run_id: string;
  requester_id: string;
};

export type RunRequestUpdate = {
  status?: RequestStatus;
};

export interface ChatRow {
  id: string;
  run_id: string;
  user_1: string;
  user_2: string;
  last_message_at: string | null;
  created_at: string;
}

export type ChatInsert = {
  run_id: string;
  user_1: string;
  user_2: string;
};

export type ChatUpdate = {
  last_message_at?: string | null;
};

export interface MessageRow {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export type MessageInsert = {
  chat_id: string;
  sender_id: string;
  content: string;
};

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: UserInsert;
        Update: UserUpdate;
        Relationships: [];
      };
      runs: {
        Row: RunRow;
        Insert: RunInsert;
        Update: RunUpdate;
        Relationships: [];
      };
      run_requests: {
        Row: RunRequestRow;
        Insert: RunRequestInsert;
        Update: RunRequestUpdate;
        Relationships: [];
      };
      chats: {
        Row: ChatRow;
        Insert: ChatInsert;
        Update: ChatUpdate;
        Relationships: [];
      };
      messages: {
        Row: MessageRow;
        Insert: MessageInsert;
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
