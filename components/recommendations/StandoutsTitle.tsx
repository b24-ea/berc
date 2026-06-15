import { View, Text } from 'react-native';
import { theme } from '@/constants/theme';

export function StandoutsTitle() {
  return (
    <View className="items-center px-6 pt-1 pb-5">
      <View
        className="rounded-full px-5 py-2 border"
        style={{
          borderColor: theme.brand,
          backgroundColor: '#F7E8DF',
        }}
      >
        <Text
          className="text-[11px] font-bold tracking-[2px]"
          style={{ color: theme.brandDark }}
        >
          STANDOUTS
        </Text>
      </View>
      <Text className="text-center text-[15px] text-text-secondary mt-3 leading-6 max-w-[300px]">
        Runners we think you'll click with this week
      </Text>
    </View>
  );
}
