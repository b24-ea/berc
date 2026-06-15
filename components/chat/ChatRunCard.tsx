import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatRunEventLine } from '@/utils/formatters';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

interface ChatRunCardProps {
  title: string;
  datetime: string;
  onPress?: () => void;
}

export function ChatRunCard({ title, datetime, onPress }: ChatRunCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-2xl p-3.5 mb-4"
      style={{
        backgroundColor: theme.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        className="rounded-xl items-center justify-center"
        style={{
          width: 44,
          height: 44,
          backgroundColor: theme.cardMuted,
        }}
      >
        <Ionicons name="map-outline" size={22} color={theme.brandDark} />
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-base font-bold text-text-primary">{title}</Text>
        <Text className="text-sm text-text-secondary mt-0.5">
          {formatRunEventLine(datetime)}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}
