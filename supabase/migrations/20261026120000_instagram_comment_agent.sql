-- =============================================
-- INSTAGRAM COMMENT AGENT
-- Replies to comments on the QUALITY LIGHT Instagram page as a lighting specialist.
-- Independent of the storefront: own tables, own edge function (instagram-agent).
-- =============================================

-- Agent settings (single row, id = 1)
CREATE TABLE public.ig_agent_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  enabled BOOLEAN NOT NULL DEFAULT false,
  -- hybrid: auto-post safe replies, hold sensitive ones for review
  -- approve_all: every reply waits for admin approval
  -- auto: post every reply the agent decides to send (sensitive ones still held)
  mode TEXT NOT NULL DEFAULT 'hybrid' CHECK (mode IN ('hybrid', 'approve_all', 'auto')),
  knowledge TEXT NOT NULL DEFAULT '',
  extra_rules TEXT NOT NULL DEFAULT '',
  -- only comments newer than this are handled (set when the agent is switched on)
  active_since TIMESTAMPTZ,
  ig_user_id TEXT,
  ig_app_user_id TEXT,
  ig_username TEXT,
  token_refreshed_at TIMESTAMPTZ,
  last_poll_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.ig_agent_settings (id) VALUES (1);

-- Instagram access token lives apart from settings: no RLS policies => service role only
CREATE TABLE public.ig_agent_secrets (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  access_token TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.ig_agent_secrets (id) VALUES (1);

-- Every comment the agent has seen, with its decision and reply
CREATE TABLE public.ig_comments (
  comment_id TEXT PRIMARY KEY,
  media_id TEXT,
  media_caption TEXT,
  media_permalink TEXT,
  media_type TEXT,
  parent_id TEXT,
  parent_text TEXT,
  from_id TEXT,
  username TEXT,
  text TEXT,
  commented_at TIMESTAMPTZ,
  source TEXT NOT NULL DEFAULT 'webhook' CHECK (source IN ('webhook', 'poll')),
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'processing', 'replied', 'pending_review', 'ignored', 'failed')),
  category TEXT,
  reason TEXT,
  draft_reply TEXT,
  final_reply TEXT,
  reply_comment_id TEXT,
  error TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ig_comments_status ON public.ig_comments (status, created_at DESC);
CREATE INDEX idx_ig_comments_media ON public.ig_comments (media_id);

ALTER TABLE public.ig_agent_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ig_agent_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ig_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view agent settings" ON public.ig_agent_settings
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update agent settings" ON public.ig_agent_settings
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view instagram comments" ON public.ig_comments
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update instagram comments" ON public.ig_comments
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete instagram comments" ON public.ig_comments
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Poll recent posts every 2 minutes. This is the main path when no webhook is configured
-- (no Meta webhook setup needed); with a webhook it is a safety net for missed events.
SELECT cron.schedule(
  'instagram-agent-poll',
  '*/2 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://yubebbfsmlopmnluajgf.supabase.co/functions/v1/instagram-agent',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YmViYmZzbWxvcG1ubHVhamdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MjQxNDUsImV4cCI6MjA4NTIwMDE0NX0.625SioK5zQ0n5LtS7JCWarCaUdOw8-VltlHQRhZfs1o"}'::jsonb,
    body := '{"action": "poll"}'::jsonb
  ) AS request_id;
  $$
);
