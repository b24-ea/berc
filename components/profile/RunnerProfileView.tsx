import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTopBar } from '@/components/ui/AppTopBar';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';
import type { RunRow, UserRow } from '@/types/database';
import {
  formatRunDateBlock,
  formatRunScheduleLine,
  getFirstName,
} from '@/utils/formatters';
import { MOCK_PROFILE_PHOTOS } from '@/constants/mockFeed';
import { usePeopleDiscoveryStore } from '@/store/peopleDiscoveryStore';

interface RunnerProfileViewProps {
  user: UserRow;
  runs: RunRow[];
  isOwnProfile?: boolean;
  onBack: () => void;
  onEdit?: () => void;
  onJoinRun?: (run: RunRow) => void;
  joinLoading?: boolean;
}

const STAT_BG = '#F3ECE4';

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3"
      style={{ color: theme.brandDark }}
    >
      {children}
    </Text>
  );
}

function AthleticStatCard({
  icon,
  label,
  value,
  wide,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <View
      className="rounded-2xl p-4"
      style={{
        backgroundColor: STAT_BG,
        flex: wide ? undefined : 1,
        width: wide ? '100%' : undefined,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Ionicons name={icon} size={14} color={theme.brandDark} />
            <Text
              className="text-[10px] font-bold uppercase tracking-wide"
              style={{ color: theme.brandDark }}
            >
              {label}
            </Text>
          </View>
          <Text className="text-xl font-bold" style={{ color: theme.brand }}>
            {value}
          </Text>
        </View>
        {wide ? (
          <View
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: `${theme.brand}18` }}
          >
            <Ionicons name="trophy-outline" size={18} color={theme.brand} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

function ScheduledRunCard({ run }: { run: RunRow }) {
  const { month, day } = formatRunDateBlock(run.datetime);
  const vibe = run.vibe_tags[0] ?? 'Run';
  const distance = run.distance ? `${run.distance}km` : '';
  const time = formatRunScheduleLine(run.datetime).split(' • ')[1] ?? '';
  const detail = [distance, vibe, time].filter(Boolean).join(' • ');

  return (
    <View
      className="flex-row items-center rounded-2xl p-3 mb-3 border"
      style={{ backgroundColor: colors.white, borderColor: colors.border }}
    >
      <View
        className="rounded-xl items-center justify-center"
        style={{ width: 52, height: 52, backgroundColor: theme.brandDark }}
      >
        <Text className="text-[10px] font-bold text-white uppercase">{month}</Text>
        <Text className="text-lg font-bold text-white leading-5">{day}</Text>
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-base font-bold text-text-primary">{run.title}</Text>
        <Text className="text-sm text-text-secondary mt-0.5">{detail}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </View>
  );
}

export function RunnerProfileView({
  user,
  runs,
  isOwnProfile = false,
  onBack,
  onEdit,
  onJoinRun,
  joinLoading,
}: RunnerProfileViewProps) {
  const insets = useSafeAreaInsets();
  const invitePerson = usePeopleDiscoveryStore((s) => s.invitePerson);
  const invitedIds = usePeopleDiscoveryStore((s) => s.invitedIds);
  const isInvited = invitedIds.includes(user.id);

  const photos = user.photos?.length ? user.photos : MOCK_PROFILE_PHOTOS;
  const heroPhoto = photos[0];
  const thumbs = photos.slice(1, 4);
  const extraCount = Math.max(0, photos.length - 4);
  const firstName = getFirstName(user.name);
  const primaryRun = runs[0];
  const runnerType = user.vibe_tags[0] ?? user.run_club ?? 'Runner';
  const locationLine = user.city ? `${runnerType} • ${user.city}` : runnerType;
  const best5k = '19:42';

  const handleInvite = () => {
    invitePerson(user.id);
    Alert.alert('Invite sent', `You invited ${firstName} to run.`);
  };

  const handleMore = () => {
    Alert.alert('Options', 'More actions coming soon.');
  };

  return (
    <View className="flex-1 bg-page">
      <View style={{ backgroundColor: colors.background }}>
        <AppTopBar
          leftContent={(
            <Pressable
              onPress={isOwnProfile ? onEdit : onBack}
              hitSlop={10}
              className="min-w-[46px] h-[46px] justify-center"
            >
              {isOwnProfile ? (
                <Text className="text-base font-semibold" style={{ color: theme.brand }}>
                  Edit
                </Text>
              ) : (
                <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
              )}
            </Pressable>
          )}
          rightContent={(
            <Pressable
              onPress={handleMore}
              hitSlop={10}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons name="ellipsis-horizontal" size={22} color={colors.textPrimary} />
            </Pressable>
          )}
          hideRightIcon
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isOwnProfile ? insets.bottom + 24 : insets.bottom + 100,
        }}
      >
        <View className="mx-5 rounded-[20px] overflow-hidden mt-2" style={{ height: 320 }}>
          {heroPhoto ? (
            <Image
              source={{ uri: heroPhoto }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : null}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.72)']}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 160 }}
          />
          <View className="absolute bottom-4 left-4 right-4">
            <Text className="text-[28px] font-bold text-white leading-8">{user.name}</Text>
            <Text className="text-sm font-medium text-white/90 mt-1">{locationLine}</Text>
          </View>
        </View>

        {thumbs.length > 0 || extraCount > 0 ? (
          <View className="flex-row px-5 mt-3" style={{ gap: 8 }}>
            {thumbs.map((uri, i) => (
              <Image
                key={`${uri}-${i}`}
                source={{ uri }}
                style={{ width: 72, height: 72, borderRadius: 14 }}
                contentFit="cover"
              />
            ))}
            {extraCount > 0 ? (
              <View
                className="rounded-[14px] items-center justify-center"
                style={{ width: 72, height: 72, backgroundColor: '#F7E8DF' }}
              >
                <Text className="text-base font-bold" style={{ color: theme.brandDark }}>
                  +{extraCount}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <View className="px-5 mt-6">
          <SectionLabel>Athletic profile</SectionLabel>
          <View className="flex-row gap-3">
            {user.average_pace ? (
              <AthleticStatCard
                icon="speedometer-outline"
                label="Avg pace"
                value={`${user.average_pace} /km`}
              />
            ) : null}
            {user.weekly_km != null ? (
              <AthleticStatCard
                icon="location-outline"
                label="Weekly dist"
                value={`${user.weekly_km} km`}
              />
            ) : null}
          </View>
          <View className="mt-3">
            <AthleticStatCard
              icon="timer-outline"
              label="Best effort (5k)"
              value={best5k}
              wide
            />
          </View>
        </View>

        <View className="px-5 mt-6">
          <SectionLabel>About</SectionLabel>
          <View
            className="rounded-2xl p-4"
            style={{ backgroundColor: STAT_BG }}
          >
            <Text className="text-[15px] text-text-primary leading-6">
              {user.bio ?? 'No bio yet.'}
            </Text>
            {user.vibe_tags.length > 0 ? (
              <View className="flex-row flex-wrap mt-4 gap-2">
                {user.vibe_tags.map((tag) => (
                  <View
                    key={tag}
                    className="rounded-full px-3.5 py-2 border"
                    style={{ borderColor: theme.brand, backgroundColor: 'transparent' }}
                  >
                    <Text className="text-sm font-semibold" style={{ color: theme.brandDark }}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>

        <View className="px-5 mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text
              className="text-[11px] font-bold uppercase tracking-[1.5px]"
              style={{ color: theme.brandDark }}
            >
              Scheduled runs
            </Text>
            {runs.length > 0 ? (
              <Pressable hitSlop={8}>
                <Text className="text-sm font-semibold" style={{ color: theme.brand }}>
                  View all
                </Text>
              </Pressable>
            ) : null}
          </View>

          {runs.length === 0 ? (
            <View className="rounded-2xl p-4 bg-white border border-border">
              <Text className="text-sm text-text-secondary">No upcoming runs posted yet.</Text>
            </View>
          ) : (
            runs.slice(0, 3).map((run) => <ScheduledRunCard key={run.id} run={run} />)
          )}
        </View>
      </ScrollView>

      {!isOwnProfile ? (
        <View
          className="absolute left-0 right-0 bottom-0 flex-row gap-3 px-5 pt-3"
          style={{
            paddingBottom: insets.bottom + 12,
            backgroundColor: 'rgba(250, 237, 230, 0.96)',
          }}
        >
          {primaryRun && onJoinRun ? (
            <Pressable
              onPress={() => onJoinRun(primaryRun)}
              disabled={joinLoading}
              className="flex-1 h-[52px] rounded-full items-center justify-center flex-row gap-2"
              style={{
                backgroundColor: joinLoading ? theme.cardMuted : theme.brand,
                shadowColor: theme.brand,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text className="text-base font-bold text-white">
                {joinLoading ? 'Sending...' : 'Join run'}
              </Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={handleInvite}
            className="flex-1 h-[52px] rounded-full items-center justify-center flex-row gap-2 border bg-white"
            style={{
              borderColor: colors.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Ionicons
              name="paper-plane-outline"
              size={18}
              color={isInvited ? colors.textSecondary : theme.brand}
            />
            <Text
              className="text-base font-bold"
              style={{ color: isInvited ? colors.textSecondary : theme.brandDark }}
            >
              {isInvited ? 'Invited' : 'Invite to run'}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
