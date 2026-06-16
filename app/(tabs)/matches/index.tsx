import { useMemo, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StandoutsTopBar } from '@/components/recommendations/StandoutsTopBar';
import { MatchRow, MatchesTitlePill } from '@/components/matches/MatchRow';
import {
  MatchesSegmentControl,
  type MatchesTab,
} from '@/components/matches/MatchesSegmentControl';
import { InvitationPersonRow } from '@/components/people/InvitationPersonRow';
import { MOCK_MATCHES } from '@/constants/mockMatches';
import {
  MOCK_RECEIVED_INVITATIONS,
  type InvitationListItem,
} from '@/constants/mockInvitations';
import { MOCK_CHAT_LIST } from '@/constants/mockChats';
import { useUserStore } from '@/store/userStore';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

export default function MatchesScreen() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const feedCity = useUserStore((s) => s.feedCity);
  const [activeTab, setActiveTab] = useState<MatchesTab>('matches');
  const [receivedItems, setReceivedItems] = useState(MOCK_RECEIVED_INVITATIONS);

  const displayCity = feedCity || profile?.city || 'London';
  const matches = useMemo(() => MOCK_MATCHES, []);

  const pendingInviteCount = receivedItems.filter((item) => item.status === 'pending').length;

  const handleAccept = (item: InvitationListItem) => {
    setReceivedItems((prev) =>
      prev.map((row) => (row.id === item.id ? { ...row, status: 'accepted' } : row)),
    );
    Alert.alert('Invite accepted', `You matched with ${item.name}.`);
  };

  const handleDecline = (item: InvitationListItem) => {
    setReceivedItems((prev) => prev.filter((row) => row.id !== item.id));
    Alert.alert('Invite declined', `You declined ${item.name}'s invite.`);
  };

  const openChatForUser = (userId: string) => {
    const chat = MOCK_CHAT_LIST.find((c) => c.otherUser.id === userId);
    if (chat) {
      router.push(`/(tabs)/chats/${chat.id}`);
      return;
    }
    router.push('/(tabs)/chats');
  };

  const renderMatches = () => {
    if (matches.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="heart-outline" size={32} color={theme.brand} />
          <Text className="text-base font-semibold text-text-primary text-center mt-4">
            No matches yet
          </Text>
          <Text className="text-sm text-center mt-2 leading-5" style={{ color: colors.textSecondary }}>
            Accept a run invite or join a run to start matching.
          </Text>
        </View>
      );
    }

    return (
      <FlashList
        data={matches}
        keyExtractor={(item) => item.id}
        style={{ flex: 1, backgroundColor: colors.page }}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <MatchRow
            item={item}
            onPress={() => router.push(`/user/${item.userId}`)}
            onMessage={() => openChatForUser(item.userId)}
          />
        )}
      />
    );
  };

  const renderInvites = () => {
    if (receivedItems.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="mail-outline" size={32} color={theme.brand} />
          <Text className="text-base font-semibold text-text-primary text-center mt-4">
            No invites yet
          </Text>
          <Text className="text-sm text-center mt-2 leading-5" style={{ color: colors.textSecondary }}>
            When someone invites you to run, they will show up here.
          </Text>
        </View>
      );
    }

    return (
      <FlashList
        data={receivedItems}
        keyExtractor={(item) => item.id}
        style={{ flex: 1, backgroundColor: colors.page }}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View className="mx-5">
            <InvitationPersonRow
              item={item}
              onPress={() => router.push(`/user/${item.userId}`)}
              rightContent={
                item.status === 'pending' ? (
                  <View className="gap-2">
                    <Pressable
                      className="rounded-full px-3 py-1.5"
                      style={{ backgroundColor: theme.brand }}
                      onPress={() => handleAccept(item)}
                    >
                      <Text className="text-xs font-semibold text-white">Accept</Text>
                    </Pressable>
                    <Pressable
                      className="rounded-full px-3 py-1.5 border"
                      style={{ borderColor: colors.border }}
                      onPress={() => handleDecline(item)}
                    >
                      <Text className="text-xs font-semibold text-text-secondary">Decline</Text>
                    </Pressable>
                  </View>
                ) : undefined
              }
            />
          </View>
        )}
      />
    );
  };

  return (
    <View className="flex-1 bg-page">
      <StandoutsTopBar city={displayCity} />
      <MatchesTitlePill />
      <MatchesSegmentControl active={activeTab} onChange={setActiveTab} />

      {activeTab === 'invites' && pendingInviteCount > 0 ? (
        <Text className="text-sm text-text-secondary px-5 mb-3">
          {pendingInviteCount} runner{pendingInviteCount === 1 ? '' : 's'} invited you to run
        </Text>
      ) : null}

      <View className="flex-1">
        {activeTab === 'matches' ? renderMatches() : renderInvites()}
      </View>
    </View>
  );
}
