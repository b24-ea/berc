import { View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useSignOut } from '@/features/auth/hooks';
import { exitDevMode } from '@/utils/devBypass';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';
import { DISCOVERY_RADIUS_OPTIONS } from '@/constants/vibes';
import { useState } from 'react';

function SettingsRow({
  label,
  onPress,
  showChevron = true,
  right,
}: {
  label: string;
  onPress?: () => void;
  showChevron?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress && !right}
      className="flex-row items-center justify-between py-4 border-b border-border"
    >
      <Text className="text-base text-text-primary">{label}</Text>
      {right ?? (showChevron && onPress ? (
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      ) : null)}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDevBypass = useAuthStore((s) => s.isDevBypass);
  const signOut = useSignOut();
  const profile = useUserStore((s) => s.profile);
  const setFeedFilters = useUserStore((s) => s.setFeedFilters);
  const feedCity = useUserStore((s) => s.feedCity);
  const feedRadius = useUserStore((s) => s.feedRadius);

  const [pushEnabled, setPushEnabled] = useState(true);
  const [runReminders, setRunReminders] = useState(true);

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          if (isDevBypass) {
            exitDevMode();
            router.replace('/(auth)/welcome' as Href);
            return;
          }
          signOut.mutate(undefined, {
            onSuccess: () => router.replace('/(auth)/welcome' as Href),
          });
        },
      },
    ]);
  };

  const cycleRadius = () => {
    const currentIndex = DISCOVERY_RADIUS_OPTIONS.indexOf(
      feedRadius as (typeof DISCOVERY_RADIUS_OPTIONS)[number],
    );
    const next =
      DISCOVERY_RADIUS_OPTIONS[(currentIndex + 1) % DISCOVERY_RADIUS_OPTIONS.length];
    setFeedFilters(feedCity || profile?.city || 'London', next);
  };

  return (
    <View className="flex-1 bg-background">
      <View
        className="flex-row items-center justify-between px-5 pb-3 border-b border-border"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable onPress={() => router.back()} hitSlop={10} className="w-10 h-10 justify-center">
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text className="text-lg font-semibold text-text-primary">Settings</Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}>
        <Text className="text-xs uppercase tracking-wide mb-2" style={{ color: theme.brand }}>
          Account
        </Text>
        <View className="bg-white rounded-2xl px-4 mb-6 border border-border">
          <SettingsRow label="Edit profile" onPress={() => router.push('/(tabs)/profile/edit')} />
          <SettingsRow
            label="Invitations"
            onPress={() => router.push('/invitations')}
          />
        </View>

        <Text className="text-xs uppercase tracking-wide mb-2" style={{ color: theme.brand }}>
          Discovery
        </Text>
        <View className="bg-white rounded-2xl px-4 mb-6 border border-border">
          <SettingsRow
            label="Discovery radius"
            onPress={cycleRadius}
            right={<Text className="text-sm font-medium" style={{ color: theme.brand }}>{feedRadius} km</Text>}
            showChevron={false}
          />
        </View>

        <Text className="text-xs uppercase tracking-wide mb-2" style={{ color: theme.brand }}>
          Notifications
        </Text>
        <View className="bg-white rounded-2xl px-4 mb-6 border border-border">
          <SettingsRow
            label="Push notifications"
            showChevron={false}
            right={
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: '#E7E2DD', true: theme.peach }}
                thumbColor={pushEnabled ? theme.brand : '#f4f3f4'}
              />
            }
          />
          <SettingsRow
            label="Run reminders"
            showChevron={false}
            right={
              <Switch
                value={runReminders}
                onValueChange={setRunReminders}
                trackColor={{ false: '#E7E2DD', true: theme.peach }}
                thumbColor={runReminders ? theme.brand : '#f4f3f4'}
              />
            }
          />
        </View>

        <Pressable
          onPress={handleSignOut}
          className="rounded-2xl py-4 items-center border border-border bg-white"
        >
          <Text className="text-base font-semibold text-text-secondary">Sign out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
