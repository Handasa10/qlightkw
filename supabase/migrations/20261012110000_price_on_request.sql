-- Products with no price (0) are "price on request": customers ask on WhatsApp instead of
-- ordering online. The website hides Add to Cart for them; this makes the database refuse
-- such order lines too, so nothing can be bought for 0 KWD.

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
  IF NEW.unit_price IS NULL OR NEW.unit_price <= 0 THEN
    RAISE EXCEPTION 'This product is priced on request. Please contact us on WhatsApp.' USING ERRCODE = '22023';
  END IF;
  NEW.total_price := NEW.unit_price * NEW.quantity;
  NEW.product_name_en := _product.name_en;
  NEW.product_name_ar := _product.name_ar;
  NEW.variation_name := _variation_name;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enforce_order_item_price() FROM anon, authenticated, public;
