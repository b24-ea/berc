import { View, Text, Pressable } from 'react-native';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

export type MatchesTab = 'matches' | 'invites';

interface MatchesSegmentControlProps {
  active: MatchesTab;
  onChange: (tab: MatchesTab) => void;
}

const TABS: { key: MatchesTab; label: string }[] = [
  { key: 'matches', label: 'Matches' },
  { key: 'invites', label: 'Invites' },
];

export function MatchesSegmentControl({ active, onChange }: MatchesSegmentControlProps) {
  return (
    <View className="flex-row mx-5 mb-4 gap-2">
      {TABS.map((tab) => {
        const selected = active === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            className="flex-1 rounded-full py-2.5 items-center border"
            style={{
              borderColor: selected ? theme.brand : colors.border,
              backgroundColor: selected ? colors.accentLight : colors.card,
            }}
          >
            <Text
              className="text-sm font-bold"
              style={{ color: selected ? theme.brand : colors.textSecondary }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
