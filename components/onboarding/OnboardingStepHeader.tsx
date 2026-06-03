import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';

interface OnboardingStepHeaderProps {
  step: number;
  totalSteps?: number;
  onBack?: () => void;
}

export function OnboardingStepHeader({
  step,
  totalSteps = 6,
  onBack,
}: OnboardingStepHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top + 8 }}>
      <View className="flex-row items-center justify-between px-1 mb-3">
        <Pressable
          onPress={onBack ?? (() => router.back())}
          hitSlop={12}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text className="text-[11px] font-semibold tracking-[2px] text-text-secondary uppercase">
          Step {step} of {totalSteps}
        </Text>
        <View className="w-10" />
      </View>
      <View className="h-px bg-border mx-1" />
    </View>
  );
}
