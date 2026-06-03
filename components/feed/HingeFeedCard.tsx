import React, { useCallback } from 'react';
import { View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { FeedRun } from '@/types/app';
import { formatRunDateTime, getFirstName } from '@/utils/formatters';
import { resolveRequestCTA } from '@/features/requests/api';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

interface HingeFeedCardProps {
  run: FeedRun;
  cardHeight: number;
  onJoin: (run: FeedRun) => void;
  onOpenChat: (run: FeedRun) => void;
  onPass: (run: FeedRun) => void;
}

function InfoBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View
      className="rounded-2xl border px-4 py-3.5 mb-3 bg-white"
      style={{ borderColor: '#E8E4DF' }}
    >
      <Text
        className="text-[11px] font-semibold uppercase tracking-wider mb-2"
        style={{ color: theme.brand }}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}

export const HingeFeedCard = React.memo(function HingeFeedCard({
  run,
  cardHeight,
  onJoin,
  onOpenChat,
  onPass,
}: HingeFeedCardProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const creatorName = getFirstName(run.creator.name);
  const ctaState = resolveRequestCTA(run.requestStatus, undefined);
  const photoHeight = Math.round(cardHeight * 0.52);

  const ctaLabel =
    ctaState === 'requested'
      ? 'Requested'
      : ctaState === 'accepted'
        ? 'Message'
        : `Join ${creatorName}'s run`;

  const ctaDisabled = ctaState !== 'default' && ctaState !== 'accepted';

  const handlePrimary = useCallback(() => {
    if (ctaState === 'accepted') onOpenChat(run);
    else if (ctaState === 'default') onJoin(run);
  }, [ctaState, run, onJoin, onOpenChat]);

  const vibeLine = run.vibe_tags.slice(0, 3).join(' · ');

  return (
    <View style={{ height: cardHeight, width, paddingHorizontal: 16, paddingBottom: 8 }}>
      <View
        className="flex-1 rounded-3xl overflow-hidden bg-white"
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
        }}
      >
        <Pressable onPress={() => router.push(`/user/${run.creator.id}`)}>
          <Image
            source={{ uri: run.image }}
            style={{ width: '100%', height: photoHeight }}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.75)']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: photoHeight - 120,
              height: 120,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              top: photoHeight - 72,
            }}
          >
            <Text className="text-[26px] font-bold text-white">
              {run.creator.name}
              {run.creator.age ? `, ${run.creator.age}` : ''}
            </Text>
            <View className="flex-row items-center mt-1 gap-2 flex-wrap">
              <View className="flex-row items-center gap-1">
                <Ionicons name="location" size={13} color="#fff" />
                <Text className="text-sm font-medium text-white">
                  {run.creator.city ?? 'London'}
                </Text>
              </View>
              {run.distanceKm != null ? (
                <Text className="text-sm text-white/90">{run.distanceKm} km away</Text>
              ) : null}
            </View>
          </View>
        </Pressable>

        <ScrollView
          className="flex-1 px-4 pt-3"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <InfoBlock label="Upcoming run">
            <Text className="text-[17px] font-semibold text-text-primary leading-snug">
              {run.title}
            </Text>
            <Text className="text-sm text-text-secondary mt-1.5">
              {formatRunDateTime(run.datetime)}
            </Text>
            <View className="flex-row items-center gap-1.5 mt-1">
              <Ionicons name="navigate-outline" size={14} color={colors.textSecondary} />
              <Text className="text-sm text-text-secondary flex-1">{run.location}</Text>
            </View>
          </InfoBlock>

          <InfoBlock label="Run details">
            <Text className="text-base font-medium text-text-primary">
              {run.distance ? `${run.distance} km` : '—'}
              {run.pace ? ` · ${run.pace} /km` : ''}
            </Text>
            {vibeLine ? (
              <Text className="text-sm mt-1.5" style={{ color: theme.brandDark }}>
                {vibeLine}
              </Text>
            ) : null}
          </InfoBlock>
        </ScrollView>

        <View className="flex-row items-center justify-center gap-5 px-4 pb-5 pt-1">
          <Pressable
            onPress={() => onPass(run)}
            className="w-14 h-14 rounded-full items-center justify-center border-2 bg-white"
            style={{ borderColor: '#D9D4CE' }}
          >
            <Ionicons name="close" size={28} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            onPress={handlePrimary}
            disabled={ctaDisabled}
            className="flex-1 max-w-[220px] h-14 rounded-full items-center justify-center"
            style={{
              backgroundColor: ctaDisabled ? theme.cardMuted : theme.brand,
            }}
          >
            <View className="flex-row items-center gap-2">
              {ctaState === 'default' ? (
                <Ionicons name="footsteps" size={20} color="#fff" />
              ) : (
                <Ionicons
                  name={ctaState === 'accepted' ? 'chatbubble' : 'time-outline'}
                  size={18}
                  color={ctaDisabled ? colors.textSecondary : '#fff'}
                />
              )}
              <Text
                className="text-base font-bold"
                style={{ color: ctaDisabled ? colors.textSecondary : '#fff' }}
              >
                {ctaLabel}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
});
