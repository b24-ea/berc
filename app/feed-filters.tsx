import { View, Text, Pressable, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FeedCategoryChips } from '@/components/feed/FeedCategoryChips';
import { useRunsStore } from '@/store/runsStore';
import { useUserStore } from '@/store/userStore';
import { DISCOVERY_RADIUS_OPTIONS } from '@/constants/vibes';
import {
  FEED_INTEREST_FILTERS,
  HEIGHT_FILTERS,
  RELATIONSHIP_FILTERS,
} from '@/constants/feedFilters';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

function FilterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-full px-4 py-2.5 border"
      style={{
        borderColor: selected ? theme.brand : '#E7E2DD',
        backgroundColor: selected ? colors.accentLight : colors.card,
      }}
    >
      <Text style={{ color: selected ? theme.brand : '#6B6B6B', fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function FeedFiltersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    activeFilter,
    genderFilter,
    distanceFilter,
    interestFilters,
    heightFilter,
    relationshipFilter,
    setActiveFilter,
    setGenderFilter,
    setDistanceFilter,
    toggleInterestFilter,
    setHeightFilter,
    setRelationshipFilter,
    resetFeedFilters,
  } = useRunsStore();
  const feedRadius = useUserStore((s) => s.feedRadius);
  const feedCity = useUserStore((s) => s.feedCity);
  const profile = useUserStore((s) => s.profile);
  const setFeedFilters = useUserStore((s) => s.setFeedFilters);

  const displayCity = feedCity || profile?.city || 'London';

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
          <Text className="text-lg font-semibold text-text-primary">Filters</Text>
          <Pressable onPress={resetFeedFilters} hitSlop={8}>
            <Text className="text-sm font-semibold" style={{ color: theme.brand }}>
              Reset
            </Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-xs uppercase tracking-wide mb-3" style={{ color: theme.brand }}>
            Category
          </Text>
          <FeedCategoryChips compact activeFilter={activeFilter} onFilterChange={setActiveFilter} />

          <Text className="text-xs uppercase tracking-wide mb-3 mt-6" style={{ color: theme.brand }}>
            Gender
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <FilterChip label="All" selected={genderFilter === 'all'} onPress={() => setGenderFilter('all')} />
            <FilterChip label="Women" selected={genderFilter === 'women'} onPress={() => setGenderFilter('women')} />
            <FilterChip label="Men" selected={genderFilter === 'men'} onPress={() => setGenderFilter('men')} />
          </View>

          <Text className="text-xs uppercase tracking-wide mb-3 mt-6" style={{ color: theme.brand }}>
            Run distance
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <FilterChip label="All" selected={distanceFilter === 'all'} onPress={() => setDistanceFilter('all')} />
            <FilterChip label="0-6 km" selected={distanceFilter === 'short'} onPress={() => setDistanceFilter('short')} />
            <FilterChip label="6-10 km" selected={distanceFilter === 'medium'} onPress={() => setDistanceFilter('medium')} />
            <FilterChip label="10+ km" selected={distanceFilter === 'long'} onPress={() => setDistanceFilter('long')} />
          </View>

          <Text className="text-xs uppercase tracking-wide mb-3 mt-6" style={{ color: theme.brand }}>
            Interests
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {FEED_INTEREST_FILTERS.map((interest) => (
              <FilterChip
                key={interest.id}
                label={interest.label}
                selected={interestFilters.includes(interest.id)}
                onPress={() => toggleInterestFilter(interest.id)}
              />
            ))}
          </View>

          <Text className="text-xs uppercase tracking-wide mb-3 mt-6" style={{ color: theme.brand }}>
            Height
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {HEIGHT_FILTERS.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                selected={heightFilter === option.id}
                onPress={() => setHeightFilter(option.id)}
              />
            ))}
          </View>

          <Text className="text-xs uppercase tracking-wide mb-3 mt-6" style={{ color: theme.brand }}>
            Relationship
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {RELATIONSHIP_FILTERS.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                selected={relationshipFilter === option.id}
                onPress={() => setRelationshipFilter(option.id)}
              />
            ))}
          </View>

          <Text className="text-xs uppercase tracking-wide mb-3 mt-6" style={{ color: theme.brand }}>
            Discovery radius
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {DISCOVERY_RADIUS_OPTIONS.map((r) => (
              <FilterChip
                key={r}
                label={`${r} km`}
                selected={feedRadius === r}
                onPress={() => setFeedFilters(displayCity, r)}
              />
            ))}
          </View>
        </ScrollView>

        <View className="px-5 pb-8 pt-3 border-t border-border bg-page">
          <Pressable
            onPress={() => router.back()}
            className="rounded-full py-4 items-center"
            style={{ backgroundColor: theme.brand }}
          >
            <Text className="text-base font-bold text-white">Show results</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
