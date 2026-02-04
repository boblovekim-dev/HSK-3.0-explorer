
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Load env vars
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchAll(table: string, columns: string) {
    let allItems: any[] = [];
    let from = 0;
    const limit = 1000;

    while (true) {
        const { data, error } = await supabase
            .from(table)
            .select(columns)
            .order('id', { ascending: true })
            .range(from, from + limit - 1);

        if (error) {
            console.error(`Error fetching ${table}:`, error);
            break;
        }

        if (!data || data.length === 0) break;

        allItems = allItems.concat(data);
        from += limit;
        console.log(`Fetched ${allItems.length} items from ${table}...`);

        if (data.length < limit) break; // End of list
    }
    return allItems;
}

async function deduplicate() {
    console.log("Starting deduplication...");

    // 1. DEDUPLICATE VOCABULARY
    console.log("Fetching vocabulary...");
    const vocab = await fetchAll('entries_vocabulary', 'id, hanzi, level, pinyin, ordinal');

    if (vocab.length > 0) {
        console.log(`Checking ${vocab.length} vocabulary items...`);
        const seen = new Map<string, string>(); // key -> id
        const idsToDelete: string[] = [];

        for (const item of vocab) {
            const key = `${item.hanzi}-${item.level}-${item.ordinal || '0'}`;

            if (seen.has(key)) {
                idsToDelete.push(item.id);
            } else {
                seen.set(key, item.id);
            }
        }

        if (idsToDelete.length > 0) {
            console.log(`Deleting ${idsToDelete.length} duplicate vocabulary entries...`);
            const batchSize = 100;
            for (let i = 0; i < idsToDelete.length; i += batchSize) {
                const batch = idsToDelete.slice(i, i + batchSize);
                const { error: delError } = await supabase
                    .from('entries_vocabulary')
                    .delete()
                    .in('id', batch);

                if (delError) console.error("Error deleting batch:", delError);
                else console.log(`Deleted batch ${i / batchSize + 1}`);
            }
        } else {
            console.log("No duplicate vocabulary found.");
        }
    }

    // 2. DEDUPLICATE CHARACTERS
    console.log("Fetching characters...");
    const chars = await fetchAll('entries_character', 'id, char, level, type, ordinal');

    if (chars.length > 0) {
        console.log(`Checking ${chars.length} character items...`);
        const seen = new Map<string, string>();
        const idsToDelete: string[] = [];

        for (const item of chars) {
            const key = `${item.char}-${item.level}-${item.type}`;

            if (seen.has(key)) {
                idsToDelete.push(item.id);
            } else {
                seen.set(key, item.id);
            }
        }

        if (idsToDelete.length > 0) {
            console.log(`Deleting ${idsToDelete.length} duplicate character entries...`);
            const batchSize = 100;
            for (let i = 0; i < idsToDelete.length; i += batchSize) {
                const batch = idsToDelete.slice(i, i + batchSize);
                const { error: delError } = await supabase
                    .from('entries_character')
                    .delete()
                    .in('id', batch);

                if (delError) console.error("Error deleting batch:", delError);
                else console.log(`Deleted char batch ${i / batchSize + 1}`);
            }
        } else {
            console.log("No duplicate characters found.");
        }
    }

    // 3. DEDUPLICATE GRAMMAR
    console.log("Fetching grammar...");
    const grams = await fetchAll('entries_grammar', 'id, name, level, pattern');

    if (grams.length > 0) {
        console.log(`Checking ${grams.length} grammar items...`);
        const seen = new Map<string, string>();
        const idsToDelete: string[] = [];

        for (const item of grams) {
            const key = `${item.name}-${item.level}`;

            if (seen.has(key)) {
                idsToDelete.push(item.id);
            } else {
                seen.set(key, item.id);
            }
        }

        if (idsToDelete.length > 0) {
            console.log(`Deleting ${idsToDelete.length} duplicate grammar entries...`);
            const batchSize = 100;
            for (let i = 0; i < idsToDelete.length; i += batchSize) {
                const batch = idsToDelete.slice(i, i + batchSize);
                const { error: delError } = await supabase
                    .from('entries_grammar')
                    .delete()
                    .in('id', batch);

                if (delError) console.error("Error deleting batch:", delError);
            }
        } else {
            console.log("No duplicate grammar found.");
        }
    }

    console.log("Deduplication complete.");
}

deduplicate();
