import { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import { OnboardingPhotoGrid } from '@/components/onboarding/OnboardingPhotoGrid';
import { ONBOARDING_STEPS } from '@/constants/onboarding';
import { config } from '@/constants/config';
import { useUserStore } from '@/store/userStore';

const SLOT_COUNT = 6;
const RUNNING_SLOT = 0;

export default function OnboardingPhotosScreen() {
  const router = useRouter();
  const { onboardingDraft, updateOnboardingDraft } = useUserStore();
  const [photos, setPhotos] = useState<(string | undefined)[]>(() => {
    const existing = onboardingDraft.photos ?? [];
    return Array.from({ length: SLOT_COUNT }, (_, i) => existing[i]);
  });

  const filledCount = photos.filter(Boolean).length;
  const canContinue = filledCount >= config.minPhotos;

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

  const removePhoto = (slotIndex: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      next[slotIndex] = undefined;
      return next;
    });
  };

  const handleContinue = () => {
    if (!canContinue) return;
    const photoUrls = photos.filter((p): p is string => Boolean(p));
    const runningIndices = photoUrls.length > 0 ? [RUNNING_SLOT] : [];
    updateOnboardingDraft({
      photos: photoUrls,
      runningPhotoIndices: runningIndices,
    });
    router.push('/(onboarding)/running' as Href);
  };

  return (
    <OnboardingShell
      step={ONBOARDING_STEPS.photos}
      title="Add your photos"
      subtitle="Show your running journey. We recommend adding at least 3 photos of your favorite routes or gear."
      onContinue={handleContinue}
      continueDisabled={!canContinue}
    >
      <OnboardingPhotoGrid
        photos={photos}
        onSlotPress={pickForSlot}
        onRemove={removePhoto}
      />

      <View className="flex-row items-center gap-2 mt-5">
        <Ionicons name="information-circle-outline" size={18} color="#8B3213" />
        <Text className="text-sm font-medium text-[#8B3213]">
          Add at least {config.minPhotos} photos to continue
        </Text>
      </View>
    </OnboardingShell>
  );
}
