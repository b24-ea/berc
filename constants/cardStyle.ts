import { colors } from '@/constants/colors';

const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 2,
} as const;

/** Shared peach card surface on white pages. */
export const cardFrame = {
  backgroundColor: colors.card,
  borderWidth: 1,
  borderColor: colors.cardBorder,
  ...cardShadow,
} as const;

export const cardFrameMuted = {
  backgroundColor: 'rgba(245, 230, 220, 0.55)',
  borderWidth: 1,
  borderColor: colors.cardBorder,
  ...cardShadow,
} as const;
