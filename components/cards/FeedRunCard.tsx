import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Avatar } from '@/components/ui/Avatar';
import type { FeedRun } from '@/types/app';
import { formatRunDateTime, getFirstName } from '@/utils/formatters';
import { resolveRequestCTA } from '@/features/requests/api';
import { cardFrame } from '@/constants/cardStyle';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

interface FeedRunCardProps {
  run: FeedRun;
  index: number;
  onJoin: (run: FeedRun) => void;
  onOpenChat: (run: FeedRun) => void;
}

export const FeedRunCard = React.memo(function FeedRunCard({
  run,
  index,
  onJoin,
  onOpenChat,
}: FeedRunCardProps) {
  const router = useRouter();
  const creatorName = getFirstName(run.creator.name);
  const ctaState = resolveRequestCTA(run.requestStatus, undefined);
  const distanceAway = run.distanceKm != null ? `${run.distanceKm} km away` : null;

  const ctaLabel =
    ctaState === 'requested'
      ? 'Requested'
      : ctaState === 'accepted'
        ? 'Open Chat →'
        : ctaState === 'expired'
          ? 'Request Expired'
          : ctaState === 'declined'
            ? 'Not Available'
            : `Join ${creatorName}'s Run`;

  const ctaDisabled = ctaState !== 'default' && ctaState !== 'accepted';

  const handleCTA = useCallback(() => {
    if (ctaState === 'accepted') onOpenChat(run);
    else if (ctaState === 'default') onJoin(run);
  }, [ctaState, run, onJoin, onOpenChat]);

  const statTags: string[] = [];
  if (run.distance) statTags.push(`${run.distance} km`);
  if (run.pace) statTags.push(`${run.pace} min/km`);
  run.vibe_tags.slice(0, 2).forEach((t) => statTags.push(`#${t.toLowerCase().replace(/\s/g, '')}`));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(350)}
      className="mb-8 rounded-3xl overflow-hidden"
      style={{
        ...cardFrame,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      <Pressable
        onPress={() => router.push(`/user/${run.creator.id}`)}
        className="flex-row items-center px-4 pt-4 pb-3"
      >
        <Avatar uri={run.creator.photos?.[0]} name={run.creator.name} size="md" />
        <View className="flex-1 ml-3">
          <Text className="text-base font-bold text-text-primary">
            {run.creator.name}
            {run.creator.age ? `, ${run.creator.age}` : ''}
          </Text>
          <Text className="text-sm text-text-secondary mt-0.5">
            {run.creator.city ?? '—'}
            {run.creator.vibe_tags?.[0] ? ` • ${run.creator.vibe_tags[0]}` : ''}
          </Text>
        </View>
        {distanceAway && (
          <View style={{ backgroundColor: theme.peach }} className="rounded-full px-3 py-1.5">
            <Text className="text-xs font-medium" style={{ color: theme.brand }}>
              {distanceAway}
            </Text>
          </View>
        )}
      </Pressable>

      <Pressable onPress={() => router.push(`/user/${run.creator.id}`)}>
        <Image
          source={{ uri: run.image }}
          style={{ width: '100%', height: 280 }}
          contentFit="cover"
        />
      </Pressable>

      <View className="px-4 pt-4 pb-4">
        <Text className="text-xl font-bold text-text-primary">{run.title}</Text>

        <View className="flex-row items-center gap-2 mt-2">
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text className="text-sm text-text-secondary flex-1">{run.location}</Text>
        </View>

        <View className="flex-row items-center gap-2 mt-1.5">
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text className="text-sm text-text-secondary">{formatRunDateTime(run.datetime)}</Text>
        </View>

        {statTags.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-4">
            {statTags.map((tag) => (
              <View
                key={tag}
                style={{ backgroundColor: theme.peach }}
                className="rounded-full px-3 py-1.5"
              >
                <Text className="text-xs font-medium text-text-primary">{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <Pressable
          onPress={handleCTA}
          disabled={ctaDisabled}
          style={{
            backgroundColor: ctaDisabled ? theme.cardMuted : theme.brand,
            marginTop: 16,
          }}
          className="rounded-2xl py-4 items-center"
        >
          <Text
            className="text-base font-semibold"
            style={{ color: ctaDisabled ? colors.textSecondary : '#fff' }}
          >
            {ctaLabel}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
});
