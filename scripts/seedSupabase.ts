
import { createClient } from '@supabase/supabase-js';
import { OFFICIAL_DATA } from '../data/hskData';
import 'dotenv/config'; // Requires npm install dotenv

// You can run this script with: npx tsx scripts/seedSupabase.ts
// Ensure .env.local exists or variables are passed. 
// Note: standard dotenv looks for .env, you might need to copy .env.local to .env or specify path.

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Or SERVICE_ROLE_KEY if RLS blocks inserts

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in environment.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log("Starting seed...");

    // 1. Vocabulary
    for (const [level, items] of Object.entries(OFFICIAL_DATA.vocabulary)) {
        console.log(`Seeding Vocabulary Level ${level}, ${items.length} items`);
        const dbItems = items.map(item => ({
            level,
            hanzi: item.hanzi,
            pinyin: item.pinyin,
            part_of_speech: item.partOfSpeech,
            definition: item.definition,
            example_sentence: item.exampleSentence,
            ordinal: item.ordinal,
            source: item.source
        }));

        const { error } = await supabase.from('entries_vocabulary').upsert(dbItems, { onConflict: 'hanzi, level' as any });
        // Note: You might need a unique constraint on hanzi+level if you want true upsert, or just let it add. 
        // For now assuming we just want to insert. If you run multiple times, you might want truncate first.
        if (error) console.error("Error seeding vocab:", error);
    }

    // 2. Characters
    for (const [level, items] of Object.entries(OFFICIAL_DATA.characters)) {
        console.log(`Seeding Characters Level ${level}, ${items.length} items`);
        const dbItems = items.map(item => ({
            level,
            char: item.char,
            pinyin: item.pinyin,
            meaning: item.meaning,
            strokes: item.strokes,
            type: item.type,
            ordinal: item.ordinal,
            source: item.source
        }));

        const { error } = await supabase.from('entries_character').upsert(dbItems);
        if (error) console.error("Error seeding chars:", error);
    }

    // 3. Grammar
    for (const [level, items] of Object.entries(OFFICIAL_DATA.grammar)) {
        console.log(`Seeding Grammar Level ${level}, ${items.length} items`);
        const dbItems = items.map(item => ({
            level,
            category: item.category,
            sub_category: item.subCategory,
            name: item.name,
            pattern: item.pattern,
            explanation: item.explanation,
            example: item.example,
            source: item.source
        }));

        const { error } = await supabase.from('entries_grammar').upsert(dbItems);
        if (error) console.error("Error seeding grammar:", error);
    }

    console.log("Seeding complete.");
}

seed();
