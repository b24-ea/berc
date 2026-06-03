import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { AppTopBar } from '@/components/ui/AppTopBar';

interface FeedTopBarProps {
  city: string;
  onCityPress?: () => void;
  onFiltersPress?: () => void;
  filtersActive?: boolean;
}

export function FeedTopBar({
  city,
  onCityPress,
  onFiltersPress,
  filtersActive,
}: FeedTopBarProps) {
  const router = useRouter();

  return (
    <AppTopBar
      leftContent={(
        <Pressable
          onPress={onCityPress}
          className="flex-row items-center gap-1 rounded-full px-3 py-1.5"
          style={{ backgroundColor: theme.peach }}
        >
          <Text className="text-sm font-semibold" style={{ color: theme.brand }}>
            {city || 'City'}
          </Text>
          <Ionicons name="chevron-down" size={14} color={theme.brand} />
        </Pressable>
      )}
      rightContent={(
        <View className="flex-row items-center gap-1">
          <Pressable
            onPress={onFiltersPress}
            hitSlop={10}
            className="w-10 h-10 items-center justify-center rounded-full"
            style={{ backgroundColor: filtersActive ? theme.peach : 'transparent' }}
          >
            <Ionicons
              name="options-outline"
              size={22}
              color={filtersActive ? theme.brand : colors.textPrimary}
            />
          </Pressable>
          <Pressable
            onPress={() => router.push('/invitations')}
            hitSlop={10}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="notifications-outline" size={24} color={theme.brand} />
          </Pressable>
        </View>
      )}
      hideRightIcon
    />
  );
}
