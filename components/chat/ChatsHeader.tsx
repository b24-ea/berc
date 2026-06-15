import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

export function ChatsTitlePill() {
  return (
    <View className="items-center pt-2 pb-4">
      <View
        className="rounded-full px-10 py-2.5 border"
        style={{
          borderColor: theme.brand,
          backgroundColor: theme.peach,
        }}
      >
        <Text className="text-[22px] font-bold" style={{ color: theme.brandDark }}>
          Chats
        </Text>
      </View>
    </View>
  );
}

export function ChatsEndHint() {
  return (
    <View className="items-center px-8 pt-8 pb-6">
      <Ionicons
        name="chatbubble-outline"
        size={32}
        color={theme.brandDark}
        style={{ opacity: 0.45 }}
      />
      <Text
        className="text-center text-[15px] leading-6 mt-4"
        style={{ color: theme.brandDark }}
      >
        No more chats. Accept a run request to start talking.
      </Text>
    </View>
  );
}
