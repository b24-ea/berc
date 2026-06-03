import { Redirect, type Href } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

export default function Index() {
  const { session, isLoading, isDevBypass } = useAuthStore();
  const profile = useUserStore((s) => s.profile);

  if (isLoading) return <LoadingScreen />;

  if (!session && !isDevBypass) return <Redirect href={'/(auth)/welcome' as Href} />;
  if (!profile?.is_onboarded) return <Redirect href="/(onboarding)" />;
  return <Redirect href="/(tabs)/feed" />;
}
