
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function testFetch(level: string) {
    console.log(`Testing fetch for Level ${level}...`);

    let query = supabase.from('entries_vocabulary').select('*');

    // query = query.or(`level.eq.${level},level.ilike.${level}(%),level.ilike.${level}（%）`);

    // Try variation 1: Only full width (known to match '半')
    // query = query.or(`level.eq.${level},level.ilike.${level}（%）`);

    // Try variation 2: Escaped ascii parens?
    // query = query.or(`level.eq.${level},level.ilike.${level}\\(%)`);

    // Variation 3: Just simple ilike to test wildcard without parens? No, need parens.
    // Try standard filter chaining? No, OR requires string.

    // Let's print what we are sending
    const orString = `level.eq.${level},level.ilike.${level}（%）`;
    console.log("Testing OR string:", orString);
    query = query.or(orString);

    const { data, error } = await query.order('ordinal', { ascending: true });

    if (error) {
        console.error("Supabase Error:", error);
        return;
    }

    if (!data) {
        console.log("No data returned.");
        return;
    }

    console.log(`Raw items fetched: ${data.length}`);

    // Check for '半' in raw data
    const rawBan = data.find(i => i.hanzi === '半');
    console.log("Found '半' in raw data:", JSON.stringify(rawBan, null, 2));

    // Simulate Deduplication Logic from contentService.ts
    const seen = new Set<string>();
    const items = data.filter(item => {
        let key = '';
        // Vocab key
        key = `v-${item.hanzi}-${item.level}-${item.ordinal}`;

        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    console.log(`Items after dedupe: ${items.length}`);
    const dedupedBan = items.find(i => i.hanzi === '半');
    console.log("Found '半' after dedupe:", !!dedupedBan);

    // Check missing sequence
    const indices = items.map(i => i.ordinal);
    console.log("First 10 indices:", indices.slice(0, 10));
}

testFetch('1');
