import type { UserRow } from '@/types/database';

export function getProfileCompletion(user: UserRow): number {
  const checks = [
    (user.photos?.length ?? 0) >= 1,
    (user.photos?.length ?? 0) >= 2,
    Boolean(user.bio?.trim()),
    Boolean(user.city?.trim()),
    (user.vibe_tags?.length ?? 0) >= 2,
    user.weekly_km != null && user.weekly_km > 0,
    Boolean(user.average_pace?.trim()),
    Boolean(user.favourite_route?.trim()),
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}
