import { colors } from '@/constants/colors';

const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 2,
} as const;

/** Shared white card surface on peach pages. */
export const cardFrame = {
  backgroundColor: colors.white,
  ...cardShadow,
} as const;

export const cardFrameMuted = {
  backgroundColor: colors.white,
  opacity: 0.92,
  ...cardShadow,
} as const;
