import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { cn } from '@/utils/cn';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelRight?: React.ReactNode;
  variant?: 'default' | 'auth';
}

export function Input({
  label,
  error,
  containerClassName,
  labelRight,
  variant = 'default',
  className,
  ...props
}: InputProps & { className?: string }) {
  const isAuth = variant === 'auth';

  return (
    <View className={cn('gap-2', containerClassName)}>
      {label ? (
        <View className="flex-row items-center justify-between">
          <Text
            className={cn(
              'text-sm font-medium',
              isAuth ? 'text-text-secondary' : 'text-text-primary',
            )}
          >
            {label}
          </Text>
          {labelRight}
        </View>
      ) : null}
      <TextInput
        placeholderTextColor="#A8A8A8"
        className={cn(
          'text-base text-text-primary',
          isAuth
            ? 'bg-card rounded-full px-5 py-3.5 border border-card-border'
            : 'bg-card rounded-xl px-4 py-3 border border-card-border',
          error && 'border-error',
          className,
        )}
        {...props}
      />
      {error ? <Text className="text-sm text-error px-1">{error}</Text> : null}
    </View>
  );
}
