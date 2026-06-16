import { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StandoutsTopBar } from '@/components/recommendations/StandoutsTopBar';
import { BercPlusLikesBanner } from '@/components/matches/BercPlusLikesBanner';
import { MatchesAvatarStrip } from '@/components/matches/MatchesAvatarStrip';
import {
  LikesGridCard,
  LikesSectionHeader,
  type LikeGridItem,
} from '@/components/matches/LikesGridCard';
import { MOCK_MATCHES } from '@/constants/mockMatches';
import {
  MOCK_RECEIVED_INVITATIONS,
  type InvitationListItem,
} from '@/constants/mockInvitations';
import { MOCK_CHAT_LIST } from '@/constants/mockChats';
import { useUserStore } from '@/store/userStore';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

const GRID_GAP = 10;
const GRID_PADDING = 20;
const HAS_BERC_PLUS = false;

function toLikeGridItem(item: InvitationListItem): LikeGridItem {
  const locked = item.status === 'pending' && !HAS_BERC_PLUS;
  return {
    id: item.id,
    userId: item.userId,
    name: item.name,
    age: item.age,
    photo: item.photo,
    runTitle: item.runTitle,
    status: item.status,
    locked,
  };
}

export default function MatchesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const profile = useUserStore((s) => s.profile);
  const feedCity = useUserStore((s) => s.feedCity);
  const [receivedItems, setReceivedItems] = useState(MOCK_RECEIVED_INVITATIONS);

  const displayCity = feedCity || profile?.city || 'London';
  const matches = useMemo(() => MOCK_MATCHES, []);

  const likes = useMemo(
    () => receivedItems.map(toLikeGridItem),
    [receivedItems],
  );

  const pendingCount = likes.filter((item) => item.status === 'pending').length;
  const cardWidth = (screenWidth - GRID_PADDING * 2 - GRID_GAP) / 2;

  const handleAccept = (item: InvitationListItem) => {
    setReceivedItems((prev) =>
      prev.map((row) => (row.id === item.id ? { ...row, status: 'accepted' } : row)),
    );
    Alert.alert('It\'s a match!', `You and ${item.name} are ready to run together.`);
  };

  const handleLikePress = (item: LikeGridItem) => {
    const source = receivedItems.find((row) => row.id === item.id);
    if (!source) return;

    if (item.locked) {
      router.push('/berc-plus');
      return;
    }

    if (item.status === 'pending') {
      Alert.alert(
        source.name,
        `Wants to join · ${source.runTitle}`,
        [
          { text: 'Decline', style: 'destructive', onPress: () => handleDecline(source) },
          { text: 'Accept', onPress: () => handleAccept(source) },
          { text: 'View profile', onPress: () => router.push(`/user/${source.userId}`) },
        ],
      );
      return;
    }

    router.push(`/user/${source.userId}`);
  };

  const handleDecline = (item: InvitationListItem) => {
    setReceivedItems((prev) => prev.filter((row) => row.id !== item.id));
  };

  const openChatForUser = (userId: string) => {
    const chat = MOCK_CHAT_LIST.find((c) => c.otherUser.id === userId);
    if (chat) {
      router.push(`/(tabs)/chats/${chat.id}`);
      return;
    }
    router.push('/(tabs)/chats');
  };

  return (
    <View className="flex-1 bg-page">
      <StandoutsTopBar city={displayCity} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <LikesSectionHeader count={likes.length} />

        <MatchesAvatarStrip
          matches={matches}
          onPressMatch={(item) => router.push(`/user/${item.userId}`)}
          onMessage={(item) => openChatForUser(item.userId)}
        />

        {pendingCount > 0 && !HAS_BERC_PLUS ? (
          <BercPlusLikesBanner
            likeCount={pendingCount}
            onPress={() => router.push('/berc-plus')}
          />
        ) : null}

        <View className="px-5 mb-3 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-text-primary">Likes You</Text>
          {pendingCount > 0 ? (
            <View
              className="rounded-full px-2.5 py-1 min-w-[28px] items-center"
              style={{ backgroundColor: theme.brand }}
            >
              <Text className="text-xs font-bold text-white">{pendingCount}</Text>
            </View>
          ) : null}
        </View>

        {likes.length === 0 ? (
          <View className="items-center justify-center px-8 py-16">
            <Ionicons name="heart-outline" size={40} color={theme.brand} />
            <Text className="text-base font-semibold text-text-primary text-center mt-4">
              No likes yet
            </Text>
            <Text
              className="text-sm text-center mt-2 leading-5"
              style={{ color: colors.textSecondary }}
            >
              When someone wants to run with you, they&apos;ll appear here.
            </Text>
          </View>
        ) : (
          <View
            className="flex-row flex-wrap px-5"
            style={{ gap: GRID_GAP }}
          >
            {likes.map((item) => (
              <LikesGridCard
                key={item.id}
                item={item}
                width={cardWidth}
                onPress={() => handleLikePress(item)}
              />
            ))}
          </View>
        )}

        {likes.some((item) => !item.locked && item.status === 'accepted') ? (
          <View className="px-5 mt-8">
            <Text className="text-xs font-bold uppercase tracking-wider mb-3 text-text-secondary">
              Matched runs
            </Text>
            {receivedItems
              .filter((item) => item.status === 'accepted')
              .map((item) => (
                <Pressable
                  key={`matched-${item.id}`}
                  onPress={() => openChatForUser(item.userId)}
                  className="bg-card rounded-2xl mb-2 px-4 py-3 flex-row items-center"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 3,
                    elevation: 2,
                  }}
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: colors.accentLight }}
                  >
                    <Ionicons name="chatbubble" size={18} color={theme.brand} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-text-primary">{item.name}</Text>
                    <Text className="text-sm text-text-secondary" numberOfLines={1}>
                      {item.runTitle}
                    </Text>
                  </View>
                  <Text className="text-sm font-semibold" style={{ color: theme.brand }}>
                    Message
                  </Text>
                </Pressable>
              ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
