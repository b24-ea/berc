import { StreamChat } from 'stream-chat';
import { config } from '@/constants/config';
import { supabase } from '@/services/supabase/client';

let chatClient: StreamChat | null = null;

export function getStreamClient(): StreamChat {
  if (!chatClient) {
    chatClient = StreamChat.getInstance(config.streamApiKey);
  }
  return chatClient;
}

export async function connectStreamUser(userId: string, name: string): Promise<void> {
  const client = getStreamClient();

  const { data, error } = await supabase.functions.invoke<{ token: string }>(
    'stream-token',
    { body: { userId } },
  );

  if (error || !data?.token) {
    throw new Error('Failed to get Stream token');
  }

  await client.connectUser({ id: userId, name }, data.token);
}

export async function disconnectStreamUser(): Promise<void> {
  const client = getStreamClient();
  if (client.userID) {
    await client.disconnectUser();
  }
}

export async function createRunChannel(
  runId: string,
  members: [string, string],
  customData: { run_title: string; run_date: string },
): Promise<void> {
  const client = getStreamClient();
  const channel = client.channel('messaging', `run_${runId}`, {
    members,
    ...({ run_id: runId, run_title: customData.run_title, run_date: customData.run_date } as Record<string, string>),
  });
  await channel.create();
}

export function getRunChannel(runId: string) {
  const client = getStreamClient();
  return client.channel('messaging', `run_${runId}`);
}
