# runr

A premium social lifestyle app where people naturally connect through running.

## Stack

- React Native (Expo SDK 56)
- Expo Router v3
- TypeScript (strict)
- NativeWind v4
- Supabase (Auth, Database, Storage)
- TanStack Query v5
- Zustand
- React Hook Form + Zod
- Stream Chat
- FlashList, Reanimated 3, expo-image

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and fill in:

   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_STREAM_API_KEY`

3. **Supabase**

   - Run `supabase/migrations/001_initial_schema.sql` in the SQL editor
   - Create storage buckets: `user-photos`, `run-images` (public)
   - Enable Apple & Google auth providers
   - Deploy edge functions: `stream-token`, `expire-requests`
   - Schedule `expire-requests` on a cron (hourly)

4. **Stream Chat**

   - Create a Stream app and add the API key to `.env`
   - Set `STREAM_API_KEY` and `STREAM_API_SECRET` in Supabase edge function secrets

5. **Run the app**

   ```bash
   npx expo start
   ```

## Architecture

```
app/           → Expo Router screens
components/    → Reusable UI
features/      → Business logic + React Query hooks
services/      → Supabase & Stream clients
store/         → Zustand (client state)
hooks/         → Auth guard, notifications
constants/     → Design tokens
types/         → TypeScript definitions
```

## Core flows

1. **Auth** → Email, Apple, Google via Supabase Auth
2. **Onboarding** → Photos, vibes, bio, location, running info
3. **Feed** → Browse open runs, request to join
4. **Requests** → Accept/decline → unlocks chat
5. **Chat** → Stream Chat channel `run_{run_id}`

## Product principles

- Warm, premium, calm — never gamified or cluttered
- 1-to-1 social running (no group runs in MVP)
- Chat unlocks only after accepted request
