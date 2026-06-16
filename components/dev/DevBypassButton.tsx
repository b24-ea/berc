import { Pressable, Text } from 'react-native';

interface DevBypassButtonProps {
  variant?: 'light' | 'dark';
}

/** Hidden from UI — dev bypass remains available via code paths only. */
export function DevBypassButton(_props: DevBypassButtonProps) {
  return null;
}
