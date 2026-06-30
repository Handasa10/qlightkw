-- Update product pricing and image URLs with real-world premium values

-- 1. Chandeliers
UPDATE public.products SET base_price = 249.900, sale_price = 199.900 WHERE slug = 'crystal-elegance-chandelier';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1543248939-ff40856f65d4?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'crystal-elegance-chandelier' LIMIT 1);

UPDATE public.products SET base_price = 189.000, sale_price = NULL WHERE slug = 'gold-sputnik-chandelier';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'gold-sputnik-chandelier' LIMIT 1);

UPDATE public.products SET base_price = 320.000, sale_price = 279.000 WHERE slug = 'black-empire-chandelier';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1572912353188-a5d0aeefaa68?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'black-empire-chandelier' LIMIT 1);

UPDATE public.products SET base_price = 175.000, sale_price = NULL WHERE slug = 'modern-ring-chandelier';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'modern-ring-chandelier' LIMIT 1);

UPDATE public.products SET base_price = 145.000, sale_price = 125.000 WHERE slug = 'vintage-candle-chandelier';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1571508601936-6ca847b47ae4?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'vintage-candle-chandelier' LIMIT 1);

-- 2. Ceiling Lights
UPDATE public.products SET base_price = 45.900, sale_price = 39.900 WHERE slug = 'led-flush-mount-round';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'led-flush-mount-round' LIMIT 1);

UPDATE public.products SET base_price = 55.000, sale_price = NULL WHERE slug = 'square-panel-light';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1606103658514-6830a687ef7f?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'square-panel-light' LIMIT 1);

UPDATE public.products SET base_price = 89.000, sale_price = 75.000 WHERE slug = 'crystal-ceiling-light';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'crystal-ceiling-light' LIMIT 1);

UPDATE public.products SET base_price = 79.000, sale_price = NULL WHERE slug = 'smart-wifi-ceiling-light';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'smart-wifi-ceiling-light' LIMIT 1);

UPDATE public.products SET base_price = 42.000, sale_price = NULL WHERE slug = 'minimalist-dome-light';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'minimalist-dome-light' LIMIT 1);

-- 3. Wall Lights
UPDATE public.products SET base_price = 65.000, sale_price = 55.000 WHERE slug = 'brass-wall-sconce';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'brass-wall-sconce' LIMIT 1);

UPDATE public.products SET base_price = 35.000, sale_price = NULL WHERE slug = 'industrial-cage-light';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'industrial-cage-light' LIMIT 1);

UPDATE public.products SET base_price = 48.000, sale_price = 42.000 WHERE slug = 'modern-swing-arm-lamp';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'modern-swing-arm-lamp' LIMIT 1);

UPDATE public.products SET base_price = 55.000, sale_price = NULL WHERE slug = 'led-wall-washer';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'led-wall-washer' LIMIT 1);

UPDATE public.products SET base_price = 38.000, sale_price = NULL WHERE slug = 'picture-light-bronze';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'picture-light-bronze' LIMIT 1);

-- 4. Pendant Lights
UPDATE public.products SET base_price = 75.000, sale_price = 65.000 WHERE slug = 'glass-globe-pendant';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'glass-globe-pendant' LIMIT 1);

UPDATE public.products SET base_price = 55.000, sale_price = NULL WHERE slug = 'industrial-dome-pendant';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'industrial-dome-pendant' LIMIT 1);

UPDATE public.products SET base_price = 68.000, sale_price = 58.000 WHERE slug = 'geometric-pendant-light';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1553095083-506e22c83c24?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'geometric-pendant-light' LIMIT 1);

UPDATE public.products SET base_price = 125.000, sale_price = NULL WHERE slug = 'cluster-pendant-set';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'cluster-pendant-set' LIMIT 1);

UPDATE public.products SET base_price = 45.000, sale_price = NULL WHERE slug = 'woven-rattan-pendant';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'woven-rattan-pendant' LIMIT 1);

-- 5. LED Strips
UPDATE public.products SET base_price = 28.000, sale_price = 22.000 WHERE slug = 'rgb-smart-led-strip-5m';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'rgb-smart-led-strip-5m' LIMIT 1);

UPDATE public.products SET base_price = 18.000, sale_price = NULL WHERE slug = 'warm-white-strip-3000k';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'warm-white-strip-3000k' LIMIT 1);

UPDATE public.products SET base_price = 35.000, sale_price = 29.000 WHERE slug = 'neon-flex-led-strip';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'neon-flex-led-strip' LIMIT 1);

UPDATE public.products SET base_price = 25.000, sale_price = NULL WHERE slug = 'cob-led-strip-daylight';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'cob-led-strip-daylight' LIMIT 1);

UPDATE public.products SET base_price = 42.000, sale_price = 36.000 WHERE slug = 'rgbw-led-strip-kit';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'rgbw-led-strip-kit' LIMIT 1);

-- 6. Floor Lamps
UPDATE public.products SET base_price = 89.000, sale_price = 75.000 WHERE slug = 'arc-floor-lamp';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'arc-floor-lamp' LIMIT 1);

UPDATE public.products SET base_price = 75.000, sale_price = NULL WHERE slug = 'tripod-floor-lamp';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1542728929-14ab1c6880f9?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'tripod-floor-lamp' LIMIT 1);

UPDATE public.products SET base_price = 55.000, sale_price = 48.000 WHERE slug = 'led-reading-floor-lamp';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'led-reading-floor-lamp' LIMIT 1);

UPDATE public.products SET base_price = 95.000, sale_price = NULL WHERE slug = 'industrial-pipe-lamp';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'industrial-pipe-lamp' LIMIT 1);

UPDATE public.products SET base_price = 68.000, sale_price = NULL WHERE slug = 'smart-touch-floor-lamp';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'smart-touch-floor-lamp' LIMIT 1);

-- 7. Outdoor Lighting
UPDATE public.products SET base_price = 45.000, sale_price = 38.000 WHERE slug = 'garden-bollard-light';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'garden-bollard-light' LIMIT 1);

UPDATE public.products SET base_price = 32.000, sale_price = NULL WHERE slug = 'solar-path-lights-set';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'solar-path-lights-set' LIMIT 1);

UPDATE public.products SET base_price = 55.000, sale_price = 48.000 WHERE slug = 'wall-mounted-lantern';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'wall-mounted-lantern' LIMIT 1);

UPDATE public.products SET base_price = 28.000, sale_price = NULL WHERE slug = 'flood-light-50w';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'flood-light-50w' LIMIT 1);

UPDATE public.products SET base_price = 18.000, sale_price = 15.000 WHERE slug = 'string-lights-10m';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'string-lights-10m' LIMIT 1);

-- 8. Spotlights
UPDATE public.products SET base_price = 12.500, sale_price = 9.900 WHERE slug = 'led-recessed-downlight-12w';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'led-recessed-downlight-12w' LIMIT 1);

UPDATE public.products SET base_price = 25.000, sale_price = NULL WHERE slug = 'track-light-head';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'track-light-head' LIMIT 1);

UPDATE public.products SET base_price = 18.000, sale_price = 15.000 WHERE slug = 'surface-mount-spotlight';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'surface-mount-spotlight' LIMIT 1);

UPDATE public.products SET base_price = 22.000, sale_price = NULL WHERE slug = 'gimbal-downlight';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1462826303086-329426d1aef5?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'gimbal-downlight' LIMIT 1);

UPDATE public.products SET base_price = 35.000, sale_price = 29.000 WHERE slug = 'mini-spotlight-set';
UPDATE public.product_images SET url = 'https://images.unsplash.com/photo-1431540015239-7c95a43a5136?auto=format&fit=crop&q=80&w=600' WHERE product_id = (SELECT id FROM public.products WHERE slug = 'mini-spotlight-set' LIMIT 1);

