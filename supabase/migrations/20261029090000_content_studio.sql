-- Content studio: reel + image post pipeline (idea -> script -> media -> owner approval in Telegram -> slot -> Postora, or the Graph API in meta mode)
-- Claude sessions write items through the content-studio function; the owner approves each step from the QL Studio Telegram bot.

CREATE TABLE IF NOT EXISTS public.content_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  paused BOOLEAN NOT NULL DEFAULT false,
  -- 'postora': approved items get a slot and the Claude session schedules them on Postora; 'meta': this function publishes through the Graph API
  publisher TEXT NOT NULL DEFAULT 'postora' CHECK (publisher IN ('postora', 'meta')),
  -- local Kuwait times (UTC+3, no daylight saving)
  reel_slots TEXT[] NOT NULL DEFAULT ARRAY['09:00', '14:00', '18:00'],
  image_slots TEXT[] NOT NULL DEFAULT ARRAY['11:30', '20:30'],
  publish_instagram BOOLEAN NOT NULL DEFAULT true,
  publish_facebook BOOLEAN NOT NULL DEFAULT true,
  telegram_chat_id BIGINT,
  telegram_webhook_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO public.content_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('reel', 'image')),
  -- idea -> idea_approved -> script_ready -> script_approved -> media_ready -> approved -> scheduled (Postora) | publishing -> published (Meta)
  -- side states: revise (owner asked for changes, see feedback), rejected, failed
  status TEXT NOT NULL DEFAULT 'idea' CHECK (status IN ('idea', 'idea_approved', 'script_ready', 'script_approved', 'media_ready', 'approved', 'scheduled', 'publishing', 'published', 'revise', 'rejected', 'failed')),
  topic TEXT NOT NULL,
  hook TEXT,
  angle TEXT,
  script TEXT,
  voice_description TEXT,
  caption TEXT,
  feedback TEXT,
  revise_from TEXT,
  media_url TEXT,
  preview_url TEXT,
  cover_url TEXT,
  duration_sec NUMERIC,
  scheduled_at TIMESTAMPTZ,
  platforms TEXT[],
  postora_post_ids JSONB,
  ig_container_id TEXT,
  ig_media_id TEXT,
  ig_permalink TEXT,
  ig_status TEXT,
  fb_post_id TEXT,
  fb_status TEXT,
  publish_started_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS content_items_status_idx ON public.content_items (status);
CREATE INDEX IF NOT EXISTS content_items_scheduled_idx ON public.content_items (scheduled_at);

-- which item each bot message is about (replying to the message asks for changes on that item)
CREATE TABLE IF NOT EXISTS public.content_tg_messages (
  message_id BIGINT PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.content_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tg_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view content items" ON public.content_items
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view content settings" ON public.content_settings
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- public bucket: Instagram and Facebook fetch the videos and images from their URLs (50 MB per file: the free-plan upload limit)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('content-media', 'content-media', true, 52428800)
ON CONFLICT (id) DO NOTHING;

-- publish due posts and follow Instagram processing every 5 minutes
SELECT cron.schedule(
  'content-studio-tick',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://yubebbfsmlopmnluajgf.supabase.co/functions/v1/content-studio',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YmViYmZzbWxvcG1ubHVhamdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MjQxNDUsImV4cCI6MjA4NTIwMDE0NX0.625SioK5zQ0n5LtS7JCWarCaUdOw8-VltlHQRhZfs1o"}'::jsonb,
    body := '{"action": "tick"}'::jsonb
  ) AS request_id;
  $$
);
