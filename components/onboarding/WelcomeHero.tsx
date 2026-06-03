import { View, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

interface WelcomeHeroProps {
  showSignIn?: boolean;
  onGetStarted?: () => void;
}

/**
 * Full-bleed design asset — copy and CTAs are baked into welcome-hero.png.
 * Only invisible touch targets are overlaid here.
 */
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
    <View className="flex-1 bg-black">
      <Image
        source={require('@/assets/images/welcome-hero.png')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />

      <View
        className="flex-1 justify-end"
        style={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Get Started — matches button in design asset */}
        <Pressable
          onPress={handleGetStarted}
          accessibilityRole="button"
          accessibilityLabel="Get Started"
          style={{ marginHorizontal: 24, height: 56, marginBottom: showSignIn ? 12 : 0 }}
        />

        {showSignIn && (
          <Pressable
            onPress={() => router.push('/(auth)/login')}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            style={{ marginHorizontal: 24, height: 44 }}
          />
        )}
      </View>
    </View>
  );
}
