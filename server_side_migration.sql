-- 1. Enable unaccent extension for removing accents (optional, but good for general text)
-- We will write a custom function to be more precise with Pinyin rules (like ü -> v)

-- 2. Add columns if they don't exist
ALTER TABLE public.entries_vocabulary ADD COLUMN IF NOT EXISTS pinyin_clean text;
ALTER TABLE public.entries_character ADD COLUMN IF NOT EXISTS pinyin_clean text;

-- 3. Create a function to clean Pinyin (Server-side logic)
CREATE OR REPLACE FUNCTION clean_pinyin_text(input_text text) 
RETURNS text AS $$
DECLARE
    cleaned_text text;
BEGIN
    IF input_text IS NULL THEN
        RETURN NULL;
    END IF;

    -- Normalize unicode to separate combos
    -- Note: PostgreSQL normalization functions might differ, but we can do string replacements.
    -- Simple replacements for vowels with tones to plain vowels
    cleaned_text := input_text;
    
    -- a
    cleaned_text := regexp_replace(cleaned_text, '[āáǎà]', 'a', 'g');
    -- e
    cleaned_text := regexp_replace(cleaned_text, '[ēéěè]', 'e', 'g');
    -- i
    cleaned_text := regexp_replace(cleaned_text, '[īíǐì]', 'i', 'g');
    -- o
    cleaned_text := regexp_replace(cleaned_text, '[ōóǒò]', 'o', 'g');
    -- u
    cleaned_text := regexp_replace(cleaned_text, '[ūúǔù]', 'u', 'g');
    -- ü (v) - Handle ü cases specifically
    cleaned_text := regexp_replace(cleaned_text, '[üǖǘǚǜ]', 'v', 'g');
    
    -- Remove non-alphanumeric chars (keep numbers if pinyin has them, usually not)
    -- Remove spaces
    cleaned_text := regexp_replace(cleaned_text, '[^a-zA-Z0-9]', '', 'g');
    
    -- Lowercase
    cleaned_text := lower(cleaned_text);
    
    RETURN cleaned_text;
END;
$$ LANGUAGE plpgsql;

-- 4. Update the tables using the function (for existing data)
UPDATE public.entries_vocabulary SET pinyin_clean = clean_pinyin_text(pinyin);
UPDATE public.entries_character SET pinyin_clean = clean_pinyin_text(pinyin);

-- 5. Create Trigger Function to auto-update on future inserts/changes
CREATE OR REPLACE FUNCTION trigger_clean_pinyin() RETURNS TRIGGER AS $$
BEGIN
    NEW.pinyin_clean := clean_pinyin_text(NEW.pinyin);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Apply Triggers to Tables
DROP TRIGGER IF EXISTS update_vocab_pinyin_clean ON public.entries_vocabulary;
CREATE TRIGGER update_vocab_pinyin_clean
    BEFORE INSERT OR UPDATE OF pinyin ON public.entries_vocabulary
    FOR EACH ROW
    EXECUTE FUNCTION trigger_clean_pinyin();

DROP TRIGGER IF EXISTS update_char_pinyin_clean ON public.entries_character;
CREATE TRIGGER update_char_pinyin_clean
    BEFORE INSERT OR UPDATE OF pinyin ON public.entries_character
    FOR EACH ROW
    EXECUTE FUNCTION trigger_clean_pinyin();

