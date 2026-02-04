-- Up Migration: Add translation columns to entries_grammar
-- Use this query in the Supabase SQL Editor to add the required columns without affecting existing data.

ALTER TABLE public.entries_grammar
ADD COLUMN IF NOT EXISTS category_en text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS category_vi text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS sub_category_en text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS sub_category_vi text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS name_en text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS name_vi text DEFAULT NULL;

-- Optional: Comments for documentation
COMMENT ON COLUMN public.entries_grammar.category_en IS 'English translation of the main category';
COMMENT ON COLUMN public.entries_grammar.category_vi IS 'Vietnamese translation of the main category';
COMMENT ON COLUMN public.entries_grammar.sub_category_en IS 'English translation of the sub-category';
COMMENT ON COLUMN public.entries_grammar.sub_category_vi IS 'Vietnamese translation of the sub-category';
COMMENT ON COLUMN public.entries_grammar.name_en IS 'English translation of the grammar point name';
COMMENT ON COLUMN public.entries_grammar.name_vi IS 'Vietnamese translation of the grammar point name';
