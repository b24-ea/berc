import { View, Pressable, Text } from 'react-native';
import { VIBE_TAGS } from '@/constants/vibes';

interface OnboardingVibeTagsProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export function OnboardingVibeTags({ selected, onChange }: OnboardingVibeTagsProps) {
  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <View className="flex-row flex-wrap gap-2.5">
      {VIBE_TAGS.map((tag) => {
        const isSelected = selected.includes(tag);
        return (
          <Pressable
            key={tag}
            onPress={() => toggle(tag)}
            className={`px-4 py-2.5 rounded-full border ${
              isSelected
                ? 'bg-[#FFF0EB] border-[#E8673A]'
                : 'bg-[#FAF8F5] border-[#E8E2D9]'
            }`}
          >
            <Text
              className={`text-[15px] ${
                isSelected ? 'text-[#E8673A] font-medium' : 'text-[#5C5C5C]'
              }`}
            >
              {tag}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
