import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { enterDevMode } from '@/utils/devBypass';
import { cn } from '@/utils/cn';

interface DevBypassButtonProps {
  variant?: 'light' | 'dark';
}

export function DevBypassButton({ variant = 'light' }: DevBypassButtonProps) {
  const router = useRouter();

  if (!__DEV__) return null;

  const handlePress = () => {
    enterDevMode();
    router.replace('/(tabs)/feed');
  };

  const isDark = variant === 'dark';

  return (
    <Pressable
      onPress={handlePress}
      className={cn(
        'py-3 items-center border border-dashed rounded-2xl',
        isDark ? 'border-white/40' : 'border-border mt-6',
      )}
    >
      <Text
        className={cn(
          'text-sm font-medium',
          isDark ? 'text-white/80' : 'text-text-secondary',
        )}
      >
        Developer: Skip login →
      </Text>
    </Pressable>
  );
}
