import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { RunnerProfileView } from '@/components/profile/RunnerProfileView';
import { useOtherUserProfile } from '@/hooks/useOtherUserProfile';
import { useAuthStore } from '@/store/authStore';
import { useCreateRunRequest } from '@/features/requests/hooks';

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const isDevBypass = useAuthStore((s) => s.isDevBypass);
  const createRequest = useCreateRunRequest();

  const { profile, runs, isLoading, isError } = useOtherUserProfile(id);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!profile || isError) {
    return (
      <View className="flex-1 bg-page justify-center">
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
    <RunnerProfileView
      user={profile}
      runs={runs}
      onBack={() => router.back()}
      onJoinRun={handleJoinRun}
      joinLoading={createRequest.isPending}
    />
  );
}
