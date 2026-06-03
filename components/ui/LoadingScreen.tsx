import { View, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/colors';

export function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}
