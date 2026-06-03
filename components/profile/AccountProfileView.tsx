import { View, Text, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppTopBar } from '@/components/ui/AppTopBar';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';
import type { UserRow } from '@/types/database';
import { MOCK_PROFILE_PHOTOS, MOCK_UPCOMING_RUNS } from '@/constants/mockFeed';
import { format, parseISO, isValid } from 'date-fns';

interface AccountProfileViewProps {
  user: UserRow;
  showDevActions?: boolean;
  onSignOut?: () => void;
  onEditProfile?: () => void;
  onSettingsPress?: () => void;
}

function formatUpcomingDate(iso: string): string {
  try {
    const d = parseISO(iso);
    if (!isValid(d)) return iso;
    return format(d, 'EEE, d MMM • HH:mm');
  } catch {
    return iso;
  }
}

export function AccountProfileView({
  user,
  showDevActions,
  onSignOut,
  onEditProfile,
  onSettingsPress,
}: AccountProfileViewProps) {
  const photos =
    user.photos && user.photos.length > 0 ? user.photos : MOCK_PROFILE_PHOTOS;
  const heroPhoto = photos[0] ?? MOCK_PROFILE_PHOTOS[0];
  const thumbs = photos.slice(1, 5);
  const firstName = user.name?.split(' ')[0] ?? 'Runner';

  const stats = [
    {
      label: 'Weekly Distance',
      value: user.weekly_km != null ? `${user.weekly_km} km` : '52.4 km',
    },
    { label: 'Avg. Pace', value: user.average_pace ? `${user.average_pace} /km` : '4:55 /km' },
    { label: 'Total Runs', value: '128' },
    { label: 'Elevation Gain', value: '1,240 m' },
  ];

  const vibeTags =
    user.vibe_tags && user.vibe_tags.length > 0
      ? user.vibe_tags
      : ['Trail Run', 'Marathoner', 'Dog Lover'];

  return (
    <View className="flex-1 bg-background">
      <AppTopBar
        onRightIconPress={onSettingsPress}
        rightIconName="settings-outline"
        rightIconColor={theme.brand}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        nestedScrollEnabled
      >
        <View className="mx-5 rounded-3xl overflow-hidden mb-3" style={{ height: 320 }}>
          <Image
            source={{ uri: heroPhoto }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.65)']}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 160 }}
          />
          <View className="absolute bottom-5 left-5 right-5">
            <Text className="text-3xl font-bold text-white">
              {firstName}
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
          <View
            className="flex-row px-5 mb-4"
            style={{ gap: 8 }}
          >
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

        <View className="mx-5 rounded-3xl p-5 mb-6" style={{ backgroundColor: theme.card }}>
          <Text className="text-lg font-bold text-text-primary mb-3">Bio</Text>
          <Text className="text-base text-text-secondary leading-6">
            {user.bio ||
              "Marathoner, morning coffee enthusiast, and trail seeker. I run for the silence and the stories. Let's hit the miles!"}
          </Text>

          <View className="flex-row flex-wrap mt-4" style={{ gap: 8 }}>
            {vibeTags.map((tag) => (
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
            {stats.map((stat) => (
              <View
                key={stat.label}
                className="rounded-2xl p-4"
                style={{ backgroundColor: '#EEEBE6', flexBasis: '47%', flexGrow: 1 }}
              >
                <Text className="text-[10px] font-semibold text-text-secondary uppercase tracking-wide">
                  {stat.label}
                </Text>
                <Text className="text-xl font-bold mt-1" style={{ color: theme.brand }}>
                  {stat.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="flex-row items-center justify-between px-5 mb-3">
          <Text className="text-lg font-bold text-text-primary">Upcoming Runs</Text>
          <Pressable>
            <Text className="text-sm font-semibold" style={{ color: theme.brand }}>
              See All
            </Text>
          </Pressable>
        </View>

        {MOCK_UPCOMING_RUNS.map((run) => (
          <Pressable
            key={run.id}
            className="mx-5 mb-3 flex-row items-center rounded-2xl p-3"
            style={{ backgroundColor: theme.card }}
          >
            <Image
              source={{ uri: run.image }}
              style={{ width: 56, height: 56, borderRadius: 12 }}
              contentFit="cover"
            />
            <View className="flex-1 ml-3">
              <Text className="text-xs font-semibold" style={{ color: theme.brand }}>
                {formatUpcomingDate(run.datetime)}
              </Text>
              <Text className="text-base font-bold text-text-primary mt-0.5">{run.title}</Text>
              <Text className="text-sm text-text-secondary mt-0.5">
                {run.distance} km • {run.attendees} attending
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </Pressable>
        ))}

        {showDevActions ? (
          <View className="px-5 mt-6" style={{ gap: 12 }}>
            <Pressable
              onPress={onEditProfile}
              className="rounded-2xl py-4 items-center border border-border"
            >
              <Text className="text-base font-medium text-text-primary">Edit Profile</Text>
            </Pressable>
            <Pressable onPress={onSignOut} className="rounded-2xl py-4 items-center">
              <Text className="text-base font-medium text-text-secondary">Sign Out</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
