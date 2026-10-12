/**
 * Helper utility to extract and structure product specifications (Watt, Lumen, CCT, Beam Angle, IP, Cutout, Warranty).
 * Automatically handles database JSON values and otherwise reads values stated in the product name (e.g. "10W 6500K IP65"). Unknown values stay
 * empty: showing invented specs (a "12W" switch) would mislead customers.
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
  _slug: string = '',
  nameEn: string = ''
): ProductSpecs {
  const specs = specifications && typeof specifications === 'object' ? specifications : {};
  const name = nameEn || '';

  // Case-insensitive lookup in the stored specifications
  const stored = (keys: string[]): string => {
    for (const key of keys) {
      const found = Object.keys(specs).find(
        (k) => k.toLowerCase().replace(/[^a-z]/g, '') === key.toLowerCase().replace(/[^a-z]/g, '')
      );
      if (found && specs[found] !== undefined && specs[found] !== null && String(specs[found]).trim()) {
        return String(specs[found]);
      }
    }
    return '';
  };

  // Values written in the product name
  const fromName = (re: RegExp, format: (m: RegExpMatchArray) => string): string => {
    const m = name.match(re);
    return m ? format(m) : '';
  };

  return {
    wattage: stored(['wattage', 'watt', 'power', 'power_wattage']) || fromName(/(\d+(?:\.\d+)?)\s?W\b/i, (m) => `${m[1]}W`),
    lumens: stored(['lumens', 'lumen', 'brightness', 'flux']) || fromName(/(\d{2,5})\s?lm\b/i, (m) => `${m[1]} lm`),
    cct: stored(['cct', 'color_temperature', 'color_temp', 'kelvin']) || fromName(/(\d{4})\s?K\b/i, (m) => `${m[1]}K`),
    beam_angle: stored(['beam_angle', 'beam', 'angle']) || fromName(/(\d{2,3})\s?°/, (m) => `${m[1]}°`),
    ip_rating: stored(['ip_rating', 'ip', 'protection']) || fromName(/\bIP\s?(\d{2})\b/i, (m) => `IP${m[1]}`),
    cutout_size: stored(['cutout_size', 'cutout', 'cut_out', 'hole']),
    warranty: stored(['warranty', 'guarantee', 'warranty_period']),
    material: stored(['material', 'body_material']),
    voltage: stored(['voltage', 'input_voltage', 'power_source']) || fromName(/(\d{2,3})\s?V\b/i, (m) => `${m[1]}V`),
  };
}
