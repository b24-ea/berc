import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

export function AuthPrimaryButton({
  label,
  onPress,
  loading,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className="h-[52px] rounded-full items-center justify-center"
      style={{ backgroundColor: loading ? `${theme.brand}99` : theme.brand }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-base font-bold text-white">{label}</Text>
      )}
    </Pressable>
  );
}

export function AuthSocialButtons({
  onApplePress,
  onGooglePress,
  appleLoading,
  googleLoading,
}: {
  onApplePress?: () => void;
  onGooglePress?: () => void;
  appleLoading?: boolean;
  googleLoading?: boolean;
}) {
  return (
    <View className="gap-3">
      {Platform.OS === 'ios' && onApplePress ? (
        <Pressable
          onPress={onApplePress}
          disabled={appleLoading}
          className="h-[52px] rounded-full flex-row items-center justify-center gap-2"
          style={{ backgroundColor: '#1A1A1A' }}
        >
          {appleLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="logo-apple" size={20} color="#fff" />
              <Text className="text-base font-semibold text-white">Sign in with Apple</Text>
            </>
          )}
        </Pressable>
      ) : null}

      {onGooglePress ? (
        <Pressable
          onPress={onGooglePress}
          disabled={googleLoading}
          className="h-[52px] rounded-full flex-row items-center justify-center gap-2 bg-white border"
          style={{ borderColor: colors.border }}
        >
          {googleLoading ? (
            <ActivityIndicator color={theme.brand} />
          ) : (
            <>
              <Ionicons name="logo-google" size={18} color="#4285F4" />
              <Text className="text-base font-semibold text-text-primary">
                Sign in with Google
              </Text>
            </>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}
