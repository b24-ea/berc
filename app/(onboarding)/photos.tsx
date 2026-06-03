import { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingStepHeader } from '@/components/onboarding/OnboardingStepHeader';
import { OnboardingPhotoGrid } from '@/components/onboarding/OnboardingPhotoGrid';
import { OnboardingContinueButton } from '@/components/onboarding/OnboardingContinueButton';
import { ONBOARDING_STEPS } from '@/constants/onboarding';
import { config } from '@/constants/config';
import { useUserStore } from '@/store/userStore';
import { requestNotificationPermissions } from '@/hooks/useNotifications';

const RUNNING_SLOT = 0;

export default function OnboardingPhotos() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { onboardingDraft, updateOnboardingDraft } = useUserStore();
  const [photos, setPhotos] = useState<(string | undefined)[]>(() => {
    const existing = onboardingDraft.photos ?? [];
    return [0, 1, 2, 3].map((i) => existing[i]);
  });

  const filledCount = photos.filter(Boolean).length;
  const hasRunningPhoto = Boolean(photos[RUNNING_SLOT]);
  const canContinue = filledCount >= config.minPhotos && hasRunningPhoto;

  const pickForSlot = async (slotIndex: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (!result.canceled) {
      setPhotos((prev) => {
        const next = [...prev];
        next[slotIndex] = result.assets[0].uri;
        return next;
      });
    }
  };

  const handleNext = async () => {
    if (!canContinue) return;
    const photoUrls = photos.filter((p): p is string => Boolean(p));
    updateOnboardingDraft({
      photos: photoUrls,
      runningPhotoIndices: [RUNNING_SLOT],
    });
    await requestNotificationPermissions();
    router.push('/(onboarding)/vibes');
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom + 16 }}>
      <View className="px-5">
        <OnboardingStepHeader step={ONBOARDING_STEPS.photos} />

        <Text className="text-[28px] font-bold text-text-primary mt-6 leading-9">
          Add your photos
        </Text>
        <Text className="text-base text-text-secondary mt-2 mb-6 leading-6">
          At least 4 photos — include one running photo.
        </Text>

        <OnboardingPhotoGrid
          photos={photos.map((p) => p ?? '')}
          runningSlotIndex={RUNNING_SLOT}
          onSlotPress={pickForSlot}
        />

        <View className="flex-row items-center gap-2 mt-6">
          <Ionicons name="information-circle-outline" size={18} color="#8B3213" />
          <Text className="text-sm font-medium text-[#8B3213]">
            Add at least 4 photos to continue
          </Text>
        </View>
      </View>

      <View className="flex-1" />

      <View className="px-5">
        <OnboardingContinueButton
          disabled={!canContinue}
          onPress={handleNext}
        />
      </View>
    </View>
  );
}
