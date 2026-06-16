-- berc initial schema

CREATE TABLE users (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name            text NOT NULL,
  age             integer,
  city            text,
  bio             text,
  photos          text[] DEFAULT '{}',
  vibe_tags       text[] DEFAULT '{}',
  weekly_km       numeric,
  average_pace    text,
  favourite_route text,
  run_club        text,
  discovery_radius integer DEFAULT 10,
  is_onboarded    boolean DEFAULT false,
  last_active_at  timestamptz,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE TABLE runs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id  uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title       text NOT NULL,
  location    text NOT NULL,
  datetime    timestamptz NOT NULL,
  distance    numeric,
  pace        text,
  image       text NOT NULL,
  vibe_tags   text[] DEFAULT '{}',
  note        text,
  status      text DEFAULT 'open' CHECK (status IN ('open', 'closed', 'expired')),
  closed_at   timestamptz,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE TABLE run_requests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id       uuid REFERENCES runs(id) ON DELETE CASCADE NOT NULL,
  requester_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status       text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  expires_at   timestamptz DEFAULT (now() + interval '24 hours'),
  created_at   timestamptz DEFAULT now(),
  UNIQUE (run_id, requester_id)
);

CREATE TABLE chats (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id          uuid REFERENCES runs(id) ON DELETE CASCADE UNIQUE NOT NULL,
  user_1          uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  user_2          uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  last_message_at timestamptz,
  created_at      timestamptz DEFAULT now()
);

CREATE TABLE messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id    uuid REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  sender_id  uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content    text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_runs_status ON runs(status);
CREATE INDEX idx_runs_creator ON runs(creator_id);
CREATE INDEX idx_runs_datetime ON runs(datetime);
CREATE INDEX idx_run_requests_run ON run_requests(run_id);
CREATE INDEX idx_run_requests_requester ON run_requests(requester_id);
CREATE INDEX idx_chats_users ON chats(user_1, user_2);

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE run_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- users policies
CREATE POLICY "users_select" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "users_insert" ON users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- runs policies
CREATE POLICY "runs_select" ON runs FOR SELECT TO authenticated USING (status = 'open' OR creator_id = auth.uid());
CREATE POLICY "runs_insert" ON runs FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "runs_update" ON runs FOR UPDATE TO authenticated USING (auth.uid() = creator_id);

-- run_requests policies
CREATE POLICY "run_requests_select" ON run_requests FOR SELECT TO authenticated USING (
  requester_id = auth.uid() OR
  EXISTS (SELECT 1 FROM runs WHERE runs.id = run_requests.run_id AND runs.creator_id = auth.uid())
);
CREATE POLICY "run_requests_insert" ON run_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "run_requests_update" ON run_requests FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM runs WHERE runs.id = run_requests.run_id AND runs.creator_id = auth.uid())
);

-- chats policies
CREATE POLICY "chats_select" ON chats FOR SELECT TO authenticated USING (
  user_1 = auth.uid() OR user_2 = auth.uid()
);
CREATE POLICY "chats_insert" ON chats FOR INSERT TO authenticated WITH CHECK (
  user_1 = auth.uid() OR user_2 = auth.uid()
);

-- messages policies
CREATE POLICY "messages_select" ON messages FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM chats
    WHERE chats.id = messages.chat_id
    AND (chats.user_1 = auth.uid() OR chats.user_2 = auth.uid())
  )
);
CREATE POLICY "messages_insert" ON messages FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM chats
    WHERE chats.id = messages.chat_id
    AND (chats.user_1 = auth.uid() OR chats.user_2 = auth.uid())
  )
);

-- Storage buckets (run in Supabase dashboard or via API)
-- user-photos (public)
-- run-images (public)
