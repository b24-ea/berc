import { Pressable, View, Text } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import type { ChatListItem as ChatListItemType } from '@/types/app';
import { format, isToday, isYesterday, isValid, parseISO } from 'date-fns';
import { theme } from '@/constants/theme';

interface ChatListItemProps {
  item: ChatListItemType;
  onPress: () => void;
  subtitle?: string;
  preview?: string;
  timeLabel?: string;
  unread?: boolean;
}

function getTimeLabel(lastMessageAt?: string, explicit?: string) {
  if (explicit) return explicit;
  if (!lastMessageAt) return '';
  const parsed = parseISO(lastMessageAt);
  if (!isValid(parsed)) return '';
  if (isToday(parsed)) return format(parsed, 'hh:mm a');
  if (isYesterday(parsed)) return 'Yesterday';
  return format(parsed, 'EEE');
}

export function ChatListItemRow({
  item,
  onPress,
  subtitle,
  preview,
  timeLabel,
  unread = false,
}: ChatListItemProps) {
  const rightTime = getTimeLabel(item.lastMessageAt, timeLabel);
  const secondLine = subtitle ?? item.runTitle;
  const thirdLine = preview ?? item.lastMessage;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 py-4 border-b border-border"
    >
      <Avatar
        uri={item.otherUser.photos?.[0]}
        name={item.otherUser.name}
        size="lg"
      />
      <View className="flex-1">
        <Text className="text-base font-semibold text-text-primary">
          {item.otherUser.name}
        </Text>
        <Text className="text-[15px] text-text-primary mt-0.5" numberOfLines={1}>
          {secondLine}
        </Text>
        {thirdLine && (
          <Text className="text-[15px] text-text-secondary mt-1" numberOfLines={1}>
            {thirdLine}
          </Text>
        )}
      </View>
      <View className="items-end justify-center gap-2">
        {rightTime ? (
          <Text className="text-xs text-text-secondary">{rightTime}</Text>
        ) : null}
        {unread ? (
          <View
            style={{ backgroundColor: theme.brand }}
            className="w-2.5 h-2.5 rounded-full"
          />
        ) : null}
      </View>
    </Pressable>
  );
}
