import { View, Text, Pressable, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Screen } from '@/components/ui/Screen';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  useAppleSignIn,
  useEmailLogin,
  useGoogleSignIn,
} from '@/features/auth/hooks';
import { loginSchema, type LoginFormValues } from '@/utils/validators';
import { isSupabaseConfigured } from '@/services/supabase/client';
import { DevBypassButton } from '@/components/dev/DevBypassButton';

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
    <Screen className="justify-center">
      <Text className="text-3xl font-bold text-text-primary mb-2">Welcome back</Text>
      <Text className="text-base text-text-secondary mb-8">
        Sign in to find your next running partner.
      </Text>

      {!isSupabaseConfigured && (
        <View className="bg-accent-light rounded-2xl p-4 mb-6 border border-accent/20">
          <Text className="text-sm text-text-primary leading-5">
            Supabase bağlı değil. `.env` dosyasına{' '}
            <Text className="font-semibold">EXPO_PUBLIC_SUPABASE_URL</Text> ve{' '}
            <Text className="font-semibold">EXPO_PUBLIC_SUPABASE_ANON_KEY</Text>{' '}
            ekleyip Metro&apos;yu yeniden başlat.
          </Text>
        </View>
      )}

      <View className="gap-4 mb-6">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="you@email.com"
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
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
            />
          )}
        />
      </View>

      <Button
        label="Sign In"
        fullWidth
        loading={emailLogin.isPending}
        onPress={onSubmit}
      />

      <View className="my-6 items-center">
        <Text className="text-sm text-text-secondary">or continue with</Text>
      </View>

      <View className="gap-3">
        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={16}
            style={{ width: '100%', height: 52 }}
            onPress={() => appleSignIn.mutate(undefined, { onSuccess: () => router.replace('/') })}
          />
        )}
        <Button
          label="Continue with Google"
          variant="secondary"
          fullWidth
          loading={googleSignIn.isPending}
          onPress={() => googleSignIn.mutate(undefined, { onSuccess: () => router.replace('/') })}
        />
      </View>

      <Pressable className="mt-6 items-center">
        <Link href={'/(auth)/welcome' as import('expo-router').Href} asChild>
          <Text className="text-sm text-text-secondary">← Back to welcome</Text>
        </Link>
      </Pressable>

      <Pressable className="mt-4 items-center">
        <Link href="/(auth)/register" asChild>
          <Text className="text-sm text-text-secondary">
            New here?{' '}
            <Text className="text-accent font-medium">Create an account</Text>
          </Text>
        </Link>
      </Pressable>

      <DevBypassButton />
    </Screen>
  );
}
