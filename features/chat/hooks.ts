import { useQuery } from '@tanstack/react-query';
import { fetchChatById, fetchUserChats } from './api';

export function useChats(userId: string | undefined) {
  return useQuery({
    queryKey: ['chats', userId],
    queryFn: () => fetchUserChats(userId!),
    enabled: !!userId,
  });
}

export function useChat(chatId: string | undefined, userId: string | undefined) {
  return useQuery({
    queryKey: ['chat', chatId, userId],
    queryFn: () => fetchChatById(chatId!, userId!),
    enabled: !!chatId && !!userId,
  });
}
