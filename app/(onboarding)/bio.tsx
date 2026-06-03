import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { useUserStore } from '@/store/userStore';

export default function OnboardingBio() {
  const router = useRouter();
  const { onboardingDraft, updateOnboardingDraft } = useUserStore();
  const [bio, setBio] = useState(onboardingDraft.bio ?? '');

  const handleNext = () => {
    updateOnboardingDraft({ bio });
    router.push('/(onboarding)/location');
  };

  const handleSkip = () => {
    updateOnboardingDraft({ bio: '' });
    router.push('/(onboarding)/location');
  };

  return (
    <Screen>
      <Text className="text-2xl font-bold text-text-primary mt-4">A little about you</Text>
      <Text className="text-base text-text-secondary mt-2 mb-6">
        Optional — share what makes you, you.
      </Text>

      <TextArea
        placeholder="Tell people a little about yourself..."
        value={bio}
        onChangeText={setBio}
      />

      <View className="flex-1" />
      <Button label="Continue" fullWidth onPress={handleNext} />
      <Pressable onPress={handleSkip} className="mt-4 py-3 items-center">
        <Text className="text-base text-text-secondary">Skip</Text>
      </Pressable>
    </Screen>
  );
}
