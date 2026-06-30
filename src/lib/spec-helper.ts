/**
 * Helper utility to extract and structure product specifications (Watt, Lumen, CCT, Beam Angle, IP, Cutout, Warranty).
 * Automatically handles database JSON values and provides realistic fallbacks based on product categories and slugs.
 */

export interface ProductSpecs {
  wattage: string;
  lumens: string;
  cct: string;
  beam_angle: string;
  ip_rating: string;
  cutout_size: string;
  warranty: string;
  material: string;
  voltage: string;
}

export function parseProductSpecs(
  specifications: Record<string, any> | null | undefined,
  slug: string = '',
  nameEn: string = ''
): ProductSpecs {
  const normSlug = slug.toLowerCase();
  const normName = nameEn.toLowerCase();

  // 1. Establish initial fallback template based on category/type
  let fallback: ProductSpecs = {
    wattage: '12W',
    lumens: '1080 lm',
    cct: '3000K (Warm White)',
    beam_angle: '120°',
    ip_rating: 'IP20',
    cutout_size: 'N/A',
    warranty: '2 Years',
    material: 'Aluminum + Acrylic',
    voltage: '220-240V'
  };

  if (normSlug.includes('chandelier') || normName.includes('chandelier')) {
    fallback = {
      wattage: '60W',
      lumens: '5400 lm',
      cct: '3000K (Warm White)',
      beam_angle: '360°',
      ip_rating: 'IP20',
      cutout_size: 'N/A (Suspended)',
      warranty: '3 Years',
      material: 'K9 Crystal + Premium Brass',
      voltage: '220-240V'
    };
  } else if (normSlug.includes('strip') || normName.includes('strip')) {
    fallback = {
      wattage: '12W / Meter',
      lumens: '960 lm / Meter',
      cct: 'RGB + 3000K-6000K selectable',
      beam_angle: '120°',
      ip_rating: 'IP65 Waterproof',
      cutout_size: 'Cuttable every 5cm',
      warranty: '2 Years',
      material: 'Flexible PCB + Silicone Cover',
      voltage: 'DC 24V / 220V'
    };
  } else if (normSlug.includes('downlight') || normSlug.includes('panel') || normSlug.includes('recessed') || normName.includes('downlight') || normName.includes('panel')) {
    fallback = {
      wattage: '9W',
      lumens: '810 lm',
      cct: '3-CCT Selectable (3K/4K/6K)',
      beam_angle: '90° (Anti-glare)',
      ip_rating: 'IP44',
      cutout_size: 'Ø 75mm',
      warranty: '3 Years',
      material: 'Die-cast Aluminum Heat Sink',
      voltage: '220-240V'
    };
  } else if (normSlug.includes('spotlight') || normSlug.includes('track') || normName.includes('spot') || normName.includes('track')) {
    fallback = {
      wattage: '15W',
      lumens: '1350 lm',
      cct: '4000K (Natural White)',
      beam_angle: '24° / 36° Adjustable',
      ip_rating: 'IP20',
      cutout_size: 'N/A (Track Mounted)',
      warranty: '3 Years',
      material: 'CNC Aluminum',
      voltage: '220-240V'
    };
  } else if (
    normSlug.includes('outdoor') ||
    normSlug.includes('bollard') ||
    normSlug.includes('flood') ||
    normSlug.includes('street') ||
    normSlug.includes('lantern') ||
    normSlug.includes('garden') ||
    normSlug.includes('solar') ||
    normName.includes('outdoor') ||
    normName.includes('flood') ||
    normName.includes('solar')
  ) {
    const isSolar = normSlug.includes('solar') || normName.includes('solar');
    fallback = {
      wattage: isSolar ? 'Solar Powered (20W Eq.)' : '50W',
      lumens: isSolar ? '1200 lm' : '4500 lm',
      cct: '3000K / 6000K dual option',
      beam_angle: '110°',
      ip_rating: 'IP66 Weatherproof',
      cutout_size: 'N/A (Surface Mounted)',
      warranty: '5 Years',
      material: 'Heavy Duty Anti-Corrosion Aluminum + Tempered Glass',
      voltage: isSolar ? 'Solar Battery (Lithium Po)' : '220-240V'
    };
  } else if (normSlug.includes('wall') || normName.includes('wall')) {
    fallback = {
      wattage: '12W',
      lumens: '960 lm',
      cct: '3000K (Warm White)',
      beam_angle: 'Up & Down 60°',
      ip_rating: 'IP54',
      cutout_size: 'N/A (Wall Mounted)',
      warranty: '2 Years',
      material: 'Aluminum + Clear Glass Diffuser',
      voltage: '220-240V'
    };
  }

  // 2. Map database values if they exist, overriding the fallback template
  if (!specifications || typeof specifications !== 'object') {
    return fallback;
  }

  // Helper to search JSON for case-insensitive keys
  const getVal = (keys: string[], df: string): string => {
    for (const key of keys) {
      if (specifications[key] !== undefined && specifications[key] !== null) {
        return String(specifications[key]);
      }
      // Try lowercase check
      const foundKey = Object.keys(specifications).find(
        k => k.toLowerCase() === key.toLowerCase() || k.toLowerCase().replace(/[^a-z]/g, '') === key.toLowerCase().replace(/[^a-z]/g, '')
      );
      if (foundKey && specifications[foundKey] !== undefined && specifications[foundKey] !== null) {
        return String(specifications[foundKey]);
      }
    }
    return df;
  };

  return {
    wattage: getVal(['wattage', 'watt', 'power', 'power_wattage'], fallback.wattage),
    lumens: getVal(['lumens', 'lumen', 'brightness', 'flux'], fallback.lumens),
    cct: getVal(['cct', 'color_temperature', 'color_temp', 'kelvin'], fallback.cct),
    beam_angle: getVal(['beam_angle', 'beam', 'angle'], fallback.beam_angle),
    ip_rating: getVal(['ip_rating', 'ip', 'protection'], fallback.ip_rating),
    cutout_size: getVal(['cutout_size', 'cutout', 'cut_out', 'hole'], fallback.cutout_size),
    warranty: getVal(['warranty', 'guarantee', 'warranty_period'], fallback.warranty),
    material: getVal(['material', 'body_material'], fallback.material),
    voltage: getVal(['voltage', 'input_voltage', 'power_source'], fallback.voltage)
  };
}
