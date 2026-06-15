import { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '@/components/ui/EmptyState';
import { StandoutCard } from '@/components/recommendations/StandoutCard';
import { StandoutsTitle } from '@/components/recommendations/StandoutsTitle';
import { StandoutsTopBar } from '@/components/recommendations/StandoutsTopBar';
import { MOCK_RECOMMENDATIONS } from '@/constants/mockRecommendations';
import { useUserStore } from '@/store/userStore';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';
import { getFirstName } from '@/utils/formatters';

const CARD_GAP = 12;

export default function RecommendationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const profile = useUserStore((s) => s.profile);
  const feedCity = useUserStore((s) => s.feedCity);
  const listRef = useRef<FlatList>(null);

  const cardWidth = screenWidth * 0.78;
  const cardHeight = Math.min(screenHeight * 0.56, 480);
  const sideInset = (screenWidth - cardWidth) / 2;
  const snapInterval = cardWidth + CARD_GAP;

  const [activeIndex, setActiveIndex] = useState(0);
  const [invitedIds, setInvitedIds] = useState<string[]>([]);

  const recommendations = useMemo(() => MOCK_RECOMMENDATIONS, []);
  const activeItem = recommendations[activeIndex] ?? null;
  const displayCity = feedCity || profile?.city || 'London';

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / snapInterval);
      setActiveIndex(Math.max(0, Math.min(index, recommendations.length - 1)));
    },
    [snapInterval, recommendations.length],
  );

  const handleInvite = useCallback(() => {
    if (!activeItem) return;
    const { creator_id: userId, creator } = activeItem.run;
    if (invitedIds.includes(userId)) return;
    setInvitedIds((prev) => [...prev, userId]);
    Alert.alert('Invite sent', `You invited ${getFirstName(creator.name)} to run.`);
  }, [activeItem, invitedIds]);

  const activeInvited = activeItem
    ? invitedIds.includes(activeItem.run.creator_id)
    : false;

  if (recommendations.length === 0) {
    return (
      <View className="flex-1 bg-page">
        <StandoutsTopBar city={displayCity} />
        <EmptyState
          title="No recommendations yet"
          subtitle="Check back soon for curated runner picks."
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-page">
      <StandoutsTopBar city={displayCity} />
      <StandoutsTitle />

      <FlatList
        ref={listRef}
        data={recommendations}
        keyExtractor={(item) => item.run.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={snapInterval}
        snapToAlignment="start"
        disableIntervalMomentum
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: sideInset,
          paddingBottom: 4,
          gap: CARD_GAP,
        }}
        renderItem={({ item, index }) => (
          <StandoutCard
            item={item}
            width={cardWidth}
            height={cardHeight}
            isActive={index === activeIndex}
            onPressProfile={() => router.push(`/user/${item.run.creator_id}`)}
            style={{
              opacity: index === activeIndex ? 1 : 0.55,
              transform: [{ scale: index === activeIndex ? 1 : 0.94 }],
            }}
          />
        )}
      />

      <View className="px-5 pt-5" style={{ paddingBottom: insets.bottom + 8 }}>
        <Pressable
          onPress={handleInvite}
          disabled={activeInvited}
          className="h-[52px] rounded-full items-center justify-center flex-row gap-2.5"
          style={{
            backgroundColor: activeInvited ? theme.cardMuted : theme.brand,
            shadowColor: theme.brand,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: activeInvited ? 0 : 0.22,
            shadowRadius: 10,
            elevation: activeInvited ? 0 : 4,
          }}
        >
          <Ionicons
            name={activeInvited ? 'checkmark-circle' : 'paper-plane'}
            size={18}
            color={activeInvited ? colors.textSecondary : '#fff'}
          />
          <Text
            className="text-base font-bold"
            style={{ color: activeInvited ? colors.textSecondary : '#fff' }}
          >
            {activeInvited ? 'Invite sent' : 'Invite to run'}
          </Text>
        </Pressable>

        <View className="flex-row items-center justify-center gap-2 mt-5">
          {recommendations.map((item, index) => (
            <View
              key={item.run.id}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  index === activeIndex ? theme.brand : '#E8DDD4',
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
