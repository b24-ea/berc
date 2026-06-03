import { config } from '@/constants/config';
import { FEED_FILTERS } from '@/constants/vibes';
import { supabase } from '@/services/supabase/client';
import { uploadImage } from '@/services/supabase/storage';
import type { CreateRunFormData, FeedFilters, FeedRun } from '@/types/app';
import type { RunInsert, RunRow, UserRow } from '@/types/database';

function getFilterVibe(filterId: FeedFilters['activeFilter']): string | undefined {
  const filter = FEED_FILTERS.find((f) => f.id === filterId);
  return filter && 'vibe' in filter ? filter.vibe : undefined;
}

export async function fetchFeedRuns({
  userId,
  filters,
  page,
}: {
  userId: string;
  filters: FeedFilters;
  page: number;
}): Promise<{ runs: FeedRun[]; nextPage: number | null }> {
  const from = page * config.feedPageSize;
  const to = from + config.feedPageSize - 1;

  const vibeFilter = getFilterVibe(filters.activeFilter);

  let query = supabase
    .from('runs')
    .select(
      `
      *,
      creator:users!creator_id (id, name, age, city, photos, vibe_tags)
    `,
    )
    .eq('status', 'open')
    .neq('creator_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (vibeFilter) {
    query = query.contains('vibe_tags', [vibeFilter]);
  }

  const { data: runs, error } = await query;
  if (error) throw error;

  const runIds = (runs ?? []).map((r) => r.id);

  const { data: requests } = await supabase
    .from('run_requests')
    .select('id, run_id, status, expires_at')
    .eq('requester_id', userId)
    .in('run_id', runIds.length > 0 ? runIds : ['00000000-0000-0000-0000-000000000000']);

  const requestMap = new Map(
    (requests ?? []).map((r) => {
      const isExpired =
        r.status === 'pending' && new Date(r.expires_at) < new Date();
      return [r.run_id, { ...r, status: isExpired ? 'expired' : r.status }];
    }),
  );

  type RunWithJoin = RunRow & { creator: FeedRun['creator'] };

  const feedRuns: FeedRun[] = ((runs ?? []) as RunWithJoin[])
    .filter((run) => {
      const req = requestMap.get(run.id);
      return !req || req.status !== 'declined';
    })
    .map((run) => {
      const req = requestMap.get(run.id);
      return {
        ...run,
        creator: run.creator,
        requestStatus: req?.status ?? null,
        requestId: req?.id ?? null,
      };
    });

  const hasMore = (runs ?? []).length === config.feedPageSize;
  return {
    runs: feedRuns,
    nextPage: hasMore ? page + 1 : null,
  };
}

export async function createRun(userId: string, formData: CreateRunFormData): Promise<RunRow> {
  const imageUrl = await uploadImage('run-images', userId, formData.imageUri);

  const datetime = new Date(`${formData.date}T${formData.time}`).toISOString();

  const insert: RunInsert = {
    creator_id: userId,
    title: formData.title,
    location: formData.location,
    datetime,
    distance: formData.distance ?? null,
    pace: formData.pace ?? null,
    image: imageUrl,
    vibe_tags: formData.vibeTags,
    note: formData.note ?? null,
    status: 'open',
  };

  const { data, error } = await supabase.from('runs').insert(insert).select().single();
  if (error) throw error;
  return data;
}

export async function fetchUserRuns(userId: string): Promise<RunRow[]> {
  const { data, error } = await supabase
    .from('runs')
    .select('*')
    .eq('creator_id', userId)
    .eq('status', 'open')
    .order('datetime', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchRunById(runId: string) {
  const { data, error } = await supabase
    .from('runs')
    .select(
      `*, creator:users!creator_id (id, name, age, city, photos, vibe_tags, bio, weekly_km, average_pace, favourite_route, run_club)`,
    )
    .eq('id', runId)
    .single();

  if (error) throw error;
  return data;
}
