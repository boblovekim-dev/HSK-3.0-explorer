
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkLevel1() {
    console.log("Querying for exact level '1'...");
    const { data: exact, error: e1 } = await supabase
        .from('entries_vocabulary')
        .select('id, hanzi, level, ordinal')
        .eq('level', '1')
        .order('ordinal');

    if (e1) console.error(e1);
    else {
        const ban = exact?.find(i => i.hanzi === '半');
        console.log("Exact match found '半'?", !!ban);
        console.log("Total items exact '1':", exact?.length);
    }

    console.log("\nQuerying for level '1（4）'...");
    const { data: mixed, error: e2 } = await supabase
        .from('entries_vocabulary')
        .select('id, hanzi, level, ordinal')
        .eq('level', '1（4）');

    if (e2) console.error(e2);
    else {
        console.log("Found items with level '1（4）':", mixed?.length);
        if (mixed && mixed.length > 0) console.log("Sample:", mixed[0]);
    }

    console.log("\nTesting OR query...");
    const { data: orQuery, error: e3 } = await supabase
        .from('entries_vocabulary')
        .select('id, hanzi, level, ordinal')
        .or(`level.eq.1,level.ilike.1（%）,level.ilike.1(%)`)
        .order('ordinal');

    if (e3) console.error(e3);
    else {
        const ban = orQuery?.find(i => i.hanzi === '半');
        console.log("OR query found '半'?", !!ban);
        console.log("Total items OR query:", orQuery?.length);
    }
}

checkLevel1();
