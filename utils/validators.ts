import { z } from 'zod';
import { config } from '@/constants/config';
import { VIBE_TAGS } from '@/constants/vibes';

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const onboardingAccountBaseSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: emailSchema,
  gender: z.enum(['women', 'men', 'non_binary', 'prefer_not_to_say'], {
    message: 'Select your gender',
  }),
});

export const onboardingAccountSchema = onboardingAccountBaseSchema
  .extend({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const onboardingAccountSessionSchema = onboardingAccountBaseSchema;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const createRunSchema = z.object({
  title: z.string().min(3, 'Give your run a title'),
  location: z.string().min(2, 'Where are you meeting?'),
  date: z.string().min(1, 'Pick a date'),
  time: z.string().min(1, 'Pick a time'),
  distance: z.string().optional(),
  pace: z.string().optional(),
  vibeTags: z.array(z.string()),
  note: z.string().max(300).optional(),
  imageUri: z.string().min(1, 'Add a photo for your run'),
});

export const onboardingLocationSchema = z.object({
  city: z.string().min(2, 'Enter your city to find nearby runners'),
  discoveryRadius: z.number().min(5).max(50),
});

export const onboardingRunningInfoSchema = z.object({
  weeklyKm: z.coerce.number().positive().optional().or(z.literal('')),
  averagePace: z.string().optional(),
  favouriteRoute: z.string().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type OnboardingAccountFormValues = z.infer<typeof onboardingAccountSchema>;
export type OnboardingAccountSessionFormValues = z.infer<
  typeof onboardingAccountSessionSchema
>;
export type CreateRunFormValues = z.infer<typeof createRunSchema>;

export function validatePhotos(
  photos: string[],
  runningPhotoIndices: number[],
): { valid: boolean; message?: string } {
  if (photos.length < config.minPhotos) {
    return {
      valid: false,
      message: `Add at least ${config.minPhotos} photos so people can get to know you.`,
    };
  }
  if (runningPhotoIndices.length === 0) {
    return {
      valid: false,
      message: 'Include at least one running or race photo — it helps others know you run.',
    };
  }
  return { valid: true };
}

export function validateVibeTags(tags: string[]): { valid: boolean; message?: string } {
  if (tags.length < config.minVibeTags) {
    return {
      valid: false,
      message: `Pick at least ${config.minVibeTags} tags that describe your running style.`,
    };
  }
  return { valid: true };
}
