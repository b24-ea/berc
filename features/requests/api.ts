import { createRunChannel } from '@/services/stream/client';
import { supabase } from '@/services/supabase/client';
import type { RunRequestRow, RunRow, UserRow } from '@/types/database';

export type IncomingRequest = RunRequestRow & {
  requester: Pick<UserRow, 'id' | 'name' | 'age' | 'city' | 'photos'>;
  run: Pick<RunRow, 'id' | 'title' | 'datetime' | 'image' | 'location' | 'creator_id'>;
};

export async function createRunRequest(
  runId: string,
  requesterId: string,
): Promise<RunRequestRow> {
  const { data, error } = await supabase
    .from('run_requests')
    .insert({ run_id: runId, requester_id: requesterId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchIncomingRequests(creatorId: string): Promise<IncomingRequest[]> {
  const { data: myRuns, error: runsError } = await supabase
    .from('runs')
    .select('id')
    .eq('creator_id', creatorId)
    .eq('status', 'open');

  if (runsError) throw runsError;

  const runIds = (myRuns ?? []).map((r) => r.id);
  if (runIds.length === 0) return [];

  const { data, error } = await supabase
    .from('run_requests')
    .select(
      `
      *,
      requester:users!requester_id (id, name, age, city, photos),
      run:runs!run_id (id, title, datetime, image, location, creator_id)
    `,
    )
    .in('run_id', runIds)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as IncomingRequest[];
}

export async function acceptRunRequest(
  requestId: string,
  runId: string,
  creatorId: string,
  requesterId: string,
  runTitle: string,
  runDate: string,
) {
  const { error: requestError } = await supabase
    .from('run_requests')
    .update({ status: 'accepted' })
    .eq('id', requestId);

  if (requestError) throw requestError;

  const { error: runError } = await supabase
    .from('runs')
    .update({ status: 'closed', closed_at: new Date().toISOString() })
    .eq('id', runId);

  if (runError) throw runError;

  const { data: chat, error: chatError } = await supabase
    .from('chats')
    .insert({
      run_id: runId,
      user_1: creatorId,
      user_2: requesterId,
    })
    .select()
    .single();

  if (chatError) throw chatError;

  await createRunChannel(runId, [creatorId, requesterId], {
    run_title: runTitle,
    run_date: runDate,
  });

  return chat;
}

export async function declineRunRequest(requestId: string) {
  const { error } = await supabase
    .from('run_requests')
    .update({ status: 'declined' })
    .eq('id', requestId);

  if (error) throw error;
}

export function resolveRequestCTA(
  status: string | null | undefined,
  expiresAt?: string,
): 'default' | 'requested' | 'accepted' | 'expired' | 'declined' {
  if (!status) return 'default';
  if (status === 'pending' && expiresAt && new Date(expiresAt) < new Date()) {
    return 'expired';
  }
  switch (status) {
    case 'pending':
      return 'requested';
    case 'accepted':
      return 'accepted';
    case 'expired':
      return 'expired';
    case 'declined':
      return 'declined';
    default:
      return 'default';
  }
}
