-- Instagram agent: review older posts and answer unanswered comments slowly
ALTER TABLE public.ig_agent_settings
  ADD COLUMN IF NOT EXISTS backfill_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS backfill_cursor TEXT,
  ADD COLUMN IF NOT EXISTS backfill_done BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.ig_comments DROP CONSTRAINT IF EXISTS ig_comments_status_check;
ALTER TABLE public.ig_comments ADD CONSTRAINT ig_comments_status_check
  CHECK (status IN ('new', 'queued', 'processing', 'replied', 'pending_review', 'ignored', 'failed'));

ALTER TABLE public.ig_comments DROP CONSTRAINT IF EXISTS ig_comments_source_check;
ALTER TABLE public.ig_comments ADD CONSTRAINT ig_comments_source_check
  CHECK (source IN ('webhook', 'poll', 'backfill'));
