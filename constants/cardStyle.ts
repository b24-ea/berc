import { theme } from '@/constants/theme';

/** Shared frame for light-orange card surfaces on white pages. */
export const cardFrame = {
  backgroundColor: theme.card,
  borderWidth: 1,
  borderColor: theme.cardBorder,
} as const;

export const cardFrameMuted = {
  backgroundColor: theme.cardMuted,
  borderWidth: 1,
  borderColor: theme.cardBorder,
} as const;
