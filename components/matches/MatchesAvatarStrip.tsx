import { ScrollView, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Avatar } from '@/components/ui/Avatar';
import type { MatchListItem } from '@/constants/mockMatches';
import { theme } from '@/constants/theme';

interface MatchesAvatarStripProps {
  matches: MatchListItem[];
  onPressMatch: (item: MatchListItem) => void;
  onMessage: (item: MatchListItem) => void;
}

export function MatchesAvatarStrip({
  matches,
  onPressMatch,
  onMessage,
}: MatchesAvatarStripProps) {
  if (matches.length === 0) return null;

  return (
    <View className="mb-5">
      <Text className="text-xs font-bold uppercase tracking-wider px-5 mb-3 text-text-secondary">
        New Matches
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
      >
        {matches.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => onPressMatch(item)}
            onLongPress={() => onMessage(item)}
            className="items-center"
            style={{ width: 76 }}
          >
            <View
              className="rounded-full p-0.5"
              style={{ borderWidth: 2, borderColor: theme.brand }}
            >
              {item.photo ? (
                <Image
                  source={{ uri: item.photo }}
                  style={{ width: 68, height: 68, borderRadius: 34 }}
                  contentFit="cover"
                />
              ) : (
                <Avatar name={item.name} size="lg" />
              )}
            </View>
            <Text
              className="text-xs font-semibold text-text-primary mt-2 text-center"
              numberOfLines={1}
            >
              {item.name.split(' ')[0]}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
