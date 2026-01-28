-- Add pinyin_clean column to entries_vocabulary
ALTER TABLE public.entries_vocabulary 
ADD COLUMN IF NOT EXISTS pinyin_clean text;

-- Add pinyin_clean column to entries_character
ALTER TABLE public.entries_character 
ADD COLUMN IF NOT EXISTS pinyin_clean text;
