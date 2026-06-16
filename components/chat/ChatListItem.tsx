import { Pressable, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Avatar } from '@/components/ui/Avatar';
import type { ChatListItem as ChatListItemType } from '@/types/app';
import { formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

interface ChatListItemProps {
  item: ChatListItemType;
  onPress: () => void;
  preview?: string;
  timeLabel?: string;
  unread?: boolean;
}

const ROW_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 2,
};

function getTimeLabel(lastMessageAt?: string, explicit?: string) {
  if (explicit) return explicit;
  if (!lastMessageAt) return '';
  const parsed = parseISO(lastMessageAt);
  if (!isValid(parsed)) return '';
  return formatDistanceToNow(parsed, { addSuffix: true });
}

export function ChatListItemRow({
  item,
  onPress,
  preview,
  timeLabel,
  unread = false,
}: ChatListItemProps) {
  const rightTime = getTimeLabel(item.lastMessageAt, timeLabel);
  const messagePreview = preview ?? item.lastMessage ?? item.runTitle;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 bg-card rounded-2xl mx-5 mb-2 px-4 py-3"
      style={ROW_SHADOW}
    >
      <Avatar
        uri={item.otherUser.photos?.[0]}
        name={item.otherUser.name}
        size="lg"
      />
      <View className="flex-1">
        <View className="flex-row items-center justify-between gap-2">
          <Text className="text-base font-bold text-text-primary flex-1" numberOfLines={1}>
            {item.otherUser.name}
          </Text>
          {rightTime ? (
            <Text className="text-xs text-text-secondary">{rightTime}</Text>
          ) : null}
        </View>
        <View className="flex-row items-center mt-1.5 gap-2">
          <Text className="flex-1 text-[15px] text-text-secondary" numberOfLines={1}>
            {messagePreview}
          </Text>
          {unread ? (
            <View
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: theme.brand }}
            />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

interface ChatRequestRowProps {
  name: string;
  photo?: string;
  runTitle: string;
  runDate: string;
  onAccept: () => void;
  onDecline: () => void;
  acceptLoading?: boolean;
  declineLoading?: boolean;
}

export function ChatRequestRow({
  name,
  photo,
  runTitle,
  runDate,
  onAccept,
  onDecline,
  acceptLoading,
  declineLoading,
}: ChatRequestRowProps) {
  return (
    <View
      className="bg-card rounded-2xl mx-5 mb-2 p-4"
      style={ROW_SHADOW}
    >
      <View className="flex-row gap-3 mb-3">
        {photo ? (
          <Image
            source={{ uri: photo }}
            style={{ width: 52, height: 52, borderRadius: 26 }}
            contentFit="cover"
          />
        ) : (
          <Avatar name={name} size="lg" />
        )}
        <View className="flex-1">
          <Text className="text-base font-bold text-text-primary">{name}</Text>
          <Text className="text-sm text-text-secondary mt-0.5">
            Wants to join · {runTitle}
          </Text>
          <Text className="text-xs text-text-secondary mt-1">{runDate}</Text>
        </View>
      </View>
      <View className="flex-row gap-2">
        <Pressable
          onPress={onAccept}
          disabled={acceptLoading}
          className="flex-1 rounded-full py-3 items-center"
          style={{ backgroundColor: theme.brand, opacity: acceptLoading ? 0.7 : 1 }}
        >
          <Text className="text-sm font-bold text-white">Accept</Text>
        </Pressable>
        <Pressable
          onPress={onDecline}
          disabled={declineLoading}
          className="flex-1 rounded-full py-3 items-center border bg-card"
          style={{
            borderColor: colors.border,
            opacity: declineLoading ? 0.7 : 1,
          }}
        >
          <Text className="text-sm font-bold" style={{ color: theme.brand }}>
            Decline
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
