import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

export function ChatsTitlePill() {
  return (
    <View className="items-center pt-2 pb-4">
      <View
        className="rounded-full px-10 py-2.5 border"
        style={{
          borderColor: theme.brand,
          backgroundColor: colors.white,
        }}
      >
        <Text className="text-[22px] font-bold" style={{ color: theme.brand }}>
          Chats
        </Text>
      </View>
    </View>
  );
}

export function ChatsEndHint() {
  return (
    <View className="items-center px-8 pt-8 pb-6">
      <Ionicons name="chatbubble-outline" size={32} color={theme.brand} />
      <Text className="text-base font-semibold text-text-primary text-center mt-4">
        No more chats.
      </Text>
      <Text className="text-sm text-center mt-2 leading-5" style={{ color: colors.textSecondary }}>
        Accept a run request to start talking.
      </Text>
    </View>
  );
}
