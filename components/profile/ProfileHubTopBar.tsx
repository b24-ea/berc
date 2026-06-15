import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { AppTopBar } from '@/components/ui/AppTopBar';

interface ProfileHubTopBarProps {
  city: string;
  onSettingsPress?: () => void;
}

export function ProfileHubTopBar({ city, onSettingsPress }: ProfileHubTopBarProps) {
  return (
    <View style={{ backgroundColor: colors.background }}>
      <AppTopBar
        leftContent={(
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="location-sharp" size={15} color={colors.textSecondary} />
            <Text className="text-sm font-medium text-text-secondary">
              {city || 'London'}
            </Text>
          </View>
        )}
        rightContent={(
          <Pressable
            onPress={onSettingsPress}
            hitSlop={10}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="settings-outline" size={24} color={theme.brand} />
          </Pressable>
        )}
        hideRightIcon
      />
      <View className="h-px mx-5" style={{ backgroundColor: colors.border }} />
    </View>
  );
}
