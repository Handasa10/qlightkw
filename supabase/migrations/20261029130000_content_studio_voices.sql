-- Content studio: voice-overs generated with Gemini TTS (the AI Studio voices) and approved in the QL Studio bot.
CREATE TABLE IF NOT EXISTS public.content_voices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES public.content_items(id) ON DELETE SET NULL,
  title TEXT,
  script TEXT NOT NULL,
  voice_description TEXT,
  voice TEXT NOT NULL DEFAULT 'Achird',
  -- generating -> ready (sent to the owner) -> approved | rejected; regenerating while a new take is made
  status TEXT NOT NULL DEFAULT 'generating' CHECK (status IN ('generating', 'ready', 'regenerating', 'approved', 'rejected', 'failed')),
  take INT NOT NULL DEFAULT 1,
  model TEXT,
  url TEXT,
  duration_sec NUMERIC,
  message_id BIGINT,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.content_voices ENABLE ROW LEVEL SECURITY;
