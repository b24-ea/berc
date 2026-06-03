import { Pressable, Text } from 'react-native';
import { cn } from '@/utils/cn';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'px-4 py-2 rounded-full mr-2 border',
        selected
          ? 'bg-accent-light border-accent'
          : 'bg-card border-border',
      )}
    >
      <Text
        className={cn(
          'text-sm font-medium',
          selected ? 'text-accent' : 'text-text-secondary',
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
