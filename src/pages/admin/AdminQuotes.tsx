import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, FileText, Loader2, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type Status = 'new' | 'contacted' | 'won' | 'lost';

interface QuoteItem {
  line: number; requested: string; quantity: number; unit: string; sku: string | null;
  name_en: string | null; unit_price: number | null; total: number | null; on_request: boolean;
}

interface QuoteRow {
  id: string; quote_number: string; access_token: string; customer_name: string; customer_phone: string;
  customer_email: string | null; company: string | null; source: string; attachment_path: string | null;
  items: QuoteItem[]; subtotal: number; on_request_count: number; status: Status; admin_notes: string | null;
  created_at: string; valid_until: string;
}

const fmt = (n: number) => Number(n).toFixed(3);

// Kuwaiti mobile numbers are often typed without the country code
const waNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 8 ? `965${digits}` : digits;
};

// Follow up instant quotations: see the customer's original file, the matched lines and the offer
export default function AdminQuotes() {
  const { isRTL } = useLanguage();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<Status>('new');
  const [open, setOpen] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ['admin-quotes', status],
    queryFn: async (): Promise<QuoteRow[]> => {
      const { data, error } = await supabase
        .from('quotes' as never)
        .select('id, quote_number, access_token, customer_name, customer_phone, customer_email, company, source, attachment_path, items, subtotal, on_request_count, status, admin_notes, created_at, valid_until')
        .eq('status', status)
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data as unknown as QuoteRow[]) || [];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, changes }: { id: string; changes: Partial<Pick<QuoteRow, 'status' | 'admin_notes'>> }) => {
      const { error } = await supabase.from('quotes' as never).update(changes as never).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-quotes'] }); toast.success(isRTL ? 'تم الحفظ' : 'Saved'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const openAttachment = async (path: string) => {
    const { data, error } = await supabase.storage.from('quote-requests').createSignedUrl(path, 600);
    if (error || !data) { toast.error(error?.message || 'Not found'); return; }
    window.open(data.signedUrl, '_blank', 'noopener');
  };

  const labels: Record<Status, string> = isRTL
    ? { new: 'جديدة', contacted: 'تم التواصل', won: 'تم البيع', lost: 'لم تتم' }
    : { new: 'New', contacted: 'Contacted', won: 'Won', lost: 'Lost' };

  const sourceLabel: Record<string, string> = isRTL
    ? { excel: 'إكسل', image: 'صورة', pdf: 'PDF', text: 'نص', product: 'صفحة منتج' }
    : { excel: 'Excel', image: 'Photo', pdf: 'PDF', text: 'Typed', product: 'Product page' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{isRTL ? 'عروض الأسعار' : 'Quotations'}</h1>
        <p className="text-sm text-muted-foreground">
          {isRTL
            ? 'طلبات عروض الأسعار من صفحة "عرض سعر فوري". راجع الملف الأصلي وأكّد البنود المعلّمة "يُؤكد" مع العميل.'
            : 'Requests from the Instant Quotation page. Check the original file and confirm the TBC lines with the customer.'}
        </p>
      </div>

      <Tabs value={status} onValueChange={(v) => setStatus(v as Status)}>
        <TabsList>
          {(Object.keys(labels) as Status[]).map((s) => <TabsTrigger key={s} value={s}>{labels[s]}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      {isLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin" />}
      {!isLoading && quotes.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">{isRTL ? 'لا توجد عروض هنا' : 'No quotations here'}</p>
      )}

      <div className="space-y-4">
        {quotes.map((q) => (
          <Card key={q.id}>
            <CardHeader className="cursor-pointer" onClick={() => setOpen(open === q.id ? null : q.id)}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">
                    <span className="font-mono">{q.quote_number}</span> · {q.customer_name}{q.company ? ` · ${q.company}` : ''}
                  </CardTitle>
                  <CardDescription>
                    {new Date(q.created_at).toLocaleString(isRTL ? 'ar-KW' : 'en-GB')} · <span dir="ltr">{q.customer_phone}</span>
                    {q.customer_email ? ` · ${q.customer_email}` : ''}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{sourceLabel[q.source] || q.source}</Badge>
                  <Badge variant="outline">{q.items.length} {isRTL ? 'بند' : 'items'}</Badge>
                  <Badge>{fmt(q.subtotal)} KWD</Badge>
                  {q.on_request_count > 0 && <Badge variant="destructive">{q.on_request_count} TBC</Badge>}
                </div>
              </div>
            </CardHeader>
            {open === q.id && (
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {q.attachment_path && (
                    <Button size="sm" variant="outline" onClick={() => openAttachment(q.attachment_path!)}>
                      <FileText className="me-1 h-4 w-4" />{isRTL ? 'الملف الأصلي' : 'Original file'}
                    </Button>
                  )}
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/quote/${q.id}?t=${q.access_token}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="me-1 h-4 w-4" />{isRTL ? 'عرض السعر كما يراه العميل' : "Customer's quotation"}
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild className="border-emerald-500 text-emerald-600">
                    <a href={`https://wa.me/${waNumber(q.customer_phone)}?text=${encodeURIComponent(`${isRTL ? 'مرحباً' : 'Hello'} ${q.customer_name}, ${isRTL ? 'بخصوص عرض السعر' : 'about your quotation'} ${q.quote_number}`)}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="me-1 h-4 w-4" />WhatsApp
                    </a>
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs">
                      <tr>
                        <th className="p-2 text-start">#</th>
                        <th className="p-2 text-start">{isRTL ? 'طلب العميل' : 'Customer wrote'}</th>
                        <th className="p-2 text-start">{isRTL ? 'المنتج المطابق' : 'Matched product'}</th>
                        <th className="p-2 text-end">{isRTL ? 'الكمية' : 'Qty'}</th>
                        <th className="p-2 text-end">{isRTL ? 'المجموع' : 'Total'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {q.items.map((i) => (
                        <tr key={i.line} className="border-t">
                          <td className="p-2 font-mono text-xs">{i.line}</td>
                          <td className="p-2 text-muted-foreground">{i.requested || '—'}</td>
                          <td className="p-2">{i.name_en ? <>{i.name_en} <span className="font-mono text-xs text-muted-foreground">{i.sku}</span></> : <span className="text-amber-600">{isRTL ? 'بدون مطابقة' : 'No match'}</span>}</td>
                          <td className="p-2 text-end font-mono">{i.quantity}{i.unit ? ` ${i.unit}` : ''}</td>
                          <td className="p-2 text-end font-mono">{i.on_request ? 'TBC' : fmt(i.total!)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-end gap-3">
                  <Textarea className="min-w-64 flex-1" rows={2} placeholder={isRTL ? 'ملاحظات داخلية' : 'Internal notes'}
                    value={notes[q.id] ?? q.admin_notes ?? ''} onChange={(e) => setNotes({ ...notes, [q.id]: e.target.value })} />
                  <Button size="sm" variant="outline" onClick={() => update.mutate({ id: q.id, changes: { admin_notes: notes[q.id] ?? q.admin_notes } })}>
                    {isRTL ? 'حفظ الملاحظة' : 'Save note'}
                  </Button>
                  {(Object.keys(labels) as Status[]).filter((s) => s !== q.status).map((s) => (
                    <Button key={s} size="sm" variant={s === 'won' ? 'default' : 'secondary'} onClick={() => update.mutate({ id: q.id, changes: { status: s } })}>
                      {isRTL ? `نقل إلى: ${labels[s]}` : `Mark ${labels[s].toLowerCase()}`}
                    </Button>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
