import { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { VibeTagSelector } from '@/components/forms/VibeTagSelector';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useUpdateProfile } from '@/features/profile/hooks';
import { isSupabaseConfigured } from '@/services/supabase/client';
import { DISCOVERY_RADIUS_OPTIONS } from '@/constants/vibes';
import { theme } from '@/constants/theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const isDevBypass = useAuthStore((s) => s.isDevBypass);
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);
  const updateOnboardingDraft = useUserStore((s) => s.updateOnboardingDraft);
  const updateProfileMutation = useUpdateProfile();

  const [name, setName] = useState(profile?.name ?? '');
  const [city, setCity] = useState(profile?.city ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [vibeTags, setVibeTags] = useState<string[]>(profile?.vibe_tags ?? []);
  const [weeklyKm, setWeeklyKm] = useState(
    profile?.weekly_km != null ? String(profile.weekly_km) : '',
  );
  const [averagePace, setAveragePace] = useState(profile?.average_pace ?? '');
  const [favouriteRoute, setFavouriteRoute] = useState(profile?.favourite_route ?? '');
  const [radius, setRadius] = useState(profile?.discovery_radius ?? 10);

  const canSave = useMemo(() => name.trim().length >= 2, [name]);

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-page px-5">
        <Text className="text-lg font-semibold text-text-primary">Profile unavailable</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text style={{ color: theme.brand }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const handleSave = async () => {
    if (!canSave) return;

    const updates = {
      name: name.trim(),
      city: city.trim() || null,
      bio: bio.trim() || null,
      vibe_tags: vibeTags,
      weekly_km: weeklyKm ? Number(weeklyKm) : null,
      average_pace: averagePace.trim() || null,
      favourite_route: favouriteRoute.trim() || null,
      discovery_radius: radius,
    };

    const shouldSaveLocallyOnly = isDevBypass || !isSupabaseConfigured || !userId;

    if (shouldSaveLocallyOnly) {
      setProfile({
        ...profile,
        ...updates,
        city: updates.city,
        bio: updates.bio,
        weekly_km: updates.weekly_km,
        average_pace: updates.average_pace,
        favourite_route: updates.favourite_route,
      });
      Alert.alert('Saved (demo)', 'Profile updated locally.');
      router.back();
      return;
    }

    try {
      const updated = await updateProfileMutation.mutateAsync({
        userId,
        updates,
      });
      setProfile(updated);
      router.back();
    } catch {
      Alert.alert('Could not save', 'Please try again.');
    }
  };

  const goToOnboardingStep = (path: string) => {
    updateOnboardingDraft({
      photos: profile.photos,
      runningPhotoIndices: [0],
      vibeTags,
      bio,
      city: city || '',
      discoveryRadius: radius,
      weeklyKm: weeklyKm ? Number(weeklyKm) : undefined,
      averagePace: averagePace || undefined,
      favouriteRoute: favouriteRoute || undefined,
    });
    router.push(path as Href);
  };

  return (
    <View className="flex-1 bg-page">
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-border">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </Pressable>
        <Text className="text-lg font-semibold text-text-primary">Edit Profile</Text>
        <Pressable onPress={handleSave} disabled={!canSave || updateProfileMutation.isPending}>
          <Text
            className="text-base font-medium"
            style={{ color: canSave ? theme.brand : '#A8A8A8' }}
          >
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
          <Input label="Name" value={name} onChangeText={setName} />
          <Input label="City" value={city} onChangeText={setCity} />
          <TextArea label="Bio" value={bio} onChangeText={setBio} />

          <View>
            <Text className="text-sm font-medium text-text-primary mb-2">Vibe tags</Text>
            <VibeTagSelector selected={vibeTags} onChange={setVibeTags} />
          </View>

          <Input
            label="Weekly km"
            keyboardType="numeric"
            value={weeklyKm}
            onChangeText={setWeeklyKm}
          />
          <Input
            label="Average pace (min/km)"
            value={averagePace}
            onChangeText={setAveragePace}
          />
          <Input
            label="Favourite route"
            value={favouriteRoute}
            onChangeText={setFavouriteRoute}
          />

          <View>
            <Text className="text-sm font-medium text-text-primary mb-2">Discovery radius</Text>
            <View className="flex-row flex-wrap gap-2">
              {DISCOVERY_RADIUS_OPTIONS.map((r) => (
                <Pressable
                  key={r}
                  onPress={() => setRadius(r)}
                  className="px-4 py-2 rounded-full border"
                  style={{
                    borderColor: radius === r ? theme.brand : '#EEEDE9',
                    backgroundColor: radius === r ? '#FAEDE6' : '#fff',
                  }}
                >
                  <Text style={{ color: radius === r ? theme.brand : '#6B6B6B' }}>{r} km</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View className="mt-8 gap-3">
          <Text className="text-base font-semibold text-text-primary">Edit with onboarding screens</Text>
          <Button
            label="Edit photos"
            variant="secondary"
            fullWidth
            onPress={() => goToOnboardingStep('/(onboarding)/photos')}
          />
          <Button
            label="Edit interests"
            variant="secondary"
            fullWidth
            onPress={() => goToOnboardingStep('/(onboarding)/interests')}
          />
          <Button
            label="Edit running info"
            variant="secondary"
            fullWidth
            onPress={() => goToOnboardingStep('/(onboarding)/running')}
          />
        </View>

        <View className="mt-8">
          <Button
            label={updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            fullWidth
            onPress={handleSave}
            loading={updateProfileMutation.isPending}
            disabled={!canSave}
          />
        </View>
      </ScrollView>
    </View>
  );
}
