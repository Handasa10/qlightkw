// Price helpers shared by the storefront.
// The charged price is sale_price when set, else base_price (same rule as the cart and checkout).
// A struck-through "original" price is only shown when the sale price is really lower than the base price,
// so a sale_price entered higher than base_price never shows a fake or negative discount.
type Priced = { base_price: number; sale_price: number | null };

export const effectivePrice = (p: Priced): number => Number(p.sale_price || p.base_price || 0);

export const comparePrice = (p: Priced): number | null =>
  p.sale_price && Number(p.sale_price) < Number(p.base_price) ? Number(p.base_price) : null;

export const discountPercent = (p: Priced): number => {
  const original = comparePrice(p);
  return original ? Math.round(((original - effectivePrice(p)) / original) * 100) : 0;
};
