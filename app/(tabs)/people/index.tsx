import { useMemo, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import type { Href } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { AppTopBar } from '@/components/ui/AppTopBar';
import { Avatar } from '@/components/ui/Avatar';
import { MOCK_FEED_RUNS } from '@/constants/mockFeed';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { usePeopleDiscoveryStore } from '@/store/peopleDiscoveryStore';

type PeopleItem = {
  id: string;
  name: string;
  age?: number | null;
  city?: string | null;
  photo?: string | null;
  vibe?: string | null;
  secondVibe?: string | null;
  distanceKm?: number | null;
  nextRunLabel?: string;
  coverPhoto?: string | null;
};

export default function PeopleScreen() {
  const router = useRouter();
  const invitedIds = usePeopleDiscoveryStore((s) => s.invitedIds);
  const passedIds = usePeopleDiscoveryStore((s) => s.passedIds);
  const invitePersonStore = usePeopleDiscoveryStore((s) => s.invitePerson);
  const passPersonStore = usePeopleDiscoveryStore((s) => s.passPerson);
  const [activeFilter, setActiveFilter] = useState<'discover' | 'invited' | 'passed'>('discover');

  const people = useMemo<PeopleItem[]>(() => {
    const byId = new Map<string, PeopleItem>();
    for (const run of MOCK_FEED_RUNS) {
      byId.set(run.creator.id, {
        id: run.creator.id,
        name: run.creator.name,
        age: run.creator.age,
        city: run.creator.city,
        photo: run.creator.photos?.[0] ?? null,
        vibe: run.creator.vibe_tags?.[0] ?? null,
        secondVibe: run.creator.vibe_tags?.[1] ?? null,
        distanceKm: run.distanceKm ?? null,
        nextRunLabel: run.title,
        coverPhoto: run.image ?? null,
      });
    }
    return Array.from(byId.values());
  }, []);

  const discoverPeople = useMemo(
    () => people.filter((p) => !invitedIds.includes(p.id) && !passedIds.includes(p.id)),
    [people, invitedIds, passedIds],
  );

  const invitedPeople = useMemo(
    () => people.filter((p) => invitedIds.includes(p.id)),
    [people, invitedIds],
  );

  const passedPeople = useMemo(
    () => people.filter((p) => passedIds.includes(p.id)),
    [people, passedIds],
  );

  const visiblePeople = useMemo(() => {
    if (activeFilter === 'invited') return invitedPeople;
    if (activeFilter === 'passed') return passedPeople;
    return discoverPeople;
  }, [activeFilter, discoverPeople, invitedPeople, passedPeople]);

  const invitePerson = (item: PeopleItem) => {
    invitePersonStore(item.id);
    Alert.alert('Invite sent (demo)', `You invited ${item.name} to run.`);
  };

  const passPerson = (item: PeopleItem) => {
    passPersonStore(item.id);
  };

  const openInvitations = () => router.push('/invitations' as Href);

  return (
    <View className="flex-1 bg-background">
      <AppTopBar
        rightIconName="notifications-outline"
        rightIconColor={theme.brand}
        onRightIconPress={openInvitations}
      />
      <View className="h-px bg-border" />

      <Text className="text-[42px] font-bold text-text-primary px-5 mt-7 mb-4">People</Text>
      <Text className="text-sm text-text-secondary px-5 mb-4">
        Discover runners, invite who fits your vibe, pass the rest.
      </Text>

      <View className="px-5 mb-4">
        <Pressable
          onPress={openInvitations}
          className="bg-white rounded-2xl p-3 flex-row items-center justify-between"
        >
          <View>
            <Text className="text-xs uppercase tracking-wide" style={{ color: theme.brand }}>
              Today
            </Text>
            <Text className="text-base font-semibold text-text-primary mt-0.5">
              {discoverPeople.length} runners to review
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-sm font-semibold" style={{ color: theme.brand }}>
              {invitedPeople.length} invited
            </Text>
            <Text className="text-xs text-text-secondary mt-0.5">
              {passedPeople.length} passed
            </Text>
          </View>
        </Pressable>
      </View>

      <View className="px-5 mb-4 flex-row gap-2">
        {[
          { key: 'discover', label: 'Discover' },
          { key: 'invited', label: 'Invited' },
          { key: 'passed', label: 'Passed' },
        ].map((f) => {
          const selected = activeFilter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setActiveFilter(f.key as 'discover' | 'invited' | 'passed')}
              className="rounded-full px-4 py-2 border"
              style={{
                borderColor: selected ? theme.brand : '#E7E2DD',
                backgroundColor: selected ? theme.peach : '#fff',
              }}
            >
              <Text style={{ color: selected ? theme.brand : '#6B6B6B', fontWeight: '600' }}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlashList
        data={visiblePeople}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}
        ListEmptyComponent={(
          <View className="bg-white rounded-3xl p-5 mt-2">
            <Text className="text-lg font-semibold text-text-primary">All clear</Text>
            <Text className="text-sm text-text-secondary mt-1">
              {activeFilter === 'discover'
                ? 'No more people in discover right now.'
                : activeFilter === 'invited'
                  ? 'No invites sent yet.'
                  : 'No passed profiles yet.'}
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          const isInvited = invitedIds.includes(item.id);
          return (
            <View
              className="bg-white rounded-3xl mb-4 overflow-hidden"
              style={{
                shadowColor: '#000',
                shadowOpacity: 0.04,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 4 },
              }}
            >
              <Pressable onPress={() => router.push(`/user/${item.id}`)}>
                <Image
                  source={{ uri: item.coverPhoto ?? item.photo ?? undefined }}
                  style={{ width: '100%', height: 220 }}
                  contentFit="cover"
                />
              </Pressable>

              <View className="px-4 py-4">
                <Pressable className="flex-row items-center" onPress={() => router.push(`/user/${item.id}`)}>
                  <Avatar uri={item.photo ?? undefined} name={item.name} size="lg" />
                  <View className="flex-1 ml-3">
                    <Text className="text-[18px] font-bold text-text-primary">
                      {item.name}
                      {item.age ? `, ${item.age}` : ''}
                    </Text>
                    <Text className="text-sm text-text-secondary mt-0.5">
                      {item.city ?? 'London'}
                      {item.vibe ? ` • ${item.vibe}` : ''}
                    </Text>
                  </View>
                  {item.distanceKm != null ? (
                    <View className="rounded-full px-3 py-1.5" style={{ backgroundColor: theme.peach }}>
                      <Text className="text-xs font-medium" style={{ color: theme.brand }}>
                        {item.distanceKm} km
                      </Text>
                    </View>
                  ) : null}
                </Pressable>

                <View className="mt-3 flex-row items-center gap-2">
                  {item.vibe ? (
                    <View className="rounded-full px-3 py-1.5" style={{ backgroundColor: '#F7F4F1' }}>
                      <Text className="text-xs text-text-secondary">{item.vibe}</Text>
                    </View>
                  ) : null}
                  {item.secondVibe ? (
                    <View className="rounded-full px-3 py-1.5" style={{ backgroundColor: '#F7F4F1' }}>
                      <Text className="text-xs text-text-secondary">{item.secondVibe}</Text>
                    </View>
                  ) : null}
                  {item.nextRunLabel ? (
                    <Text className="text-xs text-text-secondary flex-1" numberOfLines={1}>
                      Next: {item.nextRunLabel}
                    </Text>
                  ) : null}
                </View>

                <View className="mt-4 flex-row gap-2">
                  <Pressable
                    className="flex-1 rounded-xl py-3 border items-center"
                    style={{ borderColor: '#E7E2DD', backgroundColor: '#fff' }}
                    onPress={() => passPerson(item)}
                  >
                    <Text className="text-sm font-semibold text-text-secondary">Pass</Text>
                  </Pressable>
                  <Pressable
                    className="flex-1 rounded-xl py-3 border items-center"
                    style={{ borderColor: '#E7E2DD', backgroundColor: '#fff' }}
                    onPress={() => router.push(`/user/${item.id}`)}
                  >
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="person-outline" size={14} color="#6B6B6B" />
                      <Text className="text-sm font-semibold text-text-secondary">View</Text>
                    </View>
                  </Pressable>
                  <Pressable
                    className="flex-1 rounded-xl py-3 items-center"
                    style={{ backgroundColor: isInvited ? theme.cardMuted : theme.brand }}
                    onPress={() => invitePerson(item)}
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: isInvited ? '#6B6B6B' : '#fff' }}
                    >
                      {isInvited ? 'Invited' : 'Invite'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
