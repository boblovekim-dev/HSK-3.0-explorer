
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySearch(query: string) {
    console.log(`Searching for: ${query}`);

    const vocabRes = await supabase
        .from('entries_vocabulary')
        .select('*')
        .or(`hanzi.ilike.%${query}%,pinyin.ilike.%${query}%,definition.ilike.%${query}%`)
        .limit(5);

    if (vocabRes.error) {
        console.error("Error fetching vocab:", vocabRes.error);
    } else {
        console.log("Vocab Results:");
        vocabRes.data.forEach(item => {
            console.log(`- ${item.hanzi}: Level=${item.level} (Type: ${typeof item.level})`);
        });
    }

    const charRes = await supabase
        .from('entries_character')
        .select('*')
        .or(`char.ilike.%${query}%,pinyin.ilike.%${query}%`)
        .limit(5);

    if (charRes.error) {
        console.error("Error fetching chars:", charRes.error);
    } else {
        console.log("Character Results:");
        charRes.data.forEach(item => {
            console.log(`- ${item.char}: Level=${item.level} (Type: ${typeof item.level})`);
        });
    }
}

// Run verification
verifySearch('爱');
