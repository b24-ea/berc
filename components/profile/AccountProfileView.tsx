import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileHubTopBar } from '@/components/profile/ProfileHubTopBar';
import { HingeProfileCompletion } from '@/components/profile/HingeProfileCompletion';
import { HingeProfilePromoCard } from '@/components/profile/HingeProfilePromoCard';
import {
  HingeProfileSection,
  HingeProfileRow,
  HingeLogoutButton,
} from '@/components/profile/HingeProfileMenu';
import type { UserRow } from '@/types/database';
import { MOCK_PROFILE_PHOTOS } from '@/constants/mockFeed';
import { getProfileCompletion } from '@/utils/profileCompletion';
import { useUserStore } from '@/store/userStore';

interface AccountProfileViewProps {
  user: UserRow;
  showDevActions?: boolean;
  onSignOut?: () => void;
  onViewRunnerProfile?: () => void;
  onEditProfile?: () => void;
  onSettingsPress?: () => void;
}

export function AccountProfileView({
  user,
  showDevActions,
  onSignOut,
  onViewRunnerProfile,
  onEditProfile,
  onSettingsPress,
}: AccountProfileViewProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const feedCity = useUserStore((s) => s.feedCity);
  const photos = user.photos?.length ? user.photos : MOCK_PROFILE_PHOTOS;
  const heroPhoto = photos[0] ?? MOCK_PROFILE_PHOTOS[0];
  const completion = getProfileCompletion(user);
  const displayCity = feedCity || user.city || 'London';

  const comingSoon = (title: string) => {
    Alert.alert(title, 'Coming soon.');
  };

  return (
    <View className="flex-1 bg-page">
      <ProfileHubTopBar city={displayCity} onSettingsPress={onSettingsPress} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <HingeProfileCompletion
          photoUri={heroPhoto}
          progress={completion}
          onPhotoPress={() => onViewRunnerProfile?.()}
          onCompletePress={() => onEditProfile?.()}
        />

        <HingeProfilePromoCard
          title="berc+"
          subtitle="Get more out of every mile."
          ctaLabel="Get berc+"
          ctaVariant="pill"
          onPress={() => router.push('/berc-plus')}
        />

        <HingeProfilePromoCard
          title="Standouts"
          subtitle="Discover elite runners in your area."
          ctaLabel="Learn more"
          ctaVariant="link"
          onPress={() => router.push('/(tabs)/recommendations')}
        />

        <HingeProfileSection title="My berc">
          <HingeProfileRow label="Edit Profile" onPress={onEditProfile} />
          <HingeProfileRow
            label="Running Preferences"
            onPress={() => router.push('/feed-filters')}
          />
          <HingeProfileRow label="Account" onPress={onSettingsPress} isLast />
        </HingeProfileSection>

        <HingeProfileSection title="Safety">
          <HingeProfileRow
            label="Get More Safety"
            onPress={() => comingSoon('Safety Center')}
          />
          <HingeProfileRow
            label="Selfie Verification"
            onPress={() => comingSoon('Selfie Verification')}
            isLast
          />
        </HingeProfileSection>

        <HingeProfileSection title="Support">
          <HingeProfileRow
            label="Help Center"
            onPress={() => comingSoon('Help Center')}
            isLast
          />
        </HingeProfileSection>

        {showDevActions ? (
          <HingeLogoutButton onPress={onSignOut} />
        ) : null}
      </ScrollView>
    </View>
  );
}
