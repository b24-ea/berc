import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  return (
    <AppTopBar
      leftContent={(
        <Pressable
          onPress={onCityPress}
          className="flex-row items-center gap-1.5 rounded-full px-3 py-2"
          style={{ backgroundColor: theme.peach }}
        >
          <Ionicons name="location-sharp" size={14} color={theme.brand} />
          <Text className="text-sm font-semibold" style={{ color: theme.brandDark }}>
            {city || 'City'}
          </Text>
        </Pressable>
      )}
      rightContent={(
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
      )}
      hideRightIcon
    />
  );
}
