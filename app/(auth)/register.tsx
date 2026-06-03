import { View, Text, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Screen } from '@/components/ui/Screen';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useEmailRegister } from '@/features/auth/hooks';
import { registerSchema, type RegisterFormValues } from '@/utils/validators';

export default function RegisterScreen() {
  const router = useRouter();
  const register = useEmailRegister();

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    await register.mutateAsync(values);
    router.replace('/(onboarding)/photos');
  });

  return (
    <Screen className="justify-center">
      <Text className="text-3xl font-bold text-text-primary mb-2">Join runr</Text>
      <Text className="text-base text-text-secondary mb-8">
        Meet through running. Create your account to get started.
      </Text>

      <View className="gap-4 mb-6">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Name"
              placeholder="Your name"
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
              label="Email"
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
              label="Confirm password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
            />
          )}
        />
      </View>

      <Button
        label="Create Account"
        fullWidth
        loading={register.isPending}
        onPress={onSubmit}
      />

      <Pressable className="mt-8 items-center">
        <Link href="/(auth)/login" asChild>
          <Text className="text-sm text-text-secondary">
            Already have an account?{' '}
            <Text className="text-accent font-medium">Sign in</Text>
          </Text>
        </Link>
      </Pressable>
    </Screen>
  );
}
