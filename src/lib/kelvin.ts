// Converts a color temperature in Kelvin to an approximate RGB color.
// Based on Tanner Helland's curve fit, accurate enough for UI tinting (1000K-40000K).
export function kelvinToRgb(kelvin: number): [number, number, number] {
  const t = kelvin / 100;
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));

  const r = t <= 66 ? 255 : 329.698727446 * Math.pow(t - 60, -0.1332047592);
  const g = t <= 66
    ? 99.4708025861 * Math.log(t) - 161.1195681661
    : 288.1221695283 * Math.pow(t - 60, -0.0755148492);
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;

  return [clamp(r), clamp(g), clamp(b)];
}

export function kelvinToCss(kelvin: number, alpha = 1): string {
  const [r, g, b] = kelvinToRgb(kelvin);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Human label for common lighting temperatures
export function kelvinLabel(kelvin: number, isRTL: boolean): string {
  if (kelvin < 3200) return isRTL ? 'أبيض دافئ' : 'Warm White';
  if (kelvin < 4500) return isRTL ? 'أبيض طبيعي' : 'Natural White';
  return isRTL ? 'أبيض بارد' : 'Cool Daylight';
}
