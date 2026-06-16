import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DevBypassButton } from '@/components/dev/DevBypassButton';
import { theme } from '@/constants/theme';

const RING_CONFIG = [
  { size: 120, opacity: 0.08 },
  { size: 200, opacity: 0.06 },
  { size: 300, opacity: 0.05 },
  { size: 400, opacity: 0.04 },
  { size: 500, opacity: 0.03 },
] as const;

function WelcomeRings() {
  return (
    <View
      pointerEvents="none"
      className="absolute items-center justify-center"
      style={{ width: '100%', height: '100%' }}
    >
      {RING_CONFIG.map(({ size, opacity }) => (
        <View
          key={size}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 1,
            borderColor: `rgba(165, 61, 19, ${opacity})`,
          }}
        />
      ))}
    </View>
  );
}

interface WelcomeHeroProps {
  showSignIn?: boolean;
  onGetStarted?: () => void;
}

export function WelcomeHero({ showSignIn = true, onGetStarted }: WelcomeHeroProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
      return;
    }
    router.push('/(auth)/register');
  };

  return (
    <View className="flex-1 bg-page">
      <WelcomeRings />

      <View className="flex-1 items-center justify-center px-8">
        <Animated.View entering={FadeIn.duration(600)} className="items-center">
          <Animated.Text
            entering={FadeInDown.duration(700).springify().damping(20)}
            style={{
              fontSize: 72,
              fontWeight: '700',
              color: theme.brand,
              letterSpacing: -3,
              lineHeight: 76,
            }}
          >
            berc
          </Animated.Text>
          <Animated.Text
            entering={FadeIn.delay(250).duration(500)}
            className="text-[17px] text-text-primary text-center mt-3"
            style={{ color: '#3D2E28' }}
          >
            Meet through running.
          </Animated.Text>
        </Animated.View>
      </View>

      <View className="px-6" style={{ paddingBottom: insets.bottom + 24 }}>
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <Pressable
            onPress={handleGetStarted}
            className="h-[52px] rounded-full items-center justify-center"
            style={{ backgroundColor: theme.brand }}
          >
            <Text className="text-base font-bold text-white">Get Started</Text>
          </Pressable>
        </Animated.View>

        {showSignIn ? (
          <Animated.View entering={FadeIn.delay(550).duration(500)}>
            <Pressable
              onPress={() => router.push('/(auth)/login')}
              className="py-4 items-center"
              accessibilityRole="button"
              accessibilityLabel="Sign in"
            >
              <Text className="text-base" style={{ color: '#3D2E28' }}>
                Already have an account?{' '}
                <Text className="font-semibold" style={{ color: theme.brand }}>
                  Sign in
                </Text>
              </Text>
            </Pressable>
          </Animated.View>
        ) : null}

        <DevBypassButton variant="light" />
      </View>
    </View>
  );
}
