-- Question cards can carry a picture (sent as a Telegram photo with the question as caption)
alter table public.content_questions add column if not exists image_url text;
