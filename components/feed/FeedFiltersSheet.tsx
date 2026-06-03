import { View, Text, Pressable } from 'react-native';
import { theme } from '@/constants/theme';
import { FeedCategoryChips } from '@/components/feed/FeedCategoryChips';
import { DISCOVERY_RADIUS_OPTIONS } from '@/constants/vibes';
import type { FilterId } from '@/types/app';

interface FeedFiltersSheetProps {
  visible: boolean;
  activeFilter: FilterId;
  onFilterChange: (id: FilterId) => void;
  genderFilter: 'all' | 'women' | 'men';
  onGenderChange: (g: 'all' | 'women' | 'men') => void;
  distanceFilter: 'all' | 'short' | 'medium' | 'long';
  onDistanceChange: (d: 'all' | 'short' | 'medium' | 'long') => void;
  feedRadius: number;
  onRadiusChange: (radius: number) => void;
  onClose: () => void;
}

export function FeedFiltersSheet({
  visible,
  activeFilter,
  onFilterChange,
  genderFilter,
  onGenderChange,
  distanceFilter,
  onDistanceChange,
  feedRadius,
  onRadiusChange,
  onClose,
}: FeedFiltersSheetProps) {
  if (!visible) return null;

  const chip = (
    label: string,
    selected: boolean,
    onPress: () => void,
  ) => (
    <Pressable
      onPress={() => {
        onPress();
        onClose();
      }}
      className="rounded-full px-4 py-2 border"
      style={{
        borderColor: selected ? theme.brand : '#E7E2DD',
        backgroundColor: selected ? theme.peach : '#fff',
      }}
    >
      <Text style={{ color: selected ? theme.brand : '#6B6B6B', fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View className="mx-4 mb-3 rounded-3xl bg-white border border-border p-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-bold text-text-primary">Filters</Text>
        <Pressable onPress={onClose} hitSlop={8}>
          <Text className="text-sm font-semibold" style={{ color: theme.brand }}>
            Done
          </Text>
        </Pressable>
      </View>

      <FeedCategoryChips compact activeFilter={activeFilter} onFilterChange={onFilterChange} />

      <Text className="text-xs text-text-secondary uppercase tracking-wide mb-2 mt-3">Gender</Text>
      <View className="flex-row gap-2 mb-3 flex-wrap">
        {chip('All', genderFilter === 'all', () => onGenderChange('all'))}
        {chip('Women', genderFilter === 'women', () => onGenderChange('women'))}
        {chip('Men', genderFilter === 'men', () => onGenderChange('men'))}
      </View>

      <Text className="text-xs text-text-secondary uppercase tracking-wide mb-2">Run distance</Text>
      <View className="flex-row flex-wrap gap-2 mb-3">
        {chip('All', distanceFilter === 'all', () => onDistanceChange('all'))}
        {chip('0-6 km', distanceFilter === 'short', () => onDistanceChange('short'))}
        {chip('6-10 km', distanceFilter === 'medium', () => onDistanceChange('medium'))}
        {chip('10+ km', distanceFilter === 'long', () => onDistanceChange('long'))}
      </View>

      <Text className="text-xs text-text-secondary uppercase tracking-wide mb-2">Radius</Text>
      <View className="flex-row flex-wrap gap-2">
        {DISCOVERY_RADIUS_OPTIONS.map((r) =>
          chip(`${r} km`, feedRadius === r, () => onRadiusChange(r)),
        )}
      </View>
    </View>
  );
}
