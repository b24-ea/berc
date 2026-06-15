import { useCallback } from 'react';
import { useRouter, useFocusEffect, type Href } from 'expo-router';
import { AccountProfileView } from '@/components/profile/AccountProfileView';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuthStore } from '@/store/authStore';
import { useSignOut } from '@/features/auth/hooks';
import { useCurrentProfile } from '@/hooks/useCurrentProfile';
import { exitDevMode } from '@/utils/devBypass';
import { View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const isDevBypass = useAuthStore((s) => s.isDevBypass);
  const signOut = useSignOut();
  const { profile, isLoading, refetch } = useCurrentProfile();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!profile) {
    return (
      <View className="flex-1 bg-page">
        <EmptyState
          title="Profile unavailable"
          subtitle="Sign in or use developer mode to view your profile."
        />
      </View>
    );
  }

  const handleSignOut = () => {
    if (isDevBypass) {
      exitDevMode();
      router.replace('/(auth)/welcome' as Href);
      return;
    }
    signOut.mutate(undefined, {
      onSuccess: () => router.replace('/(auth)/welcome' as Href),
    });
  };

  return (
    <AccountProfileView
      user={profile}
      showDevActions
      onViewRunnerProfile={() => router.push('/(tabs)/profile/runner' as Href)}
      onEditProfile={() => router.push('/(tabs)/profile/edit' as Href)}
      onSignOut={handleSignOut}
      onSettingsPress={() => router.push('/(tabs)/profile/settings')}
    />
  );
}
