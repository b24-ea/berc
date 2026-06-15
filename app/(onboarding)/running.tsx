import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { ONBOARDING_STEPS } from '@/constants/onboarding';
import { DISCOVERY_RADIUS_OPTIONS } from '@/constants/vibes';
import { theme } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import { useCompleteOnboarding } from '@/features/onboarding/hooks';
import { isSupabaseConfigured } from '@/services/supabase/client';
import { finishLocalOnboarding } from '@/utils/devBypass';
import { onboardingLocationSchema } from '@/utils/validators';
import type { OnboardingData } from '@/types/app';

export default function OnboardingRunningScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { onboardingDraft, updateOnboardingDraft, clearOnboardingDraft, setProfile } =
    useUserStore();
  const completeOnboarding = useCompleteOnboarding();

  const [city, setCity] = useState(onboardingDraft.city ?? '');
  const [radius, setRadius] = useState(onboardingDraft.discoveryRadius ?? 10);
  const [weeklyKm, setWeeklyKm] = useState(
    onboardingDraft.weeklyKm?.toString() ?? '',
  );
  const [pace, setPace] = useState(onboardingDraft.averagePace ?? '');
  const [route, setRoute] = useState(onboardingDraft.favouriteRoute ?? '');
  const [bio, setBio] = useState(onboardingDraft.bio ?? '');
  const [error, setError] = useState<string | null>(null);

  const buildData = (): OnboardingData => ({
    firstName: onboardingDraft.firstName,
    lastName: onboardingDraft.lastName,
    email: onboardingDraft.email,
    gender: onboardingDraft.gender,
    photos: onboardingDraft.photos ?? [],
    runningPhotoIndices: onboardingDraft.runningPhotoIndices ?? [0],
    vibeTags: onboardingDraft.vibeTags ?? [],
    bio: bio.trim(),
    city: city.trim(),
    discoveryRadius: radius,
    weeklyKm: weeklyKm ? Number(weeklyKm) : undefined,
    averagePace: pace.trim() || undefined,
    favouriteRoute: route.trim() || undefined,
  });

  const finish = async (skipOptional = false) => {
    const parsed = onboardingLocationSchema.safeParse({
      city: city.trim(),
      discoveryRadius: radius,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Enter your city');
      return;
    }
    setError(null);

    const data = buildData();
    if (skipOptional) {
      data.weeklyKm = undefined;
      data.averagePace = undefined;
      data.favouriteRoute = undefined;
    }

    updateOnboardingDraft(data);

    if (!isSupabaseConfigured) {
      finishLocalOnboarding(data);
      clearOnboardingDraft();
      router.replace('/(tabs)/feed');
      return;
    }

    if (!user) return;

    const name =
      [onboardingDraft.firstName, onboardingDraft.lastName].filter(Boolean).join(' ').trim() ||
      (user.user_metadata?.name as string | undefined) ||
      'Runner';

    const profile = await completeOnboarding.mutateAsync({
      userId: user.id,
      data,
      name,
    });

    setProfile(profile);
    clearOnboardingDraft();
    router.replace('/(tabs)/feed');
  };

  return (
    <OnboardingShell
      step={ONBOARDING_STEPS.running}
      title="Your running profile"
      subtitle="Help others know where and how you run. City is required — the rest is optional."
      continueLabel="Finish"
      onContinue={() => finish(false)}
      continueLoading={completeOnboarding.isPending}
    >
      <View className="gap-4">
        <Input
          variant="auth"
          label="City"
          placeholder="Where do you usually run?"
          value={city}
          onChangeText={setCity}
          error={error ?? undefined}
        />

        <View>
          <Text className="text-sm font-medium text-text-secondary mb-2">
            Discovery radius (km)
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {DISCOVERY_RADIUS_OPTIONS.map((option) => {
              const selected = radius === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setRadius(option)}
                  className="rounded-full px-4 py-2.5 border"
                  style={{
                    borderColor: selected ? theme.brand : '#E7E2DD',
                    backgroundColor: selected ? theme.brand : '#fff',
                  }}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: selected ? '#fff' : '#3D2E28' }}
                  >
                    {option} km
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Input
          variant="auth"
          label="Weekly km (optional)"
          placeholder="e.g. 25"
          keyboardType="numeric"
          value={weeklyKm}
          onChangeText={setWeeklyKm}
        />
        <Input
          variant="auth"
          label="Average pace (optional)"
          placeholder="e.g. 5:30 /km"
          value={pace}
          onChangeText={setPace}
        />
        <Input
          variant="auth"
          label="Favourite route (optional)"
          placeholder="e.g. Thames Path loop"
          value={route}
          onChangeText={setRoute}
        />
        <TextArea
          label="About your running (optional)"
          placeholder="What are you training for? What does a good run look like for you?"
          value={bio}
          onChangeText={setBio}
          maxLength={300}
        />

        <Pressable onPress={() => finish(true)} className="py-2 items-center">
          <Text className="text-base text-text-secondary">Skip optional fields</Text>
        </Pressable>
      </View>
    </OnboardingShell>
  );
}
