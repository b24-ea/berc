import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppTopBar } from '@/components/ui/AppTopBar';
import { Avatar } from '@/components/ui/Avatar';
import { StreamChatView } from '@/components/chat/StreamChatView';
import { useAuthStore } from '@/store/authStore';
import { useChat } from '@/features/chat/hooks';
import { colors } from '@/constants/colors';
import { MOCK_CHAT_LIST, MOCK_CHAT_MESSAGES } from '@/constants/mockChats';
import { theme } from '@/constants/theme';
import { getFirstName } from '@/utils/formatters';

export default function ChatDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = useAuthStore((s) => s.user?.id);
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
      <View className="flex-1 bg-page items-center justify-center">
        <ActivityIndicator color={theme.brand} />
      </View>
    );
  }

  if (!data && !mockChat) {
    return (
      <View className="flex-1 bg-page items-center justify-center px-6">
        <Text className="text-base text-text-secondary text-center">
          {isError ? 'Chat could not be loaded.' : 'Chat not found.'}
        </Text>
      </View>
    );
  }

  const otherUser = data?.otherUser ?? mockChat!.otherUser;
  const run = data?.run ?? {
    id: mockRunId,
    title: mockChat!.runTitle,
    datetime: mockChat!.runDate,
  };
  const firstName = getFirstName(otherUser.name);

  return (
    <View className="flex-1 bg-page">
      <View style={{ backgroundColor: colors.background }}>
        <AppTopBar
          leftContent={(
            <Pressable
              onPress={() => router.back()}
              hitSlop={10}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons name="chevron-back" size={24} color={theme.brandDark} />
            </Pressable>
          )}
          rightContent={(
            <Pressable
              onPress={() => router.push(`/user/${otherUser.id}`)}
              className="flex-row items-center gap-2"
            >
              <Text className="text-sm font-semibold" style={{ color: theme.brandDark }}>
                {firstName}
              </Text>
              <Avatar uri={otherUser.photos?.[0]} name={otherUser.name} size="sm" />
            </Pressable>
          )}
          hideRightIcon
        />
      </View>

      <StreamChatView
        runId={run.id}
        runTitle={run.title}
        runDatetime={run.datetime}
        currentUserId={userId ?? 'mock-self'}
        mockMessages={isMockChat ? mockMessages : undefined}
      />
    </View>
  );
}
