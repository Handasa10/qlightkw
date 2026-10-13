-- Instant quotations: a customer uploads an Excel sheet, a photo of a handwritten list, a PDF
-- or types a list; the smart-quote edge function matches it to the catalog and saves an
-- official quotation. Prices are always taken from the products table, never from the AI.

BEGIN;

CREATE SEQUENCE IF NOT EXISTS public.quote_number_seq;

CREATE TABLE IF NOT EXISTS public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number text UNIQUE NOT NULL DEFAULT (
    'QL-Q-' || to_char(now() AT TIME ZONE 'Asia/Kuwait', 'YYYY') || '-' || lpad(nextval('public.quote_number_seq')::text, 5, '0')
  ),
  -- Random secret that lets the customer reopen their quotation without an account
  access_token text NOT NULL DEFAULT encode(extensions.gen_random_bytes(18), 'hex'),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  company text,
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ar')),
  source text NOT NULL CHECK (source IN ('excel', 'image', 'pdf', 'text', 'product')),
  attachment_path text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric(12, 3) NOT NULL DEFAULT 0,
  on_request_count int NOT NULL DEFAULT 0,
  valid_until date NOT NULL DEFAULT ((now() AT TIME ZONE 'Asia/Kuwait')::date + 7),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'won', 'lost')),
  admin_notes text,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quotes_created_at_idx ON public.quotes (created_at DESC);
CREATE INDEX IF NOT EXISTS quotes_ip_hash_idx ON public.quotes (ip_hash, created_at);

DROP TRIGGER IF EXISTS quotes_updated_at ON public.quotes;
CREATE TRIGGER quotes_updated_at BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Only admins read and manage quotations directly; customers use get_quote() with their token
DROP POLICY IF EXISTS "Admins manage quotes" ON public.quotes;
CREATE POLICY "Admins manage quotes" ON public.quotes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Every AI reading is logged so the public endpoint can be rate limited
CREATE TABLE IF NOT EXISTS public.quote_extractions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip_hash text NOT NULL,
  source text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS quote_extractions_ip_idx ON public.quote_extractions (ip_hash, created_at);
ALTER TABLE public.quote_extractions ENABLE ROW LEVEL SECURITY;

-- The customer's view of their quotation (no internal fields)
CREATE OR REPLACE FUNCTION public.get_quote(_id uuid, _token text)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'id', q.id, 'quote_number', q.quote_number, 'customer_name', q.customer_name,
    'customer_phone', q.customer_phone, 'customer_email', q.customer_email, 'company', q.company,
    'language', q.language, 'items', q.items, 'subtotal', q.subtotal,
    'on_request_count', q.on_request_count, 'valid_until', q.valid_until, 'created_at', q.created_at
  )
  FROM public.quotes q
  WHERE q.id = _id AND q.access_token = _token;
$$;
REVOKE ALL ON FUNCTION public.get_quote(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_quote(uuid, text) TO anon, authenticated;

-- Customers' original files (Excel, photos, PDFs): private, admins only
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('quote-requests', 'quote-requests', false, 10485760)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Admins read quote requests" ON storage.objects;
CREATE POLICY "Admins read quote requests" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'quote-requests' AND public.has_role(auth.uid(), 'admin'));

COMMIT;
