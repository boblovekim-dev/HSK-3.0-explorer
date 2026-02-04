
-- =========================================================================================
-- INSTRUCTIONS FOR DEDUPLICATING HSK DATA
-- =========================================================================================
-- Since the application's API key does not have permission to DELETE data (for security),
-- you must run this script manually in your Supabase project's SQL Editor.
--
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/_
-- 2. Navigate to the "SQL Editor" section on the left sidebar.
-- 3. Click "New Query".
-- 4. Copy and paste the entire SQL block below into the editor.
-- 5. Click "Run" (or Ctrl+Enter).
--
-- This script safely removes duplicate entries based on unique constraint fields
-- (e.g., hanzi + level for vocabulary), keeping only the first instance.
-- =========================================================================================

-- 1. Deduplicate Vocabulary
-- Keeps the entry with the lowest ID (earliest insert)
DELETE FROM entries_vocabulary
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY hanzi, level, ordinal -- Unique key
             ORDER BY id ASC
           ) as row_num
    FROM entries_vocabulary
  ) t
  WHERE t.row_num > 1
);

-- 2. Deduplicate Characters
DELETE FROM entries_character
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY char, level, type -- Unique key
             ORDER BY id ASC
           ) as row_num
    FROM entries_character
  ) t
  WHERE t.row_num > 1
);

-- 3. Deduplicate Grammar
DELETE FROM entries_grammar
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY name, level, pattern -- Unique key
             ORDER BY id ASC
           ) as row_num
    FROM entries_grammar
  ) t
  WHERE t.row_num > 1
);
