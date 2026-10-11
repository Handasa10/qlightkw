-- Server-side order integrity.
--
-- Checkout builds orders in the browser and inserts them directly, so prices,
-- delivery cost and discounts were whatever the client sent. These triggers make
-- the database the source of truth for customer-created orders:
--   * order item prices come from products / variations
--   * delivery cost comes from the delivery method
--   * discounts are only granted through a valid coupon_usages row
--   * order totals are recomputed from the items
--   * customers can no longer edit their orders (only cancel a pending one)
--
-- Admins, the service role (edge functions) and the database owner bypass all of it.

-- True when the current request comes from a regular customer (or anonymous) session.
-- Uses the JWT role rather than current_user, because current_user is the function
-- owner inside SECURITY DEFINER functions.
CREATE OR REPLACE FUNCTION public.is_customer_request()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT COALESCE(auth.role(), '') IN ('authenticated', 'anon') AND NOT public.is_admin();
$$;

-- Keep in sync with deliveryCost in src/pages/Checkout.tsx
CREATE OR REPLACE FUNCTION public.delivery_cost_for(_method text)
RETURNS numeric
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE _method
    WHEN 'express' THEN 5.000
    WHEN 'sameday' THEN 8.000
    ELSE 3.000
  END;
$$;

-- Recomputes subtotal and total of an order from its items and discount.
CREATE OR REPLACE FUNCTION public.recalculate_order_totals(_order_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _subtotal numeric;
BEGIN
  SELECT COALESCE(SUM(total_price), 0) INTO _subtotal
  FROM public.order_items WHERE order_id = _order_id;

  UPDATE public.orders
  SET subtotal = _subtotal,
      discount_amount = LEAST(COALESCE(discount_amount, 0), _subtotal),
      total_amount = _subtotal + COALESCE(shipping_cost, 0) - LEAST(COALESCE(discount_amount, 0), _subtotal)
  WHERE id = _order_id;
END;
$$;

-- orders: BEFORE INSERT - customers cannot choose status, delivery cost or discount
CREATE OR REPLACE FUNCTION public.enforce_order_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.is_customer_request() THEN
    RETURN NEW;
  END IF;

  NEW.status := 'pending';
  NEW.payment_status := 'pending';
  NEW.shipping_cost := public.delivery_cost_for(NEW.shipping_method);
  -- Granted later by a valid coupon_usages row
  NEW.discount_amount := 0;
  -- No items yet; recalculated as items are added
  NEW.subtotal := 0;
  NEW.total_amount := NEW.shipping_cost;
  NEW.admin_notes := NULL;
  NEW.tracking_number := NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_order_insert_trigger ON public.orders;
CREATE TRIGGER enforce_order_insert_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.enforce_order_insert();

-- orders: BEFORE UPDATE - customers may only cancel their own pending order
CREATE OR REPLACE FUNCTION public.enforce_order_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  -- Updates made by our own triggers (e.g. recalculating totals) are allowed
  IF NOT public.is_customer_request() OR pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  IF OLD.status = 'pending' AND NEW.status = 'cancelled'
     AND (to_jsonb(NEW) - 'status' - 'updated_at') = (to_jsonb(OLD) - 'status' - 'updated_at') THEN
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'Orders can only be cancelled while pending' USING ERRCODE = '42501';
END;
$$;

DROP TRIGGER IF EXISTS enforce_order_update_trigger ON public.orders;
CREATE TRIGGER enforce_order_update_trigger
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.enforce_order_update();

-- order_items: BEFORE INSERT - prices and names come from the catalog
CREATE OR REPLACE FUNCTION public.enforce_order_item_price()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _product record;
  _modifier numeric := 0;
  _variation_name text;
BEGIN
  IF NOT public.is_customer_request() THEN
    RETURN NEW;
  END IF;

  IF NEW.quantity IS NULL OR NEW.quantity < 1 THEN
    RAISE EXCEPTION 'Invalid quantity' USING ERRCODE = '22023';
  END IF;

  -- Items can only be added while the order is still pending
  IF NOT EXISTS (SELECT 1 FROM public.orders WHERE id = NEW.order_id AND status = 'pending') THEN
    RAISE EXCEPTION 'Order is not open for changes' USING ERRCODE = '42501';
  END IF;

  SELECT name_en, name_ar, base_price, sale_price INTO _product
  FROM public.products
  WHERE id = NEW.product_id AND COALESCE(is_active, true);
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product is not available' USING ERRCODE = '22023';
  END IF;

  IF NEW.variation_id IS NOT NULL THEN
    SELECT COALESCE(price_modifier, 0), name_en INTO _modifier, _variation_name
    FROM public.product_variations
    WHERE id = NEW.variation_id AND product_id = NEW.product_id AND COALESCE(is_active, true);
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product option is not available' USING ERRCODE = '22023';
    END IF;
  END IF;

  -- Same rule as the cart: sale price when set, plus the variation modifier
  NEW.unit_price := COALESCE(NULLIF(_product.sale_price, 0), _product.base_price) + _modifier;
  NEW.total_price := NEW.unit_price * NEW.quantity;
  NEW.product_name_en := _product.name_en;
  NEW.product_name_ar := _product.name_ar;
  NEW.variation_name := _variation_name;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_order_item_price_trigger ON public.order_items;
CREATE TRIGGER enforce_order_item_price_trigger
  BEFORE INSERT ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.enforce_order_item_price();

-- order_items: AFTER INSERT - keep order totals in sync
CREATE OR REPLACE FUNCTION public.sync_order_totals_from_items()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.is_customer_request() THEN
    PERFORM public.recalculate_order_totals(NEW.order_id);
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS sync_order_totals_trigger ON public.order_items;
CREATE TRIGGER sync_order_totals_trigger
  AFTER INSERT ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.sync_order_totals_from_items();

-- coupon_usages: BEFORE INSERT - validate the coupon and compute the discount
CREATE OR REPLACE FUNCTION public.enforce_coupon_usage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _coupon record;
  _order record;
  _discount numeric;
BEGIN
  IF NOT public.is_customer_request() THEN
    RETURN NEW;
  END IF;

  SELECT id, user_id, status, subtotal INTO _order
  FROM public.orders WHERE id = NEW.order_id;
  IF NOT FOUND OR _order.user_id <> auth.uid() OR _order.status <> 'pending' THEN
    RAISE EXCEPTION 'Invalid order for coupon' USING ERRCODE = '42501';
  END IF;

  IF EXISTS (SELECT 1 FROM public.coupon_usages WHERE order_id = NEW.order_id) THEN
    RAISE EXCEPTION 'A coupon was already applied to this order' USING ERRCODE = '23505';
  END IF;

  -- Same checks as src/hooks/useCoupon.ts
  SELECT * INTO _coupon FROM public.coupons WHERE id = NEW.coupon_id FOR UPDATE;
  IF NOT FOUND
     OR NOT COALESCE(_coupon.is_active, false)
     OR (_coupon.valid_from IS NOT NULL AND _coupon.valid_from > now())
     OR (_coupon.valid_until IS NOT NULL AND _coupon.valid_until < now())
     OR (_coupon.max_uses IS NOT NULL AND COALESCE(_coupon.current_uses, 0) >= _coupon.max_uses)
     OR (_coupon.min_order_amount IS NOT NULL AND _order.subtotal < _coupon.min_order_amount) THEN
    RAISE EXCEPTION 'Coupon is not valid for this order' USING ERRCODE = '22023';
  END IF;

  IF _coupon.discount_type = 'percentage' THEN
    _discount := _order.subtotal * _coupon.discount_value / 100;
    IF _coupon.max_discount_amount IS NOT NULL THEN
      _discount := LEAST(_discount, _coupon.max_discount_amount);
    END IF;
  ELSE
    _discount := _coupon.discount_value;
  END IF;
  _discount := ROUND(LEAST(GREATEST(_discount, 0), _order.subtotal), 3);

  NEW.discount_applied := _discount;

  UPDATE public.orders SET discount_amount = _discount WHERE id = NEW.order_id;
  PERFORM public.recalculate_order_totals(NEW.order_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_coupon_usage_trigger ON public.coupon_usages;
CREATE TRIGGER enforce_coupon_usage_trigger
  BEFORE INSERT ON public.coupon_usages
  FOR EACH ROW EXECUTE FUNCTION public.enforce_coupon_usage();

-- Status history rows should only come from the log_order_status_change trigger
DROP POLICY IF EXISTS "System can insert status history" ON public.order_status_history;
CREATE POLICY "Admins can insert status history" ON public.order_status_history
  FOR INSERT WITH CHECK (public.is_admin());

-- Trigger functions are not meant to be called through the API
REVOKE EXECUTE ON FUNCTION
  public.handle_new_user(),
  public.increment_coupon_usage(),
  public.log_order_status_change(),
  public.reduce_stock_on_order(),
  public.restore_stock_on_cancel(),
  public.recalculate_order_totals(uuid),
  public.enforce_order_item_price(),
  public.sync_order_totals_from_items(),
  public.enforce_coupon_usage()
FROM anon, authenticated, public;
