
-- 4. entries_task table
CREATE TABLE IF NOT EXISTS entries_task (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    can_do JSONB DEFAULT '[]'::jsonb, -- Array of strings
    source TEXT DEFAULT 'official',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. entries_topic table
CREATE TABLE IF NOT EXISTS entries_topic (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT NOT NULL,
    primary_topic TEXT NOT NULL,
    secondary_topic TEXT,
    tertiary_items JSONB DEFAULT '[]'::jsonb, -- Array of strings
    source TEXT DEFAULT 'official',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE entries_task ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries_topic ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read access for tasks" ON entries_task FOR SELECT USING (true);
CREATE POLICY "Public read access for topics" ON entries_topic FOR SELECT USING (true);
