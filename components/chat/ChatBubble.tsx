import { View, Text } from 'react-native';
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

interface ChatBubbleProps {
  content: string;
  isOwn: boolean;
  timeLabel?: string;
}

export function ChatBubble({ content, isOwn, timeLabel }: ChatBubbleProps) {
  const Entering = isOwn ? FadeInRight : FadeInLeft;

  return (
    <Animated.View
      entering={Entering.springify().damping(18)}
      className={`mb-4 max-w-[82%] ${isOwn ? 'self-end items-end' : 'self-start items-start'}`}
    >
      <View
        className="px-4 py-3 rounded-2xl"
        style={{
          backgroundColor: isOwn ? theme.brandDark : colors.white,
          borderBottomRightRadius: isOwn ? 6 : 16,
          borderBottomLeftRadius: isOwn ? 16 : 6,
        }}
      >
        <Text
          className="text-[15px] leading-5"
          style={{ color: isOwn ? '#fff' : colors.textPrimary }}
        >
          {content}
        </Text>
      </View>
      {timeLabel ? (
        <Text className="text-[11px] text-text-secondary mt-1.5 px-1">{timeLabel}</Text>
      ) : null}
    </Animated.View>
  );
}

export function ChatDateSeparator({ label }: { label: string }) {
  return (
    <View className="items-center my-2">
      <Text className="text-[11px] font-semibold text-text-secondary tracking-[1.5px] uppercase">
        {label}
      </Text>
    </View>
  );
}
