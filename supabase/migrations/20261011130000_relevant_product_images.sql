-- Replace unrelated stock product photos with category-appropriate ones.
--
-- In June the catalog's product photos were bulk-replaced with random Unsplash
-- images (e.g. a plate of dumplings for a solar flood light). This maps every
-- category to a pool of photos that were checked by eye, and gives each product
-- a photo from its category's pool (spread across the pool so neighbours differ).
--
-- Only rows still pointing at images.unsplash.com are touched, so any real photo
-- uploaded through the admin panel is kept.

BEGIN;

CREATE TEMP TABLE image_pools (pool text PRIMARY KEY, urls text[]) ON COMMIT DROP;
INSERT INTO image_pools VALUES
    ('strip', ARRAY['https://images.unsplash.com/photo-1618403323851-ac3d38029495?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1659066019874-7a15628cea60?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1735473924766-2ffac80b719e?auto=format&fit=crop&q=80&w=800']),
    ('linear', ARRAY['https://images.unsplash.com/photo-1570005616859-784c0e1644c5?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1512551980832-13df02babc9e?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1584259097630-4d5cb684a0ec?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1771332819281-94ce4a1ec702?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1561661979-cd7243709678?auto=format&fit=crop&q=80&w=800']),
    ('magnetic', ARRAY['https://images.unsplash.com/photo-1526116638181-d787e552d669?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1512551980832-13df02babc9e?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1771332819281-94ce4a1ec702?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1570005616859-784c0e1644c5?auto=format&fit=crop&q=80&w=800']),
    ('spot', ARRAY['https://images.unsplash.com/photo-1697966522851-579b0d0f9c1b?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1579020151900-9f3b65f67aa5?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1602223876473-c37ee6c2a4e2?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1636891852883-862c06a10c90?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1705909944158-5325de9bb3a7?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1679121877287-0dbb1d68f44c?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1715318755388-100298581a17?auto=format&fit=crop&q=80&w=800']),
    ('panel', ARRAY['https://images.unsplash.com/photo-1641159930908-e9eb9ccdc002?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1767294274700-c2a68decaad5?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1750189953388-5ef155c12369?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1772391032510-34fb90537b2e?auto=format&fit=crop&q=80&w=800']),
    ('highbay', ARRAY['https://images.unsplash.com/photo-1633523316711-a969b8f47bdc?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1772305336606-989a457ffbae?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1634834576400-56f5e1ad8db8?auto=format&fit=crop&q=80&w=800']),
    ('chandelier', ARRAY['https://images.unsplash.com/photo-1627306411131-358d6d0fd2cb?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1764185754864-1e26d14f0e8c?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1531762948975-73032b7b61f4?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1509437142917-63dfe86dcbec?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1572955034096-233ea61a78d8?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1576514409676-dbcb2640bf58?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1526568929-7cdd510e77fd?auto=format&fit=crop&q=80&w=800']),
    ('brass', ARRAY['https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1627306411131-358d6d0fd2cb?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1572955034096-233ea61a78d8?auto=format&fit=crop&q=80&w=800']),
    ('pendant', ARRAY['https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1772536394212-60fbf8a8fa5b?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1656402887556-e727ffe1f6d7?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1758945630632-7a8f1caffc6d?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1589173956121-8891103b66b0?auto=format&fit=crop&q=80&w=800']),
    ('sconce', ARRAY['https://images.unsplash.com/photo-1790605762222-62b40faaa6da?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1783008918134-1c3b5cabc908?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1753912180048-beeddfe216b2?auto=format&fit=crop&q=80&w=800']),
    ('accent', ARRAY['https://images.unsplash.com/photo-1790605762222-62b40faaa6da?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1735473924766-2ffac80b719e?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1589173956121-8891103b66b0?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1764185754864-1e26d14f0e8c?auto=format&fit=crop&q=80&w=800']),
    ('indoor', ARRAY['https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1579020151900-9f3b65f67aa5?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1750189953388-5ef155c12369?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1790605762222-62b40faaa6da?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1656402887556-e727ffe1f6d7?auto=format&fit=crop&q=80&w=800']),
    ('cabinet', ARRAY['https://images.unsplash.com/photo-1567196279979-3bf2f62e8d35?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1774716925737-2618ea7ebc50?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1772567733035-edbd44fb56b1?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1776831293955-f569f2f3a4b5?auto=format&fit=crop&q=80&w=800']),
    ('stair', ARRAY['https://images.unsplash.com/photo-1529160638848-c6c71fee1cb7?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1584259097593-a34c6bc53860?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1576156049735-265d7dbdc5f7?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1584259432689-f6894ce102be?auto=format&fit=crop&q=80&w=800']),
    ('outwall', ARRAY['https://images.unsplash.com/photo-1759722127805-39a77d665cb9?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1766128868287-7931ad45d6ef?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1705354154299-1fc2d030fa15?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1759390304641-9490a433c34b?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1766788465232-c87291004c3f?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1764857558281-3b804f32463e?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1762933453125-f00f5de15631?auto=format&fit=crop&q=80&w=800']),
    ('garden', ARRAY['https://images.unsplash.com/photo-1658692051708-519fbdac7e8f?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1594353162824-a8b237f9adae?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1527359443443-84a48aec73d2?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1604601638534-8cc3198794e2?auto=format&fit=crop&q=80&w=800']),
    ('street', ARRAY['https://images.unsplash.com/photo-1566276423184-a8c13d2a88a1?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1626006846694-f0852fa032f1?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1757656822581-b03819b254c1?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1565199975350-a723a63c053f?auto=format&fit=crop&q=80&w=800']),
    ('flood', ARRAY['https://images.unsplash.com/photo-1779036440565-9e776cfce061?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1509928015542-fcc9b3bcd048?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1574876705975-05e0bb4cddce?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1716561388086-cbc1e07f9f65?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1705473110515-065ef85be6fb?auto=format&fit=crop&q=80&w=800']),
    ('solar', ARRAY['https://images.unsplash.com/photo-1719992807597-142cdca47542?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1789835015215-8fda9f118184?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1586995942222-7af8ba44632c?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1683876510308-a4985997f866?auto=format&fit=crop&q=80&w=800']),
    ('outdoor', ARRAY['https://images.unsplash.com/photo-1759722127805-39a77d665cb9?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1658692051708-519fbdac7e8f?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1766128868287-7931ad45d6ef?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1594353162824-a8b237f9adae?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1719992807597-142cdca47542?auto=format&fit=crop&q=80&w=800']),
    ('bulb', ARRAY['https://images.unsplash.com/photo-1532007271951-c487760934ae?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1556401615-c909c3d67480?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1674659719067-8735479ba10c?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1641113403042-0b6f6e5e0a35?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1583341655470-c039d25ce01e?auto=format&fit=crop&q=80&w=800']),
    ('fan', ARRAY['https://images.unsplash.com/photo-1609519479841-5fd3b2884e17?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1555470100-1728256970aa?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1576503963299-fcd31822b523?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1632394128474-b8c3dca00f83?auto=format&fit=crop&q=80&w=800']),
    ('vent', ARRAY['https://images.unsplash.com/photo-1652699160837-6471c565b440?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1645533920626-06e2b9186f43?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1695760177249-85c742906940?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1572081790780-1a7739896259?auto=format&fit=crop&q=80&w=800']),
    ('switch', ARRAY['https://images.unsplash.com/photo-1698768144235-b5dbe3043bb2?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1705938298629-5e474cf76245?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1762087577379-13b2a75d9436?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1638468626915-5b663bf32f6e?auto=format&fit=crop&q=80&w=800']),
    ('socket', ARRAY['https://images.unsplash.com/photo-1610056494071-9373f12bf769?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1650501386688-41f6d0251875?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1781331534854-c75885f01c01?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1788399629805-a01bedd4a73b?auto=format&fit=crop&q=80&w=800']),
    ('tools', ARRAY['https://images.unsplash.com/photo-1645651964715-d200ce0939cc?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1606676539940-12768ce0e762?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1518709414768-a88981a4515d?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1683115099413-5b7d85c2950c?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1546827209-a218e99fdbe9?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1540103711724-ebf833bde8d1?auto=format&fit=crop&q=80&w=800']);

CREATE TEMP TABLE category_pools (category_slug text PRIMARY KEY, pool text) ON COMMIT DROP;
INSERT INTO category_pools VALUES
    ('12v-led-strip-light', 'strip'),
    ('220v-led-strip-light', 'strip'),
    ('24v-led-strip-light', 'strip'),
    ('5v-led-strip-light', 'strip'),
    ('led-strip-light', 'strip'),
    ('aluminum-profile', 'linear'),
    ('led-strip-light-aluminum-profile', 'linear'),
    ('linear-light', 'linear'),
    ('magnetic-light', 'magnetic'),
    ('recessed-magnetic-light', 'magnetic'),
    ('ultra-thin-surface-mounted-magnetic-light', 'magnetic'),
    ('led-spot-light', 'spot'),
    ('led-downlight', 'spot'),
    ('professional-lighting', 'spot'),
    ('led-panel-light', 'panel'),
    ('ceiling-general-lighting', 'panel'),
    ('high-bay-light', 'highbay'),
    ('chandelier', 'chandelier'),
    ('luxury-brass-light', 'brass'),
    ('modi-selections', 'chandelier'),
    ('pendant-lighting', 'pendant'),
    ('indoor-wall-light', 'sconce'),
    ('accent-decorative-lighting', 'accent'),
    ('indoor-lights', 'indoor'),
    ('cabinet-light', 'cabinet'),
    ('led-stair-lights', 'stair'),
    ('led-outdoor-wall-light', 'outwall'),
    ('led-garden-light', 'garden'),
    ('led-street-light', 'street'),
    ('led-flood-light', 'flood'),
    ('solar-lights', 'solar'),
    ('outdoor-lights', 'outdoor'),
    ('led-bulbs-tubes', 'bulb'),
    ('household-fan', 'fan'),
    ('ventilation-fan', 'vent'),
    ('sensor-switch', 'switch'),
    ('smart-control', 'switch'),
    ('extension-socket', 'socket'),
    ('hardware', 'tools'),
    ('power-tools', 'tools');

-- Number each image within its category so consecutive products get different photos
WITH ranked AS (
  SELECT pi.id,
         ip.urls,
         ROW_NUMBER() OVER (PARTITION BY c.slug ORDER BY p.slug, pi.is_primary DESC, pi.sort_order, pi.id) - 1 AS n
  FROM public.product_images pi
  JOIN public.products p ON p.id = pi.product_id
  JOIN public.categories c ON c.id = p.category_id
  JOIN category_pools cp ON cp.category_slug = c.slug
  JOIN image_pools ip ON ip.pool = cp.pool
  WHERE pi.url LIKE 'https://images.unsplash.com/%'
)
UPDATE public.product_images pi
SET url = ranked.urls[(ranked.n % array_length(ranked.urls, 1)) + 1]
FROM ranked
WHERE pi.id = ranked.id;

-- Category tiles get the first photo of their pool (several still pointed at deleted photos)
UPDATE public.categories c
SET image_url = replace(ip.urls[1], 'w=800', 'w=600')
FROM category_pools cp
JOIN image_pools ip ON ip.pool = cp.pool
WHERE cp.category_slug = c.slug
  AND (c.image_url IS NULL OR c.image_url LIKE 'https://images.unsplash.com/%');

COMMIT;
