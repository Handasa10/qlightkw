import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, ExternalLink, Loader2, MessageSquareReply, Trash2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Stars } from '@/components/storefront/ProductReviews';
import { toast } from 'sonner';

type Status = 'pending' | 'approved' | 'rejected';

interface ReviewRow {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  author_name: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
  products: { name_en: string; name_ar: string; slug: string } | null;
}

// Moderate customer product reviews: only approved ones appear on the site and in Google
export default function AdminReviews() {
  const { isRTL } = useLanguage();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<Status>('pending');
  const [replyFor, setReplyFor] = useState<string | null>(null);
  const [reply, setReply] = useState('');

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews', status],
    queryFn: async (): Promise<ReviewRow[]> => {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('id, rating, title, body, author_name, status, admin_reply, created_at, products(name_en, name_ar, slug)')
        .eq('status', status)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as unknown as ReviewRow[]) || [];
    },
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });

  const update = useMutation({
    mutationFn: async ({ id, changes }: { id: string; changes: { status?: Status; admin_reply?: string | null } }) => {
      const { error } = await supabase.from('product_reviews').update(changes).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { refresh(); setReplyFor(null); setReply(''); toast.success(isRTL ? 'تم الحفظ' : 'Saved'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('product_reviews').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { refresh(); toast.success(isRTL ? 'تم الحذف' : 'Deleted'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const labels: Record<Status, string> = isRTL
    ? { pending: 'بانتظار المراجعة', approved: 'منشورة', rejected: 'مرفوضة' }
    : { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{isRTL ? 'تقييمات المنتجات' : 'Product Reviews'}</h1>
        <p className="text-sm text-muted-foreground">
          {isRTL
            ? 'التقييمات من مشترين موثّقين فقط. لا يظهر التقييم في الموقع وفي نتائج جوجل إلا بعد الموافقة.'
            : 'Reviews come from verified buyers only. A review appears on the site and in Google results once approved.'}
        </p>
      </div>

      <Tabs value={status} onValueChange={(v) => setStatus(v as Status)}>
        <TabsList>
          {(['pending', 'approved', 'rejected'] as Status[]).map((s) => (
            <TabsTrigger key={s} value={s}>{labels[s]}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : reviews.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">
          {isRTL ? 'لا توجد تقييمات هنا.' : 'No reviews here.'}
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <Card key={r.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      {r.author_name}
                      <Badge variant="secondary">{labels[r.status as Status]}</Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {r.products && (
                        <Link to={`/product/${r.products.slug}`} target="_blank" className="inline-flex items-center gap-1 hover:text-primary">
                          {isRTL ? r.products.name_ar || r.products.name_en : r.products.name_en}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                      {' · '}{new Date(r.created_at).toLocaleString(isRTL ? 'ar-KW' : 'en-GB')}
                    </CardDescription>
                  </div>
                  <Stars value={r.rating} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {r.title && <p className="font-semibold">{r.title}</p>}
                <p className="whitespace-pre-line text-sm text-muted-foreground">{r.body}</p>
                {r.admin_reply && replyFor !== r.id && (
                  <p className="rounded-lg bg-muted p-3 text-sm"><span className="font-semibold">{isRTL ? 'ردك: ' : 'Your reply: '}</span>{r.admin_reply}</p>
                )}
                {replyFor === r.id && (
                  <div className="space-y-2">
                    <Textarea value={reply} onChange={(e) => setReply(e.target.value)} maxLength={1000} rows={3}
                      placeholder={isRTL ? 'اكتب رداً يظهر تحت التقييم' : 'Write a public reply shown under the review'} />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => update.mutate({ id: r.id, changes: { admin_reply: reply.trim() || null } })}>
                        {isRTL ? 'حفظ الرد' : 'Save reply'}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setReplyFor(null)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  {r.status !== 'approved' && (
                    <Button size="sm" onClick={() => update.mutate({ id: r.id, changes: { status: 'approved' } })} className="gap-1">
                      <Check className="h-4 w-4" />{isRTL ? 'موافقة ونشر' : 'Approve'}
                    </Button>
                  )}
                  {r.status !== 'rejected' && (
                    <Button size="sm" variant="outline" onClick={() => update.mutate({ id: r.id, changes: { status: 'rejected' } })} className="gap-1">
                      <X className="h-4 w-4" />{isRTL ? 'رفض' : 'Reject'}
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => { setReplyFor(r.id); setReply(r.admin_reply || ''); }}>
                    <MessageSquareReply className="h-4 w-4" />{isRTL ? 'رد' : 'Reply'}
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1 text-destructive"
                    onClick={() => { if (confirm(isRTL ? 'حذف هذا التقييم نهائياً؟' : 'Delete this review permanently?')) remove.mutate(r.id); }}>
                    <Trash2 className="h-4 w-4" />{isRTL ? 'حذف' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
