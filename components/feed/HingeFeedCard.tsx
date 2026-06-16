import React, { useCallback, useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { FeedRun } from '@/types/app';
import { formatRunDateTime, getFirstName } from '@/utils/formatters';
import { resolveRequestCTA } from '@/features/requests/api';
import { getMockUserById } from '@/constants/mockUsers';
import { cardFrame } from '@/constants/cardStyle';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

interface HingeFeedCardProps {
  run: FeedRun;
  onJoin: (run: FeedRun) => void;
  onOpenChat: (run: FeedRun) => void;
  onAdvance: (run: FeedRun) => void;
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
      className="rounded-2xl border px-4 py-3.5 mb-3 mx-4"
      style={cardFrame}
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

const PHOTO_HEIGHT = 400;

export const HingeFeedCard = React.memo(function HingeFeedCard({
  run,
  onJoin,
  onOpenChat,
  onAdvance,
}: HingeFeedCardProps) {
  const router = useRouter();
  const creatorName = getFirstName(run.creator.name);
  const ctaState = resolveRequestCTA(run.requestStatus, undefined);

  const photos = useMemo(() => {
    const mockUser = getMockUserById(run.creator_id);
    const fromProfile = mockUser?.photos ?? run.creator.photos ?? [];
    const combined = [...fromProfile, run.image].filter(Boolean) as string[];
    return [...new Set(combined)];
  }, [run.creator_id, run.creator.photos, run.image]);

  const ctaLabel =
    ctaState === 'requested'
      ? 'Requested'
      : ctaState === 'accepted'
        ? 'Message'
        : `Join ${creatorName}'s run`;

  const ctaDisabled = ctaState !== 'default' && ctaState !== 'accepted';

  const handlePrimary = useCallback(() => {
    if (ctaState === 'accepted') {
      onOpenChat(run);
      return;
    }
    if (ctaState === 'default') {
      onJoin(run);
      onAdvance(run);
    }
  }, [ctaState, run, onJoin, onOpenChat, onAdvance]);

  const handlePass = useCallback(() => {
    onAdvance(run);
  }, [run, onAdvance]);

  const vibeLine = run.vibe_tags.slice(0, 3).join(' · ');
  const heroPhoto = photos[0];

  return (
    <View className="flex-1">
      <ScrollView
        key={run.id}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {photos.map((uri, index) => (
          <Pressable
            key={`${uri}-${index}`}
            onPress={() => router.push(`/user/${run.creator.id}`)}
          >
            <View style={{ position: 'relative' }}>
              <Image
                source={{ uri }}
                style={{ width: '100%', height: PHOTO_HEIGHT }}
                contentFit="cover"
              />
            {index === 0 && heroPhoto ? (
              <>
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.75)']}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 140,
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    left: 20,
                    right: 20,
                    bottom: 20,
                  }}
                >
                  <Text className="text-[28px] font-bold text-white">
                    {run.creator.name}
                    {run.creator.age ? `, ${run.creator.age}` : ''}
                  </Text>
                  <View className="flex-row items-center mt-2 gap-2 flex-wrap">
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
              </>
            ) : null}
            </View>
          </Pressable>
        ))}

        <View className="pt-2">
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
        </View>
      </ScrollView>

      <View
        className="absolute left-0 right-0 bottom-0 flex-row items-center justify-center gap-5 px-4 py-4 border-t border-border bg-background"
      >
        <Pressable
          onPress={handlePass}
          className="w-14 h-14 rounded-full items-center justify-center border-2 bg-card"
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
  );
});
