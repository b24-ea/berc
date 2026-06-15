import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import type { LocalMessage } from 'stream-chat';
import { getRunChannel } from '@/services/stream/client';
import { ChatBubble, ChatDateSeparator } from './ChatBubble';
import { ChatRunCard } from './ChatRunCard';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';
import type { MockChatMessage } from '@/constants/mockChats';

interface StreamChatViewProps {
  runId: string;
  runTitle: string;
  runDatetime: string;
  currentUserId: string;
  mockMessages?: MockChatMessage[];
}

export function StreamChatView({
  runId,
  runTitle,
  runDatetime,
  currentUserId,
  mockMessages,
}: StreamChatViewProps) {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [localMockMessages, setLocalMockMessages] = useState<MockChatMessage[]>(
    mockMessages ?? [],
  );
  const [input, setInput] = useState('');

  useEffect(() => {
    if (mockMessages) {
      setLocalMockMessages(mockMessages);
      return;
    }

    const channel = getRunChannel(runId);

    const load = async () => {
      await channel.watch();
      setMessages([...channel.state.messages]);
    };

    load();

    const handler = channel.on('message.new', (event) => {
      if (event.message) {
        setMessages((prev) => [...prev, event.message as unknown as LocalMessage]);
      }
    });

    return () => {
      handler.unsubscribe();
    };
  }, [runId, mockMessages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (mockMessages) {
      setLocalMockMessages((prev) => [
        ...prev,
        {
          id: `mock-${Date.now()}`,
          text: input.trim(),
          isOwn: true,
          timeLabel: format(new Date(), 'h:mm a'),
        },
      ]);
      setInput('');
      return;
    }

    const channel = getRunChannel(runId);
    await channel.sendMessage({ text: input.trim() });
    setInput('');
  };

  const orderedMessages = [...messages].reverse();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-page"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
    >
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <ChatRunCard title={runTitle} datetime={runDatetime} />

        {mockMessages
          ? localMockMessages.map((item) => (
              <View key={item.id}>
                {item.dateSeparator ? (
                  <ChatDateSeparator label={item.dateSeparator} />
                ) : null}
                <ChatBubble
                  content={item.text}
                  isOwn={item.isOwn}
                  timeLabel={item.timeLabel}
                />
              </View>
            ))
          : orderedMessages.map((item) => (
              <ChatBubble
                key={item.id}
                content={item.text ?? ''}
                isOwn={item.user?.id === currentUserId}
                timeLabel={
                  item.created_at
                    ? format(new Date(item.created_at), 'h:mm a')
                    : undefined
                }
              />
            ))}
      </ScrollView>

      <View
        className="flex-row items-center gap-2.5 px-4 py-3 border-t border-border"
        style={{ backgroundColor: colors.background }}
      >
        <Pressable
          className="w-10 h-10 rounded-full items-center justify-center border"
          style={{ borderColor: colors.border, backgroundColor: colors.white }}
        >
          <Ionicons name="add" size={22} color={theme.brandDark} />
        </Pressable>

        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor={colors.muted}
          className="flex-1 rounded-full px-4 py-3 text-[15px] text-text-primary"
          style={{ backgroundColor: theme.peach }}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />

        <Pressable
          onPress={sendMessage}
          disabled={!input.trim()}
          className="flex-row items-center gap-1.5 rounded-full px-4 py-3"
          style={{
            backgroundColor: input.trim() ? theme.brandDark : theme.cardMuted,
          }}
        >
          <Text className="text-sm font-bold text-white">Send</Text>
          <Ionicons name="paper-plane" size={16} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
