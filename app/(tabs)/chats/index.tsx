import { useMemo, useState } from 'react';
import { View, ActivityIndicator, Text, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { EmptyState } from '@/components/ui/EmptyState';
import { ChatListItemRow } from '@/components/chat/ChatListItem';
import { AppTopBar } from '@/components/ui/AppTopBar';
import { useAuthStore } from '@/store/authStore';
import { useChats } from '@/features/chat/hooks';
import type { ChatListItem } from '@/types/app';
import { MOCK_CHAT_LIST } from '@/constants/mockChats';
import { theme } from '@/constants/theme';

export default function ChatsScreen() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const isDevBypass = useAuthStore((s) => s.isDevBypass);
  const { data: chats, isLoading, isError } = useChats(isDevBypass ? undefined : userId);
  const [showEmptyDemo, setShowEmptyDemo] = useState(false);

  const hasRealChats = (chats?.length ?? 0) > 0;
  const displayChats = useMemo(() => {
    if (showEmptyDemo) return [];
    if (hasRealChats) return chats ?? [];
    if (__DEV__ || isDevBypass) return MOCK_CHAT_LIST;
    return [];
  }, [showEmptyDemo, hasRealChats, chats, isDevBypass]);

  return (
    <View className="flex-1 bg-background">
      <AppTopBar onRightIconPress={() => router.push('/invitations')} />
      <View className="h-px bg-border" />
      <Text className="text-[46px] font-bold text-text-primary px-5 mt-8 mb-5">Chats</Text>

      {isLoading && !isDevBypass ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={theme.brand} />
        </View>
      ) : isError && !isDevBypass ? (
        <EmptyState
          title="Could not load chats"
          subtitle="Pull to refresh after signing in again."
        />
      ) : (
        <View className="flex-1">
          {displayChats.length === 0 ? (
            <EmptyState
              title="No chats yet."
              subtitle="Accept a run request to start talking."
            />
          ) : (
            <FlashList
              data={displayChats}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              renderItem={({ item }) => {
                const mockItem = item as (ChatListItem & {
                  subtitle?: string;
                  preview?: string;
                  timeLabel?: string;
                  unread?: boolean;
                });
                return (
                  <ChatListItemRow
                    item={item}
                    subtitle={mockItem.subtitle}
                    preview={mockItem.preview}
                    timeLabel={mockItem.timeLabel}
                    unread={mockItem.unread}
                    onPress={() => router.push(`/(tabs)/chats/${item.id}`)}
                  />
                );
              }}
            />
          )}

          {__DEV__ && (
            <Pressable
              onPress={() => setShowEmptyDemo((s) => !s)}
              className="self-center mb-8 mt-2 px-5 py-3 rounded-full border border-border"
            >
              <Text className="text-sm text-text-secondary">
                Toggle Empty State Demo
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
