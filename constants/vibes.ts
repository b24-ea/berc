export const VIBE_TAGS = [
  'Coffee Run',
  'Social',
  'Beginner Friendly',
  'Easy Pace',
  'Long Run',
  'Marathon Prep',
  'Morning Run',
  'Evening Run',
  'Competitive',
  'Chill Pace',
] as const;

export type VibeTag = (typeof VIBE_TAGS)[number];

export const FEED_FILTERS = [
  { id: 'nearby', label: 'Nearby' },
  { id: 'beginner', label: 'Beginner', vibe: 'Beginner Friendly' },
  { id: 'coffee', label: 'Coffee Runs', vibe: 'Coffee Run' },
  { id: 'social', label: 'Social', vibe: 'Social' },
  { id: 'morning', label: 'Morning', vibe: 'Morning Run' },
  { id: 'evening', label: 'Evening', vibe: 'Evening Run' },
  { id: 'long', label: 'Long Run', vibe: 'Long Run' },
  { id: 'easy', label: 'Easy Pace', vibe: 'Easy Pace' },
] as const;

export const DISCOVERY_RADIUS_OPTIONS = [5, 10, 25, 50] as const;
