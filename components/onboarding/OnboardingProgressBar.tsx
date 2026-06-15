import { View } from 'react-native';

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export function OnboardingProgressBar({
  currentStep,
  totalSteps = 4,
}: OnboardingProgressBarProps) {
  return (
    <View className="flex-row gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <View
          key={i}
          className="h-1 flex-1 rounded-full"
          style={{ backgroundColor: i < currentStep ? '#A53D13' : '#EEEDE9' }}
        />
      ))}
    </View>
  );
}
