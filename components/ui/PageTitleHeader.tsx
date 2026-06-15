import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
interface PageTitleHeaderProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: 'md' | 'lg';
}

export function PageTitleHeader({
  title,
  subtitle,
  icon,
  size = 'md',
}: PageTitleHeaderProps) {
  const backgroundColor = 'rgba(255, 255, 255, 0.72)';
  const titleClass = size === 'lg' ? 'text-[36px] leading-10' : 'text-[26px] leading-8';

  return (
    <View className="px-5 pt-3 pb-3">
      <View
        className="self-start rounded-full px-4 py-2.5"
        style={{ backgroundColor, maxWidth: '100%' }}
      >
        <View className="flex-row items-center gap-1.5">
          {icon ? <Ionicons name={icon} size={18} color={theme.brand} /> : null}
          <Text className={`${titleClass} font-bold text-text-primary`}>
            {title}
          </Text>
        </View>
        {subtitle ? (
          <Text className="text-[13px] text-text-secondary mt-0.5 leading-5 pr-1">
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
