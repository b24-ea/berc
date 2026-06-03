import { View, Text } from 'react-native';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Text className="text-lg font-semibold text-text-primary text-center">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-base text-text-secondary text-center mt-2 leading-6">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
