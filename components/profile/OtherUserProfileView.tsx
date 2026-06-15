import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';
import type { RunRow, UserRow } from '@/types/database';
import { formatRunDateTime } from '@/utils/formatters';
import { usePeopleDiscoveryStore } from '@/store/peopleDiscoveryStore';

interface OtherUserProfileViewProps {
  user: UserRow;
  runs: RunRow[];
  onBack: () => void;
  onJoinRun?: (run: RunRow) => void;
  joinLoading?: boolean;
}

export function OtherUserProfileView({
  user,
  runs,
  onBack,
  onJoinRun,
  joinLoading,
}: OtherUserProfileViewProps) {
  const insets = useSafeAreaInsets();
  const invitePerson = usePeopleDiscoveryStore((s) => s.invitePerson);
  const invitedIds = usePeopleDiscoveryStore((s) => s.invitedIds);
  const isInvited = invitedIds.includes(user.id);

  const heroPhoto = user.photos[0];
  const thumbs = user.photos.slice(1, 4);
  const firstName = user.name.split(' ')[0];
  const primaryRun = runs[0];

  const handleInvite = () => {
    invitePerson(user.id);
    Alert.alert('Invite sent (demo)', `You invited ${firstName} to run.`);
  };

  return (
    <View className="flex-1 bg-page">
      <View
        className="flex-row items-center px-5 pb-3 border-b border-border"
        style={{ paddingTop: insets.top + 8, backgroundColor: colors.background }}
      >
        <Pressable onPress={onBack} hitSlop={10} className="w-10 h-10 justify-center">
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text className="flex-1 text-center text-base font-semibold text-text-primary mr-10">
          {firstName}&apos;s Profile
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="mx-5 rounded-3xl overflow-hidden mb-3 mt-4" style={{ height: 300 }}>
          {heroPhoto ? (
            <Image
              source={{ uri: heroPhoto }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : null}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.65)']}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 140 }}
          />
          <View className="absolute bottom-4 left-4 right-4">
            <Text className="text-2xl font-bold text-white">
              {user.name}
              {user.age ? `, ${user.age}` : ''}
            </Text>
            {user.city ? (
              <View className="flex-row items-center self-start mt-2 bg-black/35 rounded-full px-3 py-1.5 gap-1.5">
                <Ionicons name="location" size={12} color="#fff" />
                <Text className="text-xs font-semibold text-white uppercase tracking-wide">
                  {user.city}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {thumbs.length > 0 && (
          <View className="flex-row px-5 mb-4" style={{ gap: 8 }}>
            {thumbs.map((uri, i) => (
              <Image
                key={`${uri}-${i}`}
                source={{ uri }}
                style={{ width: 72, height: 72, borderRadius: 12 }}
                contentFit="cover"
              />
            ))}
          </View>
        )}

        <View className="mx-5 rounded-3xl p-5 mb-4" style={{ backgroundColor: theme.card }}>
          <Text className="text-lg font-bold text-text-primary mb-2">About</Text>
          <Text className="text-base text-text-secondary leading-6">
            {user.bio ?? 'No bio yet.'}
          </Text>

          <View className="flex-row flex-wrap mt-4" style={{ gap: 8 }}>
            {user.vibe_tags.map((tag) => (
              <View
                key={tag}
                style={{ backgroundColor: theme.peach }}
                className="rounded-full px-3 py-1.5"
              >
                <Text className="text-sm font-medium text-text-primary">{tag}</Text>
              </View>
            ))}
          </View>

          <View className="flex-row flex-wrap mt-5" style={{ gap: 12 }}>
            {user.weekly_km != null && (
              <StatBox label="Weekly km" value={`${user.weekly_km} km`} />
            )}
            {user.average_pace && <StatBox label="Avg. pace" value={`${user.average_pace} /km`} />}
            {user.favourite_route && (
              <StatBox label="Favourite route" value={user.favourite_route} />
            )}
          </View>
        </View>

        <View className="px-5 mb-3">
          <Text className="text-lg font-bold text-text-primary">Upcoming runs</Text>
        </View>

        {runs.length === 0 ? (
          <View className="mx-5 rounded-2xl p-4 bg-white border border-border">
            <Text className="text-sm text-text-secondary">No upcoming runs posted yet.</Text>
          </View>
        ) : (
          runs.map((run) => (
            <View
              key={run.id}
              className="mx-5 mb-3 flex-row items-center rounded-2xl p-3 bg-white border border-border"
            >
              <Image
                source={{ uri: run.image }}
                style={{ width: 56, height: 56, borderRadius: 12 }}
                contentFit="cover"
              />
              <View className="flex-1 ml-3">
                <Text className="text-xs font-semibold" style={{ color: theme.brand }}>
                  {formatRunDateTime(run.datetime)}
                </Text>
                <Text className="text-base font-bold text-text-primary mt-0.5">{run.title}</Text>
                <Text className="text-sm text-text-secondary mt-0.5">
                  {run.distance ? `${run.distance} km` : '—'}
                  {run.pace ? ` • ${run.pace} /km` : ''}
                </Text>
              </View>
            </View>
          ))
        )}

        <View className="px-5 mt-4 gap-3">
          {primaryRun && onJoinRun ? (
            <Pressable
              onPress={() => onJoinRun(primaryRun)}
              disabled={joinLoading}
              className="rounded-2xl py-4 items-center"
              style={{ backgroundColor: joinLoading ? theme.cardMuted : theme.brand }}
            >
              <Text className="text-base font-semibold text-white">
                {joinLoading ? 'Sending...' : `Join ${firstName}'s Run`}
              </Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={handleInvite}
            className="rounded-2xl py-4 items-center border border-border bg-white"
          >
            <Text className="text-base font-semibold" style={{ color: theme.brand }}>
              {isInvited ? 'Invited' : `Invite ${firstName}`}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View
      className="rounded-2xl p-4"
      style={{ backgroundColor: '#EEEBE6', flexBasis: '47%', flexGrow: 1 }}
    >
      <Text className="text-[10px] font-semibold text-text-secondary uppercase tracking-wide">
        {label}
      </Text>
      <Text className="text-xl font-bold mt-1" style={{ color: theme.brand }}>
        {value}
      </Text>
    </View>
  );
}
