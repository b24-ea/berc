import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import { useCompleteOnboarding } from '@/features/onboarding/hooks';

export default function OnboardingRunningInfo() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { onboardingDraft, updateOnboardingDraft, clearOnboardingDraft, setProfile } =
    useUserStore();
  const completeOnboarding = useCompleteOnboarding();

  const [weeklyKm, setWeeklyKm] = useState('');
  const [pace, setPace] = useState('');
  const [route, setRoute] = useState('');

  const finish = async (skip = false) => {
    if (!user) return;

    const data = {
      photos: onboardingDraft.photos ?? [],
      runningPhotoIndices: onboardingDraft.runningPhotoIndices ?? [],
      vibeTags: onboardingDraft.vibeTags ?? [],
      bio: onboardingDraft.bio ?? '',
      city: onboardingDraft.city ?? '',
      discoveryRadius: onboardingDraft.discoveryRadius ?? 10,
      weeklyKm: skip ? undefined : weeklyKm ? Number(weeklyKm) : undefined,
      averagePace: skip ? undefined : pace || undefined,
      favouriteRoute: skip ? undefined : route || undefined,
    };

    const profile = await completeOnboarding.mutateAsync({
      userId: user.id,
      data,
      name: user.user_metadata?.name ?? 'Runner',
    });

    setProfile(profile);
    clearOnboardingDraft();
    router.replace('/(tabs)/feed');
  };

  const handleNext = () => {
    updateOnboardingDraft({
      weeklyKm: weeklyKm ? Number(weeklyKm) : undefined,
      averagePace: pace,
      favouriteRoute: route,
    });
    finish(false);
  };

  return (
    <Screen>
      <Text className="text-2xl font-bold text-text-primary mt-4">Running info</Text>
      <Text className="text-base text-text-secondary mt-2 mb-6">
        Optional — helps others know your pace.
      </Text>

      <View className="gap-4">
        <Input
          label="Weekly km"
          placeholder="e.g. 25"
          keyboardType="numeric"
          value={weeklyKm}
          onChangeText={setWeeklyKm}
        />
        <Input
          label="Average pace (min/km)"
          placeholder="e.g. 5:30"
          value={pace}
          onChangeText={setPace}
        />
        <Input
          label="Favourite route"
          placeholder="e.g. Vondelpark loop"
          value={route}
          onChangeText={setRoute}
        />
      </View>

      <View className="flex-1" />
      <Button
        label="Finish"
        fullWidth
        loading={completeOnboarding.isPending}
        onPress={handleNext}
      />
      <Pressable onPress={() => finish(true)} className="mt-4 py-3 items-center">
        <Text className="text-base text-text-secondary">Skip</Text>
      </Pressable>
    </Screen>
  );
}
