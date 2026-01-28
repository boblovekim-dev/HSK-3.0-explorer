
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars (ESM style for Node)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySearch(query) {
    console.log(`Searching for: ${query}`);

    const { data, error } = await supabase
        .from('entries_vocabulary')
        .select('*')
        .or(`hanzi.ilike.%${query}%,pinyin.ilike.%${query}%`)
        .limit(3);

    if (error) {
        console.error("Error fetching vocab:", error);
    } else {
        console.log("Raw Vocab Results:");
        data.forEach(item => {
            console.log(JSON.stringify(item, null, 2));
        });
    }
}

verifySearch('爱');
