import { ScrollView, Pressable, Text } from 'react-native';
import { FEED_FILTERS } from '@/constants/vibes';
import type { FilterId } from '@/types/app';
import { theme } from '@/constants/theme';

interface FeedCategoryChipsProps {
  activeFilter: FilterId;
  onFilterChange: (id: FilterId) => void;
  compact?: boolean;
}

const DISPLAY_FILTERS = FEED_FILTERS.filter((f) =>
  ['nearby', 'beginner', 'coffee', 'social'].includes(f.id),
);

export function FeedCategoryChips({
  activeFilter,
  onFilterChange,
  compact = false,
}: FeedCategoryChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: compact ? 0 : 20,
        gap: 8,
        paddingBottom: compact ? 8 : 16,
        alignItems: 'center',
      }}
    >
      {DISPLAY_FILTERS.map((filter) => {
        const selected = activeFilter === filter.id;
        return (
          <Pressable
            key={filter.id}
            onPress={() => onFilterChange(filter.id)}
            style={{
              paddingHorizontal: 18,
              height: 42,
              borderRadius: 999,
              backgroundColor: selected ? theme.brand : theme.peach,
              alignSelf: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              className={`text-sm font-medium ${
                selected ? 'text-white' : 'text-text-primary'
              }`}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
      <Pressable
        onPress={() => onFilterChange('morning')}
        style={{
          paddingHorizontal: 18,
          height: 42,
          borderRadius: 999,
          backgroundColor: activeFilter === 'morning' ? theme.brand : theme.peach,
          alignSelf: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          className={`text-sm font-medium ${
            activeFilter === 'morning' ? 'text-white' : 'text-text-primary'
          }`}
        >
          Training
        </Text>
      </Pressable>
    </ScrollView>
  );
}
