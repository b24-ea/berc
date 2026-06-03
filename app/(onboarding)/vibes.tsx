import { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { OnboardingVibeTags } from '@/components/onboarding/OnboardingVibeTags';
import { OnboardingContinueButton } from '@/components/onboarding/OnboardingContinueButton';
import { config } from '@/constants/config';
import { useUserStore } from '@/store/userStore';

export default function OnboardingVibes() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { onboardingDraft, updateOnboardingDraft } = useUserStore();
  const [tags, setTags] = useState<string[]>(onboardingDraft.vibeTags ?? []);

  const canContinue = tags.length >= config.minVibeTags;

  const handleNext = () => {
    if (!canContinue) return;
    updateOnboardingDraft({ vibeTags: tags });
    router.push('/(onboarding)/bio');
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom + 16 }}>
      <OnboardingProgressBar currentStep={3} totalSteps={4} />

      <View className="px-5 flex-1">
        <Text className="text-[28px] font-bold text-text-primary mt-8 leading-9">
          What kind of runner are you?
        </Text>
        <Text className="text-base text-text-secondary mt-2 mb-8 leading-6">
          Pick at least 2 that feel like you.
        </Text>

        <OnboardingVibeTags selected={tags} onChange={setTags} />

        <View className="flex-1" />

        <OnboardingContinueButton
          disabled={!canContinue}
          onPress={handleNext}
        />

        <Text className="text-sm text-text-secondary text-center mt-4 mb-2">
          You can change these anytime in your profile.
        </Text>
      </View>
    </View>
  );
}
