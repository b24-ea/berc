import { Pressable, Text, ActivityIndicator } from 'react-native';
import { theme } from '@/constants/theme';

interface OnboardingContinueButtonProps {
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
}

export function OnboardingContinueButton({
  label = 'Continue',
  disabled = false,
  loading = false,
  onPress,
}: OnboardingContinueButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className="w-full h-[52px] rounded-full items-center justify-center"
      style={{ backgroundColor: disabled ? '#E8E2D9' : theme.brand }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text
          className="text-base font-bold"
          style={{ color: disabled ? '#9A9A9A' : '#fff' }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
