import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { OtherUserProfileView } from '@/components/profile/OtherUserProfileView';
import { useOtherUserProfile } from '@/hooks/useOtherUserProfile';
import { useAuthStore } from '@/store/authStore';
import { useCreateRunRequest } from '@/features/requests/hooks';
import { DEV_USER_ID } from '@/utils/devBypass';

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const isDevBypass = useAuthStore((s) => s.isDevBypass);
  const createRequest = useCreateRunRequest();

  const ownId = currentUserId ?? (isDevBypass ? DEV_USER_ID : undefined);

  if (id && ownId && id === ownId) {
    router.replace('/(tabs)/profile');
    return <LoadingScreen />;
  }

  const { profile, runs, isLoading, isError } = useOtherUserProfile(id);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!profile || isError) {
    return (
      <View className="flex-1 bg-background justify-center">
        <EmptyState
          title="Profile not found"
          subtitle="This runner profile is unavailable."
        />
      </View>
    );
  }

  const handleJoinRun = (run: { id: string }) => {
    if (!currentUserId && !isDevBypass) return;
    if (run.id.startsWith('mock-') || isDevBypass) return;
    createRequest.mutate({
      runId: run.id,
      requesterId: currentUserId!,
    });
  };

  return (
    <OtherUserProfileView
      user={profile}
      runs={runs}
      onBack={() => router.back()}
      onJoinRun={handleJoinRun}
      joinLoading={createRequest.isPending}
    />
  );
}
