import { View, Text, Pressable } from 'react-native';
import { theme } from '@/constants/theme';

interface HingeProfilePromoCardProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaVariant?: 'pill' | 'link';
  onPress?: () => void;
}

export function HingeProfilePromoCard({
  title,
  subtitle,
  ctaLabel,
  ctaVariant = 'pill',
  onPress,
}: HingeProfilePromoCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mx-4 mb-3 rounded-2xl p-4 flex-row items-center justify-between"
      style={{ backgroundColor: theme.card }}
    >
      <View className="flex-1 pr-3">
        <Text className="text-[22px] font-bold text-text-primary leading-7">{title}</Text>
        <Text className="text-[15px] text-text-secondary mt-1 leading-5">{subtitle}</Text>
      </View>

      {ctaVariant === 'pill' ? (
        <View
          className="rounded-full px-4 py-2.5"
          style={{ backgroundColor: theme.brandDark }}
        >
          <Text className="text-sm font-bold text-white">{ctaLabel}</Text>
        </View>
      ) : (
        <Text className="text-sm font-bold" style={{ color: theme.brandDark }}>
          {ctaLabel}
        </Text>
      )}
    </Pressable>
  );
}
