import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { cn } from '@/utils/cn';

interface TextAreaProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, className, ...props }: TextAreaProps & { className?: string }) {
  return (
    <View className="gap-1.5">
      {label && (
        <Text className="text-sm font-medium text-text-primary">{label}</Text>
      )}
      <TextInput
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        placeholderTextColor="#A8A8A8"
        className={cn(
          'bg-card rounded-2xl px-4 py-3.5 text-base text-text-primary border border-border min-h-[120px]',
          error && 'border-error',
          className,
        )}
        {...props}
      />
      {error && <Text className="text-sm text-error">{error}</Text>}
    </View>
  );
}
