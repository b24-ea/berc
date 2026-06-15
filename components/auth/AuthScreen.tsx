import { View, Text, ScrollView, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';

interface AuthScreenProps extends ViewProps {
  children: React.ReactNode;
}

export function AuthScreen({ children, ...props }: AuthScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-page" {...props}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

export function AuthWordmark() {
  return (
    <Text
      className="text-center mb-8"
      style={{
        fontSize: 34,
        fontWeight: '700',
        color: theme.brand,
        letterSpacing: -1.5,
      }}
    >
      berc
    </Text>
  );
}

export function AuthHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View className="mb-8">
      <Text className="text-[32px] font-bold text-text-primary leading-9 mb-2">
        {title}
      </Text>
      <Text className="text-base leading-6" style={{ color: '#5C4A42' }}>
        {subtitle}
      </Text>
    </View>
  );
}

export function AuthOrDivider() {
  return (
    <View className="flex-row items-center my-6">
      <View className="flex-1 h-px bg-border" />
      <Text className="mx-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
        OR
      </Text>
      <View className="flex-1 h-px bg-border" />
    </View>
  );
}

export function AuthFooterLink({
  prefix,
  linkLabel,
  onPress,
}: {
  prefix: string;
  linkLabel: string;
  onPress: () => void;
}) {
  return (
    <Text className="text-center text-base mt-6" style={{ color: '#3D2E28' }}>
      {prefix}{' '}
      <Text onPress={onPress} className="font-semibold" style={{ color: theme.brand }}>
        {linkLabel}
      </Text>
    </Text>
  );
}
