import type { FeedRun } from '@/types/app';
import type {
  FeedInterestId,
  HeightFilterId,
  RelationshipFilterId,
} from '@/constants/feedFilters';
import { HEIGHT_FILTERS } from '@/constants/feedFilters';
import { getMockCreatorFilterMeta } from '@/constants/mockCreatorFilters';

function getCreatorInterests(run: FeedRun): FeedInterestId[] {
  const meta = getMockCreatorFilterMeta(run.creator_id);
  if (meta) return meta.interests;

  const tags = [...run.vibe_tags, ...run.creator.vibe_tags].map((t) => t.toLowerCase());
  const inferred: FeedInterestId[] = ['run'];
  if (tags.some((t) => t.includes('social'))) inferred.push('social');
  if (tags.some((t) => t.includes('marathon') || t.includes('tempo'))) inferred.push('marathon');
  if (tags.some((t) => t.includes('training') || t.includes('competitive'))) inferred.push('training');
  return [...new Set(inferred)];
}

function matchesHeight(creatorId: string, heightFilter: HeightFilterId): boolean {
  if (heightFilter === 'all') return true;
  const meta = getMockCreatorFilterMeta(creatorId);
  if (!meta) return true;

  const rule = HEIGHT_FILTERS.find((item) => item.id === heightFilter);
  if (!rule || rule.id === 'all') return true;

  const { heightCm } = meta;
  const min = 'min' in rule ? rule.min : undefined;
  const max = 'max' in rule ? rule.max : undefined;
  if (min != null && heightCm < min) return false;
  if (max != null && heightCm > max) return false;
  return true;
}

function matchesRelationship(creatorId: string, relationshipFilter: RelationshipFilterId): boolean {
  if (relationshipFilter === 'all') return true;
  const meta = getMockCreatorFilterMeta(creatorId);
  if (!meta) return true;
  return meta.relationshipGoal === relationshipFilter;
}

function matchesInterests(run: FeedRun, interestFilters: FeedInterestId[]): boolean {
  if (interestFilters.length === 0) return true;
  const interests = getCreatorInterests(run);
  return interestFilters.some((filter) => interests.includes(filter));
}

export function matchesExtendedFeedFilters(
  run: FeedRun,
  options: {
    interestFilters: FeedInterestId[];
    heightFilter: HeightFilterId;
    relationshipFilter: RelationshipFilterId;
  },
): boolean {
  return (
    matchesInterests(run, options.interestFilters)
    && matchesHeight(run.creator_id, options.heightFilter)
    && matchesRelationship(run.creator_id, options.relationshipFilter)
  );
}
