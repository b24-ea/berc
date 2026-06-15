import { View, Text, Pressable } from 'react-native';
import { theme } from '@/constants/theme';
import { GENDER_OPTIONS, type GenderOption } from '@/constants/interests';

interface GenderSelectorProps {
  value?: GenderOption;
  onChange: (value: GenderOption) => void;
}

export function GenderSelector({ value, onChange }: GenderSelectorProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-medium text-text-secondary">Gender</Text>
      <View className="flex-row flex-wrap gap-2">
        {GENDER_OPTIONS.map((option) => {
          const selected = value === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => onChange(option.id)}
              className="rounded-full px-4 py-2.5 border"
              style={{
                borderColor: selected ? theme.brand : '#E7E2DD',
                backgroundColor: selected ? theme.brand : '#fff',
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: selected ? '#fff' : '#3D2E28' }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
