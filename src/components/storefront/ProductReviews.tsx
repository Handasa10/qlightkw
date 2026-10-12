import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BadgeCheck, Loader2, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface ApprovedReview {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  author_name: string;
  admin_reply: string | null;
  created_at: string;
}

// Approved reviews for a product; also used by the product page for the Google rating data
export function useProductReviews(productId: string | undefined) {
  return useQuery({
    queryKey: ['product-reviews', productId],
    enabled: !!productId,
    queryFn: async (): Promise<ApprovedReview[]> => {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('id, rating, title, body, author_name, admin_reply, created_at')
        .eq('product_id', productId!)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export const Stars = ({ value, size = 'h-4 w-4', onChange }: { value: number; size?: string; onChange?: (v: number) => void }) => (
  <div className="flex items-center gap-0.5" dir="ltr">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        disabled={!onChange}
        onClick={() => onChange?.(n)}
        className={cn(onChange ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default')}
        aria-label={`${n} star${n > 1 ? 's' : ''}`}
      >
        <Star className={cn(size, n <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30')} />
      </button>
    ))}
  </div>
);

const ProductReviews = ({ productId }: { productId: string }) => {
  const { user } = useAuth();
  const { isRTL, language } = useLanguage();
  const queryClient = useQueryClient();
  const { data: reviews = [], isLoading } = useProductReviews(productId);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Only verified buyers who haven't reviewed yet may write a review
  const { data: canReview } = useQuery({
    queryKey: ['can-review', productId, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.rpc('can_review_product', { _product_id: productId });
      return !!data;
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('product_reviews').insert({
        product_id: productId,
        user_id: user!.id,
        rating,
        title: title.trim() || null,
        body: body.trim(),
        author_name: (name.trim() || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Customer').slice(0, 80),
        language,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['can-review', productId] });
      toast.success(isRTL ? 'شكراً! سيظهر تقييمك بعد المراجعة.' : 'Thank you! Your review will appear after approval.');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const count = reviews.length;
  const average = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  const distribution = [5, 4, 3, 2, 1].map((n) => ({ n, count: reviews.filter((r) => r.rating === n).length }));

  return (
    <div className="mx-auto max-w-3xl space-y-8 text-start">
      {/* Summary */}
      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center">
        <div className="text-center sm:w-40">
          <div className="text-5xl font-extrabold text-foreground">{count ? average.toFixed(1) : '–'}</div>
          <div className="mt-2 flex justify-center"><Stars value={average} /></div>
          <div className="mt-1 text-xs text-muted-foreground">
            {isRTL ? `${count} تقييم` : `${count} review${count === 1 ? '' : 's'}`}
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          {distribution.map(({ n, count: c }) => (
            <div key={n} className="flex items-center gap-2 text-xs" dir="ltr">
              <span className="w-3 text-muted-foreground">{n}</span>
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-amber-400" style={{ width: count ? `${(c / count) * 100}%` : '0%' }} />
              </div>
              <span className="w-6 text-end text-muted-foreground">{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write a review */}
      {!user ? (
        <p className="text-center text-sm text-muted-foreground">
          {isRTL ? 'هل اشتريت هذا المنتج؟ ' : 'Bought this product? '}
          <Link to="/auth" className="font-semibold text-primary hover:underline">{isRTL ? 'سجّل الدخول لكتابة تقييم' : 'Sign in to write a review'}</Link>
        </p>
      ) : submitted ? (
        <p className="rounded-xl bg-primary/10 p-4 text-center text-sm text-primary">
          {isRTL ? 'شكراً! سيظهر تقييمك بعد مراجعته.' : 'Thank you! Your review will appear once it has been approved.'}
        </p>
      ) : canReview ? (
        <form
          onSubmit={(e) => { e.preventDefault(); submit.mutate(); }}
          className="space-y-4 rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="font-bold text-foreground">{isRTL ? 'اكتب تقييمك' : 'Write a review'}</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{isRTL ? 'تقييمك:' : 'Your rating:'}</span>
            <Stars value={rating} size="h-6 w-6" onChange={setRating} />
          </div>
          <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder={isRTL ? 'الاسم الظاهر (اختياري)' : 'Display name (optional)'} />
          <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder={isRTL ? 'عنوان التقييم (اختياري)' : 'Review title (optional)'} />
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            minLength={10}
            maxLength={2000}
            required
            rows={4}
            placeholder={isRTL ? 'شاركنا تجربتك مع المنتج (10 أحرف على الأقل)' : 'Tell others about your experience (at least 10 characters)'}
          />
          <Button type="submit" disabled={submit.isPending || body.trim().length < 10} className="rounded-full">
            {submit.isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            {isRTL ? 'إرسال التقييم' : 'Submit review'}
          </Button>
        </form>
      ) : null}

      {/* Reviews */}
      {isLoading ? (
        <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : count === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          {isRTL ? 'لا توجد تقييمات لهذا المنتج بعد.' : 'No reviews yet.'}
        </p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{r.author_name}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                    <BadgeCheck className="h-3 w-3" />
                    {isRTL ? 'مشتري موثّق' : 'Verified buyer'}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString(isRTL ? 'ar-KW' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="mt-2"><Stars value={r.rating} /></div>
              {r.title && <h4 className="mt-2 font-semibold text-foreground">{r.title}</h4>}
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              {r.admin_reply && (
                <div className="mt-3 rounded-xl border-s-4 border-primary bg-primary/5 p-3 text-sm">
                  <span className="font-semibold text-primary">{isRTL ? 'رد كواليتي لايت: ' : 'Quality Light replied: '}</span>
                  <span className="text-muted-foreground">{r.admin_reply}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductReviews;
