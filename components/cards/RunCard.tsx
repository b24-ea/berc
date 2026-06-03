import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import type { FeedRun, RunCardCTAState } from '@/types/app';
import {
  formatDistanceAndPace,
  formatRunDateTime,
  formatUserAge,
  formatUserLocation,
  getFirstName,
} from '@/utils/formatters';
import { resolveRequestCTA } from '@/features/requests/api';

interface RunCardProps {
  run: FeedRun;
  index: number;
  onJoin: (run: FeedRun) => void;
  onOpenChat: (run: FeedRun) => void;
}

function getCTAConfig(state: RunCardCTAState, creatorName: string) {
  switch (state) {
    case 'requested':
      return { label: 'Requested', variant: 'muted' as const, disabled: true };
    case 'accepted':
      return { label: 'Open Chat →', variant: 'primary' as const, disabled: false };
    case 'expired':
      return { label: 'Request Expired', variant: 'muted' as const, disabled: true };
    case 'declined':
      return { label: 'Not Available', variant: 'muted' as const, disabled: true };
    default:
      return {
        label: `Join ${creatorName}'s Run`,
        variant: 'primary' as const,
        disabled: false,
      };
  }
}

export const RunCard = React.memo(function RunCard({
  run,
  index,
  onJoin,
  onOpenChat,
}: RunCardProps) {
  const router = useRouter();
  const creatorName = getFirstName(run.creator.name);
  const ctaState = resolveRequestCTA(run.requestStatus, undefined);
  const cta = getCTAConfig(ctaState, creatorName);
  const avatarUri = run.creator.photos?.[0];

  const handleCTA = useCallback(() => {
    if (ctaState === 'accepted') {
      onOpenChat(run);
    } else if (ctaState === 'default') {
      onJoin(run);
    }
  }, [ctaState, run, onJoin, onOpenChat]);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).duration(400)}
      className="mb-6"
    >
      <Pressable
        onPress={() => router.push(`/user/${run.creator.id}`)}
        className="flex-row items-center gap-3 mb-3"
      >
        <Avatar uri={avatarUri} name={run.creator.name} size="md" />
        <View>
          <Text className="text-base font-semibold text-text-primary">
            {run.creator.name}
            {run.creator.age ? `, ${formatUserAge(run.creator.age)}` : ''}
          </Text>
          <Text className="text-sm text-text-secondary">
            {formatUserLocation(run.creator.city)}
          </Text>
        </View>
      </Pressable>

      <View className="rounded-3xl overflow-hidden mb-3">
        <Image
          source={{ uri: run.image }}
          style={{ width: '100%', aspectRatio: 4 / 5 }}
          contentFit="cover"
          transition={300}
        />
      </View>

      <View className="gap-1 mb-3">
        <Text className="text-xl font-semibold text-text-primary">{run.title}</Text>
        <Text className="text-sm text-text-secondary">{run.location}</Text>
        <Text className="text-sm text-text-secondary">
          {formatRunDateTime(run.datetime)}
        </Text>
        {(run.distance || run.pace) && (
          <Text className="text-sm text-text-secondary">
            {formatDistanceAndPace(run.distance, run.pace)}
          </Text>
        )}
      </View>

      {run.vibe_tags.length > 0 && (
        <View className="flex-row flex-wrap gap-1 mb-4">
          {run.vibe_tags.map((tag) => (
            <View key={tag} className="mr-1">
              <Chip label={tag} />
            </View>
          ))}
        </View>
      )}

      <Button
        label={cta.label}
        variant={cta.variant}
        fullWidth
        disabled={cta.disabled}
        onPress={handleCTA}
      />
    </Animated.View>
  );
});
