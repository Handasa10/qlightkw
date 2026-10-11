-- Fix checkout failing with: duplicate key value violates unique constraint "orders_order_number_key".
--
-- Checkout inserts orders with order_number = '' and relies on the database to fill it in,
-- but the trigger only ran WHEN order_number IS NULL. The blank string was stored as-is,
-- and since one old order already has '', every new order collided with it.
--
-- Now: blank or missing numbers are generated, the generator retries until the number is
-- unique (it is random within the day), and the old blank order gets a proper number.

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  _candidate text;
  _attempt int := 0;
BEGIN
  IF NEW.order_number IS NOT NULL AND btrim(NEW.order_number) <> '' THEN
    RETURN NEW;
  END IF;

  LOOP
    _candidate := 'QL-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
      LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = _candidate);
    _attempt := _attempt + 1;
    -- After many collisions in one day, widen the random part
    IF _attempt > 20 THEN
      _candidate := 'QL-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
        LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = _candidate);
    END IF;
  END LOOP;

  NEW.order_number := _candidate;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS generate_order_number_trigger ON public.orders;
CREATE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM anon, authenticated, public;

-- Give existing orders with a blank number a real one, based on their creation date
UPDATE public.orders
SET order_number = 'QL-' || TO_CHAR(created_at, 'YYYYMMDD') || '-' || UPPER(SUBSTRING(REPLACE(id::text, '-', '') FROM 1 FOR 6))
WHERE order_number IS NULL OR btrim(order_number) = '';
