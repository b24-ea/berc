import * as ImageManipulator from 'expo-image-manipulator';
import { config } from '@/constants/config';

export async function compressImage(uri: string): Promise<string> {
  let quality = 0.8;
  let result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1200 } }],
    { compress: quality, format: ImageManipulator.SaveFormat.JPEG },
  );

  while (quality > 0.3) {
    const response = await fetch(result.uri);
    const blob = await response.blob();
    if (blob.size <= config.maxImageSizeBytes) break;
    quality -= 0.15;
    result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: Math.round(1200 * quality) } }],
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG },
    );
  }

  return result.uri;
}
