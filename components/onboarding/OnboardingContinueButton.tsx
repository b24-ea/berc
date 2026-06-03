import { Pressable, Text, ActivityIndicator } from 'react-native';

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
      className={`w-full py-4 rounded-full items-center justify-center ${
        disabled ? 'bg-[#E8E2D9]' : 'bg-[#E8673A]'
      }`}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text
          className={`text-base font-semibold ${
            disabled ? 'text-[#9A9A9A]' : 'text-white'
          }`}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
