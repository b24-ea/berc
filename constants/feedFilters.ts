export const FEED_INTEREST_FILTERS = [
  { id: 'run', label: 'Run' },
  { id: 'hyrox', label: 'Hyrox' },
  { id: 'marathon', label: 'Marathon' },
  { id: 'ironman', label: 'Ironman' },
  { id: 'social', label: 'Social' },
  { id: 'training', label: 'Training' },
] as const;

export type FeedInterestId = (typeof FEED_INTEREST_FILTERS)[number]['id'];

export const HEIGHT_FILTERS = [
  { id: 'all', label: 'Any height' },
  { id: 'under_165', label: 'Under 165 cm', max: 164 },
  { id: '165_175', label: '165–175 cm', min: 165, max: 175 },
  { id: '175_185', label: '175–185 cm', min: 175, max: 185 },
  { id: 'over_185', label: '185 cm+', min: 186 },
] as const;

export type HeightFilterId = (typeof HEIGHT_FILTERS)[number]['id'];

export const RELATIONSHIP_FILTERS = [
  { id: 'all', label: 'Any' },
  { id: 'long_term', label: 'Long term' },
  { id: 'short_term', label: 'Short term' },
  { id: 'life_partner', label: 'Life partner' },
  { id: 'just_training', label: 'Just training' },
] as const;

export type RelationshipFilterId = (typeof RELATIONSHIP_FILTERS)[number]['id'];

export type RelationshipGoal = Exclude<RelationshipFilterId, 'all'>;
