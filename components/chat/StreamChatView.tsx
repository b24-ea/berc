import { useEffect, useState } from 'react';
import { View, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { LocalMessage } from 'stream-chat';
import { getRunChannel } from '@/services/stream/client';
import { ChatBubble } from './ChatBubble';
import { colors } from '@/constants/colors';
import type { MockChatMessage } from '@/constants/mockChats';

interface StreamChatViewProps {
  runId: string;
  currentUserId: string;
  mockMessages?: MockChatMessage[];
}

export function StreamChatView({ runId, currentUserId, mockMessages }: StreamChatViewProps) {
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
        { id: `mock-${Date.now()}`, text: input.trim(), isOwn: true },
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
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 16, flexGrow: 1, justifyContent: 'flex-end' }}
      >
        {mockMessages
          ? localMockMessages.map((item) => (
              <ChatBubble key={item.id} content={item.text} isOwn={item.isOwn} />
            ))
          : orderedMessages.map((item) => (
              <ChatBubble
                key={item.id}
                content={item.text ?? ''}
                isOwn={item.user?.id === currentUserId}
              />
            ))}
      </ScrollView>

      <View className="flex-row items-center gap-2 px-4 py-3 border-t border-border bg-background">
        <Pressable className="p-2">
          <Ionicons name="happy-outline" size={24} color={colors.textSecondary} />
        </Pressable>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Message..."
          placeholderTextColor={colors.muted}
          className="flex-1 bg-card rounded-full px-4 py-2.5 text-base text-text-primary"
          onSubmitEditing={sendMessage}
        />
        <Pressable onPress={sendMessage} className="p-2">
          <Ionicons name="send" size={22} color={colors.accent} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
