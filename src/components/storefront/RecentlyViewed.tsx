import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCatalog } from '@/hooks/useCatalog';
import { getViewed } from '@/lib/recently-viewed';
import ProductRail from './ProductRail';

// "Recently viewed": what this visitor looked at before, so they can pick up where they left off
const RecentlyViewed = ({ excludeId }: { excludeId?: string }) => {
  const { isRTL } = useLanguage();
  const { products } = useCatalog();
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => { setIds(getViewed()); }, [excludeId]);

  const byId = new Map(products.map((p) => [p.id, p]));
  const list = ids.filter((id) => id !== excludeId).map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (list.length < 2) return null;
  return <ProductRail title={isRTL ? 'شاهدتها مؤخراً' : 'Recently viewed'} products={list} />;
};

export default RecentlyViewed;
