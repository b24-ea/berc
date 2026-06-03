import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="photos" />
      <Stack.Screen name="vibes" />
      <Stack.Screen name="bio" />
      <Stack.Screen name="location" />
      <Stack.Screen name="running-info" />
    </Stack>
  );
}
