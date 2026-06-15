import { View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
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
  useEmailRegister,
  useGoogleSignIn,
} from '@/features/auth/hooks';
import { registerSchema, type RegisterFormValues } from '@/utils/validators';

export default function RegisterScreen() {
  const router = useRouter();
  const register = useEmailRegister();
  const appleSignIn = useAppleSignIn();
  const googleSignIn = useGoogleSignIn();

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    await register.mutateAsync(values);
    router.replace('/(onboarding)/interests' as Href);
  });

  const goAfterSocial = () => router.replace('/(onboarding)/account' as Href);

  return (
    <AuthScreen>
      <AuthWordmark />
      <AuthHeading
        title="Create account"
        subtitle="Meet through running. Your next partner is out there."
      />

      <View className="gap-4">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              variant="auth"
              label="Name"
              placeholder="Enter your name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
            />
          )}
        />
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
              placeholder="Create a password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              variant="auth"
              label="Confirm password"
              placeholder="Confirm your password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
            />
          )}
        />
      </View>

      <View className="mt-6">
        <AuthPrimaryButton
          label="Create account"
          loading={register.isPending}
          onPress={onSubmit}
        />
      </View>

      <AuthOrDivider />

      <AuthSocialButtons
        onApplePress={() => appleSignIn.mutate(undefined, { onSuccess: goAfterSocial })}
        onGooglePress={() => googleSignIn.mutate(undefined, { onSuccess: goAfterSocial })}
        appleLoading={appleSignIn.isPending}
        googleLoading={googleSignIn.isPending}
      />

      <AuthFooterLink
        prefix="Already have an account?"
        linkLabel="Sign in"
        onPress={() => router.push('/(auth)/login')}
      />
    </AuthScreen>
  );
}
