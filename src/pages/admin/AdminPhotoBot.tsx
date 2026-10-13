import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Copy, ExternalLink, Loader2, Plug, RefreshCw, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface BotStatus {
  tokenSet: boolean;
  bot?: string | null;
  connected?: boolean;
  pending?: number;
  lastError?: string | null;
  users: { telegram_user_id: number; display_name: string | null; linked_at: string }[];
}

interface JobRow {
  id: string;
  image_url: string | null;
  status: string;
  created_at: string;
  reading: { what?: string; tag_model?: string } | null;
  products: { name_en: string; sku: string; slug: string } | null;
}

const invoke = async <T,>(body: Record<string, unknown>): Promise<T> => {
  const { data, error } = await supabase.functions.invoke('photo-bot', { body });
  if (error) throw error;
  return data as T;
};

// Set up the Telegram photo bot and see what it has put on the website
export default function AdminPhotoBot() {
  const { isRTL } = useLanguage();
  const queryClient = useQueryClient();
  const [code, setCode] = useState<{ code: string; bot: string | null } | null>(null);

  const status = useQuery({ queryKey: ['photo-bot-status'], queryFn: () => invoke<BotStatus>({ action: 'status' }) });

  const coverage = useQuery({
    queryKey: ['photo-coverage'],
    queryFn: async () => {
      let real = 0, total = 0;
      for (let from = 0; ; from += 1000) {
        const { data, error } = await supabase.from('products').select('id, product_images(url, is_primary)').eq('is_active', true).range(from, from + 999);
        if (error) throw error;
        for (const p of data || []) {
          total++;
          const imgs = (p.product_images as { url: string; is_primary: boolean }[] | null) || [];
          const main = imgs.find((i) => i.is_primary) || imgs[0];
          if (main && !main.url.startsWith('https://images.unsplash.com/')) real++;
        }
        if (!data || data.length < 1000) break;
      }
      return { real, total };
    },
  });

  const jobs = useQuery({
    queryKey: ['photo-bot-jobs'],
    queryFn: async (): Promise<JobRow[]> => {
      const { data, error } = await supabase.from('photo_bot_jobs' as never)
        .select('id, image_url, status, created_at, reading, products(name_en, sku, slug)')
        .order('created_at', { ascending: false }).limit(48);
      if (error) throw error;
      return (data as unknown as JobRow[]) || [];
    },
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['photo-bot-status'] });
  const setup = useMutation({
    mutationFn: () => invoke<{ bot: string }>({ action: 'setup' }),
    onSuccess: (d) => { toast.success(isRTL ? `تم ربط @${d.bot}` : `Connected @${d.bot}`); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const newCode = useMutation({
    mutationFn: () => invoke<{ code: string; bot: string | null }>({ action: 'code' }),
    onSuccess: setCode,
    onError: (e: Error) => toast.error(e.message),
  });
  const unlink = useMutation({
    mutationFn: (id: number) => invoke({ action: 'unlink', telegram_user_id: id }),
    onSuccess: refresh,
    onError: (e: Error) => toast.error(e.message),
  });

  const s = status.data;
  const pct = coverage.data ? Math.round((coverage.data.real / Math.max(1, coverage.data.total)) * 100) : 0;
  const statusLabel: Record<string, string> = isRTL
    ? { done: 'منشورة', pending: 'بانتظار التأكيد', skipped: 'تم التخطي', undone: 'تم التراجع', failed: 'فشلت' }
    : { done: 'Live', pending: 'Waiting', skipped: 'Skipped', undone: 'Undone', failed: 'Failed' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{isRTL ? 'بوت الصور (تيليجرام)' : 'Photo Bot (Telegram)'}</h1>
        <p className="text-sm text-muted-foreground">
          {isRTL
            ? 'صوّر المنتج وأرسله للبوت: يتعرف عليه الذكاء الاصطناعي ويقص الصورة ويحسّنها، وبضغطة واحدة تظهر في الموقع.'
            : 'Photograph a product and send it to the bot: the AI identifies it, crops and brightens the photo, and one tap puts it live on the website.'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isRTL ? 'الصور الحقيقية في الموقع' : 'Real photos on the website'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={pct} />
          <p className="text-sm text-muted-foreground">
            {coverage.data ? `${coverage.data.real} / ${coverage.data.total} (${pct}%)` : <Loader2 className="h-4 w-4 animate-spin" />}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">{isRTL ? 'الإعداد' : 'Setup'}</CardTitle>
              <CardDescription>
                {status.isLoading ? '…' : s?.connected
                  ? <span className="inline-flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-4 w-4" /> {isRTL ? 'متصل' : 'Connected'}: @{s.bot}</span>
                  : (isRTL ? 'غير متصل بعد' : 'Not connected yet')}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={refresh} aria-label="Refresh"><RefreshCw className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          <ol className="list-decimal space-y-3 ps-5">
            <li className={s?.tokenSet ? 'text-muted-foreground line-through' : ''}>
              {isRTL
                ? 'في تيليجرام افتح ‎@BotFather‎ وأرسل ‎/newbot‎، اختر اسماً (مثل QLight Photos) ثم انسخ الرمز (token).'
                : 'In Telegram, open @BotFather, send /newbot, choose a name (e.g. QLight Photos) and copy the token it gives you.'}
            </li>
            <li className={s?.tokenSet ? 'text-muted-foreground line-through' : ''}>
              {isRTL ? 'من مجلد المشروع شغّل هذا الأمر (ضع الرمز مكان XXXX):' : 'From the project folder, run this command (put the token instead of XXXX):'}
              <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-2 font-mono text-xs" dir="ltr">npx supabase secrets set TELEGRAM_BOT_TOKEN=XXXX</pre>
            </li>
            <li>
              <Button size="sm" onClick={() => setup.mutate()} disabled={!s?.tokenSet || setup.isPending}>
                {setup.isPending ? <Loader2 className="me-1 h-4 w-4 animate-spin" /> : <Plug className="me-1 h-4 w-4" />}
                {s?.connected ? (isRTL ? 'إعادة الربط' : 'Reconnect') : (isRTL ? 'اربط البوت' : 'Connect the bot')}
              </Button>
            </li>
            <li>
              <Button size="sm" variant="outline" onClick={() => newCode.mutate()} disabled={!s?.connected || newCode.isPending}>
                {isRTL ? 'أنشئ رمز ربط لهاتفي' : 'Create a pairing code for my phone'}
              </Button>
              {code && (
                <div className="mt-3 rounded-xl border bg-muted/40 p-4">
                  <p>{isRTL ? 'أرسل هذا للبوت خلال 15 دقيقة:' : 'Send this to the bot within 15 minutes:'}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <code className="rounded bg-background px-3 py-1.5 text-lg font-bold" dir="ltr">/link {code.code}</code>
                    <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(`/link ${code.code}`); toast.success('Copied'); }}><Copy className="h-4 w-4" /></Button>
                    {code.bot && (
                      <Button size="sm" asChild>
                        <a href={`https://t.me/${code.bot}?start=${code.code}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="me-1 h-4 w-4" />{isRTL ? 'افتح في تيليجرام' : 'Open in Telegram'}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </li>
          </ol>

          {s?.lastError && <p className="text-xs text-destructive">{isRTL ? 'آخر خطأ من تيليجرام: ' : 'Last Telegram error: '}{s.lastError}</p>}

          {s?.users?.length ? (
            <div>
              <p className="font-semibold">{isRTL ? 'الهواتف المرتبطة' : 'Paired phones'}</p>
              <ul className="mt-2 space-y-1">
                {s.users.map((u) => (
                  <li key={u.telegram_user_id} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <span>{u.display_name || u.telegram_user_id}</span>
                    <Button size="icon" variant="ghost" onClick={() => unlink.mutate(u.telegram_user_id)} aria-label={isRTL ? 'إلغاء الربط' : 'Unpair'}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">{isRTL ? 'آخر الصور' : 'Recent photos'}</CardTitle></CardHeader>
        <CardContent>
          {jobs.isLoading && <Loader2 className="mx-auto h-5 w-5 animate-spin" />}
          {!jobs.isLoading && !jobs.data?.length && <p className="text-sm text-muted-foreground">{isRTL ? 'لا توجد صور بعد' : 'No photos yet'}</p>}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {jobs.data?.map((j) => (
              <div key={j.id} className="overflow-hidden rounded-xl border">
                <div className="aspect-square bg-muted">{j.image_url && <img src={j.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />}</div>
                <div className="space-y-1 p-2 text-xs">
                  <Badge variant={j.status === 'done' ? 'default' : 'secondary'}>{statusLabel[j.status] || j.status}</Badge>
                  {j.products
                    ? <a href={`/product/${j.products.slug}`} target="_blank" rel="noopener noreferrer" className="block truncate font-medium hover:underline">{j.products.name_en}</a>
                    : <p className="truncate text-muted-foreground">{j.reading?.what || '—'}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
