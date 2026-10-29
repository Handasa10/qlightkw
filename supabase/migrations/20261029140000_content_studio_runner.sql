-- Content studio: settings and fields for the scheduled Claude runs (3 a day) that drive the pipeline through the bot.
ALTER TABLE public.content_settings
  ADD COLUMN IF NOT EXISTS runner_lock_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS daily_reels INT NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS default_platforms TEXT[] NOT NULL DEFAULT ARRAY['instagram', 'facebook', 'tiktok', 'threads'],
  ADD COLUMN IF NOT EXISTS auto_schedule BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS style TEXT,
  ADD COLUMN IF NOT EXISTS target_duration TEXT,
  ADD COLUMN IF NOT EXISTS voice_id UUID,
  ADD COLUMN IF NOT EXISTS produced_at TIMESTAMPTZ;
