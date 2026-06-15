import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AuthScreen,
  AuthWordmark,
  AuthHeading,
  AuthOrDivider,
  AuthFooterLink,
} from '@/components/auth/AuthScreen';
import { AuthPrimaryButton, AuthSocialButtons } from '@/components/auth/AuthButtons';
import { Input } from '@/components/ui/Input';
import {
  useAppleSignIn,
  useEmailLogin,
  useGoogleSignIn,
} from '@/features/auth/hooks';
import { loginSchema, type LoginFormValues } from '@/utils/validators';
import { isSupabaseConfigured } from '@/services/supabase/client';
import { DevBypassButton } from '@/components/dev/DevBypassButton';
import { theme } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const emailLogin = useEmailLogin();
  const appleSignIn = useAppleSignIn();
  const googleSignIn = useGoogleSignIn();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    await emailLogin.mutateAsync(values);
    router.replace('/');
  });

  return (
    <AuthScreen>
      <AuthWordmark />
      <AuthHeading
        title="Welcome back"
        subtitle="The road is waiting for you."
      />

      {!isSupabaseConfigured ? (
        <View className="bg-white/80 rounded-2xl p-4 mb-6 border border-border">
          <Text className="text-sm text-text-primary leading-5">
            Supabase bağlı değil. `.env` dosyasına{' '}
            <Text className="font-semibold">EXPO_PUBLIC_SUPABASE_URL</Text> ve{' '}
            <Text className="font-semibold">EXPO_PUBLIC_SUPABASE_ANON_KEY</Text>{' '}
            ekleyip Metro&apos;yu yeniden başlat.
          </Text>
        </View>
      ) : null}

      <View className="gap-4">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              variant="auth"
              label="Email"
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              variant="auth"
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              labelRight={
                <Pressable hitSlop={8}>
                  <Text className="text-sm font-medium" style={{ color: theme.brand }}>
                    Forgot password?
                  </Text>
                </Pressable>
              }
            />
          )}
        />
      </View>

      <View className="mt-6">
        <AuthPrimaryButton
          label="Login"
          loading={emailLogin.isPending}
          onPress={onSubmit}
        />
      </View>

      <AuthOrDivider />

      <AuthSocialButtons
        onApplePress={() =>
          appleSignIn.mutate(undefined, { onSuccess: () => router.replace('/') })
        }
        onGooglePress={() =>
          googleSignIn.mutate(undefined, { onSuccess: () => router.replace('/') })
        }
        appleLoading={appleSignIn.isPending}
        googleLoading={googleSignIn.isPending}
      />

      <AuthFooterLink
        prefix="Don't have an account?"
        linkLabel="Create account"
        onPress={() => router.push('/(auth)/register')}
      />

      <DevBypassButton />
    </AuthScreen>
  );
}
