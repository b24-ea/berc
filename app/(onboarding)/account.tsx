import { View, Text, Alert } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import { GenderSelector } from '@/components/onboarding/GenderSelector';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useEmailRegister } from '@/features/auth/hooks';
import { isSupabaseConfigured } from '@/services/supabase/client';
import {
  onboardingAccountSchema,
  onboardingAccountSessionSchema,
  type OnboardingAccountFormValues,
  type OnboardingAccountSessionFormValues,
} from '@/utils/validators';
import { ONBOARDING_STEPS } from '@/constants/onboarding';
import type { GenderOption } from '@/constants/interests';

type AccountFormValues = OnboardingAccountFormValues | OnboardingAccountSessionFormValues;

export default function OnboardingAccountScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const user = useAuthStore((s) => s.user);
  const { onboardingDraft, updateOnboardingDraft } = useUserStore();
  const register = useEmailRegister();

  const hasSession = Boolean(session);
  const useSessionSchema = hasSession || !isSupabaseConfigured;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AccountFormValues>({
    resolver: zodResolver(
      useSessionSchema ? onboardingAccountSessionSchema : onboardingAccountSchema,
    ),
    defaultValues: {
      firstName: onboardingDraft.firstName ?? '',
      lastName: onboardingDraft.lastName ?? '',
      email: onboardingDraft.email ?? user?.email ?? '',
      password: '',
      confirmPassword: '',
      gender: (onboardingDraft.gender as GenderOption | undefined) ?? undefined,
    },
  });

  const gender = watch('gender');

  const onSubmit = handleSubmit(async (values) => {
    const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`;
    updateOnboardingDraft({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email,
      gender: values.gender,
    });

    if (!hasSession && isSupabaseConfigured) {
      try {
        const withPassword = values as OnboardingAccountFormValues;
        await register.mutateAsync({
          name: fullName,
          email: values.email,
          password: withPassword.password,
          confirmPassword: withPassword.confirmPassword,
        });
      } catch (err) {
        Alert.alert(
          'Could not create account',
          err instanceof Error ? err.message : 'Please try again.',
        );
        return;
      }
    }

    router.push('/(onboarding)/interests' as Href);
  });

  return (
    <OnboardingShell
      step={ONBOARDING_STEPS.account}
      title="Create your account"
      subtitle="Tell us a bit about you to get started on berc."
      onContinue={onSubmit}
      continueLoading={register.isPending}
      showBack={false}
    >
      <View className="gap-4">
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              variant="auth"
              label="First name"
              placeholder="Enter your first name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.firstName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              variant="auth"
              label="Last name"
              placeholder="Enter your last name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.lastName?.message}
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
              editable={!hasSession}
            />
          )}
        />
        {!useSessionSchema ? (
          <>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="auth"
                  label="Password"
                  placeholder="Create a password"
                  secureTextEntry
                  value={value ?? ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={'password' in errors ? errors.password?.message : undefined}
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
                  value={value ?? ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={
                    'confirmPassword' in errors ? errors.confirmPassword?.message : undefined
                  }
                />
              )}
            />
          </>
        ) : null}
        <GenderSelector
          value={gender}
          onChange={(value) => setValue('gender', value, { shouldValidate: true })}
        />
        {errors.gender?.message ? (
          <Text className="text-sm text-red-500">{errors.gender.message}</Text>
        ) : null}
      </View>
    </OnboardingShell>
  );
}
