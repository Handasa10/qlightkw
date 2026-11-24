-- Content studio: questions and messages from the Claude session to the owner through the QL Studio bot.
-- A row with options is a choice card (buttons; multi = toggles + "done"); a row without options is a plain message.
-- The owner answers with a button, by replying to the card, or by just typing while a card is open.
CREATE TABLE IF NOT EXISTS public.content_questions (
  id BIGSERIAL PRIMARY KEY,
  item_id UUID REFERENCES public.content_items(id) ON DELETE SET NULL,
  header TEXT,
  question TEXT NOT NULL,
  -- [{"label": "...", "description": "..."}], the recommended option first
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  multi BOOLEAN NOT NULL DEFAULT false,
  recommended INT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'answered', 'cancelled')),
  selected JSONB NOT NULL DEFAULT '[]'::jsonb,
  answer_text TEXT,
  message_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ,
  answered_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS content_questions_status_idx ON public.content_questions (status);
CREATE INDEX IF NOT EXISTS content_questions_message_idx ON public.content_questions (message_id);
ALTER TABLE public.content_questions ENABLE ROW LEVEL SECURITY;
