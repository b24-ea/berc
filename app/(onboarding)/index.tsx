import { Redirect, type Href } from 'expo-router';

/** Onboarding starts at photos — welcome lives only on (auth)/welcome. */
export default function OnboardingIndex() {
  return <Redirect href={'/(onboarding)/photos' as Href} />;
}
