-- =========================================================
-- FULL CATALOG INTEGRATION FOR QUALITY LIGHT STORE
-- Populates all 40 categories with premium photos and products
-- =========================================================

BEGIN;

-- 1. Update Category Photos for all 40 categories
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600' WHERE slug = 'solar-lights';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600' WHERE slug = 'led-strip-light-aluminum-profile';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600' WHERE slug = 'led-strip-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600' WHERE slug = '220v-led-strip-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600' WHERE slug = '24v-led-strip-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=600' WHERE slug = '12v-led-strip-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600' WHERE slug = '5v-led-strip-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600' WHERE slug = 'aluminum-profile';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600' WHERE slug = 'magnetic-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600' WHERE slug = 'indoor-lights';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600' WHERE slug = 'recessed-magnetic-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=600' WHERE slug = 'ceiling-general-lighting';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=600' WHERE slug = 'led-downlight';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1606103658514-6830a687ef7f?auto=format&fit=crop&q=80&w=600' WHERE slug = 'led-panel-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600' WHERE slug = 'linear-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1550985543-f47f38aee65e?auto=format&fit=crop&q=80&w=600' WHERE slug = 'led-bulbs-tubes';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1542728929-14ab1c6880f9?auto=format&fit=crop&q=80&w=600' WHERE slug = 'accent-decorative-lighting';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1543248939-ff40856f65d4?auto=format&fit=crop&q=80&w=600' WHERE slug = 'luxury-brass-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600' WHERE slug = 'pendant-lighting';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1572912353188-a5d0aeefaa68?auto=format&fit=crop&q=80&w=600' WHERE slug = 'chandelier';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=600' WHERE slug = 'indoor-wall-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=600' WHERE slug = 'led-spot-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600' WHERE slug = 'cabinet-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600' WHERE slug = 'professional-lighting';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600' WHERE slug = 'high-bay-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600' WHERE slug = 'smart-control';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600' WHERE slug = 'sensor-switch';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1508615070457-7baebe4003ab?auto=format&fit=crop&q=80&w=600' WHERE slug = 'outdoor-lights';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600' WHERE slug = 'led-flood-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?auto=format&fit=crop&q=80&w=600' WHERE slug = 'led-street-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=600' WHERE slug = 'led-garden-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&q=80&w=600' WHERE slug = 'led-outdoor-wall-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600' WHERE slug = 'led-stair-lights';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=600' WHERE slug = 'ultra-thin-surface-mounted-magnetic-light';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600' WHERE slug = 'hardware';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600' WHERE slug = 'extension-socket';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1613540015239-7c95a43a5136?auto=format&fit=crop&q=80&w=600' WHERE slug = 'ventilation-fan';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=600' WHERE slug = 'household-fan';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600' WHERE slug = 'power-tools';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&q=80&w=600' WHERE slug = 'modi-selections';

-- 2. Clean up existing products to prevent duplicates
DELETE FROM public.product_images WHERE product_id IN (SELECT id FROM public.products WHERE slug IN ('solar-path-lights-set-8pc', 'solar-flood-light-100w-remote', 'recessed-aluminum-profile-v-shape', 'surface-mount-led-profile-2m', 'cob-led-strip-light-5m-3000k', 'neon-flex-rgb-strip-5m', 'high-voltage-220v-strip-waterproof', 'outdoor-220v-strip-light-warm', 'prof-24v-cob-led-strip', 'dimmable-24v-led-strip-warm', '12v-rgb-led-strip-sync-kit', '12v-under-cabinet-strip-light', '5v-usb-tv-backlight-strip', 'portable-5v-led-strip-battery', 'slim-aluminum-profile-channel-1m', 'wide-surface-aluminum-track-2m', 'magnetic-track-light-rail-2m', 'magnetic-track-spotlight-12w', 'modern-fabric-floor-lamp-scand', 'sleek-desk-study-lamp-led', 'recessed-magnetic-track-rail-1m', 'recessed-magnetic-grille-18w', 'led-flush-mount-round-24w-gen', 'modern-circular-ceiling-chandelier', 'ultra-thin-led-downlight-12w-flat', 'anti-glare-deep-downlight-9w', 'slim-led-panel-60x60cm-40w', 'recessed-panel-light-30x30cm', 'suspended-led-linear-light-12m', 'linkable-surface-linear-light', 'vintage-filament-led-bulb-e27', 't8-led-tube-light-4feet-18w', 'hexagon-wall-light-panels-6pc', 'sunset-projection-lamp-usb', 'premium-solid-brass-chandelier', 'luxury-brass-wall-sconce-modern', 'nordic-wooden-pendant-lamp', 'industrial-metal-dome-pendant-black', 'crystal-elegance-chandelier-prod', 'modern-gold-sputnik-chandelier-p', 'modern-nordic-wall-sconce', 'minimalist-led-up-down-wall-light', 'cob-spotlight-gu10-7w', 'directional-surface-spotlight-15w', 'wireless-motion-sensor-closet-light', 'under-cabinet-linkable-led-puck', 'commercial-track-spotlight-30w', 'high-power-retail-spotlight-50w', 'ufo-led-high-bay-light-150w', 'industrial-led-high-bay-100w', 'smart-wifi-light-switch-3gang', 'smart-rgb-controller-rf-remote', 'pir-motion-sensor-wall-switch', 'touchless-hand-wave-sensor-switch', 'modern-outdoor-wall-sconce-wpr', 'waterproof-led-pillar-light-gate', 'slim-led-flood-light-100w-ip66', 'portable-rechargeable-flood-light', 'solar-street-light-200w-pole', 'integrated-led-street-light-100w', 'solar-garden-flame-torch-4pack', 'led-spike-lawn-light-5w', 'up-down-outdoor-wall-light-led', 'round-outdoor-led-bulkhead-light', 'recessed-led-step-light-waterproof', 'step-stair-strip-light-controller', 'ultra-thin-magnetic-track-1m', 'ultra-thin-magnetic-linear-12w', 'designer-glass-switch-cover-white', 'heavy-duty-mounting-bracket-set', 'sleek-extension-socket-4way-usb', 'smart-wifi-extension-board', 'quiet-bathroom-exhaust-fan-4inch', 'ceiling-exhaust-fan-8inch-metal', 'remote-control-pedestal-stand-fan', 'modern-wall-mount-fan-pull-cord', 'cordless-drill-driver-kit-12v', 'laser-distance-meter-40m', 'modi-curved-linear-led-chandelier', 'modi-recessed-dual-spotlight-white'));
DELETE FROM public.products WHERE slug IN ('solar-path-lights-set-8pc', 'solar-flood-light-100w-remote', 'recessed-aluminum-profile-v-shape', 'surface-mount-led-profile-2m', 'cob-led-strip-light-5m-3000k', 'neon-flex-rgb-strip-5m', 'high-voltage-220v-strip-waterproof', 'outdoor-220v-strip-light-warm', 'prof-24v-cob-led-strip', 'dimmable-24v-led-strip-warm', '12v-rgb-led-strip-sync-kit', '12v-under-cabinet-strip-light', '5v-usb-tv-backlight-strip', 'portable-5v-led-strip-battery', 'slim-aluminum-profile-channel-1m', 'wide-surface-aluminum-track-2m', 'magnetic-track-light-rail-2m', 'magnetic-track-spotlight-12w', 'modern-fabric-floor-lamp-scand', 'sleek-desk-study-lamp-led', 'recessed-magnetic-track-rail-1m', 'recessed-magnetic-grille-18w', 'led-flush-mount-round-24w-gen', 'modern-circular-ceiling-chandelier', 'ultra-thin-led-downlight-12w-flat', 'anti-glare-deep-downlight-9w', 'slim-led-panel-60x60cm-40w', 'recessed-panel-light-30x30cm', 'suspended-led-linear-light-12m', 'linkable-surface-linear-light', 'vintage-filament-led-bulb-e27', 't8-led-tube-light-4feet-18w', 'hexagon-wall-light-panels-6pc', 'sunset-projection-lamp-usb', 'premium-solid-brass-chandelier', 'luxury-brass-wall-sconce-modern', 'nordic-wooden-pendant-lamp', 'industrial-metal-dome-pendant-black', 'crystal-elegance-chandelier-prod', 'modern-gold-sputnik-chandelier-p', 'modern-nordic-wall-sconce', 'minimalist-led-up-down-wall-light', 'cob-spotlight-gu10-7w', 'directional-surface-spotlight-15w', 'wireless-motion-sensor-closet-light', 'under-cabinet-linkable-led-puck', 'commercial-track-spotlight-30w', 'high-power-retail-spotlight-50w', 'ufo-led-high-bay-light-150w', 'industrial-led-high-bay-100w', 'smart-wifi-light-switch-3gang', 'smart-rgb-controller-rf-remote', 'pir-motion-sensor-wall-switch', 'touchless-hand-wave-sensor-switch', 'modern-outdoor-wall-sconce-wpr', 'waterproof-led-pillar-light-gate', 'slim-led-flood-light-100w-ip66', 'portable-rechargeable-flood-light', 'solar-street-light-200w-pole', 'integrated-led-street-light-100w', 'solar-garden-flame-torch-4pack', 'led-spike-lawn-light-5w', 'up-down-outdoor-wall-light-led', 'round-outdoor-led-bulkhead-light', 'recessed-led-step-light-waterproof', 'step-stair-strip-light-controller', 'ultra-thin-magnetic-track-1m', 'ultra-thin-magnetic-linear-12w', 'designer-glass-switch-cover-white', 'heavy-duty-mounting-bracket-set', 'sleek-extension-socket-4way-usb', 'smart-wifi-extension-board', 'quiet-bathroom-exhaust-fan-4inch', 'ceiling-exhaust-fan-8inch-metal', 'remote-control-pedestal-stand-fan', 'modern-wall-mount-fan-pull-cord', 'cordless-drill-driver-kit-12v', 'laser-distance-meter-40m', 'modi-curved-linear-led-chandelier', 'modi-recessed-dual-spotlight-white');

-- 3. Insert Products and images
-- Category: solar-lights
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '095ea0bb-fb21-41d2-81f7-ad47ab0258be',
  'Solar Pathway Lights Set (8-Pack)',
  'مجموعة مصابيح مسار شمسية (8 قطع)',
  'solar-path-lights-set-8pc',
  15,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'solar-lights' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Waterproof solar-powered pathway lights in stainless steel. Automatic dusk-to-dawn operation.',
  'مصابيح مسار شمسية مقاومة للماء مصنوعة من الفولاذ المقاوم للصدأ. تعمل تلقائياً من الغسق حتى الفجر.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'SL-PTH-001'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('095ea0bb-fb21-41d2-81f7-ad47ab0258be', 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=600', true, 'Solar Pathway Lights Set (8-Pack)', 'مجموعة مصابيح مسار شمسية (8 قطع)', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('095ea0bb-fb21-41d2-81f7-ad47ab0258be', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=600', false, 'Solar Pathway Lights Set (8-Pack) - Alternate', 'مجموعة مصابيح مسار شمسية (8 قطع) - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'b6e25913-28d4-4de1-bcda-34f414945c6b',
  'Solar Flood Light 100W with Remote',
  'كشاف إضاءة شمسي 100 واط مع ريموت',
  'solar-flood-light-100w-remote',
  28,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'solar-lights' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'High-brightness solar flood light with IP67 waterproofing, remote control, and timer settings.',
  'كشاف إضاءة شمسي عالي السطوع مع مقاومة للماء IP67، جهاز تحكم عن بعد وإعدادات مؤقت.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'SL-FLD-100'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('b6e25913-28d4-4de1-bcda-34f414945c6b', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600', true, 'Solar Flood Light 100W with Remote', 'كشاف إضاءة شمسي 100 واط مع ريموت', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('b6e25913-28d4-4de1-bcda-34f414945c6b', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600', false, 'Solar Flood Light 100W with Remote - Alternate', 'كشاف إضاءة شمسي 100 واط مع ريموت - صورة بديلة', 1);

-- Category: led-strip-light-aluminum-profile
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '50444db4-ff9a-4e58-a032-5acda817d663',
  'Recessed Aluminum Profile V-Shape 2M',
  'بروفايل ألومنيوم غائر على شكل حرف V مترين',
  'recessed-aluminum-profile-v-shape',
  4.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-strip-light-aluminum-profile' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Anodized aluminum channel profile for corner LED strip installations. Includes diffuser lens.',
  'قناة بروفايل ألومنيوم مطلي لتركيب شرائط LED في الزوايا. يشمل غطاء التشتيت.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'AP-REC-V01'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('50444db4-ff9a-4e58-a032-5acda817d663', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600', true, 'Recessed Aluminum Profile V-Shape 2M', 'بروفايل ألومنيوم غائر على شكل حرف V مترين', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('50444db4-ff9a-4e58-a032-5acda817d663', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600', false, 'Recessed Aluminum Profile V-Shape 2M - Alternate', 'بروفايل ألومنيوم غائر على شكل حرف V مترين - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '4a4df90f-f229-4269-b53e-19e693897539',
  'Surface Mount LED Profile 2M',
  'بروفايل ألومنيوم سطحي مترين',
  'surface-mount-led-profile-2m',
  5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-strip-light-aluminum-profile' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Flat surface-mounted aluminum channel for clean LED strip lighting. Complete with end caps.',
  'قناة ألومنيوم مسطحة تثبت على السطح لإضاءة شريط LED نظيفة. كاملة مع الأغطية النهائية.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'AP-SRF-M02'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('4a4df90f-f229-4269-b53e-19e693897539', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600', true, 'Surface Mount LED Profile 2M', 'بروفايل ألومنيوم سطحي مترين', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('4a4df90f-f229-4269-b53e-19e693897539', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600', false, 'Surface Mount LED Profile 2M - Alternate', 'بروفايل ألومنيوم سطحي مترين - صورة بديلة', 1);

-- Category: led-strip-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'ab2e1cc8-6169-4cbe-8f07-6ac937895553',
  'COB LED Strip Light 5M 3000K',
  'شريط إضاءة LED COB 5 متر 3000 كلفن',
  'cob-led-strip-light-5m-3000k',
  12,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-strip-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'High-density dotless COB LED strip. Warm white 3000K, highly flexible and cuttable.',
  'شريط LED COB عالي الكثافة خالي من النقاط. أبيض دافئ 3000 كلفن، مرن للغاية وقابل للقص.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'ST-COB-300'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('ab2e1cc8-6169-4cbe-8f07-6ac937895553', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600', true, 'COB LED Strip Light 5M 3000K', 'شريط إضاءة LED COB 5 متر 3000 كلفن', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('ab2e1cc8-6169-4cbe-8f07-6ac937895553', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600', false, 'COB LED Strip Light 5M 3000K - Alternate', 'شريط إضاءة LED COB 5 متر 3000 كلفن - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '90137822-b6dc-4977-890e-8c252489a7a4',
  'Neon Flex RGB Strip Light 5M',
  'شريط نيون فليكس ملون 5 متر',
  'neon-flex-rgb-strip-5m',
  18,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-strip-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Flexible neon-style silicone LED strip with RGB color changing. Waterproof IP65.',
  'شريط LED سيليكون مرن بنمط النيون مع تغيير ألوان RGB. مقاوم للماء IP65.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'ST-NEO-RGB'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('90137822-b6dc-4977-890e-8c252489a7a4', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600', true, 'Neon Flex RGB Strip Light 5M', 'شريط نيون فليكس ملون 5 متر', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('90137822-b6dc-4977-890e-8c252489a7a4', 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=600', false, 'Neon Flex RGB Strip Light 5M - Alternate', 'شريط نيون فليكس ملون 5 متر - صورة بديلة', 1);

-- Category: 220v-led-strip-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'd57950ad-e71e-4e63-90fc-58e95a4dd61f',
  'High-Voltage 220V LED Strip Waterproof',
  'شريط إضاءة LED جهد 220 فولت مقاوم للماء',
  'high-voltage-220v-strip-waterproof',
  25,
  NULL,
  (SELECT id FROM public.categories WHERE slug = '220v-led-strip-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Direct-connect 220V LED strip light, ideal for long outdoor outlines or building facade highlights.',
  'شريط إضاءة LED توصيل مباشر 220 فولت، مثالي للمسافات الطويلة الخارجية أو إضاءة واجهات المباني.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'ST-220-WPR'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('d57950ad-e71e-4e63-90fc-58e95a4dd61f', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600', true, 'High-Voltage 220V LED Strip Waterproof', 'شريط إضاءة LED جهد 220 فولت مقاوم للماء', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('d57950ad-e71e-4e63-90fc-58e95a4dd61f', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600', false, 'High-Voltage 220V LED Strip Waterproof - Alternate', 'شريط إضاءة LED جهد 220 فولت مقاوم للماء - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'd5d9d263-47c1-432a-b7cd-83fe30670c92',
  'Outdoor 220V Strip Light Warm White',
  'شريط إضاءة خارجي 220 فولت أبيض دافئ',
  'outdoor-220v-strip-light-warm',
  22,
  NULL,
  (SELECT id FROM public.categories WHERE slug = '220v-led-strip-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Heavy-duty outdoor 220V strip light in warm white tone, flexible and UV-resistant jacket.',
  'شريط إضاءة خارجي 220 فولت قوي باللون الأبيض الدافئ، مرن ومقاوم للأشعة فوق البنفسجية.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'ST-220-WRM'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('d5d9d263-47c1-432a-b7cd-83fe30670c92', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600', true, 'Outdoor 220V Strip Light Warm White', 'شريط إضاءة خارجي 220 فولت أبيض دافئ', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('d5d9d263-47c1-432a-b7cd-83fe30670c92', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600', false, 'Outdoor 220V Strip Light Warm White - Alternate', 'شريط إضاءة خارجي 220 فولت أبيض دافئ - صورة بديلة', 1);

-- Category: 24v-led-strip-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'ffa52495-165a-41bf-b055-f587b9fba795',
  'Professional 24V COB LED Strip 5M',
  'شريط LED COB احترافي 24 فولت 5 متر',
  'prof-24v-cob-led-strip',
  14,
  NULL,
  (SELECT id FROM public.categories WHERE slug = '24v-led-strip-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Premium 24V COB strip offering seamless light without spots. Safe low voltage.',
  'شريط COB ممتاز 24 فولت يوفر ضوءاً متواصلاً بدون نقاط. جهد منخفض آمن.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'ST-24V-COB'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('ffa52495-165a-41bf-b055-f587b9fba795', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600', true, 'Professional 24V COB LED Strip 5M', 'شريط LED COB احترافي 24 فولت 5 متر', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('ffa52495-165a-41bf-b055-f587b9fba795', 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=600', false, 'Professional 24V COB LED Strip 5M - Alternate', 'شريط LED COB احترافي 24 فولت 5 متر - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '37ad7e24-ead5-4f0c-b0a4-edc29a2455ba',
  'Dimmable 24V LED Strip Warm Light',
  'شريط LED قابل للتعتيم 24 فولت إضاءة دافئة',
  'dimmable-24v-led-strip-warm',
  15,
  NULL,
  (SELECT id FROM public.categories WHERE slug = '24v-led-strip-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Dimmable 24V LED strip, highly compatible with smart home controllers and dimmers.',
  'شريط LED قابل للتعتيم 24 فولت، متوافق جداً مع أجهزة التحكم الذكية للمنزل ومفاتيح التعتيم.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'ST-24V-DIM'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('37ad7e24-ead5-4f0c-b0a4-edc29a2455ba', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600', true, 'Dimmable 24V LED Strip Warm Light', 'شريط LED قابل للتعتيم 24 فولت إضاءة دافئة', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('37ad7e24-ead5-4f0c-b0a4-edc29a2455ba', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600', false, 'Dimmable 24V LED Strip Warm Light - Alternate', 'شريط LED قابل للتعتيم 24 فولت إضاءة دافئة - صورة بديلة', 1);

-- Category: 12v-led-strip-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '625a022f-1f7b-4105-9a35-88ebe507126a',
  '12V RGB LED Strip Sync Kit',
  'مجموعة شريط إضاءة LED ملون 12 فولت',
  '12v-rgb-led-strip-sync-kit',
  8.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = '12v-led-strip-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  '12V RGB strip kit with remote control, music sync sensor, and power adapter.',
  'مجموعة شريط RGB جهد 12 فولت مع جهاز تحكم عن بعد، مستشعر مزامنة الموسيقى، ومحول الطاقة.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'ST-12V-RGB'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('625a022f-1f7b-4105-9a35-88ebe507126a', 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=600', true, '12V RGB LED Strip Sync Kit', 'مجموعة شريط إضاءة LED ملون 12 فولت', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('625a022f-1f7b-4105-9a35-88ebe507126a', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600', false, '12V RGB LED Strip Sync Kit - Alternate', 'مجموعة شريط إضاءة LED ملون 12 فولت - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'c799dfc5-5d09-4ae4-9928-c31b15b45111',
  '12V Under-Cabinet Strip Light 3M',
  'شريط إضاءة أسفل الكابينت 12 فولت 3 متر',
  '12v-under-cabinet-strip-light',
  7,
  NULL,
  (SELECT id FROM public.categories WHERE slug = '12v-led-strip-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Ultra-thin 12V LED strip light with adhesive backing. Perfect for kitchen cabinets.',
  'شريط إضاءة LED نحيف 12 فولت مع لاصق خلفي. مثالي لخزائن المطبخ.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'ST-12V-CAB'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('c799dfc5-5d09-4ae4-9928-c31b15b45111', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600', true, '12V Under-Cabinet Strip Light 3M', 'شريط إضاءة أسفل الكابينت 12 فولت 3 متر', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('c799dfc5-5d09-4ae4-9928-c31b15b45111', 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=600', false, '12V Under-Cabinet Strip Light 3M - Alternate', 'شريط إضاءة أسفل الكابينت 12 فولت 3 متر - صورة بديلة', 1);

-- Category: 5v-led-strip-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '38b4c83e-5e7e-4d2b-ae21-109a4a636b66',
  '5V USB TV Backlight Strip 2M',
  'شريط إضاءة خلفي للتلفزيون USB جهد 5 فولت',
  '5v-usb-tv-backlight-strip',
  3.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = '5v-led-strip-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'USB-powered 5V LED strip. Reduces eye strain and enhances TV viewing contrast.',
  'شريط LED يعمل بمنفذ USB جهد 5 فولت. يقلل من إجهاد العين ويعزز تباين مشاهدة التلفزيون.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'ST-05V-USB'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('38b4c83e-5e7e-4d2b-ae21-109a4a636b66', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600', true, '5V USB TV Backlight Strip 2M', 'شريط إضاءة خلفي للتلفزيون USB جهد 5 فولت', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('38b4c83e-5e7e-4d2b-ae21-109a4a636b66', 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=600', false, '5V USB TV Backlight Strip 2M - Alternate', 'شريط إضاءة خلفي للتلفزيون USB جهد 5 فولت - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '073065e6-3a27-4184-a26d-5322fa0b25c5',
  'Portable 5V LED Strip with Battery Pack',
  'شريط إضاءة LED متنقل 5 فولت مع علبة بطارية',
  'portable-5v-led-strip-battery',
  4,
  NULL,
  (SELECT id FROM public.categories WHERE slug = '5v-led-strip-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Battery-operated portable 5V strip light, ideal for camping, closets, and decorative crafts.',
  'شريط إضاءة متنقل يعمل بالبطارية 5 فولت، مثالي للتخييم والخزائن والأعمال الحرفية الديكورية.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'ST-05V-BAT'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('073065e6-3a27-4184-a26d-5322fa0b25c5', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600', true, 'Portable 5V LED Strip with Battery Pack', 'شريط إضاءة LED متنقل 5 فولت مع علبة بطارية', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('073065e6-3a27-4184-a26d-5322fa0b25c5', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600', false, 'Portable 5V LED Strip with Battery Pack - Alternate', 'شريط إضاءة LED متنقل 5 فولت مع علبة بطارية - صورة بديلة', 1);

-- Category: aluminum-profile
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '2d13f37a-51e2-4364-9891-118b0c165238',
  'Slim Aluminum Profile Channel 1M',
  'مجرى بروفايل ألومنيوم نحيف 1 متر',
  'slim-aluminum-profile-channel-1m',
  2.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'aluminum-profile' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Slim aluminum profile channel for recessed mounting, creates a clean integrated finish.',
  'مجرى بروفايل ألومنيوم نحيف للتركيب الغائر، يوفر تشطيباً مدمجاً ونظيفاً.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'AP-SLM-101'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('2d13f37a-51e2-4364-9891-118b0c165238', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600', true, 'Slim Aluminum Profile Channel 1M', 'مجرى بروفايل ألومنيوم نحيف 1 متر', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('2d13f37a-51e2-4364-9891-118b0c165238', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600', false, 'Slim Aluminum Profile Channel 1M - Alternate', 'مجرى بروفايل ألومنيوم نحيف 1 متر - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'dcdf544d-6ab5-4162-a5a3-f4524baa3d51',
  'Wide Surface Aluminum Track 2M',
  'مجرى ألومنيوم سطحي عريض مترين',
  'wide-surface-aluminum-track-2m',
  3.2,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'aluminum-profile' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Wide surface-mount aluminum profile, suitable for wider strip lights or dual strips.',
  'بروفايل ألومنيوم سطحي عريض، مناسب لشرائط الإضاءة العريضة أو الشرائط المزدوجة.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'AP-WDE-202'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('dcdf544d-6ab5-4162-a5a3-f4524baa3d51', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600', true, 'Wide Surface Aluminum Track 2M', 'مجرى ألومنيوم سطحي عريض مترين', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('dcdf544d-6ab5-4162-a5a3-f4524baa3d51', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600', false, 'Wide Surface Aluminum Track 2M - Alternate', 'مجرى ألومنيوم سطحي عريض مترين - صورة بديلة', 1);

-- Category: magnetic-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '1dc2154c-15ce-4ce2-9306-dcbc12c2fa8f',
  'Magnetic Track Light Rail 2M',
  'مجرى إضاءة مغناطيسي سكة مترين',
  'magnetic-track-light-rail-2m',
  18,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'magnetic-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Sleek surface-mounted magnetic track light rail. Rated for DC48V safety voltage.',
  'مجرى إضاءة مغناطيسي سطحي أنيق. مصمم لجهد أمان DC48V.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'ML-TRK-2M'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('1dc2154c-15ce-4ce2-9306-dcbc12c2fa8f', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600', true, 'Magnetic Track Light Rail 2M', 'مجرى إضاءة مغناطيسي سكة مترين', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('1dc2154c-15ce-4ce2-9306-dcbc12c2fa8f', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600', false, 'Magnetic Track Light Rail 2M - Alternate', 'مجرى إضاءة مغناطيسي سكة مترين - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '18cd4d70-0ce3-4ed9-ba51-87ba2021bbdb',
  'Magnetic Track Spotlight 12W',
  'سبوت لايت مجرى مغناطيسي 12 واط',
  'magnetic-track-spotlight-12w',
  12,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'magnetic-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Focusable magnetic track spotlight with premium Bridgelux LED chip. Dimmable option.',
  'سبوت لايت مجرى مغناطيسي قابل للتوجيه مع شريحة LED Bridgelux ممتازة. خيار قابل للتعتيم.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'ML-SPT-12W'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('18cd4d70-0ce3-4ed9-ba51-87ba2021bbdb', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600', true, 'Magnetic Track Spotlight 12W', 'سبوت لايت مجرى مغناطيسي 12 واط', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('18cd4d70-0ce3-4ed9-ba51-87ba2021bbdb', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600', false, 'Magnetic Track Spotlight 12W - Alternate', 'سبوت لايت مجرى مغناطيسي 12 واط - صورة بديلة', 1);

-- Category: indoor-lights
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '88f588c0-3795-46e3-b629-266e89cfcc1f',
  'Modern Fabric Floor Lamp Scandinavian',
  'مصباح أرضي قماشي حديث اسكندنافي',
  'modern-fabric-floor-lamp-scand',
  29,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'indoor-lights' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Elegant standing floor lamp with solid wood tripod base and white fabric drum shade.',
  'مصباح أرضي قائم أنيق بقاعدة ثلاثية القوائم من الخشب الصلب وغطاء دائري من القماش الأبيض.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'IL-FLR-SND'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('88f588c0-3795-46e3-b629-266e89cfcc1f', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600', true, 'Modern Fabric Floor Lamp Scandinavian', 'مصباح أرضي قماشي حديث اسكندنافي', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('88f588c0-3795-46e3-b629-266e89cfcc1f', 'https://images.unsplash.com/photo-1542728929-14ab1c6880f9?auto=format&fit=crop&q=80&w=600', false, 'Modern Fabric Floor Lamp Scandinavian - Alternate', 'مصباح أرضي قماشي حديث اسكندنافي - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '7a533ded-579c-4d8a-9336-e62db29ebb3b',
  'Sleek Desk Study Lamp LED',
  'مصباح مكتب للدراسة LED أنيق',
  'sleek-desk-study-lamp-led',
  9.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'indoor-lights' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Flexible LED desk lamp with touch controls, 3 color temperatures, and USB port.',
  'مصباح مكتب LED مرن مع مفاتيح تحكم باللمس، 3 درجات حرارة ألوان، ومنفذ USB.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'IL-DSK-LED'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('7a533ded-579c-4d8a-9336-e62db29ebb3b', 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=600', true, 'Sleek Desk Study Lamp LED', 'مصباح مكتب للدراسة LED أنيق', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('7a533ded-579c-4d8a-9336-e62db29ebb3b', 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80&w=600', false, 'Sleek Desk Study Lamp LED - Alternate', 'مصباح مكتب للدراسة LED أنيق - صورة بديلة', 1);

-- Category: recessed-magnetic-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '276fc0e8-069a-4966-ba53-9f3c0d27919d',
  'Recessed Magnetic Track Rail 1M',
  'سكة مجرى مغناطيسي غائر 1 متر',
  'recessed-magnetic-track-rail-1m',
  15,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'recessed-magnetic-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Flangeless recessed magnetic track rail for seamless integration with gypsum ceilings.',
  'سكة مجرى مغناطيسي غائر بدون حواف لتكامل سلس مع أسقف الجبس بورد.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'ML-REC-1M'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('276fc0e8-069a-4966-ba53-9f3c0d27919d', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600', true, 'Recessed Magnetic Track Rail 1M', 'سكة مجرى مغناطيسي غائر 1 متر', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('276fc0e8-069a-4966-ba53-9f3c0d27919d', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600', false, 'Recessed Magnetic Track Rail 1M - Alternate', 'سكة مجرى مغناطيسي غائر 1 متر - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'd73bd416-0f50-4889-a5df-e53cfdcdac53',
  'Recessed Magnetic Grille Light 18W',
  'كشاف شبكي مغناطيسي غائر 18 واط',
  'recessed-magnetic-grille-18w',
  14,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'recessed-magnetic-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Honeycomb anti-glare magnetic linear grille fixture, warm 3000K light output.',
  'وحدة إضاءة شبكية مغناطيسية خطية مانعة للتوهج بتصميم خلية النحل، مخرج ضوء دافئ 3000 كلفن.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'ML-GRL-18W'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('d73bd416-0f50-4889-a5df-e53cfdcdac53', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600', true, 'Recessed Magnetic Grille Light 18W', 'كشاف شبكي مغناطيسي غائر 18 واط', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('d73bd416-0f50-4889-a5df-e53cfdcdac53', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600', false, 'Recessed Magnetic Grille Light 18W - Alternate', 'كشاف شبكي مغناطيسي غائر 18 واط - صورة بديلة', 1);

-- Category: ceiling-general-lighting
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '053bca66-6392-4ecc-a9bb-fa534046b357',
  'LED Flush Mount Round 24W',
  'إضاءة سقف LED دائرية مباشرة 24 واط',
  'led-flush-mount-round-24w-gen',
  12.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'ceiling-general-lighting' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Slim design ceiling light offering bright, uniform light. Perfect for hallways and bedrooms.',
  'إضاءة سقف بتصميم نحيف توفر إضاءة ساطعة ومنتظمة. مثالية للممرات وغرف النوم.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'CL-GEN-R24'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('053bca66-6392-4ecc-a9bb-fa534046b357', 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&q=80&w=600', true, 'LED Flush Mount Round 24W', 'إضاءة سقف LED دائرية مباشرة 24 واط', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('053bca66-6392-4ecc-a9bb-fa534046b357', 'https://images.unsplash.com/photo-1606103658514-6830a687ef7f?auto=format&fit=crop&q=80&w=600', false, 'LED Flush Mount Round 24W - Alternate', 'إضاءة سقف LED دائرية مباشرة 24 واط - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'ab5e030d-f5f9-41ab-9340-442166ba8769',
  'Modern Circular Ceiling Chandelier 60cm',
  'ثريا سقف دائرية حديثة 60 سم',
  'modern-circular-ceiling-chandelier',
  45,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'ceiling-general-lighting' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Sleek geometric circular ceiling light with integrated dimmable LED driver.',
  'إضاءة سقف دائرية هندسية أنيقة مع محرك LED مدمج قابل للتعتيم.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'CL-GEN-CHD'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('ab5e030d-f5f9-41ab-9340-442166ba8769', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600', true, 'Modern Circular Ceiling Chandelier 60cm', 'ثريا سقف دائرية حديثة 60 سم', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('ab5e030d-f5f9-41ab-9340-442166ba8769', 'https://images.unsplash.com/photo-1572912353188-a5d0aeefaa68?auto=format&fit=crop&q=80&w=600', false, 'Modern Circular Ceiling Chandelier 60cm - Alternate', 'ثريا سقف دائرية حديثة 60 سم - صورة بديلة', 1);

-- Category: led-downlight
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'cbbd5b30-8ccb-440c-9586-b62d1c98a532',
  'Ultra-Thin LED Downlight 12W',
  'سبوت لايت غائر LED مسطح نحيف جداً 12 واط',
  'ultra-thin-led-downlight-12w-flat',
  2.8,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-downlight' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Ultra-slim design recessed ceiling panel, warm white, with external transformer.',
  'لوحة سقف غائرة بتصميم نحيف للغاية، لون أبيض دافئ، مع محول خارجي.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'DL-FLT-12W'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('cbbd5b30-8ccb-440c-9586-b62d1c98a532', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=600', true, 'Ultra-Thin LED Downlight 12W', 'سبوت لايت غائر LED مسطح نحيف جداً 12 واط', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('cbbd5b30-8ccb-440c-9586-b62d1c98a532', 'https://images.unsplash.com/photo-1606103658514-6830a687ef7f?auto=format&fit=crop&q=80&w=600', false, 'Ultra-Thin LED Downlight 12W - Alternate', 'سبوت لايت غائر LED مسطح نحيف جداً 12 واط - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '4b78d5b0-8f53-44b4-adf9-5b890dcfc02e',
  'Anti-Glare Deep Downlight 9W',
  'سبوت لايت غائر مانع للتوهج عميق 9 واط',
  'anti-glare-deep-downlight-9w',
  3.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-downlight' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Deep-recessed cob downlight preventing eye strain with a refined glare-free design.',
  'سبوت لايت غائر عميق يمنع إجهاد العين مع تصميم متطور خالٍ من التوهج.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'DL-AGL-09W'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('4b78d5b0-8f53-44b4-adf9-5b890dcfc02e', 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&q=80&w=600', true, 'Anti-Glare Deep Downlight 9W', 'سبوت لايت غائر مانع للتوهج عميق 9 واط', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('4b78d5b0-8f53-44b4-adf9-5b890dcfc02e', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=600', false, 'Anti-Glare Deep Downlight 9W - Alternate', 'سبوت لايت غائر مانع للتوهج عميق 9 واط - صورة بديلة', 1);

-- Category: led-panel-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '042672dc-20e3-4890-9ef4-172bf1bee075',
  'Slim LED Panel 60x60cm 40W',
  'لوحة إضاءة LED مسطحة 60x60 سم 40 واط',
  'slim-led-panel-60x60cm-40w',
  8.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-panel-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'High-efficiency ceiling panel light for office and grid ceiling installations. Cool white 6000K.',
  'لوحة إضاءة سقفية عالية الكفاءة للمكاتب والأسقف الشبكية. أبيض بارد 6000 كلفن.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'PL-606-40W'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('042672dc-20e3-4890-9ef4-172bf1bee075', 'https://images.unsplash.com/photo-1606103658514-6830a687ef7f?auto=format&fit=crop&q=80&w=600', true, 'Slim LED Panel 60x60cm 40W', 'لوحة إضاءة LED مسطحة 60x60 سم 40 واط', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('042672dc-20e3-4890-9ef4-172bf1bee075', 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&q=80&w=600', false, 'Slim LED Panel 60x60cm 40W - Alternate', 'لوحة إضاءة LED مسطحة 60x60 سم 40 واط - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '38f7b8c8-2e4a-450d-9838-369979dae91c',
  'Recessed Panel Light 30x30cm 18W',
  'لوحة إضاءة غائرة 30x30 سم 18 واط',
  'recessed-panel-light-30x30cm',
  5.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-panel-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Square recessed ceiling panel, ideal for modern kitchens and compact commercial spaces.',
  'لوحة سقف غائرة مربعة، مثالية للمطابخ الحديثة والمساحات التجارية الصغيرة.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'PL-303-18W'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('38f7b8c8-2e4a-450d-9838-369979dae91c', 'https://images.unsplash.com/photo-1606103658514-6830a687ef7f?auto=format&fit=crop&q=80&w=600', true, 'Recessed Panel Light 30x30cm 18W', 'لوحة إضاءة غائرة 30x30 سم 18 واط', 0);

-- Category: linear-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'bfe72da7-d1e5-431e-8046-e49ba223ada2',
  'Suspended LED Linear Light 1.2M 40W',
  'إضاءة خطية LED معلقة 1.2 متر 40 واط',
  'suspended-led-linear-light-12m',
  24,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'linear-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Suspended architectural linear light fixture with seamless aluminum extrusion. Perfect for workspaces.',
  'وحدة إضاءة خطية معمارية معلقة بهيكل ألومنيوم متكامل. مثالية لمساحات العمل.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'LN-SUS-12M'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('bfe72da7-d1e5-431e-8046-e49ba223ada2', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600', true, 'Suspended LED Linear Light 1.2M 40W', 'إضاءة خطية LED معلقة 1.2 متر 40 واط', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('bfe72da7-d1e5-431e-8046-e49ba223ada2', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600', false, 'Suspended LED Linear Light 1.2M 40W - Alternate', 'إضاءة خطية LED معلقة 1.2 متر 40 واط - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '164c95e4-145f-44ef-af87-bad3d583077d',
  'Linkable Surface Linear Light 1.2M',
  'إضاءة خطية سطحية قابلة للتوصيل 1.2 متر',
  'linkable-surface-linear-light',
  18,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'linear-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Easy linkable surface-mounted linear light, allows continuous runs of light lines.',
  'إضاءة خطية سطحية سهلة التوصيل ببعضها البعض، تتيح إنشاء خطوط إضاءة مستمرة.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'LN-SRF-LNK'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('164c95e4-145f-44ef-af87-bad3d583077d', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600', true, 'Linkable Surface Linear Light 1.2M', 'إضاءة خطية سطحية قابلة للتوصيل 1.2 متر', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('164c95e4-145f-44ef-af87-bad3d583077d', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600', false, 'Linkable Surface Linear Light 1.2M - Alternate', 'إضاءة خطية سطحية قابلة للتوصيل 1.2 متر - صورة بديلة', 1);

-- Category: led-bulbs-tubes
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '0fa0de09-79aa-4fda-83f6-3e107846f394',
  'Vintage Filament LED Bulb E27 4W',
  'مصباح LED فيلامنت كلاسيكي E27 بقدرة 4 واط',
  'vintage-filament-led-bulb-e27',
  1.2,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-bulbs-tubes' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Classic retro Edison style filament bulb. Amber glass cover with warm golden glow.',
  'مصباح كلاسيكي بنمط إديسون القديم. زجاج كهرماني مع إضاءة ذهبية دافئة.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'BL-VNT-E27'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('0fa0de09-79aa-4fda-83f6-3e107846f394', 'https://images.unsplash.com/photo-1550985543-f47f38aee65e?auto=format&fit=crop&q=80&w=600', true, 'Vintage Filament LED Bulb E27 4W', 'مصباح LED فيلامنت كلاسيكي E27 بقدرة 4 واط', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('0fa0de09-79aa-4fda-83f6-3e107846f394', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600', false, 'Vintage Filament LED Bulb E27 4W - Alternate', 'مصباح LED فيلامنت كلاسيكي E27 بقدرة 4 واط - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'e90c3b9e-c177-4a7c-9d15-34b5c3757646',
  'T8 LED Tube Light 4 Feet 18W',
  'أنبوب إضاءة LED طراز T8 طول 4 أقدام 18 واط',
  't8-led-tube-light-4feet-18w',
  1.8,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-bulbs-tubes' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'High brightness frosted glass LED tube light, replaces traditional fluorescent tubes.',
  'أنبوب إضاءة LED زجاجي مثلج عالي السطوع، يستبدل أنابيب الفلورسنت التقليدية.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'TB-T8L-04F'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('e90c3b9e-c177-4a7c-9d15-34b5c3757646', 'https://images.unsplash.com/photo-1550985543-f47f38aee65e?auto=format&fit=crop&q=80&w=600', true, 'T8 LED Tube Light 4 Feet 18W', 'أنبوب إضاءة LED طراز T8 طول 4 أقدام 18 واط', 0);

-- Category: accent-decorative-lighting
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '39b168ec-e79c-42f9-88d1-b59a35494003',
  'Hexagon Wall Light Panels (6-Pack)',
  'لوحات إضاءة جدارية سداسية (6 قطع)',
  'hexagon-wall-light-panels-6pc',
  15,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'accent-decorative-lighting' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Modular touch-sensitive or app-controlled RGB hexagon panels for modern room decor.',
  'لوحات إضاءة RGB سداسية معيارية تعمل باللمس أو التحكم بالتطبيق لتزيين الغرف الحديثة.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'DC-HEX-6PK'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('39b168ec-e79c-42f9-88d1-b59a35494003', 'https://images.unsplash.com/photo-1542728929-14ab1c6880f9?auto=format&fit=crop&q=80&w=600', true, 'Hexagon Wall Light Panels (6-Pack)', 'لوحات إضاءة جدارية سداسية (6 قطع)', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('39b168ec-e79c-42f9-88d1-b59a35494003', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600', false, 'Hexagon Wall Light Panels (6-Pack) - Alternate', 'لوحات إضاءة جدارية سداسية (6 قطع) - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '75591aa6-3add-45b9-bc0a-71dad9674d14',
  'Sunset Projection Lamp USB',
  'مصباح إسقاط إضاءة الغروب USB',
  'sunset-projection-lamp-usb',
  4.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'accent-decorative-lighting' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Romantic sunset projection visual lamp, 180 degree rotation, USB-powered.',
  'مصباح إسقاط بصري لغروب الشمس الرومانسي، دوران 180 درجة، يعمل بمنفذ USB.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'DC-SUN-USB'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('75591aa6-3add-45b9-bc0a-71dad9674d14', 'https://images.unsplash.com/photo-1542728929-14ab1c6880f9?auto=format&fit=crop&q=80&w=600', true, 'Sunset Projection Lamp USB', 'مصباح إسقاط إضاءة الغروب USB', 0);

-- Category: luxury-brass-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'fc0bb13d-46f5-4fb5-bbc4-1fac652e1c69',
  'Premium Solid Brass Chandelier',
  'ثريا فاخرة من النحاس الخالص',
  'premium-solid-brass-chandelier',
  180,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'luxury-brass-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Exquisite multi-arm chandelier handcrafted from premium solid brass with golden polish.',
  'ثريا رائعة متعددة الأذرع مصنوعة يدوياً من النحاس الخالص عالي الجودة مع تشطيب ذهبي مصقول.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'LX-BRS-CHD'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('fc0bb13d-46f5-4fb5-bbc4-1fac652e1c69', 'https://images.unsplash.com/photo-1543248939-ff40856f65d4?auto=format&fit=crop&q=80&w=600', true, 'Premium Solid Brass Chandelier', 'ثريا فاخرة من النحاس الخالص', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('fc0bb13d-46f5-4fb5-bbc4-1fac652e1c69', 'https://images.unsplash.com/photo-1572912353188-a5d0aeefaa68?auto=format&fit=crop&q=80&w=600', false, 'Premium Solid Brass Chandelier - Alternate', 'ثريا فاخرة من النحاس الخالص - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '704ea1ab-3964-4960-a8b0-8e03da13d3c3',
  'Luxury Brass Wall Sconce Modern',
  'شمعدان جداري نحاسي فاخر حديث',
  'luxury-brass-wall-sconce-modern',
  35,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'luxury-brass-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Premium modern brass wall sconce with a frosted glass globe shade for dining rooms.',
  'شمعدان جداري نحاسي فاخر بتصميم حديث مع غطاء كروي زجاجي مثلج لغرف الطعام.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'LX-BRS-SCN'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('704ea1ab-3964-4960-a8b0-8e03da13d3c3', 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=600', true, 'Luxury Brass Wall Sconce Modern', 'شمعدان جداري نحاسي فاخر حديث', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('704ea1ab-3964-4960-a8b0-8e03da13d3c3', 'https://images.unsplash.com/photo-1543248939-ff40856f65d4?auto=format&fit=crop&q=80&w=600', false, 'Luxury Brass Wall Sconce Modern - Alternate', 'شمعدان جداري نحاسي فاخر حديث - صورة بديلة', 1);

-- Category: pendant-lighting
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'f020b421-fc71-464b-8e4c-802f28ef889a',
  'Nordic Wooden Pendant Lamp',
  'مصباح معلق خشبي اسكندنافي',
  'nordic-wooden-pendant-lamp',
  18,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'pendant-lighting' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Minimalist wooden dome pendant light with high quality matte white finish.',
  'مصباح معلق قبة خشبي بتصميم مينيماليست مع تشطيب أبيض مطفي عالي الجودة.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'PL-NWD-WOD'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('f020b421-fc71-464b-8e4c-802f28ef889a', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600', true, 'Nordic Wooden Pendant Lamp', 'مصباح معلق خشبي اسكندنافي', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('f020b421-fc71-464b-8e4c-802f28ef889a', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=600', false, 'Nordic Wooden Pendant Lamp - Alternate', 'مصباح معلق خشبي اسكندنافي - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '4c5658b7-1205-4040-bfb2-f9e6b26c3203',
  'Industrial Metal Dome Pendant Black',
  'مصباح معلق قبة معدني صناعي أسود',
  'industrial-metal-dome-pendant-black',
  14,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'pendant-lighting' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Industrial vintage style black dome pendant light, white interior for maximum light reflection.',
  'مصباح معلق قبة أسود بطراز صناعي عتيق، دهان داخلي أبيض لتوفير أقصى قدر من انعكاس الضوء.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'PL-IND-MET'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('4c5658b7-1205-4040-bfb2-f9e6b26c3203', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=600', true, 'Industrial Metal Dome Pendant Black', 'مصباح معلق قبة معدني صناعي أسود', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('4c5658b7-1205-4040-bfb2-f9e6b26c3203', 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&q=80&w=600', false, 'Industrial Metal Dome Pendant Black - Alternate', 'مصباح معلق قبة معدني صناعي أسود - صورة بديلة', 1);

-- Category: chandelier
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '86c66741-338e-4bc9-b48b-6d3d7a56aafe',
  'Crystal Elegance Chandelier',
  'ثريا كريستال أنيقة',
  'crystal-elegance-chandelier-prod',
  220,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'chandelier' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Stunning 6-arm crystal chandelier with premium glass droplets. Perfect for dining rooms.',
  'ثريا كريستال فاخرة بستة أذرع مع قطرات زجاجية متميزة. مثالية لغرف الطعام والمداخل.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'CH-CRY-PRD'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('86c66741-338e-4bc9-b48b-6d3d7a56aafe', 'https://images.unsplash.com/photo-1543248939-ff40856f65d4?auto=format&fit=crop&q=80&w=600', true, 'Crystal Elegance Chandelier', 'ثريا كريستال أنيقة', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('86c66741-338e-4bc9-b48b-6d3d7a56aafe', 'https://images.unsplash.com/photo-1572912353188-a5d0aeefaa68?auto=format&fit=crop&q=80&w=600', false, 'Crystal Elegance Chandelier - Alternate', 'ثريا كريستال أنيقة - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'fd417787-8adc-4407-8109-0913b0a456af',
  'Modern Gold Sputnik Chandelier',
  'ثريا سبوتنيك ذهبية حديثة',
  'modern-gold-sputnik-chandelier-p',
  145,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'chandelier' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Mid-century modern sputnik chandelier in brushed gold finish. Features 18 light sockets.',
  'ثريا سبوتنيك عصرية بتشطيب ذهبي مصقول. تحتوي على 18 مقبس مصباح.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'CH-SPT-GLD'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('fd417787-8adc-4407-8109-0913b0a456af', 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=600', true, 'Modern Gold Sputnik Chandelier', 'ثريا سبوتنيك ذهبية حديثة', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('fd417787-8adc-4407-8109-0913b0a456af', 'https://images.unsplash.com/photo-1543248939-ff40856f65d4?auto=format&fit=crop&q=80&w=600', false, 'Modern Gold Sputnik Chandelier - Alternate', 'ثريا سبوتنيك ذهبية حديثة - صورة بديلة', 1);

-- Category: indoor-wall-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '065d6af9-c968-4e60-a674-be6014b47e6f',
  'Modern Nordic Wall Sconce',
  'شمعدان حائط نورديك حديث',
  'modern-nordic-wall-sconce',
  9.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'indoor-wall-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Minimalist wooden and iron wall sconce with rotatable lampshade. E27 base.',
  'شمعدان حائط بسيط من الخشب والحديد مع غطاء مصباح قابل للتدوير. قاعدة E27.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'WL-NDD-SCN'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('065d6af9-c968-4e60-a674-be6014b47e6f', 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=600', true, 'Modern Nordic Wall Sconce', 'شمعدان حائط نورديك حديث', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('065d6af9-c968-4e60-a674-be6014b47e6f', 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&q=80&w=600', false, 'Modern Nordic Wall Sconce - Alternate', 'شمعدان حائط نورديك حديث - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'a75fcf79-6c1f-4667-8a83-856f4cdffd8c',
  'Minimalist LED Up-Down Wall Light',
  'إضاءة حائط LED علوية سفلية بسيطة',
  'minimalist-led-up-down-wall-light',
  8,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'indoor-wall-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Slim linear LED wall light projecting soft up and down glow. Dimmable warm white.',
  'إضاءة حائط LED خطية نحيفة تسلط توهجاً ناعماً لأعلى ولأسفل. أبيض دافئ قابل للتعتيم.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'WL-MIN-UPD'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('a75fcf79-6c1f-4667-8a83-856f4cdffd8c', 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=600', true, 'Minimalist LED Up-Down Wall Light', 'إضاءة حائط LED علوية سفلية بسيطة', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('a75fcf79-6c1f-4667-8a83-856f4cdffd8c', 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=600', false, 'Minimalist LED Up-Down Wall Light - Alternate', 'إضاءة حائط LED علوية سفلية بسيطة - صورة بديلة', 1);

-- Category: led-spot-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'c25f8276-fed3-4480-b94e-af8b391af2ab',
  'COB Spotlight GU10 7W',
  'سبوت لايت COB قاعدة GU10 بقدرة 7 واط',
  'cob-spotlight-gu10-7w',
  1.9,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-spot-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Energy-saving spotlight bulb, high lumen focus beam angle, standard GU10 socket.',
  'مصباح سبوت لايت موفر للطاقة، زاوية شعاع تركيز عالية اللمعان، قاعدة GU10 القياسية.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'SL-GU1-07W'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('c25f8276-fed3-4480-b94e-af8b391af2ab', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=600', true, 'COB Spotlight GU10 7W', 'سبوت لايت COB قاعدة GU10 بقدرة 7 واط', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('c25f8276-fed3-4480-b94e-af8b391af2ab', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=600', false, 'COB Spotlight GU10 7W - Alternate', 'سبوت لايت COB قاعدة GU10 بقدرة 7 واط - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '8d6c89cd-e1b1-478a-b3c9-2ee2bc443e0b',
  'Directional Surface Spotlight 15W',
  'سبوت لايت سطحي موجه 15 واط',
  'directional-surface-spotlight-15w',
  4.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-spot-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Surface-mounted adjustable cylinder spotlight, ideal for focusing light on decor.',
  'سبوت لايت أسطواني سطحي قابل للتوجيه والتعديل، مثالي لتركيز الضوء على الديكور والتحف.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'SL-SRF-15W'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('8d6c89cd-e1b1-478a-b3c9-2ee2bc443e0b', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600', true, 'Directional Surface Spotlight 15W', 'سبوت لايت سطحي موجه 15 واط', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('8d6c89cd-e1b1-478a-b3c9-2ee2bc443e0b', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=600', false, 'Directional Surface Spotlight 15W - Alternate', 'سبوت لايت سطحي موجه 15 واط - صورة بديلة', 1);

-- Category: cabinet-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'a40b4447-5b39-437d-9e89-d870eb41fe44',
  'Wireless Motion Sensor Closet Light',
  'إضاءة خزانة متنقلة بمستشعر حركة',
  'wireless-motion-sensor-closet-light',
  3.8,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'cabinet-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'USB rechargeable LED closet bar with motion detector and magnetic attachment.',
  'قضيب إضاءة LED للخزانة قابل لإعادة الشحن عبر USB مع كاشف حركة وتثبيت مغناطيسي.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'CL-WRL-MOT'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('a40b4447-5b39-437d-9e89-d870eb41fe44', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600', true, 'Wireless Motion Sensor Closet Light', 'إضاءة خزانة متنقلة بمستشعر حركة', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('a40b4447-5b39-437d-9e89-d870eb41fe44', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600', false, 'Wireless Motion Sensor Closet Light - Alternate', 'إضاءة خزانة متنقلة بمستشعر حركة - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'c1b8d751-0538-40e2-93e3-e6e69f0ca18d',
  'Under-Cabinet Linkable LED Puck Light',
  'إضاءة كابينت قرصية LED قابلة للربط',
  'under-cabinet-linkable-led-puck',
  2.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'cabinet-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Ultra-thin puck light for display cabinets and shelf illumination. Linkable system.',
  'إضاءة قرصية نحيفة للغاية لخزائن العرض وإضاءة الأرفف. نظام قابل للتوصيل المتبادل.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'CL-LNK-PCK'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('c1b8d751-0538-40e2-93e3-e6e69f0ca18d', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600', true, 'Under-Cabinet Linkable LED Puck Light', 'إضاءة كابينت قرصية LED قابلة للربط', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('c1b8d751-0538-40e2-93e3-e6e69f0ca18d', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600', false, 'Under-Cabinet Linkable LED Puck Light - Alternate', 'إضاءة كابينت قرصية LED قابلة للربط - صورة بديلة', 1);

-- Category: professional-lighting
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '57321cd8-bfed-4e63-b13e-b6ba91bc8c2c',
  'Commercial Track Spotlight 30W',
  'سبوت لايت مسار تجاري 30 واط',
  'commercial-track-spotlight-30w',
  14.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'professional-lighting' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'High-lumen track head designed for retail stores and galleries. Adjustable lens.',
  'رأس إضاءة مسار عالي السطوع مصمم للمحلات التجارية والمعارض الفنية. عدسة قابلة للتعديل.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'PL-TRK-30W'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('57321cd8-bfed-4e63-b13e-b6ba91bc8c2c', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600', true, 'Commercial Track Spotlight 30W', 'سبوت لايت مسار تجاري 30 واط', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('57321cd8-bfed-4e63-b13e-b6ba91bc8c2c', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=600', false, 'Commercial Track Spotlight 30W - Alternate', 'سبوت لايت مسار تجاري 30 واط - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '6046e11a-b31a-4593-a88c-7f74480d3f77',
  'High-Power Retail Spotlight 50W',
  'سبوت لايت محلات عالي القوة 50 واط',
  'high-power-retail-spotlight-50w',
  22,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'professional-lighting' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Heavy-duty 50W spotlight for double-height ceilings in showroom areas.',
  'سبوت لايت قوي 50 واط مخصص للأسقف المزدوجة الارتفاع في صالات العرض والمتاجر الكبيرة.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'PL-RTL-50W'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('6046e11a-b31a-4593-a88c-7f74480d3f77', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600', true, 'High-Power Retail Spotlight 50W', 'سبوت لايت محلات عالي القوة 50 واط', 0);

-- Category: high-bay-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '7573def3-1c6a-4b1e-bcc7-9f3afc12f599',
  'UFO LED High Bay Light 150W',
  'كشاف مستودعات هايباي 150 واط شكل UFO',
  'ufo-led-high-bay-light-150w',
  38,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'high-bay-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'UFO-shaped industrial LED high bay light, IP65 waterproof, high ceiling industrial fixture.',
  'كشاف مستودعات صناعي LED على شكل UFO، مقاوم للماء IP65، مناسب للأسقف المرتفعة الصناعية.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'HB-UFO-150'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('7573def3-1c6a-4b1e-bcc7-9f3afc12f599', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600', true, 'UFO LED High Bay Light 150W', 'كشاف مستودعات هايباي 150 واط شكل UFO', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('7573def3-1c6a-4b1e-bcc7-9f3afc12f599', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600', false, 'UFO LED High Bay Light 150W - Alternate', 'كشاف مستودعات هايباي 150 واط شكل UFO - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'a65f3b7a-39b7-4ed0-aeb1-ed38e79961cf',
  'Industrial LED High Bay 100W',
  'كشاف مصانع هايباي LED بقوة 100 واط',
  'industrial-led-high-bay-100w',
  28,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'high-bay-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Die-cast aluminum high bay light offering optimal heat dissipation and high efficiency.',
  'كشاف هايباي بهيكل ألومنيوم مصبوب يوفر تشتيتاً ممتازاً للحرارة وكفاءة إضاءة عالية.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'HB-IND-100'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('a65f3b7a-39b7-4ed0-aeb1-ed38e79961cf', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600', true, 'Industrial LED High Bay 100W', 'كشاف مصانع هايباي LED بقوة 100 واط', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('a65f3b7a-39b7-4ed0-aeb1-ed38e79961cf', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600', false, 'Industrial LED High Bay 100W - Alternate', 'كشاف مصانع هايباي LED بقوة 100 واط - صورة بديلة', 1);

-- Category: smart-control
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '79249265-904e-4850-b2a5-dd2a28401ad8',
  'Smart WiFi Light Switch 3-Gang',
  'مفتاح إضاءة ذكي واي فاي 3 أزرار',
  'smart-wifi-light-switch-3gang',
  12.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'smart-control' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'App-controlled touch-panel smart switch, compatible with Google Home and Alexa.',
  'مفتاح إضاءة ذكي بلوحة لمس يتم التحكم به بالتطبيق، متوافق مع جوجل هوم وأليكسا.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'SC-WFS-03G'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('79249265-904e-4850-b2a5-dd2a28401ad8', 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600', true, 'Smart WiFi Light Switch 3-Gang', 'مفتاح إضاءة ذكي واي فاي 3 أزرار', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('79249265-904e-4850-b2a5-dd2a28401ad8', 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600', false, 'Smart WiFi Light Switch 3-Gang - Alternate', 'مفتاح إضاءة ذكي واي فاي 3 أزرار - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'b5afaf4d-273b-4293-89eb-391e7e080c92',
  'Smart RGB Controller with RF Remote',
  'حاكوم شريط إضاءة ذكي مع ريموت',
  'smart-rgb-controller-rf-remote',
  4.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'smart-control' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Smart controller for LED strips. Support WiFi control and RF remote selection.',
  'جهاز تحكم ذكي لشرائط الإضاءة. يدعم التحكم عن طريق الواي فاي واختيار الألوان بالريموت.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'SC-RGB-CON'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('b5afaf4d-273b-4293-89eb-391e7e080c92', 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=600', true, 'Smart RGB Controller with RF Remote', 'حاكوم شريط إضاءة ذكي مع ريموت', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('b5afaf4d-273b-4293-89eb-391e7e080c92', 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600', false, 'Smart RGB Controller with RF Remote - Alternate', 'حاكوم شريط إضاءة ذكي مع ريموت - صورة بديلة', 1);

-- Category: sensor-switch
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '08a3065c-a2c4-42d7-8b04-eea268de88d0',
  'PIR Motion Sensor Wall Switch',
  'مفتاح جداري بمستشعر حركة PIR',
  'pir-motion-sensor-wall-switch',
  6.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'sensor-switch' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Automatic wall switch utilizing infrared sensors to turn lights on when motion is detected.',
  'مفتاح جداري تلقائي يعتمد على مستشعرات الأشعة تحت الحمراء لتشغيل الضوء عند اكتشاف الحركة.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'SS-PIR-WLL'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('08a3065c-a2c4-42d7-8b04-eea268de88d0', 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600', true, 'PIR Motion Sensor Wall Switch', 'مفتاح جداري بمستشعر حركة PIR', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('08a3065c-a2c4-42d7-8b04-eea268de88d0', 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600', false, 'PIR Motion Sensor Wall Switch - Alternate', 'مفتاح جداري بمستشعر حركة PIR - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '8c4f8df0-7cef-4f87-a379-87baa5fc9783',
  'Touchless Hand Wave Sensor Switch',
  'مفتاح مستشعر بالتلويح باليد بدون لمس',
  'touchless-hand-wave-sensor-switch',
  5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'sensor-switch' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Motion sensor switch activating with a simple hand wave. Perfect for clean kitchen setups.',
  'مفتاح حساس يعمل بتمرير اليد ببساطة أمامه. مثالي لتجنب لمس المفتاح أثناء الطبخ.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'SS-WAV-TCH'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('8c4f8df0-7cef-4f87-a379-87baa5fc9783', 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600', true, 'Touchless Hand Wave Sensor Switch', 'مفتاح مستشعر بالتلويح باليد بدون لمس', 0);

-- Category: outdoor-lights
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'e84bc691-ef4d-4f7b-863a-bdfdf912afc3',
  'Modern Outdoor Wall Sconce Waterproof',
  'فانوس جداري خارجي حديث مقاوم للماء',
  'modern-outdoor-wall-sconce-wpr',
  9.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'outdoor-lights' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Stylish weatherproof wall light. Matte black finishing with clear tempered glass covers.',
  'مصباح جداري خارجي مقاوم للعوامل الجوية. هيكل أسود مطفي مع أغطية زجاجية مقواة شفافة.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'OL-WLL-SCN'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('e84bc691-ef4d-4f7b-863a-bdfdf912afc3', 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&q=80&w=600', true, 'Modern Outdoor Wall Sconce Waterproof', 'فانوس جداري خارجي حديث مقاوم للماء', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('e84bc691-ef4d-4f7b-863a-bdfdf912afc3', 'https://images.unsplash.com/photo-1508615070457-7baebe4003ab?auto=format&fit=crop&q=80&w=600', false, 'Modern Outdoor Wall Sconce Waterproof - Alternate', 'فانوس جداري خارجي حديث مقاوم للماء - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '264ce0c4-5711-4545-8ed6-34358dec2649',
  'Waterproof LED Pillar Light for Gate',
  'إضاءة سور عمودية LED مقاومة للماء',
  'waterproof-led-pillar-light-gate',
  18,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'outdoor-lights' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Landscape fence post light, IP65 aluminum body, modern cube design.',
  'مصباح أعمدة السور الخارجي للحديقة، هيكل ألومنيوم IP65، تصميم مكعب حديث.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'OL-PLR-GTE'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('264ce0c4-5711-4545-8ed6-34358dec2649', 'https://images.unsplash.com/photo-1508615070457-7baebe4003ab?auto=format&fit=crop&q=80&w=600', true, 'Waterproof LED Pillar Light for Gate', 'إضاءة سور عمودية LED مقاومة للماء', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('264ce0c4-5711-4545-8ed6-34358dec2649', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=600', false, 'Waterproof LED Pillar Light for Gate - Alternate', 'إضاءة سور عمودية LED مقاومة للماء - صورة بديلة', 1);

-- Category: led-flood-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'd5c0b89b-65b3-49b6-920f-6ef7d215a83d',
  'Slim LED Flood Light 100W IP66',
  'كشاف إضاءة LED خارجي 100 واط IP66',
  'slim-led-flood-light-100w-ip66',
  14,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-flood-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Super-slim outdoor LED flood light with high-intensity projection. IP66 waterproof.',
  'كشاف إضاءة خارجي LED نحيف بقوة إسقاط وتغطية عالية. مقاوم للماء والغبار IP66.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'FL-SLM-100'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('d5c0b89b-65b3-49b6-920f-6ef7d215a83d', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600', true, 'Slim LED Flood Light 100W IP66', 'كشاف إضاءة LED خارجي 100 واط IP66', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('d5c0b89b-65b3-49b6-920f-6ef7d215a83d', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600', false, 'Slim LED Flood Light 100W IP66 - Alternate', 'كشاف إضاءة LED خارجي 100 واط IP66 - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '49ebb13b-5fdb-4751-a578-b3e35a88b750',
  'Portable Rechargeable Flood Light 30W',
  'كشاف إضاءة متنقل قابل للشحن 30 واط',
  'portable-rechargeable-flood-light',
  9.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-flood-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Rechargeable work light with stand, USB phone charging output, 3 brightness modes.',
  'كشاف عمل يدوي قابل للشحن مع قاعدة، مخرج شحن الهواتف USB، و 3 أوضاع تشغيل.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'FL-PRT-30W'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('49ebb13b-5fdb-4751-a578-b3e35a88b750', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600', true, 'Portable Rechargeable Flood Light 30W', 'كشاف إضاءة متنقل قابل للشحن 30 واط', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('49ebb13b-5fdb-4751-a578-b3e35a88b750', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600', false, 'Portable Rechargeable Flood Light 30W - Alternate', 'كشاف إضاءة متنقل قابل للشحن 30 واط - صورة بديلة', 1);

-- Category: led-street-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '6bfb9d78-181a-45bc-b6b0-7ea62b73e56d',
  'Solar Street Light 200W with Pole',
  'كشاف شوارع شمسي 200 واط مع العمود والذراع',
  'solar-street-light-200w-pole',
  45,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-street-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'All-in-one solar street light with radar motion sensor and heavy-duty metal mounting arm.',
  'كشاف إنارة شوارع شمسي متكامل مع حساس حركة راداري وذراع تركيب معدني متين.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'SL-STR-200'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('6bfb9d78-181a-45bc-b6b0-7ea62b73e56d', 'https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?auto=format&fit=crop&q=80&w=600', true, 'Solar Street Light 200W with Pole', 'كشاف شوارع شمسي 200 واط مع العمود والذراع', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('6bfb9d78-181a-45bc-b6b0-7ea62b73e56d', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600', false, 'Solar Street Light 200W with Pole - Alternate', 'كشاف شوارع شمسي 200 واط مع العمود والذراع - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'bd927a90-a891-449c-9f84-73f0f34938ec',
  'Integrated LED Street Light 100W',
  'كشاف شوارع LED مدمج بقوة 100 واط',
  'integrated-led-street-light-100w',
  32,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-street-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'High performance integrated street light, IP66 rated, premium Philips LED chips.',
  'كشاف إنارة شوارع LED مدمج عالي الكفاءة، فئة IP66، رقائق LED متميزة من فيليبس.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'ST-LED-100'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('bd927a90-a891-449c-9f84-73f0f34938ec', 'https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?auto=format&fit=crop&q=80&w=600', true, 'Integrated LED Street Light 100W', 'كشاف شوارع LED مدمج بقوة 100 واط', 0);

-- Category: led-garden-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '75989db4-5632-4097-8092-7c94f912efa8',
  'Solar Garden Flame Torch (4-Pack)',
  'مشاعل لهب شمسية للحديقة (4 قطع)',
  'solar-garden-flame-torch-4pack',
  8.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-garden-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Dancing flame solar torch lights, realistic flickering effect, spike mount design.',
  'مصابيح مشاعل شمسية بلهب راقص، تأثير وميض واقعي، تصميم وتد أرضي للتثبيت سهل.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'GL-FLM-4PK'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('75989db4-5632-4097-8092-7c94f912efa8', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=600', true, 'Solar Garden Flame Torch (4-Pack)', 'مشاعل لهب شمسية للحديقة (4 قطع)', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('75989db4-5632-4097-8092-7c94f912efa8', 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=600', false, 'Solar Garden Flame Torch (4-Pack) - Alternate', 'مشاعل لهب شمسية للحديقة (4 قطع) - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '276d71ba-1e1c-48ab-aa1f-32fa71e1e503',
  'LED Spike Lawn Light 5W',
  'كشاف غرس للحديقة LED بقوة 5 واط',
  'led-spike-lawn-light-5w',
  3.2,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-garden-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Focusable outdoor spike spotlight for lighting trees and garden walls. 12V safe input.',
  'سبوت لايت غرس خارجي قابل للتوجيه لتسليط الضوء على الأشجار وأسوار الحديقة. جهد 12 فولت آمن.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'GL-SPK-05W'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('276d71ba-1e1c-48ab-aa1f-32fa71e1e503', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=600', true, 'LED Spike Lawn Light 5W', 'كشاف غرس للحديقة LED بقوة 5 واط', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('276d71ba-1e1c-48ab-aa1f-32fa71e1e503', 'https://images.unsplash.com/photo-1508615070457-7baebe4003ab?auto=format&fit=crop&q=80&w=600', false, 'LED Spike Lawn Light 5W - Alternate', 'كشاف غرس للحديقة LED بقوة 5 واط - صورة بديلة', 1);

-- Category: led-outdoor-wall-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '9317b3de-480f-42bd-883b-f54c52768c0f',
  'Up & Down Outdoor Wall Light LED',
  'إضاءة جدارية خارجية LED علوية سفلية',
  'up-down-outdoor-wall-light-led',
  7.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-outdoor-wall-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Modern rectangular outdoor wall sconce with top and bottom light beam output. IP54 rating.',
  'فانوس جداري خارجي مستطيل حديث مع مخرج شعاع ضوء لأعلى ولأسفل. فئة حماية IP54.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'OW-UDL-LED'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('9317b3de-480f-42bd-883b-f54c52768c0f', 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&q=80&w=600', true, 'Up & Down Outdoor Wall Light LED', 'إضاءة جدارية خارجية LED علوية سفلية', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('9317b3de-480f-42bd-883b-f54c52768c0f', 'https://images.unsplash.com/photo-1508615070457-7baebe4003ab?auto=format&fit=crop&q=80&w=600', false, 'Up & Down Outdoor Wall Light LED - Alternate', 'إضاءة جدارية خارجية LED علوية سفلية - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'bb8a60db-0185-4755-b268-61d8d983bfd9',
  'Round Outdoor LED Bulkhead Light',
  'إضاءة جدارية خارجية دائرية LED باتن',
  'round-outdoor-led-bulkhead-light',
  4.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-outdoor-wall-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Impact-resistant polycarbonate outdoor bulkhead light, perfect for garage entries.',
  'إضاءة جدارية خارجية دائرية متينة مقاومة للصدمات، مثالية لمداخل الكراجات.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'OW-BLK-RND'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('bb8a60db-0185-4755-b268-61d8d983bfd9', 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&q=80&w=600', true, 'Round Outdoor LED Bulkhead Light', 'إضاءة جدارية خارجية دائرية LED باتن', 0);

-- Category: led-stair-lights
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'ca4ec064-305b-4df8-95d5-5b06fa093d4e',
  'Recessed LED Step Light Waterproof',
  'إضاءة درجات درج غائرة LED مقاومة للماء',
  'recessed-led-step-light-waterproof',
  2.8,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-stair-lights' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Mini recessed step light for stairs, walkways, or terraces. Safe warm light.',
  'مصباح غائر صغير لإنارة الدرج والدرجات والممرات الخارجية. إضاءة دافئة هادئة.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'SL-STP-WPR'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('ca4ec064-305b-4df8-95d5-5b06fa093d4e', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600', true, 'Recessed LED Step Light Waterproof', 'إضاءة درجات درج غائرة LED مقاومة للماء', 0);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '2bb42a18-6447-4fb2-9afc-bbc8a682315b',
  'Step Stair Strip Light Controller',
  'حاكوم إضاءة درجات درج مع حساس حركة',
  'step-stair-strip-light-controller',
  16,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'led-stair-lights' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Smart motion sensor controller for step strip lighting, triggers lights sequence cascade.',
  'جهاز تحكم ذكي بحساس الحركة لشرائط الدرج، يقوم بتشغيل الإضاءة بالتتابع خطوة بخطوة.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'SL-STP-CON'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('2bb42a18-6447-4fb2-9afc-bbc8a682315b', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600', true, 'Step Stair Strip Light Controller', 'حاكوم إضاءة درجات درج مع حساس حركة', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('2bb42a18-6447-4fb2-9afc-bbc8a682315b', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600', false, 'Step Stair Strip Light Controller - Alternate', 'حاكوم إضاءة درجات درج مع حساس حركة - صورة بديلة', 1);

-- Category: ultra-thin-surface-mounted-magnetic-light
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'dce1903b-2285-43a0-a513-eda25eb085a3',
  'Ultra-Thin Magnetic Track 1M',
  'مجرى مغناطيسي سطحي نحيف جداً 1 متر',
  'ultra-thin-magnetic-track-1m',
  18,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'ultra-thin-surface-mounted-magnetic-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Ultra-slim 6mm thickness surface-mounted magnetic track rail. Perfect for low ceilings.',
  'مجرى مغناطيسي سطحي نحيف للغاية بسمك 6 مم فقط. مثالي للأسقف المنخفضة.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'UM-TRK-1M'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('dce1903b-2285-43a0-a513-eda25eb085a3', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=600', true, 'Ultra-Thin Magnetic Track 1M', 'مجرى مغناطيسي سطحي نحيف جداً 1 متر', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('dce1903b-2285-43a0-a513-eda25eb085a3', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600', false, 'Ultra-Thin Magnetic Track 1M - Alternate', 'مجرى مغناطيسي سطحي نحيف جداً 1 متر - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'c8790663-244b-4fab-ab90-c2486d63eba0',
  'Ultra-Thin Magnetic Linear Light 12W',
  'إضاءة خطية مغناطيسية نحيفة جداً 12 واط',
  'ultra-thin-magnetic-linear-12w',
  15,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'ultra-thin-surface-mounted-magnetic-light' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Sleek linear magnetic light module, clips flush into the ultra-thin track series.',
  'وحدة إضاءة خطية مغناطيسية أنيقة، تركب بشكل متساوٍ ومدمج في مجموعة المجاري النحيفة.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'UM-LIN-12W'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('c8790663-244b-4fab-ab90-c2486d63eba0', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600', true, 'Ultra-Thin Magnetic Linear Light 12W', 'إضاءة خطية مغناطيسية نحيفة جداً 12 واط', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('c8790663-244b-4fab-ab90-c2486d63eba0', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=600', false, 'Ultra-Thin Magnetic Linear Light 12W - Alternate', 'إضاءة خطية مغناطيسية نحيفة جداً 12 واط - صورة بديلة', 1);

-- Category: hardware
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '66983945-b57b-4c15-a3ee-0eb2d6efbd68',
  'Designer Glass Switch Cover White',
  'غطاء مفاتيح زجاجي أبيض فاخر',
  'designer-glass-switch-cover-white',
  2.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'hardware' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Tempered glass replacement switch plate cover. Modern scratch-resistant surface.',
  'غطاء لوحة مفاتيح إضاءة زجاجي مقوى. سطح حديث مقاوم للخدوش والتآكل.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'HW-SWC-GLS'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('66983945-b57b-4c15-a3ee-0eb2d6efbd68', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600', true, 'Designer Glass Switch Cover White', 'غطاء مفاتيح زجاجي أبيض فاخر', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('66983945-b57b-4c15-a3ee-0eb2d6efbd68', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600', false, 'Designer Glass Switch Cover White - Alternate', 'غطاء مفاتيح زجاجي أبيض فاخر - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'b4fcba38-d3bf-425d-889f-0968e699462d',
  'Heavy-Duty Mounting Bracket Set',
  'مجموعة خطافات وقواعد تعليق قوية للثريات',
  'heavy-duty-mounting-bracket-set',
  1.8,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'hardware' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Universal mounting brackets for hanging heavy chandeliers and ceiling fixtures safely.',
  'قواعد تركيب عالمية قوية لتعليق الثريات الثقيلة ووحدات السقف بأمان التام.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'HW-MNT-BRK'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('b4fcba38-d3bf-425d-889f-0968e699462d', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600', true, 'Heavy-Duty Mounting Bracket Set', 'مجموعة خطافات وقواعد تعليق قوية للثريات', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('b4fcba38-d3bf-425d-889f-0968e699462d', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600', false, 'Heavy-Duty Mounting Bracket Set - Alternate', 'مجموعة خطافات وقواعد تعليق قوية للثريات - صورة بديلة', 1);

-- Category: extension-socket
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '62473888-a71f-4bd8-805f-1f954bef182e',
  'Sleek Extension Socket 4-Way with USB',
  'توصيلة كهربائية أنيقة 4 مخارج مع USB',
  'sleek-extension-socket-4way-usb',
  6.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'extension-socket' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Modern power extension socket featuring 4 ports, surge protection, and dual USB smart chargers.',
  'توصيلة كهربائية حديثة تحتوي على 4 مخارج، حماية من الالتماس الكهربائي وشاحن USB مزدوج ذكي.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'HW-EXT-04W'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('62473888-a71f-4bd8-805f-1f954bef182e', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600', true, 'Sleek Extension Socket 4-Way with USB', 'توصيلة كهربائية أنيقة 4 مخارج مع USB', 0);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '30abc858-1b91-4d54-9625-c9f346d34e81',
  'Smart WiFi Extension Board 3-Way',
  'توصيلة كهرباء ذكية واي فاي 3 مخارج',
  'smart-wifi-extension-board',
  14.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'extension-socket' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'WiFi-enabled extension board allowing individual control of each outlet via app.',
  'توصيلة كهرباء تدعم الواي فاي تتيح التحكم الفردي بكل مخرج كهربائي عن طريق التطبيق.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'HW-EXT-SMT'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('30abc858-1b91-4d54-9625-c9f346d34e81', 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600', true, 'Smart WiFi Extension Board 3-Way', 'توصيلة كهرباء ذكية واي فاي 3 مخارج', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('30abc858-1b91-4d54-9625-c9f346d34e81', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600', false, 'Smart WiFi Extension Board 3-Way - Alternate', 'توصيلة كهرباء ذكية واي فاي 3 مخارج - صورة بديلة', 1);

-- Category: ventilation-fan
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '0286fb19-7883-46f7-be5d-d0f45aed0575',
  'Quiet Bathroom Exhaust Fan 4-Inch',
  'شفاط حمام صامت 4 بوصة',
  'quiet-bathroom-exhaust-fan-4inch',
  6.8,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'ventilation-fan' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Silent bathroom ventilation exhaust fan, low power consumption, backdraft damper included.',
  'شفاط تهوية صامت للحمام، استهلاك منخفض للطاقة، يتضمن بوابة حماية تدفق الهواء الخلفي.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'FN-EXH-04Q'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('0286fb19-7883-46f7-be5d-d0f45aed0575', 'https://images.unsplash.com/photo-1613540015239-7c95a43a5136?auto=format&fit=crop&q=80&w=600', true, 'Quiet Bathroom Exhaust Fan 4-Inch', 'شفاط حمام صامت 4 بوصة', 0);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'd55ce3ef-5bc1-43a8-a9d8-4c5dab5d7444',
  'Ceiling Exhaust Fan 8-Inch Metal',
  'شفاط سقف معدني 8 بوصة',
  'ceiling-exhaust-fan-8inch-metal',
  12.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'ventilation-fan' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'High-volume metal exhaust fan for suspended ceiling mounting in kitchens.',
  'شفاط سقف معدني قوي عالي السحب، مصمم للتركيب في الأسقف المعلقة للمطابخ والمطاعم.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'FN-EXH-08C'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('d55ce3ef-5bc1-43a8-a9d8-4c5dab5d7444', 'https://images.unsplash.com/photo-1613540015239-7c95a43a5136?auto=format&fit=crop&q=80&w=600', true, 'Ceiling Exhaust Fan 8-Inch Metal', 'شفاط سقف معدني 8 بوصة', 0);

-- Category: household-fan
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'c432cbe1-99e4-4912-9000-204a6f9f94ed',
  'Remote Control Pedestal Stand Fan 16"',
  'مروحة عمودية ستاند مع ريموت 16 بوصة',
  'remote-control-pedestal-stand-fan',
  18,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'household-fan' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Standing room cooling fan with adjustable height, 3 speed levels, and sleep timer.',
  'مروحة تبريد عمودية للمنزل مع ارتفاع قابل للتعديل، 3 مستويات سرعة، ومؤقت نوم.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'FN-PED-16R'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('c432cbe1-99e4-4912-9000-204a6f9f94ed', 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=600', true, 'Remote Control Pedestal Stand Fan 16"', 'مروحة عمودية ستاند مع ريموت 16 بوصة', 0);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '10a03da6-2647-4840-87f9-0848dd558788',
  'Modern Wall Mount Fan with Pull Cord',
  'مروحة جدارية حديثة مع حبل سحب',
  'modern-wall-mount-fan-pull-cord',
  14,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'household-fan' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Oscillating wall-mounted household fan, space saving design, adjustable tilting head.',
  'مروحة جدارية للمنزل تدعم الدوران الجانبي، تصميم موفر للمساحة ورأس قابل للتوجيه.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'FN-WLL-PUL'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('10a03da6-2647-4840-87f9-0848dd558788', 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=600', true, 'Modern Wall Mount Fan with Pull Cord', 'مروحة جدارية حديثة مع حبل سحب', 0);

-- Category: power-tools
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '1dccbb26-c3c5-4eb0-b8ce-dc24c33fcdbe',
  'Cordless Drill Driver Kit 12V',
  'دريل شحن لاسلكي ومفك براغي 12 فولت',
  'cordless-drill-driver-kit-12v',
  22,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'power-tools' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Lightweight cordless power drill with 18 torque settings, rechargeable lithium-ion battery, and case.',
  'دريل لاسلكي خفيف الوزن مع 18 إعداد عزم، بطارية ليثيوم أيون قابلة لإعادة الشحن، وحقيبة.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'TL-DRL-12V'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('1dccbb26-c3c5-4eb0-b8ce-dc24c33fcdbe', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600', true, 'Cordless Drill Driver Kit 12V', 'دريل شحن لاسلكي ومفك براغي 12 فولت', 0);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '9386cd8c-a117-4ca1-8dcf-a830a47c5548',
  'Laser Distance Meter 40M',
  'جهاز قياس المسافة بالليزر 40 متر',
  'laser-distance-meter-40m',
  9.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'power-tools' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Handy digital laser range finder tool, quick measuring calculations for room renovations.',
  'جهاز قياس مدى الليزر الرقمي المحمول، حساب قياسات سريعة لتجديد الغرف وتنسيق الإضاءة.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'TL-LSR-40M'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('9386cd8c-a117-4ca1-8dcf-a830a47c5548', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600', true, 'Laser Distance Meter 40M', 'جهاز قياس المسافة بالليزر 40 متر', 0);

-- Category: modi-selections
INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  'dbcf08b6-921d-41be-8d37-1044040f0c2d',
  'Modi Curved Linear LED Chandelier',
  'ثريا مودي خطية منحنية LED معلقة',
  'modi-curved-linear-led-chandelier',
  85,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'modi-selections' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Premium architectural wave-like LED chandelier by Modi. Artistic pendant light.',
  'ثريا LED معمارية متميزة مموجة من ماركة مودي. مصباح معلق فني.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'MD-CRV-LIN'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('dbcf08b6-921d-41be-8d37-1044040f0c2d', 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&q=80&w=600', true, 'Modi Curved Linear LED Chandelier', 'ثريا مودي خطية منحنية LED معلقة', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('dbcf08b6-921d-41be-8d37-1044040f0c2d', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600', false, 'Modi Curved Linear LED Chandelier - Alternate', 'ثريا مودي خطية منحنية LED معلقة - صورة بديلة', 1);

INSERT INTO public.products (
  id, name_en, name_ar, slug, base_price, sale_price, 
  category_id, brand_id, description_en, description_ar, 
  stock_quantity, is_active, is_featured, is_new, is_bestseller, sku
) VALUES (
  '33ddcb0b-5b7a-4920-a9ab-4326f526eb50',
  'Modi Recessed Dual Spotlight White',
  'سبوت لايت مودي غائر ثنائي أبيض',
  'modi-recessed-dual-spotlight-white',
  12.5,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'modi-selections' LIMIT 1),
  (SELECT id FROM public.brands LIMIT 1),
  'Dual spot recessed architectural trimless downlight fixture by Modi.',
  'وحدة إضاءة سبوت لايت ثنائية غائرة بدون إطار من ماركة مودي.',
  50, -- Default stock
  true,
  true,
  true,
  false,
  'MD-REC-DSL'
);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('33ddcb0b-5b7a-4920-a9ab-4326f526eb50', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=600', true, 'Modi Recessed Dual Spotlight White', 'سبوت لايت مودي غائر ثنائي أبيض', 0);
INSERT INTO public.product_images (product_id, url, is_primary, alt_text_en, alt_text_ar, sort_order) 
VALUES ('33ddcb0b-5b7a-4920-a9ab-4326f526eb50', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=600', false, 'Modi Recessed Dual Spotlight White - Alternate', 'سبوت لايت مودي غائر ثنائي أبيض - صورة بديلة', 1);

COMMIT;
