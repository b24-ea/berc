export const ONBOARDING_TOTAL_STEPS = 4;

export const ONBOARDING_STEPS = {
  account: 1,
  interests: 2,
  photos: 3,
  running: 4,
} as const;

export const ONBOARDING_STEP_SUBTITLES: Record<number, string> = {
  1: 'Account',
  2: 'Interests',
  3: 'Photos',
  4: 'Your running',
};
