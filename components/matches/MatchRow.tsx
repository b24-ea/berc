import { View, Text, Pressable } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { cardFrame } from '@/constants/cardStyle';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';
import type { MatchListItem } from '@/constants/mockMatches';

interface MatchRowProps {
  item: MatchListItem;
  onPress?: () => void;
  onMessage?: () => void;
}

export function MatchRow({ item, onPress, onMessage }: MatchRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl mx-5 mb-2 px-4 py-3 flex-row items-center"
      style={cardFrame}
    >
      <Avatar uri={item.photo ?? undefined} name={item.name} size="lg" />
      <View className="flex-1 ml-3">
        <Text className="text-base font-bold text-text-primary">
          {item.name}
          {item.age ? `, ${item.age}` : ''}
        </Text>
        <Text className="text-sm text-text-secondary mt-0.5" numberOfLines={1}>
          {item.city ?? 'London'}
        </Text>
        <Text className="text-xs mt-1" style={{ color: theme.brand }} numberOfLines={1}>
          Matched on · {item.runTitle}
        </Text>
      </View>
      <View className="items-end gap-2">
        <Text className="text-[11px] text-text-secondary">{item.timeLabel}</Text>
        {onMessage ? (
          <Pressable
            onPress={onMessage}
            className="rounded-full px-3 py-1.5"
            style={{ backgroundColor: theme.brand }}
          >
            <Text className="text-xs font-semibold text-white">Message</Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

export function MatchesTitlePill() {
  return (
    <View className="items-center pt-2 pb-4">
      <View
        className="rounded-full px-10 py-2.5 border"
        style={{
          borderColor: theme.brand,
          backgroundColor: colors.white,
        }}
      >
        <Text className="text-[22px] font-bold" style={{ color: theme.brand }}>
          Matches
        </Text>
      </View>
    </View>
  );
}
