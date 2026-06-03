import { useEffect } from 'react';
import { useRouter, useSegments, type Href } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { fetchUserProfile } from '@/features/onboarding/api';
import { isSupabaseConfigured, supabase } from '@/services/supabase/client';
import { connectStreamUser, disconnectStreamUser } from '@/services/stream/client';

export function useAuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { session, isLoading, isDevBypass, setSession, setUser, setLoading } = useAuthStore();
  const { profile, setProfile } = useUserStore();

  useEffect(() => {
    if (isDevBypass) {
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          try {
            const userProfile = await fetchUserProfile(newSession.user.id);
            setProfile(userProfile);
            await connectStreamUser(
              newSession.user.id,
              userProfile.name,
            ).catch(() => undefined);
          } catch {
            setProfile(null);
          }
        } else {
          setProfile(null);
          await disconnectStreamUser().catch(() => undefined);
        }

        setLoading(false);
      },
    );

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (!s) setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isDevBypass, setSession, setUser, setLoading, setProfile]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';

    if (!session && !isDevBypass) {
      if (!inAuthGroup && !inOnboarding) {
        router.replace('/(auth)/welcome' as Href);
      }
      return;
    }

    if (!profile) return;

    if (!profile.is_onboarded) {
      if (!inOnboarding) router.replace('/(onboarding)/photos' as Href);
      return;
    }

    if (inAuthGroup || inOnboarding) {
      router.replace('/(tabs)/feed');
    }
  }, [session, isDevBypass, profile, isLoading, segments, router]);
}
