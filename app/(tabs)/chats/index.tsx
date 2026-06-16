import { useMemo, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '@/components/ui/EmptyState';
import { ChatListItemRow, ChatRequestRow } from '@/components/chat/ChatListItem';
import { ChatsTitlePill, ChatsEndHint } from '@/components/chat/ChatsHeader';
import { ChatsSegmentControl, type ChatsTab } from '@/components/chat/ChatsSegmentControl';
import { StandoutsTopBar } from '@/components/recommendations/StandoutsTopBar';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useChats } from '@/features/chat/hooks';
import {
  useIncomingRequests,
  useAcceptRequest,
  useDeclineRequest,
} from '@/features/requests/hooks';
import type { IncomingRequest } from '@/features/requests/api';
import type { ChatListItem } from '@/types/app';
import { MOCK_CHAT_LIST } from '@/constants/mockChats';
import { notifications } from '@/hooks/useNotifications';
import { getFirstName, formatRunDateTime } from '@/utils/formatters';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

export default function ChatsScreen() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const isDevBypass = useAuthStore((s) => s.isDevBypass);
  const profile = useUserStore((s) => s.profile);
  const feedCity = useUserStore((s) => s.feedCity);
  const { data: chats, isLoading, isError } = useChats(isDevBypass ? undefined : userId);
  const { data: requests, isLoading: requestsLoading } = useIncomingRequests(userId);
  const acceptRequest = useAcceptRequest();
  const declineRequest = useDeclineRequest();
  const [activeTab, setActiveTab] = useState<ChatsTab>('chats');

  const displayCity = feedCity || profile?.city || 'London';

  const hasRealChats = (chats?.length ?? 0) > 0;
  const displayChats = useMemo(() => {
    if (hasRealChats) return chats ?? [];
    if (__DEV__ || isDevBypass) return MOCK_CHAT_LIST;
    return [];
  }, [hasRealChats, chats, isDevBypass]);

  const handleAccept = async (req: IncomingRequest) => {
    if (!userId) return;
    await acceptRequest.mutateAsync({
      requestId: req.id,
      runId: req.run_id,
      creatorId: userId,
      requesterId: req.requester_id,
      runTitle: req.run.title,
      runDate: req.run.datetime,
    });
    await notifications.requestAccepted(getFirstName(req.requester.name));
  };

  const renderChatsTab = () => {
    if (isLoading && !isDevBypass) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={theme.brand} />
        </View>
      );
    }

    if (isError && !isDevBypass) {
      return (
        <EmptyState
          title="Could not load chats"
          subtitle="Pull to refresh after signing in again."
        />
      );
    }

    if (displayChats.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="chatbubble-outline" size={32} color={theme.brand} />
          <Text className="text-base font-semibold text-text-primary text-center mt-4">
            No more chats.
          </Text>
          <Text
            className="text-sm text-center mt-2 leading-5"
            style={{ color: colors.textSecondary }}
          >
            Accept a run request to start talking.
          </Text>
        </View>
      );
    }

    return (
      <FlashList
        data={displayChats}
        keyExtractor={(item) => item.id}
        style={{ flex: 1, backgroundColor: colors.page }}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListFooterComponent={<ChatsEndHint />}
        renderItem={({ item }) => {
          const mockItem = item as ChatListItem & {
            preview?: string;
            timeLabel?: string;
            unread?: boolean;
          };
          return (
            <ChatListItemRow
              item={item}
              preview={mockItem.preview}
              timeLabel={mockItem.timeLabel}
              unread={mockItem.unread}
              onPress={() => router.push(`/(tabs)/chats/${item.id}`)}
            />
          );
        }}
      />
    );
  };

  const renderRequestsTab = () => {
    if (requestsLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={theme.brand} />
        </View>
      );
    }

    if (!requests?.length) {
      return (
        <EmptyState
          title="No requests yet"
          subtitle="When someone wants to join your run, they'll show up here."
        />
      );
    }

    return (
      <FlashList
        data={requests as IncomingRequest[]}
        keyExtractor={(item) => item.id}
        style={{ flex: 1, backgroundColor: colors.page }}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <ChatRequestRow
            name={item.requester.name}
            photo={item.requester.photos?.[0]}
            runTitle={item.run.title}
            runDate={formatRunDateTime(item.run.datetime)}
            onAccept={() => handleAccept(item)}
            onDecline={() => declineRequest.mutate(item.id)}
            acceptLoading={acceptRequest.isPending}
            declineLoading={declineRequest.isPending}
          />
        )}
      />
    );
  };

  return (
    <View className="flex-1 bg-page">
      <StandoutsTopBar city={displayCity} />
      <ChatsTitlePill />
      <ChatsSegmentControl active={activeTab} onChange={setActiveTab} />

      <View className="flex-1">
        {activeTab === 'chats' ? renderChatsTab() : renderRequestsTab()}
      </View>
    </View>
  );
}
