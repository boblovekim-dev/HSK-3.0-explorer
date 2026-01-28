-- Allow public update/insert access for migration purposes
-- You can remove these policies after the data migration is complete if you want strict security.

-- Vocabulary Table
CREATE POLICY "Allow public update access" ON public.entries_vocabulary FOR UPDATE USING (true);
CREATE POLICY "Allow public insert access" ON public.entries_vocabulary FOR INSERT WITH CHECK (true);

-- Character Table
CREATE POLICY "Allow public update access" ON public.entries_character FOR UPDATE USING (true);
CREATE POLICY "Allow public insert access" ON public.entries_character FOR INSERT WITH CHECK (true);
