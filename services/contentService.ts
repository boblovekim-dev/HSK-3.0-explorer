import { GoogleGenAI, Type } from "@google/genai";
import { HskLevel, Category, SyllabusResponse, VocabItem, CharItem, GrammarItem, TaskItem, TopicItem } from "../types";
import { supabase } from "./supabaseClient";
import { Language } from "../utils/translations";

const ai = new GoogleGenAI({ apiKey: import.meta.env.API_KEY || '' });

// Schemas for structured output (Keep existing schemas)
const vocabSchema = {
    type: Type.OBJECT,
    properties: {
        items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    hanzi: { type: Type.STRING },
                    pinyin: { type: Type.STRING },
                    partOfSpeech: { type: Type.STRING, description: "e.g. 动, 名, 数, 助" },
                    definition: { type: Type.STRING },
                    exampleSentence: { type: Type.STRING },
                },
                required: ["hanzi", "pinyin", "definition", "partOfSpeech"],
            },
        },
        description: { type: Type.STRING, description: "A brief summary of what this level expects for vocabulary." },
    },
};

const charSchema = {
    type: Type.OBJECT,
    properties: {
        items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    char: { type: Type.STRING },
                    pinyin: { type: Type.STRING },
                    meaning: { type: Type.STRING },
                    strokes: { type: Type.NUMBER },
                    type: { type: Type.STRING, description: "Either 'reading' or 'writing'" }
                },
                required: ["char", "pinyin", "meaning"],
            },
        },
        description: { type: Type.STRING, description: "A brief summary of character requirements for this level." },
    },
};

const grammarSchema = {
    type: Type.OBJECT,
    properties: {
        items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    category: { type: Type.STRING, description: "Main category like 'Phrase' or 'Sentence Component'" },
                    pattern: { type: Type.STRING, description: "The grammar structure, e.g., 'Subject + Verb + Object'" },
                    name: { type: Type.STRING, description: "The name of the grammar point" },
                    explanation: { type: Type.STRING },
                    example: { type: Type.STRING },
                },
                required: ["pattern", "name", "explanation", "example"],
            },
        },
        description: { type: Type.STRING, description: "A brief summary of grammar complexity for this level." },
    },
};

export const fetchSyllabusContent = async (
    level: HskLevel,
    category: Category,
    forceAi: boolean = false,
    language: Language = 'vi'
): Promise<SyllabusResponse> => {

    // 1. Check Supabase first (if not forcing AI)
    if (!forceAi) {
        try {
            let data: any[] = [];
            let error = null;

            if (category === 'vocabulary') {
                const res = await supabase
                    .from('entries_vocabulary')
                    .select('*')
                    .eq('level', level)
                    .order('ordinal', { ascending: true });
                data = res.data || [];
                error = res.error;
            } else if (category === 'characters') {
                let query = supabase
                    .from('entries_character')
                    .select('*');

                if (level === '1' || level === '2') {
                    // For levels 1 and 2, also include mixed "1-2" level items (usually writing)
                    query = query.in('level', [level, '1-2']);
                } else {
                    query = query.eq('level', level);
                }

                const res = await query.order('ordinal', { ascending: true });
                data = res.data || [];
                error = res.error;
            } else if (category === 'tasks') {
                const res = await supabase
                    .from('entries_task')
                    .select('*')
                    .eq('level', level);
                data = res.data || [];
                error = res.error;
            } else if (category === 'topics') {
                const res = await supabase
                    .from('entries_topic')
                    .select('*')
                    .eq('level', level);
                data = res.data || [];
                error = res.error;
            } else {
                const res = await supabase
                    .from('entries_grammar')
                    .select('*')
                    .eq('level', level);
                data = res.data || [];
                error = res.error;
            }

            if (error) {
                console.error("Supabase Error:", error);
            }

            if (data && data.length > 0) {
                // Map to frontend types
                const items = data.map(item => mapDbItemToFrontend(item, category, language));

                const langDesc = language === 'vi' ? "Nội dung từ cơ sở dữ liệu" :
                    language === 'zh' ? "来自数据库的内容" :
                        "Content from Database";

                return {
                    items,
                    description: langDesc
                };
            }
        } catch (err) {
            console.error("Unexpected error fetching from Supabase:", err);
        }
    }

    // 2. Fallback to AI Generation
    console.log("Falling back to Gemini AI generation...");
    const model = "gemini-2.0-flash-exp";

    let prompt = "";
    let schema = null;

    const langName = language === 'vi' ? 'Vietnamese' : language === 'zh' ? 'Chinese (Simplified)' : 'English';

    if (category === 'vocabulary') {
        prompt = `Generate a representative list of 8 distinctive HSK Level ${level} vocabulary words. 
    Include the Simplified Chinese (hanzi), Pinyin, Part of Speech (e.g. 名, 动, 形) as 'partOfSpeech', ${langName} definition, and a simple example sentence using the word.
    Focus on words that are introduced specifically at Level ${level} (HSK 3.0 standard).`;
        schema = vocabSchema;
    } else if (category === 'characters') {
        prompt = `Generate a list of 8 representative Chinese characters (Hanzi) that are required for HSK Level ${level} (3.0 standard).
    Include the character, pinyin, basic meaning in ${langName}, stroke count, and set type to 'reading'.`;
        schema = charSchema;
    } else {
        prompt = `Generate a list of 5 key grammar points specifically for HSK Level ${level} (3.0 standard).
    Include a category (e.g. Phrase, Sentence Pattern), structural pattern, name, explanation in ${langName}, and example sentence.`;
        schema = grammarSchema;
    }

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema as any,
                systemInstruction: `You are an expert Chinese language teacher specializing in the HSK 3.0 curriculum. Provide accurate, educational content. Ensure all definitions and explanations are in ${langName}.`,
            },
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");

        const parsed = JSON.parse(text) as SyllabusResponse;

        // Mark items as AI generated
        parsed.items = parsed.items.map(item => ({ ...item, source: 'ai' as const }));

        return parsed;

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to fetch HSK content. Please check your API Key or network.");
    }
};

// Helper to map DB items to frontend types
const mapDbItemToFrontend = (item: any, category: Category, language: Language = 'zh'): VocabItem | CharItem | GrammarItem | TaskItem | TopicItem => {
    if (category === 'vocabulary') {
        return {
            hanzi: item.hanzi,
            pinyin: item.pinyin,
            partOfSpeech: item.part_of_speech,
            definition: item.definition,
            exampleSentence: item.example_sentence,
            ordinal: item.ordinal,
            source: item.source || 'official',
            level: item.level,
            section: category
        } as VocabItem;
    } else if (category === 'characters') {
        return {
            char: item.char,
            pinyin: item.pinyin,
            meaning: item.meaning,
            strokes: item.strokes,
            type: item.type,
            ordinal: item.ordinal,
            source: item.source || 'official',
            level: item.level,
            section: category
        } as CharItem;
    } else if (category === 'tasks') {
        return {
            category: language === 'vi' ? item.category_vi || item.category :
                language === 'en' ? item.category_en || item.category :
                    item.category,
            description: language === 'vi' ? item.description_vi || item.description :
                language === 'en' ? item.description_en || item.description :
                    item.description,
            canDo: language === 'vi' ? (item.can_do_vi && item.can_do_vi.length > 0 ? item.can_do_vi : item.can_do) :
                language === 'en' ? (item.can_do_en && item.can_do_en.length > 0 ? item.can_do_en : item.can_do) :
                    item.can_do,
            source: item.source || 'official',
            level: item.level,
            section: category
        } as TaskItem;
    } else if (category === 'topics') {
        return {
            primary: language === 'vi' ? item.primary_topic_vi || item.primary_topic :
                language === 'en' ? item.primary_topic_en || item.primary_topic :
                    item.primary_topic,
            secondary: language === 'vi' ? item.secondary_topic_vi || item.secondary_topic :
                language === 'en' ? item.secondary_topic_en || item.secondary_topic :
                    item.secondary_topic,
            items: language === 'vi' ? (item.tertiary_items_vi && item.tertiary_items_vi.length > 0 ? item.tertiary_items_vi : item.tertiary_items) :
                language === 'en' ? (item.tertiary_items_en && item.tertiary_items_en.length > 0 ? item.tertiary_items_en : item.tertiary_items) :
                    item.tertiary_items,
            source: item.source || 'official',
            level: item.level,
            section: category
        } as TopicItem;
    } else {
        return {
            category: item.category,
            subCategory: item.sub_category,
            name: item.name,
            pattern: item.pattern,
            explanation: item.explanation,
            example: item.example,
            source: item.source || 'official',
            level: item.level,
            section: category
        } as GrammarItem;
    }
};

// ----------------------------------------------------------------------------
// SEARCH FUNCTIONALITY
// ----------------------------------------------------------------------------
export const searchContent = async (query: string): Promise<(VocabItem | CharItem | GrammarItem | TaskItem | TopicItem)[]> => {
    if (!query) return [];

    const results: (VocabItem | CharItem | GrammarItem | TaskItem | TopicItem)[] = [];

    try {
        // 1. Search Vocabulary
        const vocabRes = await supabase
            .from('entries_vocabulary')
            .select('*')
            .or(`hanzi.ilike.%${query}%,pinyin.ilike.%${query}%,pinyin_clean.ilike.%${query}%,definition.ilike.%${query}%`)
            .limit(10);

        if (vocabRes.data) {
            results.push(...vocabRes.data.map(item => mapDbItemToFrontend(item, 'vocabulary')));
        }

        // 2. Search Characters
        const charRes = await supabase
            .from('entries_character')
            .select('*')
            .or(`char.ilike.%${query}%,pinyin.ilike.%${query}%,pinyin_clean.ilike.%${query}%`)
            .limit(10);

        if (charRes.data) {
            results.push(...charRes.data.map(item => mapDbItemToFrontend(item, 'characters')));
        }

        // 3. Search Grammar
        const grammarRes = await supabase
            .from('entries_grammar')
            .select('*')
            .or(`name.ilike.%${query}%,pattern.ilike.%${query}%`)
            .limit(10);

        if (grammarRes.data) {
            results.push(...grammarRes.data.map(item => mapDbItemToFrontend(item, 'grammar')));
        }

    } catch (err) {
        console.error("Search Error:", err);
    }

    return results;
};
