import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

interface BercPlusLikesBannerProps {
  likeCount: number;
  onPress: () => void;
}

export function BercPlusLikesBanner({ likeCount, onPress }: BercPlusLikesBannerProps) {
  return (
    <Pressable onPress={onPress} className="mx-5 mb-5 rounded-2xl overflow-hidden">
      <LinearGradient
        colors={[theme.brand, '#C45A2A', '#D4743F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 18 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-lg font-bold text-white leading-6">
              See who wants to run with you
            </Text>
            <Text className="text-sm text-white/85 mt-1">
              {likeCount} runner{likeCount === 1 ? '' : 's'} liked you · Upgrade to berc+
            </Text>
          </View>
          <View
            className="w-11 h-11 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
          >
            <Ionicons name="heart" size={22} color="#fff" />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
