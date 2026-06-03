import { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DISCOVERY_RADIUS_OPTIONS } from '@/constants/vibes';
import { useUserStore } from '@/store/userStore';
import { Pressable } from 'react-native';

export default function OnboardingLocation() {
  const router = useRouter();
  const { onboardingDraft, updateOnboardingDraft } = useUserStore();
  const [city, setCity] = useState(onboardingDraft.city ?? '');
  const [radius, setRadius] = useState(onboardingDraft.discoveryRadius ?? 10);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (city.trim().length < 2) {
      setError('Enter your city to find nearby runners.');
      return;
    }
    updateOnboardingDraft({ city: city.trim(), discoveryRadius: radius });
    router.push('/(onboarding)/running-info');
  };

  return (
    <Screen>
      <Text className="text-2xl font-bold text-text-primary mt-4">Where do you run?</Text>
      <Text className="text-base text-text-secondary mt-2 mb-6">
        We'll show you runs nearby.
      </Text>

      <Input
        label="City"
        placeholder="e.g. Amsterdam"
        value={city}
        onChangeText={setCity}
        error={error ?? undefined}
      />

      <Text className="text-sm font-medium text-text-primary mt-6 mb-3">
        Discovery radius
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {DISCOVERY_RADIUS_OPTIONS.map((r) => (
          <Pressable
            key={r}
            onPress={() => setRadius(r)}
            className={`px-5 py-3 rounded-2xl border ${
              radius === r ? 'bg-accent-light border-accent' : 'bg-card border-border'
            }`}
          >
            <Text
              className={`text-base font-medium ${
                radius === r ? 'text-accent' : 'text-text-secondary'
              }`}
            >
              {r} km
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="flex-1" />
      <Button label="Continue" fullWidth onPress={handleNext} />
    </Screen>
  );
}
