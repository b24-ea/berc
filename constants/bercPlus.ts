import { Ionicons } from '@expo/vector-icons';

export type BercPlusPlan = 'monthly' | 'yearly';

export const BERC_PLUS_PERKS = [
  {
    icon: 'sparkles' as const,
    title: 'Unlimited Standouts',
    description: 'See curated runners picked for you every day.',
  },
  {
    icon: 'footsteps' as const,
    title: 'Priority in discovery',
    description: 'Show up higher when runners browse nearby.',
  },
  {
    icon: 'chatbubbles' as const,
    title: 'Message before matching',
    description: 'Start a conversation before joining a run.',
  },
  {
    icon: 'filter' as const,
    title: 'Advanced filters',
    description: 'Filter by pace, distance, and running style.',
  },
  {
    icon: 'eye' as const,
    title: 'See who viewed you',
    description: 'Know who checked out your runner profile.',
  },
] as const;

export const BERC_PLUS_PLANS: Record<
  BercPlusPlan,
  { label: string; price: string; period: string; badge?: string }
> = {
  monthly: {
    label: 'Monthly',
    price: '£9.99',
    period: '/ month',
  },
  yearly: {
    label: 'Yearly',
    price: '£59.99',
    period: '/ year',
    badge: 'Save 50%',
  },
};
