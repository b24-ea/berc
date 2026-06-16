import { View, Pressable, Text } from 'react-native';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';
import { INTEREST_TAGS } from '@/constants/interests';

interface InterestTagSelectorProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export function InterestTagSelector({ selected, onChange }: InterestTagSelectorProps) {
  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <View>
      <Text className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
        Run vibe
      </Text>
      <View className="flex-row flex-wrap gap-2.5">
        {INTEREST_TAGS.map((tag) => {
          const isSelected = selected.includes(tag);
          return (
            <Pressable
              key={tag}
              onPress={() => toggle(tag)}
              className="rounded-full px-4 py-2.5 border"
              style={{
                borderColor: isSelected ? theme.brand : '#E7E2DD',
                backgroundColor: isSelected ? theme.brand : colors.card,
              }}
            >
              <Text
                className="text-[15px] font-semibold"
                style={{ color: isSelected ? '#fff' : '#3D2E28' }}
              >
                {tag}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
