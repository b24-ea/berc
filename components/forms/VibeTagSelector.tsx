import { View } from 'react-native';
import { Chip } from '@/components/ui/Chip';
import { VIBE_TAGS } from '@/constants/vibes';

interface VibeTagSelectorProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export function VibeTagSelector({ selected, onChange }: VibeTagSelectorProps) {
  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <View className="flex-row flex-wrap gap-2">
      {VIBE_TAGS.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          selected={selected.includes(tag)}
          onPress={() => toggle(tag)}
        />
      ))}
    </View>
  );
}
