import { useMemo, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '@/components/ui/EmptyState';
import { InvitationPersonRow } from '@/components/people/InvitationPersonRow';
import { MOCK_FEED_RUNS } from '@/constants/mockFeed';
import {
  MOCK_RECEIVED_INVITATIONS,
  MOCK_SENT_INVITATIONS,
  type InvitationListItem,
} from '@/constants/mockInvitations';
import { usePeopleDiscoveryStore } from '@/store/peopleDiscoveryStore';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

type TabKey = 'received' | 'sent';

function buildSentFromStore(invitedIds: string[]): InvitationListItem[] {
  return invitedIds
    .map((userId) => {
      const run = MOCK_FEED_RUNS.find((r) => r.creator_id === userId);
      if (!run) return null;
      return {
        id: `sent-${userId}`,
        userId,
        name: run.creator.name,
        age: run.creator.age,
        city: run.creator.city,
        photo: run.creator.photos?.[0] ?? null,
        vibe: run.creator.vibe_tags?.[0] ?? null,
        runTitle: run.title,
        direction: 'sent' as const,
        status: 'pending' as const,
        timeLabel: 'Recently',
      };
    })
    .filter((item): item is InvitationListItem => item != null);
}

export default function InvitationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const invitedIds = usePeopleDiscoveryStore((s) => s.invitedIds);
  const [activeTab, setActiveTab] = useState<TabKey>('received');
  const [receivedItems, setReceivedItems] = useState(MOCK_RECEIVED_INVITATIONS);

  const sentItems = useMemo(() => {
    const fromStore = buildSentFromStore(invitedIds);
    if (fromStore.length > 0) return fromStore;
    return MOCK_SENT_INVITATIONS;
  }, [invitedIds]);

  const visibleItems = activeTab === 'received' ? receivedItems : sentItems;

  const handleAccept = (item: InvitationListItem) => {
    setReceivedItems((prev) =>
      prev.map((row) => (row.id === item.id ? { ...row, status: 'accepted' } : row)),
    );
    Alert.alert('Invite accepted (demo)', `You accepted ${item.name}'s run invite.`);
  };

  const handleDecline = (item: InvitationListItem) => {
    setReceivedItems((prev) => prev.filter((row) => row.id !== item.id));
    Alert.alert('Invite declined (demo)', `You declined ${item.name}'s invite.`);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-page">
        <View
          className="flex-row items-center justify-between px-5 pb-3 border-b border-border"
          style={{ paddingTop: insets.top + 8, backgroundColor: colors.background }}
        >
          <Pressable onPress={() => router.back()} hitSlop={10} className="w-10 h-10 justify-center">
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text className="text-lg font-semibold text-text-primary">Invitations</Text>
          <View className="w-10 h-10" />
        </View>

        <Text className="text-sm text-text-secondary px-5 mt-4 mb-3">
          Run invites you sent and received.
        </Text>

        <View className="px-5 mb-4 flex-row gap-2">
          {[
            { key: 'received', label: 'Received' },
            { key: 'sent', label: 'Sent' },
          ].map((tab) => {
            const selected = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key as TabKey)}
                className="rounded-full px-4 py-2 border"
                style={{
                  borderColor: selected ? theme.brand : '#E7E2DD',
                  backgroundColor: selected ? theme.peach : '#fff',
                }}
              >
                <Text style={{ color: selected ? theme.brand : '#6B6B6B', fontWeight: '600' }}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {visibleItems.length === 0 ? (
          <View className="px-5">
            <EmptyState
              title={activeTab === 'received' ? 'No invites received' : 'No invites sent yet'}
              subtitle={
                activeTab === 'received'
                  ? 'When someone invites you to a run, it will show up here.'
                  : 'Invite runners from the People tab.'
              }
            />
          </View>
        ) : (
          <FlashList
            data={visibleItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}
            renderItem={({ item }) => (
              <InvitationPersonRow
                item={item}
                onPress={() => router.push(`/user/${item.userId}`)}
                rightContent={
                  activeTab === 'received' && item.status === 'pending' ? (
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
                        style={{ borderColor: '#E7E2DD' }}
                        onPress={() => handleDecline(item)}
                      >
                        <Text className="text-xs font-semibold text-text-secondary">Decline</Text>
                      </Pressable>
                    </View>
                  ) : undefined
                }
              />
            )}
          />
        )}
      </View>
    </>
  );
}
