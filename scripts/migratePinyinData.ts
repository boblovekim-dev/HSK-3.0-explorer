
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
// Note: You really need SERVICE_ROLE_KEY to bypass RLS policies if they restrict updates
// But assuming Anon key has write access or we use Service key if available
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase credentials.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Pinyin normalization helper
function removeTones(pinyin: string): string {
    if (!pinyin) return '';
    return pinyin
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/ü/g, "v") // Determine if we want 'v' or 'u'. 'v' is common for typing.
        .replace(/\s+/g, ""); // Remove spaces? "ni hao" -> "nihao" usually better for search
}

// Version keeping spaces (optional, maybe search both?)
// Let's create a versions that removes spaces AND tones for maximum matchability: "nǐ hǎo" -> "nihao"
function normalizePinyin(pinyin: string): string {
    if (!pinyin) return '';

    // 1. Decompose unicode characters (e.g. ǎ -> a + caron)
    // 2. Remove diacritical marks
    let clean = pinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 3. Handle special cases manually if NFD doesn't catch all (like ü)
    // Common tones map:
    const toneMap: Record<string, string> = {
        "ā": "a", "á": "a", "ǎ": "a", "à": "a",
        "ē": "e", "é": "e", "ě": "e", "è": "e",
        "ī": "i", "í": "i", "ǐ": "i", "ì": "i",
        "ō": "o", "ó": "o", "ǒ": "o", "ò": "o",
        "ū": "u", "ú": "u", "ǔ": "u", "ù": "u",
        "ü": "v", "ǖ": "v", "ǘ": "v", "ǚ": "v", "ǜ": "v",
        "ń": "n", "ň": "n", "": "m"
    };

    // Replace remaining chars if NFD missed them (usually NFD + regex works for accents, but ü is separate)
    clean = clean.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùüǖǘǚǜńň]/g, match => toneMap[match] || match);

    // 4. Remove all non-alphanumeric (except spaces? no, removing spaces is better for "women" matching "wo men")
    // Keep spaces? If I search "women", and DB has "wo men", "women" won't match "wo men" with ilike unless I remove spaces.
    // Let's remove spaces/punctuation.
    return clean.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(table: string, page: number, batchSize: number, retries = 5) {
    for (let i = 0; i < retries; i++) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('id, pinyin')
                .range(page * batchSize, (page + 1) * batchSize - 1);
            if (error) throw error;
            return data;
        } catch (err) {
            console.warn(`Attempt ${i + 1} failed for ${table} page ${page}:`, err);
            if (i === retries - 1) throw err;
            await delay(2000 * (i + 1));
        }
    }
    return null;
}

async function updateWithRetry(table: string, updates: any[], retries = 5) {
    for (let i = 0; i < retries; i++) {
        try {
            const { error: updateError } = await supabase
                .from(table)
                .upsert(updates as any);
            if (updateError) throw updateError;
            return;
        } catch (err) {
            console.warn(`Update attempt ${i + 1} failed for ${table}:`, err);
            if (i === retries - 1) throw err;
            await delay(2000 * (i + 1));
        }
    }
}

async function migrate() {
    console.log("Starting Pinyin Migration (Robust Mode)...");

    // 1. Update Vocabulary
    const { count: vocabCount } = await supabase.from('entries_vocabulary').select('*', { count: 'exact', head: true });
    console.log(`Found ${vocabCount} vocabulary items.`);

    let processed = 0;
    const batchSize = 50; // Reduced batch size

    // We need to fetch all rows. Pagination loop.
    let page = 0;
    while (true) {
        let data;
        try {
            data = await fetchWithRetry('entries_vocabulary', page, batchSize);
        } catch (e) {
            console.error("Critical error fetching vocab:", e);
            break;
        }

        if (!data || data.length === 0) break;

        const updates = data.map(item => ({
            id: item.id,
            pinyin_clean: normalizePinyin(item.pinyin)
        }));

        try {
            await updateWithRetry('entries_vocabulary', updates);
        } catch (e) {
            console.error("Critical error updating vocab:", e);
        }

        processed += data.length;
        console.log(`Processed ${processed} vocab items...`);
        page++;
        await delay(300); // Delay to be nice
    }

    // 2. Update Characters
    console.log("Updating Characters...");

    const { count: charCount } = await supabase.from('entries_character').select('*', { count: 'exact', head: true });
    console.log(`Found ${charCount} character items.`);

    processed = 0;
    page = 0;
    while (true) {
        let data;
        try {
            data = await fetchWithRetry('entries_character', page, batchSize);
        } catch (e) {
            console.error("Critical error fetching chars:", e);
            break;
        }

        if (!data || data.length === 0) break;

        const updates = data.map(item => ({
            id: item.id,
            pinyin_clean: normalizePinyin(item.pinyin)
        }));

        try {
            await updateWithRetry('entries_character', updates);
        } catch (e) {
            console.error("Critical error updating character:", e);
        }

        processed += data.length;
        console.log(`Processed ${processed} character items...`);
        page++;
        await delay(300);
    }

    console.log("Migration complete!");
}

migrate();
