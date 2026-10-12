-- Product reviews from verified buyers, moderated by admins.
--
-- * Only customers with an order containing the product can review it (one review each)
-- * New reviews are 'pending' and only appear once an admin approves them
-- * Approved reviews feed the star rating on the product page and in Google results

CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text CHECK (char_length(title) <= 120),
  body text NOT NULL CHECK (char_length(body) BETWEEN 10 AND 2000),
  author_name text NOT NULL CHECK (char_length(author_name) BETWEEN 1 AND 80),
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ar')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_reply text CHECK (char_length(admin_reply) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, user_id)
);

CREATE INDEX IF NOT EXISTS product_reviews_product_status_idx ON public.product_reviews (product_id, status);
CREATE INDEX IF NOT EXISTS product_reviews_status_created_idx ON public.product_reviews (status, created_at DESC);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Everyone sees approved reviews; customers also see their own; admins see everything
CREATE POLICY "Approved reviews are public" ON public.product_reviews
  FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Customers can write their own review" ON public.product_reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Customers can delete their own review" ON public.product_reviews
  FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can moderate reviews" ON public.product_reviews
  FOR UPDATE USING (public.is_admin());

-- Whether a user has bought a product (any order that wasn't cancelled or refunded)
CREATE OR REPLACE FUNCTION public.has_purchased_product(_user_id uuid, _product_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT o.id
  FROM public.orders o
  JOIN public.order_items oi ON oi.order_id = o.id
  WHERE o.user_id = _user_id
    AND oi.product_id = _product_id
    AND o.status NOT IN ('cancelled', 'refunded')
  ORDER BY o.created_at DESC
  LIMIT 1;
$$;

-- Lets the product page ask "can I review this?" for the signed-in customer only
CREATE OR REPLACE FUNCTION public.can_review_product(_product_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT auth.uid() IS NOT NULL
    AND public.has_purchased_product(auth.uid(), _product_id) IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM public.product_reviews WHERE product_id = _product_id AND user_id = auth.uid());
$$;

-- Customers cannot approve their own review or pretend to have bought the product
CREATE OR REPLACE FUNCTION public.enforce_review_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _order uuid;
BEGIN
  IF public.is_admin() OR COALESCE(auth.role(), '') NOT IN ('authenticated', 'anon') THEN
    RETURN NEW;
  END IF;

  _order := public.has_purchased_product(NEW.user_id, NEW.product_id);
  IF _order IS NULL THEN
    RAISE EXCEPTION 'Only customers who bought this product can review it' USING ERRCODE = '42501';
  END IF;

  NEW.order_id := _order;
  NEW.status := 'pending';
  NEW.admin_reply := NULL;
  NEW.created_at := now();
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_review_insert_trigger ON public.product_reviews;
CREATE TRIGGER enforce_review_insert_trigger
  BEFORE INSERT ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.enforce_review_insert();

DROP TRIGGER IF EXISTS update_product_reviews_updated_at ON public.product_reviews;
CREATE TRIGGER update_product_reviews_updated_at
  BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

REVOKE EXECUTE ON FUNCTION public.has_purchased_product(uuid, uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.enforce_review_insert() FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.can_review_product(uuid) TO authenticated;
