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
    <View className="flex-row gap-2 px-5 pt-4">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <View
          key={i}
          className={`h-1 flex-1 rounded-full ${
            i < currentStep ? 'bg-[#A53D13]' : 'bg-border'
          }`}
        />
      ))}
    </View>
  );
}
