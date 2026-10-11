/**
 * Image Resolver - Maps broken MinIO/Supabase URLs to local project images.
 * 
 * The database stores URLs pointing to an unreachable MinIO server.
 * This module intercepts those URLs and serves local images instead.
 */

// Available local images by type
const LOCAL_IMAGES: Record<string, string[]> = {
  products: [
    '/images/products/ceiling-light-1.jpg',
    '/images/products/ceiling-panel-2.jpg',
    '/images/products/crystal-chandelier-1.jpg',
    '/images/products/downlight-1.jpg',
    '/images/products/floor-lamp-1.jpg',
    '/images/products/floor-lamp-2.jpg',
    '/images/products/gold-chandelier-2.jpg',
    '/images/products/led-strip-1.jpg',
    '/images/products/led-strip-2.jpg',
    '/images/products/outdoor-bollard-1.jpg',
    '/images/products/outdoor-solar-2.jpg',
    '/images/products/pendant-globe-1.jpg',
    '/images/products/pendant-industrial-2.jpg',
    '/images/products/spotlight-2.jpg',
    '/images/products/wall-light-2.jpg',
    '/images/products/wall-sconce-1.jpg',
  ],
  categories: [
    '/images/categories/ceiling-lights.jpg',
    '/images/categories/chandeliers.jpg',
    '/images/categories/floor-lamps.jpg',
    '/images/categories/led-strips.jpg',
    '/images/categories/outdoor-lighting.jpg',
    '/images/categories/pendant-lights.jpg',
    '/images/categories/spotlights.jpg',
    '/images/categories/wall-lights.jpg',
  ],
  brands: [
    '/images/brands/ge-lighting.jpg',
    '/images/brands/havells.jpg',
    '/images/brands/legrand.jpg',
    '/images/brands/osram.jpg',
    '/images/brands/panasonic.jpg',
    '/images/brands/philips.jpg',
  ],
};

// Eager-imported src/assets images (for projects & blog which use src/assets)
import bedroomInstallation from '@/assets/projects/bedroom-installation.jpg';
import gardenOutdoor from '@/assets/projects/garden-outdoor.jpg';
import kitchenInstallation from '@/assets/projects/kitchen-installation.jpg';
import majlisChandelier from '@/assets/projects/majlis-chandelier.jpg';
import officeLighting from '@/assets/projects/office-lighting.jpg';
import restaurantLighting from '@/assets/projects/restaurant-lighting.jpg';
import salonLighting from '@/assets/projects/salon-lighting.jpg';
import villaLivingRoom from '@/assets/projects/villa-living-room.jpg';

import bedroomLighting from '@/assets/blog/bedroom-lighting.jpg';
import choosingRightLight from '@/assets/blog/choosing-right-light.jpg';
import commercialLighting from '@/assets/blog/commercial-lighting.jpg';
import energySavings from '@/assets/blog/energy-savings.jpg';
import kitchenLighting from '@/assets/blog/kitchen-lighting.jpg';
import ledVsTraditional from '@/assets/blog/led-vs-traditional.jpg';
import outdoorLighting from '@/assets/blog/outdoor-lighting.jpg';
import perfectChandelier from '@/assets/blog/perfect-chandelier.jpg';
import smartLightingGuide from '@/assets/blog/smart-lighting-guide.jpg';
import warmVsCoolLight from '@/assets/blog/warm-vs-cool-light.jpg';

const PROJECT_IMAGES: string[] = [
  bedroomInstallation, gardenOutdoor, kitchenInstallation, majlisChandelier,
  officeLighting, restaurantLighting, salonLighting, villaLivingRoom,
];

// Each project photo matched to the kind of space it shows, by keywords in the project slug
const PROJECT_TYPE_IMAGES: Array<[RegExp, string]> = [
  [/salon|beauty|spa|barber/, salonLighting],
  [/bedroom/, bedroomInstallation],
  [/kitchen/, kitchenInstallation],
  [/majlis|chandelier|diwaniya|hall|palace/, majlisChandelier],
  [/restaurant|cafe|dining|mall|retail|shop/, restaurantLighting],
  [/garden|outdoor|landscape|pool|facade/, gardenOutdoor],
  [/office|corporate|tower|commercial|clinic/, officeLighting],
  [/villa|living|residential|home|house/, villaLivingRoom],
];

const BLOG_IMAGES: string[] = [
  bedroomLighting, choosingRightLight, commercialLighting, energySavings,
  kitchenLighting, ledVsTraditional, outdoorLighting, perfectChandelier,
  smartLightingGuide, warmVsCoolLight,
];

// Slug-to-image mappings for exact matches
const CATEGORY_SLUG_MAP: Record<string, string> = {
  'ceiling-lights': 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=600',
  'chandeliers': 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=600',
  'floor-lamps': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600',
  'led-strips': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600',
  'outdoor-lighting': 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&q=80&w=600',
  'pendant-lights': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600',
  'spotlights': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=600',
  'wall-lights': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
  'solar-lights': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600',
  'hardware': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
  'extension-socket': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600',
  'ventilation-fan': 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=600',
  'household-fan': 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=600',
  'power-tools': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600',
  'modi-selections': 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&q=80&w=600'
};

const BRAND_SLUG_MAP: Record<string, string> = {
  'philips': 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=600',
  'osram': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600',
  'ge-lighting': 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600',
  'havells': 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&q=80&w=600',
  'panasonic': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600',
  'legrand': 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600',
};

// Premium Unsplash images for products — every URL is UNIQUE per product
const PRODUCT_SLUG_IMAGE_MAP: Record<string, string> = {
  // Chandeliers — crystal, gold, empire, ring, and vintage styles
  'crystal-elegance-chandelier': 'https://images.unsplash.com/photo-1543248939-ff40856f65d4?auto=format&fit=crop&q=80&w=600',
  'gold-sputnik-chandelier': 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=600',
  'black-empire-chandelier': 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=600',
  'modern-ring-chandelier': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
  'vintage-candle-chandelier': 'https://images.unsplash.com/photo-1571508601936-6ca847b47ae4?auto=format&fit=crop&q=80&w=600',

  // Ceiling Lights — flush mount, panel, crystal, smart, dome
  'led-flush-mount-round': 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=600',
  'square-panel-light': 'https://images.unsplash.com/photo-1563461660947-507ef49e9c47?auto=format&fit=crop&q=80&w=600',
  'crystal-ceiling-light': 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=600',
  'smart-wifi-ceiling-light': 'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&q=80&w=600',
  'minimalist-dome-light': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600',

  // Wall Lights — sconce, cage, swing arm, washer, picture
  'brass-wall-sconce': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
  'industrial-cage-light': 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&q=80&w=600',
  'modern-swing-arm-lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
  'led-wall-washer': 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=600',
  'picture-light-bronze': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600',

  // Pendant Lights — globe, dome, geometric, cluster, rattan
  'glass-globe-pendant': 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&q=80&w=600',
  'industrial-dome-pendant': 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=600',
  'geometric-pendant-light': 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&q=80&w=600',
  'cluster-pendant-set': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600',
  'woven-rattan-pendant': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=600',

  // LED Strips — RGB, warm white, neon flex, COB, RGBW
  'rgb-smart-led-strip-5m': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600',
  'warm-white-strip-3000k': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600',
  'neon-flex-led-strip': 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600',
  'cob-led-strip-daylight': 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=600',
  'rgbw-led-strip-kit': 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=600',

  // Floor Lamps — arc, tripod, reading, industrial, smart
  'arc-floor-lamp': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600',
  'tripod-floor-lamp': 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&q=80&w=600',
  'led-reading-floor-lamp': 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=600',
  'industrial-pipe-lamp': 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=600',
  'smart-touch-floor-lamp': 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80&w=600',

  // Outdoor Lighting — bollard, solar, lantern, flood, string
  'garden-bollard-light': 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&q=80&w=600',
  'solar-path-lights-set': 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=600',
  'wall-mounted-lantern': 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&q=80&w=600',
  'flood-light-50w': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
  'string-lights-10m': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600',

  // Spotlights — recessed, track, surface, gimbal, mini
  'led-recessed-downlight-12w': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=600',
  'track-light-head': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=600',
  'surface-mount-spotlight': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600',
  'gimbal-downlight': 'https://images.unsplash.com/photo-1462826303086-329426d1aef5?auto=format&fit=crop&q=80&w=600',
  'mini-spotlight-set': 'https://images.unsplash.com/photo-1563461660947-507ef49e9c47?auto=format&fit=crop&q=80&w=600',
};

// Secondary images for hover transitions — all unique
const PRODUCT_SLUG_SECONDARY_MAP: Record<string, string> = {
  // Chandeliers
  'crystal-elegance-chandelier': 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=600',
  'gold-sputnik-chandelier': 'https://images.unsplash.com/photo-1543248939-ff40856f65d4?auto=format&fit=crop&q=80&w=600',
  'black-empire-chandelier': 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=600',
  'modern-ring-chandelier': 'https://images.unsplash.com/photo-1571508601936-6ca847b47ae4?auto=format&fit=crop&q=80&w=600',
  'vintage-candle-chandelier': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
  // Ceiling Lights
  'led-flush-mount-round': 'https://images.unsplash.com/photo-1563461660947-507ef49e9c47?auto=format&fit=crop&q=80&w=600',
  'square-panel-light': 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=600',
  'crystal-ceiling-light': 'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&q=80&w=600',
  'smart-wifi-ceiling-light': 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=600',
  'minimalist-dome-light': 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=600',
  // Wall Lights
  'brass-wall-sconce': 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&q=80&w=600',
  'industrial-cage-light': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
  'modern-swing-arm-lamp': 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=600',
  'led-wall-washer': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600',
  'picture-light-bronze': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
  // Pendant Lights
  'glass-globe-pendant': 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&q=80&w=600',
  'industrial-dome-pendant': 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&q=80&w=600',
  'geometric-pendant-light': 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=600',
  'cluster-pendant-set': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=600',
  'woven-rattan-pendant': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600',
  // LED Strips
  'rgb-smart-led-strip-5m': 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=600',
  'warm-white-strip-3000k': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600',
  'neon-flex-led-strip': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600',
  'cob-led-strip-daylight': 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600',
  'rgbw-led-strip-kit': 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=600',
  // Floor Lamps
  'arc-floor-lamp': 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=600',
  'tripod-floor-lamp': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600',
  'led-reading-floor-lamp': 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&q=80&w=600',
  'industrial-pipe-lamp': 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80&w=600',
  'smart-touch-floor-lamp': 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=600',
  // Outdoor Lighting
  'garden-bollard-light': 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=600',
  'solar-path-lights-set': 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&q=80&w=600',
  'wall-mounted-lantern': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600',
  'flood-light-50w': 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&q=80&w=600',
  'string-lights-10m': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
  // Spotlights
  'led-recessed-downlight-12w': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=600',
  'track-light-head': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=600',
  'surface-mount-spotlight': 'https://images.unsplash.com/photo-1462826303086-329426d1aef5?auto=format&fit=crop&q=80&w=600',
  'gimbal-downlight': 'https://images.unsplash.com/photo-1563461660947-507ef49e9c47?auto=format&fit=crop&q=80&w=600',
  'mini-spotlight-set': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600',
};

/** Simple hash for consistent fallback selection */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Check if a URL is known to be broken (MinIO or corrupted Supabase) */
function isBrokenUrl(url: string | null | undefined): boolean {
  if (!url) return true;
  if (url.includes('minio.walidmohamed.com')) return true;
  if (url.includes('s3.walidmohamed.com')) return true;
  return false;
}

export type ImageType = 'product' | 'category' | 'brand' | 'project' | 'blog' | 'hero';

/**
 * Resolve an image URL, falling back to local images if the URL is broken.
 * 
 * @param url - The original URL from the database
 * @param type - The type of image (product, category, brand, project, blog, hero)
 * @param slugOrId - A slug or ID used for consistent fallback selection
 * @returns A working image URL (local or original)
 */
export function resolveImageUrl(
  url: string | null | undefined,
  type: ImageType,
  slugOrId: string = ''
): string {
  // If URL looks valid (not MinIO and not local demo path), return as-is
  if (
    url && 
    !isBrokenUrl(url) && 
    !url.startsWith('/images/products/') && 
    !url.startsWith('/images/categories/') && 
    !url.startsWith('/images/brands/')
  ) return url;

  const hash = simpleHash(slugOrId || 'default');

  switch (type) {
    case 'category': {
      const exactMatch = CATEGORY_SLUG_MAP[slugOrId];
      if (exactMatch) return exactMatch;
      const images = LOCAL_IMAGES.categories;
      return images[hash % images.length];
    }
    case 'brand': {
      const exactMatch = BRAND_SLUG_MAP[slugOrId];
      if (exactMatch) return exactMatch;
      const images = LOCAL_IMAGES.brands;
      return images[hash % images.length];
    }
    case 'product': {
      // Only a fallback: a working URL from the database (e.g. a real upload) always wins
      if (slugOrId && PRODUCT_SLUG_IMAGE_MAP[slugOrId]) return PRODUCT_SLUG_IMAGE_MAP[slugOrId];
      const images = LOCAL_IMAGES.products;
      return images[hash % images.length];
    }
    case 'project': {
      const match = PROJECT_TYPE_IMAGES.find(([pattern]) => pattern.test(slugOrId));
      if (match) return match[1];
      return PROJECT_IMAGES[hash % PROJECT_IMAGES.length];
    }
    case 'blog': {
      return BLOG_IMAGES[hash % BLOG_IMAGES.length];
    }
    case 'hero': {
      // High-resolution premium Unsplash banner images for lighting / interiors
      const heroBanners = [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=1200'
      ];
      return heroBanners[hash % heroBanners.length];
    }
    default: {
      const images = LOCAL_IMAGES.products;
      return images[hash % images.length];
    }
  }
}

/**
 * Get a secondary product image (different from primary) for hover effects.
 */
export function resolveSecondaryImageUrl(
  url: string | null | undefined,
  primarySlug: string = ''
): string {
  if (url && !isBrokenUrl(url) && !url.startsWith('/images/products/')) return url;
  if (primarySlug && PRODUCT_SLUG_IMAGE_MAP[primarySlug]) {
    return PRODUCT_SLUG_SECONDARY_MAP[primarySlug] || PRODUCT_SLUG_IMAGE_MAP[primarySlug];
  }
  const images = LOCAL_IMAGES.products;
  // Use a different hash offset to get a different image
  const hash = simpleHash(primarySlug + '_secondary');
  return images[hash % images.length];
}
