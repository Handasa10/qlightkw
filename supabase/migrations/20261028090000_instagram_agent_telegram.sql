-- Instagram agent: Telegram bot for following replies and answering comments that need the owner
ALTER TABLE public.ig_agent_settings
  ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT,
  ADD COLUMN IF NOT EXISTS telegram_webhook_url TEXT;

-- which Instagram comment each bot message is about (replying to the message answers that comment)
CREATE TABLE IF NOT EXISTS public.ig_tg_messages (
  message_id BIGINT PRIMARY KEY,
  comment_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ig_tg_messages ENABLE ROW LEVEL SECURITY;
