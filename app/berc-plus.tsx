import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  BERC_PLUS_PERKS,
  BERC_PLUS_PLANS,
  type BercPlusPlan,
} from '@/constants/bercPlus';
import { cardFrame } from '@/constants/cardStyle';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

function PlanCard({
  plan,
  selected,
  onPress,
}: {
  plan: BercPlusPlan;
  selected: boolean;
  onPress: () => void;
}) {
  const { label, price, period, badge } = BERC_PLUS_PLANS[plan];

  return (
    <Pressable
      onPress={onPress}
      className="flex-1 rounded-2xl p-4 border-2"
      style={{
        backgroundColor: colors.white,
        borderColor: selected ? theme.brand : colors.border,
        ...cardFrame,
      }}
    >
      {badge ? (
        <View
          className="self-start rounded-full px-2.5 py-1 mb-2"
          style={{ backgroundColor: colors.accentLight }}
        >
          <Text className="text-xs font-semibold" style={{ color: theme.brand }}>
            {badge}
          </Text>
        </View>
      ) : (
        <View className="h-6 mb-2" />
      )}
      <Text className="text-sm font-medium text-text-secondary">{label}</Text>
      <View className="flex-row items-end mt-1">
        <Text className="text-2xl font-bold text-text-primary">{price}</Text>
        <Text className="text-sm text-text-secondary mb-1 ml-1">{period}</Text>
      </View>
      {selected ? (
        <View className="absolute top-4 right-4">
          <Ionicons name="checkmark-circle" size={22} color={theme.brand} />
        </View>
      ) : null}
    </Pressable>
  );
}

export default function BercPlusScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState<BercPlusPlan>('yearly');

  const handleJoin = () => {
    const plan = BERC_PLUS_PLANS[selectedPlan];
    Alert.alert(
      'berc+',
      `${plan.label} plan (${plan.price}${plan.period}) — coming soon.`,
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-page">
        <View
          className="flex-row items-center justify-between px-5 pb-3"
          style={{ paddingTop: insets.top + 8, backgroundColor: colors.background }}
        >
          <Pressable onPress={() => router.back()} hitSlop={10} className="w-10 h-10 justify-center">
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text className="text-lg font-bold" style={{ color: theme.brand }}>
            berc+
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingTop: 24, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-[32px] font-bold text-text-primary leading-9">
            Run further with berc+
          </Text>
          <Text className="text-base text-text-secondary mt-3 leading-6">
            Unlock the full berc experience — more discovery, more connections,
            more miles together.
          </Text>

          <View className="mt-8 gap-3">
            {BERC_PLUS_PERKS.map((perk) => (
              <View
                key={perk.title}
                className="flex-row items-start gap-3 rounded-2xl p-4 bg-white"
                style={cardFrame}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.accentLight }}
                >
                  <Ionicons name={perk.icon} size={20} color={theme.brand} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-text-primary">
                    {perk.title}
                  </Text>
                  <Text className="text-sm text-text-secondary mt-1 leading-5">
                    {perk.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <Text className="text-xs font-bold uppercase tracking-wider mt-8 mb-3 text-text-secondary">
            Choose your plan
          </Text>
          <View className="flex-row gap-3">
            <PlanCard
              plan="monthly"
              selected={selectedPlan === 'monthly'}
              onPress={() => setSelectedPlan('monthly')}
            />
            <PlanCard
              plan="yearly"
              selected={selectedPlan === 'yearly'}
              onPress={() => setSelectedPlan('yearly')}
            />
          </View>

          <Text className="text-xs text-text-secondary text-center mt-6 leading-5">
            Cancel anytime. berc+ renews automatically until you turn it off in
            your account settings.
          </Text>
        </ScrollView>

        <View
          className="px-5 pt-3 border-t border-border bg-page"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <Pressable
            onPress={handleJoin}
            className="h-[52px] rounded-full items-center justify-center"
            style={{ backgroundColor: theme.brand }}
          >
            <Text className="text-base font-bold text-white">Join berc+</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
