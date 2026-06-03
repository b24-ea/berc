import { supabase } from './client';
import { compressImage } from '@/utils/image';

export type StorageBucket = 'user-photos' | 'run-images';

export async function uploadImage(
  bucket: StorageBucket,
  userId: string,
  localUri: string,
  fileName?: string,
): Promise<string> {
  const compressedUri = await compressImage(localUri);
  const response = await fetch(compressedUri);
  const blob = await response.blob();
  const ext = 'jpg';
  const path = `${userId}/${fileName ?? `${Date.now()}.${ext}`}`;

  const { error } = await supabase.storage.from(bucket).upload(path, blob, {
    contentType: 'image/jpeg',
    upsert: true,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadMultipleImages(
  bucket: StorageBucket,
  userId: string,
  localUris: string[],
): Promise<string[]> {
  return Promise.all(
    localUris.map((uri, index) =>
      uploadImage(bucket, userId, uri, `${Date.now()}_${index}.jpg`),
    ),
  );
}
