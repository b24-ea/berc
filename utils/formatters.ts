import { format, formatDistanceToNow, isToday, isTomorrow, parseISO } from 'date-fns';

export function formatRunDateTime(isoDate: string): string {
  const date = parseISO(isoDate);
  if (isToday(date)) return `Today · ${format(date, 'h:mm a')}`;
  if (isTomorrow(date)) return `Tomorrow · ${format(date, 'h:mm a')}`;
  return format(date, 'EEE, MMM d · h:mm a');
}

export function formatRunDate(isoDate: string): string {
  return format(parseISO(isoDate), 'EEE, MMM d');
}

export function formatRelativeTime(isoDate: string): string {
  return formatDistanceToNow(parseISO(isoDate), { addSuffix: true });
}

export function formatDistanceKm(km: number | null | undefined): string {
  if (km == null) return '';
  return `${km} km`;
}

export function formatPace(pace: string | null | undefined): string {
  if (!pace) return '';
  return `${pace} /km`;
}

export function formatDistanceAndPace(
  distance: number | null | undefined,
  pace: string | null | undefined,
): string {
  const parts = [formatDistanceKm(distance), formatPace(pace)].filter(Boolean);
  return parts.join(' · ');
}

export function formatUserAge(age: number | null | undefined): string {
  if (age == null) return '';
  return `${age}`;
}

export function formatUserLocation(city: string | null | undefined): string {
  return city ?? '';
}

export function getFirstName(fullName: string): string {
  return fullName.split(' ')[0] ?? fullName;
}
