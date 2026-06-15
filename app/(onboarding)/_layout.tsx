import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="account" />
      <Stack.Screen name="interests" />
      <Stack.Screen name="photos" />
      <Stack.Screen name="running" />
    </Stack>
  );
}
