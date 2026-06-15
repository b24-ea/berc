import { View, Text, Pressable } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { theme } from '@/constants/theme';
import type { InvitationListItem } from '@/constants/mockInvitations';

interface InvitationPersonRowProps {
  item: InvitationListItem;
  onPress?: () => void;
  rightContent?: React.ReactNode;
}

export function InvitationPersonRow({ item, onPress, rightContent }: InvitationPersonRowProps) {
  const subtitle =
    item.direction === 'received'
      ? `Invited you · ${item.runTitle}`
      : `You invited · ${item.runTitle}`;

  return (
    <Pressable
      onPress={onPress}
      className="rounded-3xl px-4 py-4 mb-3 flex-row items-center"
      style={{
        backgroundColor: theme.card,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      <Avatar uri={item.photo ?? undefined} name={item.name} size="lg" />
      <View className="flex-1 ml-3">
        <Text className="text-base font-bold text-text-primary">
          {item.name}
          {item.age ? `, ${item.age}` : ''}
        </Text>
        <Text className="text-sm text-text-secondary mt-0.5" numberOfLines={1}>
          {item.city ?? 'London'}
          {item.vibe ? ` • ${item.vibe}` : ''}
        </Text>
        <Text className="text-xs mt-1" style={{ color: theme.brand }} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      {rightContent ?? (
        <View className="items-end">
          <View
            className="rounded-full px-3 py-1.5"
            style={{ backgroundColor: item.status === 'pending' ? theme.peach : '#EEEBE6' }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: item.status === 'pending' ? theme.brand : '#6B6B6B' }}
            >
              {item.status === 'pending' ? 'Pending' : 'Accepted'}
            </Text>
          </View>
          <Text className="text-[11px] text-text-secondary mt-1">{item.timeLabel}</Text>
        </View>
      )}
    </Pressable>
  );
}
