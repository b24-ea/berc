import { useRouter, type Href } from 'expo-router';
import { WelcomeHero } from '@/components/onboarding/WelcomeHero';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/(onboarding)/account' as Href);
  };

  return <WelcomeHero showSignIn onGetStarted={handleGetStarted} />;
}
