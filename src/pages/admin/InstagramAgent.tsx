import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Instagram, Loader2, Send, RefreshCw, EyeOff, ExternalLink, FlaskConical, Inbox, Copy } from 'lucide-react';

// ig_* tables are not in the generated types yet
const db = supabase as unknown as SupabaseClient;

interface IgComment {
  comment_id: string;
  media_caption: string | null;
  media_permalink: string | null;
  parent_text: string | null;
  username: string | null;
  text: string | null;
  commented_at: string | null;
  status: 'new' | 'queued' | 'processing' | 'replied' | 'pending_review' | 'ignored' | 'failed';
  category: string | null;
  reason: string | null;
  draft_reply: string | null;
  final_reply: string | null;
  error: string | null;
}

interface AgentSettings {
  enabled: boolean;
  mode: 'hybrid' | 'approve_all' | 'auto';
  knowledge: string;
  extra_rules: string;
  ig_username: string | null;
  last_poll_at: string | null;
}

interface AgentStatus {
  settings: AgentSettings;
  connected: boolean;
  default_knowledge: string;
}

const STATUS_VARIANT: Record<IgComment['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  new: 'outline',
  queued: 'outline',
  processing: 'outline',
  replied: 'default',
  pending_review: 'secondary',
  ignored: 'outline',
  failed: 'destructive',
};

const WEBHOOK_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/instagram-agent`;

async function callAgent<T = unknown>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('instagram-agent', { body });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data as T;
}

function CommentCard({ c }: { c: IgComment }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [reply, setReply] = useState(c.final_reply ?? c.draft_reply ?? '');
  useEffect(() => setReply(c.final_reply ?? c.draft_reply ?? ''), [c.final_reply, c.draft_reply]);

  const act = useMutation({
    mutationFn: (action: 'approve' | 'ignore' | 'regenerate') => callAgent({ action, comment_id: c.comment_id, reply }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ig-comments'] }),
    onError: (e: Error) => toast({ title: t('admin.igAgent.actionFailed', 'Action failed'), description: e.message, variant: 'destructive' }),
  });
  const editable = c.status !== 'replied';

  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">@{c.username ?? '—'}</span>
          <Badge variant={STATUS_VARIANT[c.status]}>{t(`admin.igAgent.status.${c.status}`, c.status)}</Badge>
          {c.category && <Badge variant="outline">{t(`admin.igAgent.category.${c.category}`, c.category)}</Badge>}
          <span className="ms-auto text-xs text-muted-foreground">{c.commented_at && new Date(c.commented_at).toLocaleString()}</span>
        </div>
        {c.parent_text && <p className="border-s-2 ps-3 text-sm text-muted-foreground">{c.parent_text}</p>}
        <p className="text-base">{c.text}</p>
        {c.media_caption && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {t('admin.igAgent.onPost', 'On post')}: {c.media_caption}
            {c.media_permalink && (
              <a href={c.media_permalink} target="_blank" rel="noreferrer" className="ms-1 inline-flex items-center text-primary">
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </p>
        )}
        {c.reason && <p className="text-xs text-muted-foreground">{t('admin.igAgent.reason', 'Agent note')}: {c.reason}</p>}
        {c.error && <p className="text-xs text-destructive">{c.error}</p>}
        {editable ? (
          <Textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={3} dir="auto" />
        ) : (
          <p className="rounded-md bg-muted p-3 text-sm" dir="auto">↳ {c.final_reply}</p>
        )}
        {editable && (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" disabled={act.isPending || !reply.trim()} onClick={() => act.mutate('approve')}>
              {act.isPending ? <Loader2 className="me-1 h-4 w-4 animate-spin" /> : <Send className="me-1 h-4 w-4" />}
              {t('admin.igAgent.approve', 'Post reply')}
            </Button>
            <Button size="sm" variant="outline" disabled={act.isPending} onClick={() => act.mutate('regenerate')}>
              <RefreshCw className="me-1 h-4 w-4" />
              {t('admin.igAgent.regenerate', 'Regenerate')}
            </Button>
            {c.status !== 'ignored' && (
              <Button size="sm" variant="ghost" disabled={act.isPending} onClick={() => act.mutate('ignore')}>
                <EyeOff className="me-1 h-4 w-4" />
                {t('admin.igAgent.ignore', 'Ignore')}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CommentsTab() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>('pending_review');
  const { data: comments, isLoading } = useQuery({
    queryKey: ['ig-comments', filter],
    queryFn: async (): Promise<IgComment[]> => {
      let q = db.from('ig_comments').select('*').order('created_at', { ascending: false }).limit(100);
      if (filter !== 'all') q = q.eq('status', filter);
      const { data, error } = await q;
      if (error) throw error;
      return data as IgComment[];
    },
    refetchInterval: 30000,
  });

  return (
    <div className="space-y-4">
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
        <SelectContent>
          {['pending_review', 'replied', 'queued', 'failed', 'ignored', 'all'].map((s) => (
            <SelectItem key={s} value={s}>{t(`admin.igAgent.status.${s}`, s)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isLoading ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : !comments?.length ? (
        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
          <Inbox className="h-10 w-10" />
          {t('admin.igAgent.empty', 'No comments here')}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">{comments.map((c) => <CommentCard key={c.comment_id} c={c} />)}</div>
      )}
    </div>
  );
}

function TestTab() {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [caption, setCaption] = useState('');
  const test = useMutation({
    mutationFn: () => callAgent<{ decision: { category: string; action: string; reply: string; reason: string }; route: string }>({ action: 'test', text, caption }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.igAgent.testTitle', 'Try the agent')}</CardTitle>
        <CardDescription>{t('admin.igAgent.testDesc', 'Write a comment as a customer would. Nothing is posted to Instagram.')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea placeholder={t('admin.igAgent.testComment', 'Comment, e.g. كم سبوت أحتاج لصالة 5×6؟')} value={text} onChange={(e) => setText(e.target.value)} rows={2} dir="auto" />
        <Input placeholder={t('admin.igAgent.testCaption', 'Post caption (optional)')} value={caption} onChange={(e) => setCaption(e.target.value)} dir="auto" />
        <Button disabled={!text.trim() || test.isPending} onClick={() => test.mutate()}>
          {test.isPending ? <Loader2 className="me-1 h-4 w-4 animate-spin" /> : <FlaskConical className="me-1 h-4 w-4" />}
          {t('admin.igAgent.testRun', 'Generate reply')}
        </Button>
        {test.error && <p className="text-sm text-destructive">{(test.error as Error).message}</p>}
        {test.data && (
          <div className="space-y-2 rounded-md bg-muted p-4 text-sm">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{t(`admin.igAgent.category.${test.data.decision.category}`, test.data.decision.category)}</Badge>
              <Badge>{t(`admin.igAgent.route.${test.data.route}`, test.data.route)}</Badge>
            </div>
            <p className="text-base" dir="auto">{test.data.decision.reply || '—'}</p>
            <p className="text-xs text-muted-foreground">{test.data.decision.reason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SettingsTab({ status }: { status: AgentStatus }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(status.settings);
  const [token, setToken] = useState('');
  useEffect(() => setForm(status.settings), [status.settings]);

  const done = (title: string) => {
    toast({ title });
    queryClient.invalidateQueries({ queryKey: ['ig-agent-status'] });
  };
  const fail = (e: Error) => toast({ title: t('admin.igAgent.actionFailed', 'Action failed'), description: e.message, variant: 'destructive' });

  const save = useMutation({
    mutationFn: () => callAgent({ action: 'save_settings', enabled: form.enabled, mode: form.mode, knowledge: form.knowledge, extra_rules: form.extra_rules }),
    onSuccess: () => done(t('admin.igAgent.saved', 'Settings saved')),
    onError: fail,
  });
  const connect = useMutation({
    mutationFn: () => callAgent<{ username: string }>({ action: 'save_token', token }),
    onSuccess: (r) => { setToken(''); done(`${t('admin.igAgent.connectedAs', 'Connected as')} @${r.username}`); },
    onError: fail,
  });
  const poll = useMutation({
    mutationFn: () => callAgent<{ scanned?: number; handled?: number; skipped?: string }>({ action: 'poll_now' }),
    onSuccess: (r) => {
      queryClient.invalidateQueries({ queryKey: ['ig-comments'] });
      toast({ title: r.skipped ?? `${t('admin.igAgent.scanned', 'Scanned')} ${r.scanned} · ${t('admin.igAgent.handled', 'new')} ${r.handled}` });
    },
    onError: fail,
  });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.igAgent.behaviour', 'Behaviour')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="ig-enabled">{t('admin.igAgent.enabled', 'Agent is on')}</Label>
            <Switch id="ig-enabled" checked={form.enabled} onCheckedChange={(v) => setForm({ ...form, enabled: v })} />
          </div>
          <p className="text-xs text-muted-foreground">{t('admin.igAgent.enabledHint', 'Only comments written after switching on are answered.')}</p>
          <div className="space-y-2">
            <Label>{t('admin.igAgent.mode', 'Reply mode')}</Label>
            <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v as AgentSettings['mode'] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hybrid">{t('admin.igAgent.modeHybrid', 'Hybrid: auto-reply safe comments, hold sensitive ones')}</SelectItem>
                <SelectItem value="approve_all">{t('admin.igAgent.modeApprove', 'Approve all: every reply waits for me')}</SelectItem>
                <SelectItem value="auto">{t('admin.igAgent.modeAuto', 'Automatic: reply to everything except complaints')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('admin.igAgent.extraRules', 'Extra rules (offers, notes for this week...)')}</Label>
            <Textarea rows={3} value={form.extra_rules} onChange={(e) => setForm({ ...form, extra_rules: e.target.value })} dir="auto" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t('admin.igAgent.knowledge', 'Knowledge base')}</Label>
              <Button size="sm" variant="ghost" onClick={() => setForm({ ...form, knowledge: status.default_knowledge })}>
                {t('admin.igAgent.loadDefault', 'Load default')}
              </Button>
            </div>
            <Textarea rows={14} className="font-mono text-xs" placeholder={status.default_knowledge} value={form.knowledge} onChange={(e) => setForm({ ...form, knowledge: e.target.value })} dir="auto" />
            <p className="text-xs text-muted-foreground">{t('admin.igAgent.knowledgeHint', 'Empty = the built-in QUALITY LIGHT knowledge is used.')}</p>
          </div>
          <Button disabled={save.isPending} onClick={() => save.mutate()}>
            {save.isPending && <Loader2 className="me-1 h-4 w-4 animate-spin" />}
            {t('admin.igAgent.save', 'Save')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.igAgent.connection', 'Instagram connection')}</CardTitle>
          <CardDescription>
            {status.connected && status.settings.ig_username
              ? `${t('admin.igAgent.connectedAs', 'Connected as')} @${status.settings.ig_username}`
              : t('admin.igAgent.notConnected', 'Not connected yet')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t('admin.igAgent.token', 'Instagram access token')}</Label>
            <div className="flex gap-2">
              <Input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="IGAA..." />
              <Button disabled={!token.trim() || connect.isPending} onClick={() => connect.mutate()}>
                {connect.isPending && <Loader2 className="me-1 h-4 w-4 animate-spin" />}
                {t('admin.igAgent.connect', 'Connect')}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{t('admin.igAgent.tokenHint', 'The token is stored server-side and refreshed automatically every week.')}</p>
          </div>
          <div className="space-y-2">
            <Label>{t('admin.igAgent.webhookUrl', 'Webhook callback URL (for Meta)')}</Label>
            <div className="flex gap-2">
              <Input readOnly value={WEBHOOK_URL} dir="ltr" />
              <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(WEBHOOK_URL)}><Copy className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" disabled={!status.connected || poll.isPending} onClick={() => poll.mutate()}>
              {poll.isPending ? <Loader2 className="me-1 h-4 w-4 animate-spin" /> : <RefreshCw className="me-1 h-4 w-4" />}
              {t('admin.igAgent.pollNow', 'Check for new comments now')}
            </Button>
            {status.settings.last_poll_at && (
              <span className="text-xs text-muted-foreground">{t('admin.igAgent.lastCheck', 'Last check')}: {new Date(status.settings.last_poll_at).toLocaleTimeString()}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function InstagramAgentPage() {
  const { t } = useTranslation();
  const { data: status, isLoading, error } = useQuery({
    queryKey: ['ig-agent-status'],
    queryFn: () => callAgent<AgentStatus>({ action: 'status' }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Instagram className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">{t('admin.igAgent.title', 'Instagram Agent')}</h1>
          <p className="text-sm text-muted-foreground">{t('admin.igAgent.subtitle', 'Replies to comments on @quality_light1 as a lighting specialist')}</p>
        </div>
        {status && (
          <div className="ms-auto flex gap-2">
            <Badge variant={status.settings.enabled ? 'default' : 'outline'}>
              {status.settings.enabled ? t('admin.igAgent.on', 'On') : t('admin.igAgent.off', 'Off')}
            </Badge>
            <Badge variant={status.connected ? 'secondary' : 'destructive'}>
              {status.connected ? `@${status.settings.ig_username ?? 'instagram'}` : t('admin.igAgent.notConnected', 'Not connected yet')}
            </Badge>
          </div>
        )}
      </div>

      {isLoading ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : error || !status ? (
        <p className="text-destructive">{(error as Error)?.message}</p>
      ) : (
        <Tabs defaultValue="comments">
          <TabsList>
            <TabsTrigger value="comments">{t('admin.igAgent.tabComments', 'Comments')}</TabsTrigger>
            <TabsTrigger value="test">{t('admin.igAgent.tabTest', 'Test')}</TabsTrigger>
            <TabsTrigger value="settings">{t('admin.igAgent.tabSettings', 'Settings')}</TabsTrigger>
          </TabsList>
          <TabsContent value="comments"><CommentsTab /></TabsContent>
          <TabsContent value="test"><TestTab /></TabsContent>
          <TabsContent value="settings"><SettingsTab status={status} /></TabsContent>
        </Tabs>
      )}
    </div>
  );
}
