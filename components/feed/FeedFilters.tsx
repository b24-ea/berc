import { View, Text, ScrollView, Pressable } from 'react-native';
import { Chip } from '@/components/ui/Chip';
import { DISCOVERY_RADIUS_OPTIONS, FEED_FILTERS } from '@/constants/vibes';
import type { FilterId } from '@/types/app';

interface FeedFiltersBarProps {
  city: string;
  radius: number;
  activeFilter: FilterId;
  onFilterChange: (filter: FilterId) => void;
  onCityPress?: () => void;
  onRadiusChange?: (radius: number) => void;
}

export function FeedFiltersBar({
  city,
  radius,
  activeFilter,
  onFilterChange,
  onCityPress,
  onRadiusChange,
}: FeedFiltersBarProps) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center gap-2 mb-3">
        <Pressable
          onPress={onCityPress}
          className="flex-row items-center bg-card rounded-full px-4 py-2 border border-border"
        >
          <Text className="text-sm font-medium text-text-primary">
            {city || 'Set city'}
          </Text>
        </Pressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {DISCOVERY_RADIUS_OPTIONS.map((r) => (
            <Pressable
              key={r}
              onPress={() => onRadiusChange?.(r)}
              className={`px-3 py-2 rounded-full mr-2 border ${
                radius === r
                  ? 'bg-accent-light border-accent'
                  : 'bg-card border-border'
              }`}
            >
              <Text
                className={`text-sm ${
                  radius === r ? 'text-accent font-medium' : 'text-text-secondary'
                }`}
              >
                {r}km
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {FEED_FILTERS.map((filter) => (
          <Chip
            key={filter.id}
            label={filter.label}
            selected={activeFilter === filter.id}
            onPress={() => onFilterChange(filter.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
