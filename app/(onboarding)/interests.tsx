import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import { InterestTagSelector } from '@/components/onboarding/InterestTagSelector';
import { ONBOARDING_STEPS } from '@/constants/onboarding';
import { config } from '@/constants/config';
import { useUserStore } from '@/store/userStore';

export default function OnboardingInterestsScreen() {
  const router = useRouter();
  const { onboardingDraft, updateOnboardingDraft } = useUserStore();
  const [selected, setSelected] = useState<string[]>(onboardingDraft.vibeTags ?? []);

  const canContinue = selected.length >= config.minVibeTags;

  const handleContinue = () => {
    if (!canContinue) return;
    updateOnboardingDraft({ vibeTags: selected });
    router.push('/(onboarding)/photos' as Href);
  };

  return (
    <OnboardingShell
      step={ONBOARDING_STEPS.interests}
      title="What are you into?"
      subtitle="Pick a few tags that describe how you like to run. This helps us find your people."
      onContinue={handleContinue}
      continueDisabled={!canContinue}
    >
      <InterestTagSelector selected={selected} onChange={setSelected} />
    </OnboardingShell>
  );
}
