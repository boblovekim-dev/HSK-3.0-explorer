import React, { useState } from 'react';
import { Globe, Loader2, AlertCircle } from 'lucide-react';
import { translateText } from '../services/translationService';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
    text: string;  // Text to translate (plain string for API)
    children?: React.ReactNode;  // Optional: custom display content (e.g. formatted hanzi)
    className?: string;
    hideText?: boolean;  // If true, only show the translate icon button (no text display)
}

/**
 * TranslatableText Component
 * Wraps Chinese text and provides a click-to-translate feature.
 * 
 * - Only shows translation icon when user language is English or Vietnamese
 * - Translation appears BELOW the original text (not replacing it)
 * - Results are cached in localStorage
 * - If `children` is provided, it renders that; otherwise renders `text`
 * - If `hideText` is true, only shows the translate icon (for overlay positioning)
 */
export const TranslatableText: React.FC<Props> = ({ text, children, className = '', hideText = false }) => {
    const { language } = useLanguage();
    const [translation, setTranslation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // Only show translation feature for non-Chinese languages and non-empty text
    const showTranslateButton = language !== 'zh' && text && text.trim().length > 0;

    const handleTranslate = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // If already translated, just toggle visibility
        if (translation) {
            setIsExpanded(!isExpanded);
            return;
        }

        setIsLoading(true);
        setError(null);

        const result = await translateText(text, language as 'en' | 'vi');

        setIsLoading(false);

        if (result.success) {
            setTranslation(result.translation);
            setIsExpanded(true);
        } else {
            setError(result.error || 'Translation failed');
        }
    };

    // If hideText is true, only render the icon button (for overlay use)
    if (hideText) {
        if (!showTranslateButton) return null;

        return (
            <div className={`relative ${className}`}>
                <button
                    onClick={handleTranslate}
                    disabled={isLoading}
                    className={`inline-flex items-center justify-center p-1 rounded-full transition-all shrink-0 bg-white shadow-sm border border-gray-100 ${isLoading
                            ? 'text-gray-400 cursor-wait'
                            : translation
                                ? 'text-blue-500 hover:bg-blue-50'
                                : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                        }`}
                    title={translation ? (isExpanded ? 'Hide translation' : 'Show translation') : 'Translate'}
                    aria-label="Translate"
                >
                    {isLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : error ? (
                        <AlertCircle size={14} className="text-red-400" />
                    ) : (
                        <Globe size={14} />
                    )}
                </button>

                {/* Translation tooltip for hideText mode - click to dismiss */}
                {isExpanded && translation && (
                    <div
                        onClick={() => setIsExpanded(false)}
                        className="absolute bottom-full right-0 mb-1 px-2 py-1 bg-blue-600 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 cursor-pointer hover:bg-blue-700"
                    >
                        {translation}
                        <span className="ml-1 opacity-70">×</span>
                    </div>
                )}
            </div>
        );
    }

    // Display content: use children if provided, otherwise use text
    const displayContent = children ?? text;

    return (
        <div className={`inline ${className}`}>
            <span className="inline-flex items-center gap-1">
                <span>{displayContent}</span>

                {showTranslateButton && (
                    <button
                        onClick={handleTranslate}
                        disabled={isLoading}
                        className={`inline-flex items-center justify-center p-1 rounded-full transition-all shrink-0 ${isLoading
                            ? 'text-gray-400 cursor-wait'
                            : translation
                                ? 'text-blue-500 hover:bg-blue-50'
                                : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                            }`}
                        title={translation ? (isExpanded ? 'Hide translation' : 'Show translation') : 'Translate'}
                        aria-label="Translate"
                    >
                        {isLoading ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : error ? (
                            <AlertCircle size={14} className="text-red-400" />
                        ) : (
                            <Globe size={14} />
                        )}
                    </button>
                )}
            </span>

            {/* Translation result - appears below original text */}
            {isExpanded && translation && (
                <div className="text-sm text-blue-600 mt-0.5 pl-0 italic">
                    {translation}
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="text-xs text-red-400 mt-0.5">
                    {error}
                </div>
            )}
        </div>
    );
};
