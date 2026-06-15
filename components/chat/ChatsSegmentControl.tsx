import { View, Text, Pressable } from 'react-native';
import { theme } from '@/constants/theme';

export type ChatsTab = 'chats' | 'requests';

interface ChatsSegmentControlProps {
  active: ChatsTab;
  onChange: (tab: ChatsTab) => void;
}

export function ChatsSegmentControl({ active, onChange }: ChatsSegmentControlProps) {
  return (
    <View className="flex-row mx-5 mb-4 gap-2">
      {(['chats', 'requests'] as const).map((tab) => {
        const selected = active === tab;
        return (
          <Pressable
            key={tab}
            onPress={() => onChange(tab)}
            className="flex-1 rounded-full py-2.5 items-center"
            style={{
              backgroundColor: selected ? theme.brandDark : '#fff',
            }}
          >
            <Text
              className="text-sm font-bold capitalize"
              style={{ color: selected ? '#fff' : theme.brandDark }}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
