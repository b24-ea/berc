import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
interface FeedToolbarProps {
  onFiltersPress?: () => void;
  activeCount?: number;
}

export function FeedToolbar({
  onFiltersPress,
  activeCount = 0,
}: FeedToolbarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        gap: 8,
        paddingBottom: 12,
        alignItems: 'center',
      }}
    >
      <Pressable
        onPress={onFiltersPress}
        className="flex-row items-center gap-2 px-4 py-2.5 rounded-full border border-card-border bg-card"
        style={{ alignSelf: 'center', height: 44, justifyContent: 'center' }}
      >
        <Ionicons name="options-outline" size={16} color={colors.textPrimary} />
        <Text className="text-sm font-medium text-text-primary">Filters</Text>
        {activeCount > 0 ? (
          <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: '#F3ECE6' }}>
            <Text className="text-xs font-semibold" style={{ color: '#A53D13' }}>
              {activeCount}
            </Text>
          </View>
        ) : null}
      </Pressable>
    </ScrollView>
  );
}
