import { Redirect, useLocalSearchParams } from 'expo-router';

export default function ProfileIdRedirect() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return <Redirect href="/(tabs)/profile" />;
  return <Redirect href={`/user/${id}`} />;
}
