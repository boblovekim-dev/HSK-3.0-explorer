
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkBan() {
    const { data, error } = await supabase
        .from('entries_vocabulary')
        .select('*')
        .eq('hanzi', '半');

    if (error) {
        console.error(error);
        return;
    }

    console.log("Entries for '半':", JSON.stringify(data, null, 2));

    // Also check ordinal 7 level 1 to see coverage
    const { data: ord7, error: oError } = await supabase
        .from('entries_vocabulary')
        .select('*')
        .eq('ordinal', 7)
        .eq('level', '1');

    console.log("Entries for Ordinal 7, Level 1:", JSON.stringify(ord7, null, 2));
}

checkBan();
