// Catalog search for the photo bot: every word matched separately (any order), Arabic spelling
// variants folded, trade shorthand understood, and the closest products returned when nothing
// contains every word.
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.93.2";

// Words people type -> spellings used in the catalog names
const SYNONYMS: Record<string, string[]> = {
  magnetic: ["magnetic", "mg", "magnatic", "مغناطيس"],
  grille: ["grel", "grille", "grill"],
  grill: ["grel", "grille", "grill"],
  linear: ["linear", "lenear"],
  profile: ["profile", "profil", "بروفايل"],
  socket: ["socket", "بلاك", "plug"],
  switch: ["switch", "سوتش"],
  wire: ["wire", "واير"],
  cable: ["cable", "كيبل", "كابل"],
  strip: ["strip", "استرب", "استريب"],
  rope: ["rope", "روب"],
  fan: ["fan", "مروح"],
  driver: ["driver", "محول", "درايفر", "transformer", "power supply"],
  transformer: ["transformer", "محول", "driver"],
  spot: ["spot", "سبوت"],
  spotlight: ["spot", "سبوت"],
  track: ["track", "trak", "مسار"],
  panel: ["panel", "بانل"],
  bulb: ["bulb", "لمب"],
  lamp: ["lamp", "bulb", "لمب"],
  ceiling: ["ceiling", "سقف"],
  downlight: ["down", "داون"],
  chandelier: ["chandelier", "ثري"],
  breaker: ["breaker", "mcb", "قاطع", "بريكر"],
  junction: ["junction", "جي بي"],
  sensor: ["sensor", "سنسر"],
};

const STOP = new Set(["the", "a", "an", "for", "with", "and", "of", "in", "light", "lights", "led", "ql"]);

// Fold the Arabic letters people type in different ways
const foldArabic = (s: string) =>
  s.replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي");

// Sizes become "17x7" (from 17*7, 17 x 7, 17×7); decimals like 1.5 are kept; dashes split words
const normalize = (s: string) =>
  foldArabic(s.toLowerCase())
    .replace(/(\d)\s*[x×*]\s*(\d)/g, "$1x$2")
    .replace(/(?<!\d)\.|\.(?!\d)/g, " ")
    .replace(/[,()%*"'`|\-_/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const isNumber = (w: string) => /^\d+(\.\d+)?$/.test(w);

// A bare number must match as a whole number ("2" matches "2 gang", not "12w")
const contains = (hay: string, v: string) =>
  isNumber(v) ? new RegExp(`(^|[^0-9.])${v.replace(".", "\\.")}([^0-9.]|$)`).test(hay) : hay.includes(v);

// The spellings of one word that may appear in the database (it stores the unfolded letters)
function dbVariants(word: string): string[] {
  const out = new Set<string>([word]);
  if (/^\d+x\d+$/.test(word)) out.add(word.replace("x", "*"));
  if (/[اهي]/.test(word)) {
    out.add(word.replace(/ه$/g, "ة"));
    out.add(word.replace(/ي$/g, "ى"));
    out.add(word.replace(/^ا/, "أ"));
    out.add(word.replace(/^ا/, "إ"));
  }
  if (word.startsWith("ال") && word.length > 3) out.add(word.slice(2));
  return [...out];
}

export interface SearchHit { id: string; score: number }

export async function searchCatalog(db: SupabaseClient, text: string, limit = 6): Promise<SearchHit[]> {
  const all = normalize(text).split(" ").filter((w) => w.length >= 2 || isNumber(w));
  // Common words ("ql", "led", "light") are ignored next to other words, but searched when alone
  const meaningful = all.filter((w) => !STOP.has(w));
  const words = (meaningful.length ? meaningful : all).slice(0, 6);
  if (!words.length) return [];

  // Each typed word becomes a group of acceptable spellings
  const groups = words.map((w) => [...new Set([...(SYNONYMS[w] || [w]), w].map(normalize))]);
  // Short bare numbers match far too much in the database; they only count when scoring
  const searchable = groups.flat().filter((v) => !(isNumber(v) && v.length < 3));
  const patterns = [...new Set((searchable.length ? searchable : groups.flat()).flatMap(dbVariants))].slice(0, 40);
  const or = patterns.flatMap((p) => [`name_en.ilike."%${p}%"`, `name_ar.ilike."%${p}%"`, `sku.ilike."%${p}%"`]).join(",");

  const { data, error } = await db.from("products")
    .select("id, sku, name_en, name_ar")
    .eq("is_active", true)
    .or(or)
    .limit(400);
  if (error) throw error;

  // Score: how many typed words match (any of their spellings), then shorter names first
  return (data || [])
    .map((p) => {
      const hay = normalize(`${p.name_en} ${p.name_ar} ${p.sku}`);
      const score = groups.filter((g) => g.some((v) => contains(hay, v))).length;
      // Tie-breaker: also matching the common words typed ("ql strip" puts QL strips first)
      const extra = all.filter((w) => contains(hay, w)).length;
      return { id: p.id as string, score, extra, len: hay.length };
    })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score || b.extra - a.extra || a.len - b.len)
    .slice(0, limit)
    .map(({ id, score }) => ({ id, score }));
}

export const wordCount = (text: string) => {
  const all = normalize(text).split(" ").filter((w) => w.length >= 2 || isNumber(w));
  const meaningful = all.filter((w) => !STOP.has(w));
  return (meaningful.length ? meaningful : all).length;
};
