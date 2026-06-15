import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 2,
};

export function HingeProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-6">
      <Text
        className="px-4 mb-2 text-[11px] font-bold uppercase tracking-[1.5px]"
        style={{ color: theme.brandDark }}
      >
        {title}
      </Text>
      <View className="mx-4 rounded-xl overflow-hidden" style={{ backgroundColor: theme.card, ...CARD_SHADOW }}>
        {children}
      </View>
    </View>
  );
}

export function HingeProfileRow({
  label,
  onPress,
  isLast = false,
  showChevron = true,
}: {
  label: string;
  onPress?: () => void;
  isLast?: boolean;
  showChevron?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={`flex-row items-center justify-between px-4 min-h-[52px] ${
        isLast ? '' : 'border-b'
      }`}
      style={isLast ? undefined : { borderBottomColor: '#EBEBEB' }}
    >
      <Text className="text-[17px] text-text-primary">{label}</Text>
      {showChevron && onPress ? (
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      ) : (
        <View className="w-5" />
      )}
    </Pressable>
  );
}

export function HingeLogoutButton({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} className="items-center py-6">
      <Text className="text-[17px] font-medium" style={{ color: theme.brandDark }}>
        Log out
      </Text>
    </Pressable>
  );
}
