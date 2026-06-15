import React, { useMemo } from 'react';
import { View, Text, Pressable, Platform, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { RecommendedRunner } from '@/constants/mockRecommendations';
import { getMockUserById } from '@/constants/mockUsers';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';
import { formatUserAge } from '@/utils/formatters';

interface StandoutCardProps {
  item: RecommendedRunner;
  width: number;
  height: number;
  isActive: boolean;
  onPressProfile: () => void;
  style?: ViewStyle;
}

const SERIF_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

export const StandoutCard = React.memo(function StandoutCard({
  item,
  width,
  height,
  isActive,
  onPressProfile,
  style,
}: StandoutCardProps) {
  const { run, reason, prompt, answer } = item;

  const photo = useMemo(() => {
    const mockUser = getMockUserById(run.creator_id);
    return mockUser?.photos?.[0] ?? run.creator.photos?.[0] ?? run.image;
  }, [run]);

  const showTodaysPick = isActive && reason.toUpperCase().includes("TODAY");

  return (
    <Pressable
      onPress={onPressProfile}
      style={[
        {
          width,
          height,
          borderRadius: 30,
          overflow: 'hidden',
          backgroundColor: theme.card,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.14,
          shadowRadius: 20,
          elevation: 10,
        },
        style,
      ]}
    >
      <Image
        source={{ uri: photo }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.08)', 'rgba(0,0,0,0.75)']}
        locations={[0, 0.42, 1]}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />

      {showTodaysPick ? (
        <View
          className="absolute top-5 left-5 rounded-full px-3.5 py-1.5"
          style={{ backgroundColor: theme.brandDark }}
        >
          <Text className="text-[11px] font-bold text-white tracking-wide uppercase">
            Today's pick
          </Text>
        </View>
      ) : reason ? (
        <View
          className="absolute top-5 left-5 rounded-full px-3.5 py-1.5"
          style={{ backgroundColor: theme.brandDark }}
        >
          <Text className="text-[11px] font-bold text-white tracking-wide uppercase">
            {reason}
          </Text>
        </View>
      ) : null}

      <View className="absolute left-5 right-5" style={{ top: height * 0.36 }}>
        <View
          className="rounded-[18px] px-4 py-4"
          style={{ backgroundColor: 'rgba(255,255,255,0.97)' }}
        >
          <Text
            className="text-[10px] font-bold uppercase tracking-[1.5px] mb-2"
            style={{ color: colors.textSecondary }}
          >
            {prompt}
          </Text>
          <Text
            className="text-[17px] leading-6"
            style={{ color: colors.textPrimary, fontFamily: SERIF_FONT }}
          >
            "{answer}"
          </Text>
        </View>
      </View>

      <View className="absolute left-5 right-5 bottom-5">
        <Text className="text-[28px] font-bold text-white leading-8">
          {run.creator.name}
          {run.creator.age ? `, ${formatUserAge(run.creator.age)}` : ''}
        </Text>
        <View className="flex-row items-center gap-1.5 mt-1.5">
          <Ionicons name="location-sharp" size={14} color="rgba(255,255,255,0.92)" />
          <Text className="text-sm font-medium text-white/90">
            {run.creator.city ?? 'London'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
});
