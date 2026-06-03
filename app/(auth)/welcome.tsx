import { View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { WelcomeHero } from '@/components/onboarding/WelcomeHero';
import { DevBypassButton } from '@/components/dev/DevBypassButton';
import { isSupabaseConfigured } from '@/services/supabase/client';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    if (!isSupabaseConfigured) {
      router.push('/(onboarding)/photos' as Href);
      return;
    }
    router.push('/(auth)/register');
  };

  return (
    <View className="flex-1">
      <WelcomeHero showSignIn onGetStarted={handleGetStarted} />
      <View className="absolute bottom-24 left-0 right-0 px-6">
        <DevBypassButton variant="dark" />
      </View>
    </View>
  );
}
