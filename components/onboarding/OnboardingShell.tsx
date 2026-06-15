import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { OnboardingContinueButton } from '@/components/onboarding/OnboardingContinueButton';
import {
  ONBOARDING_STEP_SUBTITLES,
  ONBOARDING_TOTAL_STEPS,
} from '@/constants/onboarding';
import { colors } from '@/constants/colors';

interface OnboardingShellProps {
  step: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  continueLabel?: string;
  continueDisabled?: boolean;
  continueLoading?: boolean;
  onContinue: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

export function OnboardingShell({
  step,
  title,
  subtitle,
  children,
  continueLabel = 'Continue',
  continueDisabled,
  continueLoading,
  onContinue,
  onBack,
  showBack = true,
}: OnboardingShellProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-page">
      <View style={{ paddingTop: insets.top + 8 }} className="px-5">
        <View className="flex-row items-center justify-between mb-3">
          {showBack ? (
            <Pressable
              onPress={onBack ?? (() => router.back())}
              hitSlop={12}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </Pressable>
          ) : (
            <View className="w-10" />
          )}
          <Text className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Step {step} of {ONBOARDING_TOTAL_STEPS}
          </Text>
          <Pressable
            onPress={() => router.replace('/(auth)/welcome')}
            hitSlop={12}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>
        <OnboardingProgressBar currentStep={step} totalSteps={ONBOARDING_TOTAL_STEPS} />
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[28px] font-bold text-text-primary mt-6 leading-9">{title}</Text>
        {subtitle ? (
          <Text className="text-base text-text-secondary mt-2 mb-6 leading-6">{subtitle}</Text>
        ) : (
          <View className="mb-6" />
        )}
        {children}
      </ScrollView>

      <View className="px-5" style={{ paddingBottom: insets.bottom + 16 }}>
        <OnboardingContinueButton
          label={continueLabel}
          disabled={continueDisabled}
          loading={continueLoading}
          onPress={onContinue}
        />
        <Text className="text-sm text-text-secondary text-center mt-3">
          Step {step} of {ONBOARDING_TOTAL_STEPS}: {ONBOARDING_STEP_SUBTITLES[step]}
        </Text>
      </View>
    </View>
  );
}
