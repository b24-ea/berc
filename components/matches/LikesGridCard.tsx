import { View, Text, Pressable, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

export interface LikeGridItem {
  id: string;
  userId: string;
  name: string;
  age?: number | null;
  photo?: string | null;
  runTitle?: string;
  status: 'pending' | 'accepted';
  locked: boolean;
}

interface LikesGridCardProps {
  item: LikeGridItem;
  width: number;
  style?: ViewStyle;
  onPress: () => void;
}

export function LikesGridCard({ item, width, style, onPress }: LikesGridCardProps) {
  const height = width * (4 / 3);
  const firstName = item.name.split(' ')[0];

  return (
    <Pressable
      onPress={onPress}
      style={[{ width, height, borderRadius: 14, overflow: 'hidden' }, style]}
    >
      {item.photo ? (
        <Image
          source={{ uri: item.photo }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          blurRadius={item.locked ? 18 : 0}
        />
      ) : (
        <View className="flex-1 items-center justify-center bg-white" style={{ width, height }}>
          <Text className="text-3xl font-bold" style={{ color: theme.brand }}>
            {firstName[0]}
          </Text>
        </View>
      )}

      {item.locked ? (
        <View
          className="absolute inset-0 items-center justify-center"
          style={{ backgroundColor: 'rgba(26, 26, 26, 0.28)' }}
        >
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
          >
            <Ionicons name="heart" size={22} color={theme.brand} />
          </View>
        </View>
      ) : null}

      {!item.locked ? (
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.75)']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: height * 0.42,
            justifyContent: 'flex-end',
            padding: 12,
          }}
        >
          <Text className="text-base font-bold text-white">
            {item.name}
            {item.age ? `, ${item.age}` : ''}
          </Text>
          {item.runTitle ? (
            <Text className="text-xs text-white/85 mt-0.5" numberOfLines={1}>
              {item.runTitle}
            </Text>
          ) : null}
        </LinearGradient>
      ) : null}

      {item.status === 'accepted' && !item.locked ? (
        <View
          className="absolute top-2.5 left-2.5 rounded-full px-2 py-0.5"
          style={{ backgroundColor: theme.brand }}
        >
          <Text className="text-[10px] font-bold text-white uppercase tracking-wide">Match</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export function LikesSectionHeader({ count }: { count: number }) {
  return (
    <View className="px-5 mb-4">
      <Text className="text-[32px] font-bold text-text-primary leading-9">Likes</Text>
      <Text className="text-base mt-1" style={{ color: colors.textSecondary }}>
        {count} {count === 1 ? 'person wants' : 'people want'} to run with you
      </Text>
    </View>
  );
}
