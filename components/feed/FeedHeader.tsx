import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Wordmark } from '@/components/ui/Wordmark';
import { colors } from '@/constants/colors';

interface FeedHeaderProps {
  onFilterPress?: () => void;
}

export function FeedHeader({ onFilterPress }: FeedHeaderProps) {
  return (
    <View className="flex-row items-center justify-between py-4">
      <Wordmark />
      <Pressable
        onPress={onFilterPress}
        className="w-10 h-10 rounded-full bg-card items-center justify-center"
        hitSlop={8}
      >
        <Ionicons name="options-outline" size={20} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}
