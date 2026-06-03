import { supabase } from '@/services/supabase/client';
import type { ChatListItem } from '@/types/app';
import type { ChatRow, RunRow, UserRow } from '@/types/database';

type ChatWithRelations = ChatRow & {
  run: Pick<RunRow, 'id' | 'title' | 'datetime' | 'location'>;
  user1: Pick<UserRow, 'id' | 'name' | 'photos'>;
  user2: Pick<UserRow, 'id' | 'name' | 'photos'>;
};

export async function fetchUserChats(userId: string): Promise<ChatListItem[]> {
  const { data, error } = await supabase
    .from('chats')
    .select(
      `
      *,
      run:runs!run_id (id, title, datetime),
      user1:users!user_1 (id, name, photos),
      user2:users!user_2 (id, name, photos)
    `,
    )
    .or(`user_1.eq.${userId},user_2.eq.${userId}`)
    .order('last_message_at', { ascending: false, nullsFirst: false });

  if (error) throw error;

  return ((data ?? []) as ChatWithRelations[]).map((chat) => {
    const otherUser = chat.user1.id === userId ? chat.user2 : chat.user1;

    return {
      id: chat.id,
      runId: chat.run.id,
      runTitle: chat.run.title,
      runDate: chat.run.datetime,
      otherUser,
      lastMessageAt: chat.last_message_at ?? undefined,
    };
  });
}

export async function fetchChatById(chatId: string, userId: string) {
  const { data, error } = await supabase
    .from('chats')
    .select(
      `
      *,
      run:runs!run_id (id, title, datetime, location),
      user1:users!user_1 (id, name, photos),
      user2:users!user_2 (id, name, photos)
    `,
    )
    .eq('id', chatId)
    .single();

  if (error) throw error;

  const chat = data as ChatWithRelations;
  const otherUser = chat.user1.id === userId ? chat.user2 : chat.user1;

  return { chat, otherUser, run: chat.run };
}
