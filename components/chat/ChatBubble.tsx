import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';
import { View, Text } from 'react-native';

interface ChatBubbleProps {
  content: string;
  isOwn: boolean;
}

export function ChatBubble({ content, isOwn }: ChatBubbleProps) {
  const Entering = isOwn ? FadeInRight : FadeInLeft;

  return (
    <Animated.View
      entering={Entering.springify().damping(18)}
      className={`mb-2 max-w-[80%] ${isOwn ? 'self-end' : 'self-start'}`}
    >
      <View
        className={`px-4 py-3 rounded-3xl ${
          isOwn ? 'bg-accent rounded-br-md' : 'bg-card rounded-bl-md'
        }`}
      >
        <Text className={`text-base leading-5 ${isOwn ? 'text-white' : 'text-text-primary'}`}>
          {content}
        </Text>
      </View>
    </Animated.View>
  );
}
