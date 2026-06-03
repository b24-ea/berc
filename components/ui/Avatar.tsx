import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { cn } from '@/utils/cn';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

const textSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg',
  xl: 'text-2xl',
};

export function Avatar({ uri, name, size = 'md', className }: AvatarProps) {
  const initials = name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <View
      className={cn(
        'rounded-full overflow-hidden bg-card items-center justify-center',
        sizeMap[size],
        className,
      )}
    >
      {uri ? (
        <Image source={{ uri }} className="w-full h-full" contentFit="cover" />
      ) : (
        <View className="w-full h-full items-center justify-center bg-accent-light">
          <Text className={cn('font-semibold text-accent', textSizeMap[size])}>
            {initials}
          </Text>
        </View>
      )}
    </View>
  );
}
