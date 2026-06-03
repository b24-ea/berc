import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { cn } from '@/utils/cn';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  containerClassName,
  className,
  ...props
}: InputProps & { className?: string }) {
  return (
    <View className={cn('gap-1.5', containerClassName)}>
      {label && (
        <Text className="text-sm font-medium text-text-primary">{label}</Text>
      )}
      <TextInput
        placeholderTextColor="#A8A8A8"
        className={cn(
          'bg-card rounded-2xl px-4 py-3.5 text-base text-text-primary border border-border',
          error && 'border-error',
          className,
        )}
        {...props}
      />
      {error && <Text className="text-sm text-error">{error}</Text>}
    </View>
  );
}
