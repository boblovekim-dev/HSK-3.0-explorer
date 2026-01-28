-- Add translation columns to entries_task
ALTER TABLE entries_task
ADD COLUMN IF NOT EXISTS category_vi TEXT,
ADD COLUMN IF NOT EXISTS category_en TEXT,
ADD COLUMN IF NOT EXISTS description_vi TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS can_do_vi JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS can_do_en JSONB DEFAULT '[]'::jsonb;

-- Add translation columns to entries_topic
ALTER TABLE entries_topic
ADD COLUMN IF NOT EXISTS primary_topic_vi TEXT,
ADD COLUMN IF NOT EXISTS primary_topic_en TEXT,
ADD COLUMN IF NOT EXISTS secondary_topic_vi TEXT,
ADD COLUMN IF NOT EXISTS secondary_topic_en TEXT,
ADD COLUMN IF NOT EXISTS tertiary_items_vi JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS tertiary_items_en JSONB DEFAULT '[]'::jsonb;

-- Comment on columns for clarity
COMMENT ON COLUMN entries_task.category_vi IS 'Vietnamese translation of category';
COMMENT ON COLUMN entries_task.category_en IS 'English translation of category';
COMMENT ON COLUMN entries_topic.primary_topic_vi IS 'Vietnamese translation of primary_topic';
COMMENT ON COLUMN entries_topic.primary_topic_en IS 'English translation of primary_topic';
