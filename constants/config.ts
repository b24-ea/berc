export const config = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  streamApiKey: process.env.EXPO_PUBLIC_STREAM_API_KEY ?? '',
  feedPageSize: 10,
  feedStaleTime: 60_000,
  requestsStaleTime: 30_000,
  requestExpiryHours: 24,
  requestExpiryWarningHours: 2,
  maxImageSizeBytes: 1_024_000,
  minPhotos: 4,
  minVibeTags: 2,
} as const;
