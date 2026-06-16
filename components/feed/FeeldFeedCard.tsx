import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { FeedRun } from '@/types/app';
import {
  formatDistanceAway,
  formatRunDateBlock,
  formatRunScheduleLine,
  getFirstName,
} from '@/utils/formatters';
import { resolveRequestCTA } from '@/features/requests/api';
import { getMockUserById, getMockRunsForUser } from '@/constants/mockUsers';
import { cardFrame } from '@/constants/cardStyle';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

interface FeeldFeedCardProps {
  run: FeedRun;
  onJoin: (run: FeedRun) => void;
  onOpenChat: (run: FeedRun) => void;
  onAdvance: (run: FeedRun) => void;
}

const STAT_STYLE = cardFrame;

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
};

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View
      className="rounded-2xl px-4 py-3.5"
      style={{ ...STAT_STYLE, flex: 1 }}
    >
      <Text
        className="text-[10px] font-bold uppercase tracking-wider"
        style={{ color: theme.brandDark }}
      >
        {label}
      </Text>
      <Text className="text-[22px] font-bold mt-1" style={{ color: theme.brand }}>
        {value}
      </Text>
    </View>
  );
}

function UpcomingRunCard({
  title,
  datetime,
  featured,
}: {
  title: string;
  datetime: string;
  featured?: boolean;
}) {
  const { month, day } = formatRunDateBlock(datetime);

  return (
    <View
      className="flex-row items-center rounded-2xl p-3 mb-3 bg-white"
      style={{
        ...CARD_SHADOW,
        borderWidth: featured ? 1 : 0,
        borderColor: featured ? theme.brand : 'transparent',
      }}
    >
      <View
        className="rounded-xl items-center justify-center"
        style={{
          width: 52,
          height: 52,
          backgroundColor: theme.brandDark,
        }}
      >
        <Text className="text-[10px] font-bold text-white uppercase tracking-wide">
          {month}
        </Text>
        <Text className="text-lg font-bold text-white leading-5">{day}</Text>
      </View>

      <View className="flex-1 ml-3">
        <Text className="text-base font-bold text-text-primary">{title}</Text>
        <Text className="text-sm text-text-secondary mt-0.5">
          {formatRunScheduleLine(datetime)}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </View>
  );
}

export const FeeldFeedCard = React.memo(function FeeldFeedCard({
  run,
  onJoin,
  onOpenChat,
  onAdvance,
}: FeeldFeedCardProps) {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const creatorName = getFirstName(run.creator.name);
  const ctaState = resolveRequestCTA(run.requestStatus, undefined);

  const photoWidth = screenWidth - 40;
  const photoHeight = photoWidth * (4 / 3);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const mockUser = useMemo(() => getMockUserById(run.creator_id), [run.creator_id]);
  const userRuns = useMemo(() => getMockRunsForUser(run.creator_id), [run.creator_id]);

  const photos = useMemo(() => {
    const fromProfile = mockUser?.photos ?? run.creator.photos ?? [];
    const combined = [...fromProfile, run.image].filter(Boolean) as string[];
    return [...new Set(combined)];
  }, [mockUser?.photos, run.creator.photos, run.image]);

  const vibeTags = mockUser?.vibe_tags ?? run.vibe_tags;

  const locationLine = useMemo(() => {
    const neighborhood =
      run.location?.split(',')[0]?.trim() ?? run.creator.city ?? 'Nearby';
    const distanceLabel = formatDistanceAway(run.distanceKm);
    return distanceLabel ? `${neighborhood} • ${distanceLabel}` : neighborhood;
  }, [run.location, run.creator.city, run.distanceKm]);

  useEffect(() => {
    setActivePhotoIndex(0);
  }, [run.id]);

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

  const handlePhotoScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.y / photoHeight);
      setActivePhotoIndex(Math.max(0, Math.min(index, photos.length - 1)));
    },
    [photoHeight, photos.length],
  );

  const weeklyKm = mockUser?.weekly_km;
  const averagePace = mockUser?.average_pace;

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
      >
        <View className="pt-2">
          <View
            className="mx-5 rounded-2xl overflow-hidden bg-white self-center"
            style={{ width: photoWidth, height: photoHeight, ...CARD_SHADOW }}
          >
            <FlatList
              data={photos}
              keyExtractor={(uri, index) => `${uri}-${index}`}
              pagingEnabled
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              bounces={photos.length > 1}
              onMomentumScrollEnd={handlePhotoScroll}
              onScroll={handlePhotoScroll}
              scrollEventThrottle={32}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={{ width: photoWidth, height: photoHeight }}
                  contentFit="cover"
                />
              )}
              getItemLayout={(_, index) => ({
                length: photoHeight,
                offset: photoHeight * index,
                index,
              })}
            />

            {photos.length > 1 ? (
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  right: 10,
                  top: 16,
                  bottom: 16,
                  width: 3,
                  justifyContent: 'center',
                  gap: 5,
                }}
              >
                {photos.map((_, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      maxHeight: 24,
                      borderRadius: 2,
                      backgroundColor:
                        index === activePhotoIndex
                          ? 'rgba(255,255,255,0.95)'
                          : 'rgba(255,255,255,0.35)',
                    }}
                  />
                ))}
              </View>
            ) : null}
          </View>

          <View className="px-5 mt-4">
            <Text className="text-[26px] font-bold text-text-primary leading-8">
              {run.creator.name}
              {run.creator.age ? `, ${run.creator.age}` : ''}
            </Text>
            <View className="flex-row items-center gap-1 mt-1">
              <Ionicons name="location-sharp" size={13} color={colors.textSecondary} />
              <Text className="text-sm font-medium text-text-secondary">{locationLine}</Text>
            </View>
          </View>
        </View>

        {mockUser && (weeklyKm != null || averagePace) ? (
          <View className="flex-row gap-3 px-3 mt-5">
            {weeklyKm != null ? (
              <StatBox label="Weekly km" value={`${Math.round(weeklyKm)}km`} />
            ) : null}
            {averagePace ? (
              <StatBox label="Avg pace" value={`${averagePace}/km`} />
            ) : null}
          </View>
        ) : null}

        <View className="px-3 mt-6">
          <Text
            className="text-[11px] font-bold uppercase tracking-wider mb-2"
            style={{ color: theme.brandDark }}
          >
            About
          </Text>
          <Text className="text-[15px] text-text-primary leading-6">
            {mockUser?.bio ?? 'No bio yet.'}
          </Text>

          {vibeTags.length > 0 ? (
            <View className="flex-row flex-wrap mt-4 gap-2">
              {vibeTags.slice(0, 5).map((tag) => (
                <View
                  key={tag}
                  className="rounded-full px-3.5 py-2 border bg-white"
                  style={{ borderColor: colors.border }}
                >
                  <Text className="text-sm font-semibold text-text-secondary">
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <View className="px-3 mt-7">
          <Text
            className="text-[11px] font-bold uppercase tracking-wider mb-3"
            style={{ color: theme.brandDark }}
          >
            Upcoming runs
          </Text>

          {userRuns.length === 0 ? (
            <View className="rounded-2xl p-4" style={cardFrame}>
              <Text className="text-sm text-text-secondary">No upcoming runs posted yet.</Text>
            </View>
          ) : (
            userRuns.map((userRun) => (
              <UpcomingRunCard
                key={userRun.id}
                title={userRun.title}
                datetime={userRun.datetime}
                featured={userRun.id === run.id}
              />
            ))
          )}
        </View>
      </ScrollView>

      <View
        pointerEvents="box-none"
        className="absolute left-0 right-0 bottom-0 flex-row items-center gap-4 px-5"
        style={{ paddingBottom: insets.bottom + 12, paddingTop: 12 }}
      >
        <Pressable
          onPress={handlePass}
          className="w-[52px] h-[52px] rounded-full items-center justify-center bg-white"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Ionicons name="close" size={26} color={colors.textPrimary} />
        </Pressable>

        <Pressable
          onPress={handlePrimary}
          disabled={ctaDisabled}
          className="flex-1 h-[52px] rounded-full items-center justify-center"
          style={{
            backgroundColor: ctaDisabled ? theme.cardMuted : theme.brand,
            shadowColor: theme.brand,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
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
