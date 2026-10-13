// Turns what a customer uploads into something the smart-quote function can read:
// spreadsheets become plain text (read in the browser), photos are downscaled, PDFs pass through.

export type QuoteSource = 'excel' | 'image' | 'pdf' | 'text';

export interface PreparedInput {
  source: QuoteSource;
  text?: string;
  file?: { data: string; mimeType: string };
}

const MAX_BYTES = 8 * 1024 * 1024;

const toBase64 = (buf: ArrayBuffer) => {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
};

const isSpreadsheet = (f: File) => /\.(xlsx|xls|csv)$/i.test(f.name) || /spreadsheet|ms-excel|csv/.test(f.type);

const spreadsheetMime = (f: File) =>
  /\.csv$/i.test(f.name) ? 'text/csv'
    : /\.xls$/i.test(f.name) ? 'application/vnd.ms-excel'
      : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// Photos from phones are often 4000px+; 2000px is plenty to read handwriting
async function downscaleImage(file: File): Promise<{ data: string; mimeType: string }> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode'))), 'image/jpeg', 0.85));
    return { data: toBase64(await blob.arrayBuffer()), mimeType: 'image/jpeg' };
  } catch {
    // Formats the browser cannot decode (e.g. HEIC outside Safari) go as they are
    return { data: toBase64(await file.arrayBuffer()), mimeType: file.type || 'image/heic' };
  }
}

export async function prepareFile(file: File): Promise<PreparedInput> {
  if (file.size > MAX_BYTES) throw new Error('too-large');

  if (isSpreadsheet(file)) {
    const XLSX = await import('xlsx');
    const buf = await file.arrayBuffer();
    const book = XLSX.read(buf, { type: 'array' });
    const text = book.SheetNames
      .map((name) => `# ${name}\n${XLSX.utils.sheet_to_csv(book.Sheets[name], { blankrows: false })}`)
      .join('\n\n')
      .slice(0, 30000);
    return { source: 'excel', text, file: { data: toBase64(buf), mimeType: spreadsheetMime(file) } };
  }

  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
    return { source: 'pdf', file: { data: toBase64(await file.arrayBuffer()), mimeType: 'application/pdf' } };
  }

  if (file.type.startsWith('image/') || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)) {
    return { source: 'image', file: await downscaleImage(file) };
  }

  throw new Error('unsupported');
}
