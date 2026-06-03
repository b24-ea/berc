import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Avatar } from '@/components/ui/Avatar';
import { StreamChatView } from '@/components/chat/StreamChatView';
import { useAuthStore } from '@/store/authStore';
import { useChat } from '@/features/chat/hooks';
import { formatRunDateTime } from '@/utils/formatters';
import { colors } from '@/constants/colors';
import { MOCK_CHAT_LIST, MOCK_CHAT_MESSAGES } from '@/constants/mockChats';
import { theme } from '@/constants/theme';

export default function ChatDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = useAuthStore((s) => s.user?.id);
  const isDevBypass = useAuthStore((s) => s.isDevBypass);
  const isMockChat = id?.startsWith('chat-mock-') ?? false;
  const { data, isLoading, isError } = useChat(
    isMockChat ? undefined : id,
    isMockChat ? undefined : userId,
  );

  const mockChat = MOCK_CHAT_LIST.find((c) => c.id === id);
  const mockRunId = mockChat?.runId ?? id ?? 'mock-run';
  const mockMessages = id ? MOCK_CHAT_MESSAGES[id] : undefined;

  if (isLoading && !isMockChat) {
    return (
      <Screen className="items-center justify-center">
        <ActivityIndicator color={colors.accent} />
      </Screen>
    );
  }

  if (!data && !mockChat) {
    return (
      <Screen className="items-center justify-center">
        <Text className="text-base text-text-secondary">
          {isError ? 'Chat could not be loaded.' : 'Chat not found.'}
        </Text>
      </Screen>
    );
  }

  const otherUser = data?.otherUser ?? mockChat!.otherUser;
  const run = data?.run ?? {
    id: mockRunId,
    title: mockChat!.runTitle,
    datetime: mockChat!.runDate,
  };

  return (
    <Screen padded={false} className="flex-1">
      <View className="flex-row items-center gap-3 px-4 py-3 border-b border-border bg-background">
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          className="w-9 h-9 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Avatar uri={otherUser.photos?.[0]} name={otherUser.name} size="md" />
        <View className="flex-1">
          <Text className="text-base font-semibold text-text-primary">
            {otherUser.name}
          </Text>
          <Text className="text-sm text-text-secondary" numberOfLines={1}>
            {run.title} · {formatRunDateTime(run.datetime)}
          </Text>
        </View>
        {isDevBypass ? (
          <View
            className="px-2 py-1 rounded-full"
            style={{ backgroundColor: theme.peach }}
          >
            <Text className="text-[10px] font-semibold" style={{ color: theme.brand }}>
              DEV
            </Text>
          </View>
        ) : null}
      </View>

      <StreamChatView
        runId={run.id}
        currentUserId={userId ?? 'mock-self'}
        mockMessages={isMockChat ? mockMessages : undefined}
      />
    </Screen>
  );
}
