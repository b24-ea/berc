export const INTEREST_TAGS = [
  'Social',
  'Tempo',
  'Trail',
  'Competitive',
  'Night Run',
  'Coffee Run',
  'Long Run',
  'Beginner Friendly',
  'Morning Run',
  'Chill Pace',
] as const;

export type InterestTag = (typeof INTEREST_TAGS)[number];

export const GENDER_OPTIONS = [
  { id: 'women', label: 'Woman' },
  { id: 'men', label: 'Man' },
  { id: 'non_binary', label: 'Non-binary' },
  { id: 'prefer_not_to_say', label: 'Prefer not to say' },
] as const;

export type GenderOption = (typeof GENDER_OPTIONS)[number]['id'];
