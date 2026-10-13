-- Telegram photo bot: the owner photographs a product, the photo-bot edge function identifies it,
-- asks for a one-tap confirmation and puts the photo live on the product page.

BEGIN;

-- Phones allowed to use the bot (paired with a one-time code from Admin -> Photo Bot)
CREATE TABLE IF NOT EXISTS public.photo_bot_users (
  telegram_user_id bigint PRIMARY KEY,
  chat_id bigint NOT NULL,
  display_name text,
  linked_by uuid,
  linked_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.photo_bot_codes (
  code text PRIMARY KEY,
  created_by uuid,
  expires_at timestamptz NOT NULL
);

-- One row per photo received
CREATE TABLE IF NOT EXISTS public.photo_bot_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id bigint NOT NULL,
  telegram_user_id bigint NOT NULL,
  message_id bigint,
  caption text,
  image_url text,
  candidates jsonb NOT NULL DEFAULT '[]'::jsonb,
  reading jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'skipped', 'undone', 'failed')),
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  image_row_id uuid,
  removed_images jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS photo_bot_jobs_created_idx ON public.photo_bot_jobs (created_at DESC);

-- What each chat is doing right now (searching, shooting a product from /next, last product)
CREATE TABLE IF NOT EXISTS public.photo_bot_state (
  chat_id bigint PRIMARY KEY,
  mode text,
  job_id uuid,
  target_product_id uuid,
  last_product_id uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Telegram may deliver an update twice; remember what was handled
CREATE TABLE IF NOT EXISTS public.photo_bot_updates (
  update_id bigint PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS photo_bot_jobs_updated_at ON public.photo_bot_jobs;
CREATE TRIGGER photo_bot_jobs_updated_at BEFORE UPDATE ON public.photo_bot_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.photo_bot_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_bot_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_bot_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_bot_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_bot_updates ENABLE ROW LEVEL SECURITY;

-- Admins see who is paired and what the bot did; everything else goes through the edge function
DROP POLICY IF EXISTS "Admins manage photo bot users" ON public.photo_bot_users;
CREATE POLICY "Admins manage photo bot users" ON public.photo_bot_users
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins read photo bot jobs" ON public.photo_bot_jobs;
CREATE POLICY "Admins read photo bot jobs" ON public.photo_bot_jobs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

COMMIT;
