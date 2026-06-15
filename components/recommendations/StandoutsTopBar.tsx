import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { AppTopBar } from '@/components/ui/AppTopBar';

interface StandoutsTopBarProps {
  city: string;
  onCityPress?: () => void;
}

export function StandoutsTopBar({ city, onCityPress }: StandoutsTopBarProps) {
  const router = useRouter();

  return (
    <AppTopBar
      leftContent={(
        <Pressable
          onPress={onCityPress}
          className="flex-row items-center gap-1.5"
        >
          <Ionicons name="location-sharp" size={15} color={colors.textSecondary} />
          <Text className="text-sm font-medium text-text-secondary">
            {city || 'London'}
          </Text>
        </Pressable>
      )}
      rightContent={(
        <Pressable
          onPress={() => router.push('/invitations')}
          hitSlop={10}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="notifications-outline" size={24} color={theme.brand} />
        </Pressable>
      )}
      hideRightIcon
    />
  );
}
