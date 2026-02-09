// Translation Service using MyMemory Free API
// Free tier: 1000 requests/day
// API: https://api.mymemory.translated.net

const CACHE_KEY = 'hsk_translation_cache';

// Get cached translations from localStorage
const getCache = (): Record<string, string> => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        return cached ? JSON.parse(cached) : {};
    } catch {
        return {};
    }
};

// Save translation to cache
const saveToCache = (key: string, translation: string) => {
    try {
        const cache = getCache();
        cache[key] = translation;
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
        // Ignore storage errors
    }
};

// Generate cache key from text and target language
const getCacheKey = (text: string, targetLang: string): string => {
    return `${targetLang}:${text}`;
};

export type TranslationResult = {
    success: boolean;
    translation: string;
    error?: string;
};

/**
 * Translate Chinese text to target language using MyMemory API
 * @param text Chinese text to translate
 * @param targetLang Target language code ('en' for English, 'vi' for Vietnamese)
 */
export const translateText = async (
    text: string,
    targetLang: 'en' | 'vi'
): Promise<TranslationResult> => {
    // Check cache first
    const cacheKey = getCacheKey(text, targetLang);
    const cache = getCache();

    if (cache[cacheKey]) {
        return { success: true, translation: cache[cacheKey] };
    }

    // Map language codes to MyMemory format
    const langPair = targetLang === 'en' ? 'zh|en' : 'zh|vi';

    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (data.responseStatus === 200 && data.responseData?.translatedText) {
            const translation = data.responseData.translatedText;

            // Cache the successful translation
            saveToCache(cacheKey, translation);

            return { success: true, translation };
        } else {
            return {
                success: false,
                translation: '',
                error: data.responseDetails || 'Translation failed'
            };
        }
    } catch (error) {
        return {
            success: false,
            translation: '',
            error: error instanceof Error ? error.message : 'Network error'
        };
    }
};

/**
 * Clear translation cache
 */
export const clearTranslationCache = () => {
    localStorage.removeItem(CACHE_KEY);
};
