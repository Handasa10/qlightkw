-- AI studio product images: one generated image per "look" (e.g. "GU10 LED bulb"), shared by
-- every product with that look. The product-studio edge function works through the queue.
-- Generated images only ever replace stock photos, never a photo the owner supplied.

BEGIN;

CREATE TABLE IF NOT EXISTS public.studio_images (
  key text PRIMARY KEY,
  prompt text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'working', 'done', 'failed', 'rejected')),
  url text,
  error text,
  attempts int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.studio_image_products (
  product_id uuid PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
  key text NOT NULL REFERENCES public.studio_images(key) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS studio_image_products_key_idx ON public.studio_image_products (key);

-- Single-row settings: the secret the queue runner must present, and how many images per run
CREATE TABLE IF NOT EXISTS public.studio_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  token text NOT NULL DEFAULT encode(extensions.gen_random_bytes(24), 'hex'),
  batch int NOT NULL DEFAULT 3
);
INSERT INTO public.studio_settings (id) VALUES (true) ON CONFLICT DO NOTHING;

ALTER TABLE public.studio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_image_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage studio images" ON public.studio_images;
CREATE POLICY "Admins manage studio images" ON public.studio_images
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Starts one run of the queue (called by hand or by pg_cron); the token never leaves the database
CREATE OR REPLACE FUNCTION public.run_studio_queue()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT net.http_post(
    url := 'https://yubebbfsmlopmnluajgf.supabase.co/functions/v1/product-studio',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-studio-token', (SELECT token FROM public.studio_settings)),
    body := '{}'::jsonb,
    timeout_milliseconds := 140000
  );
$$;
REVOKE ALL ON FUNCTION public.run_studio_queue() FROM PUBLIC, anon, authenticated;

COMMIT;
