import React, { useState, useEffect, useRef } from 'react';
import { LevelSelector } from './components/LevelSelector';
import { CategoryTabs } from './components/CategoryTabs';
import { ContentList } from './components/ContentList';
import { HomePage } from './components/HomePage';
import { HskLevel, Category, SyllabusResponse, LoadingState, VocabItem, CharItem, GrammarItem } from './types';
import { fetchSyllabusContent, searchContent } from './services/contentService';
import { Sparkles, AlertCircle, Home, Search, X, Globe, BookA, Languages, ScrollText, ListTodo, MessageSquare } from 'lucide-react';
import { OFFICIAL_DATA } from './data/hskData';
import { useLanguage } from './contexts/LanguageContext';
import { Language } from './utils/translations';
import { ErrorBoundary } from './components/ErrorBoundary';

type ViewState = 'home' | 'explorer';

const App: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [view, setView] = useState<ViewState>('home');
  const [currentLevel, setCurrentLevel] = useState<HskLevel>('1');
  const [currentCategory, setCurrentCategory] = useState<Category>('vocabulary');
  const [data, setData] = useState<SyllabusResponse | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ status: 'idle' });
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchCategory, setSearchCategory] = useState<Category | 'all'>('all');

  /* URL State Management */

  // 1. Initialize state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialView = (params.get('view') as ViewState) || 'home';
    const initialLevel = (params.get('level') as HskLevel) || '1';
    const initialCategory = (params.get('category') as Category) || 'vocabulary';
    const initialQuery = params.get('q') || '';

    // Only set if different to avoid double-renders or overwrites
    setView(initialView);
    setCurrentLevel(initialLevel);
    setCurrentCategory(initialCategory);
    if (initialQuery) {
      setSearchQuery(initialQuery);
      setIsSearching(true);
      performSearch(initialQuery); // Trigger search if query exists
    }
  }, []); // Run once on mount

  // 2. Listen for PopState events (Back/Forward button)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const newView = (params.get('view') as ViewState) || 'home';

      setView(newView);

      if (newView === 'explorer') {
        const newLevel = (params.get('level') as HskLevel) || '1';
        const newCategory = (params.get('category') as Category) || 'vocabulary';
        const newQuery = params.get('q') || '';

        setCurrentLevel(newLevel);
        setCurrentCategory(newCategory);
        setSearchQuery(newQuery);

        if (newQuery) {
          setIsSearching(true);
          performSearch(newQuery);
        } else {
          setIsSearching(false);
        }
      } else {
        setSearchQuery('');
        setIsSearching(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 3. Helper to push state
  const updateUrl = (viewState: ViewState, level?: HskLevel, category?: Category, query?: string) => {
    const params = new URLSearchParams();
    if (viewState === 'home') {
      // No params for home usually, or maybe preserve lang?
    } else {
      params.set('view', 'explorer');
      if (level) params.set('level', level);
      if (category) params.set('category', category);
      if (query) params.set('q', query);
    }

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({}, '', newUrl);
  };

  const navigateToExplorer = (level: HskLevel, category: Category) => {
    setCurrentLevel(level);
    setCurrentCategory(category);
    setView('explorer');
    setSearchQuery(''); // Clear search on nav
    setIsSearching(false);
    updateUrl('explorer', level, category);
  };

  const loadData = async (forceAi: boolean = false) => {
    setLoading({ status: 'loading' });
    setData(null);

    try {
      const result = await fetchSyllabusContent(currentLevel, currentCategory, forceAi, language);
      setData(result);
      setLoading({ status: 'success' });
    } catch (err) {
      setLoading({ status: 'error', message: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  // Perform search using Supabase (via contentService)
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setLoading({ status: 'loading' });

    // Debounce is handled by user typing speed usually, but here we just call directly
    // Ideally use a debounce hook, but keeping it simple for now as per previous logic
    try {
      const results = await searchContent(query);

      setData({
        items: results,
        description: t('foundMatches', { count: results.length, query })
      });
      setSearchCategory('all');
      setLoading({ status: 'success' });
    } catch (err) {
      console.error("Search failed", err);
      setLoading({ status: 'error', message: "Search failed" });
    }
  };

  useEffect(() => {
    if (view === 'explorer' && !isSearching) {
      loadData(false);
    }
  }, [currentLevel, currentCategory, view, isSearching, language]);

  // Handle Search Input from Header


  // Handle Search Input from Hero
  const handleHeroSearch = (term: string) => {
    setSearchQuery(term);
    setView('explorer');
    performSearch(term);
    updateUrl('explorer', currentLevel, currentCategory, term);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    updateUrl('explorer', currentLevel, currentCategory); // Clear query param
    if (view === 'explorer') {
      loadData(false); // Reload current context
    }
  };

  const toggleLanguage = (lang: Language) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  const getLangLabel = (lang: Language) => {
    switch (lang) {
      case 'zh': return '中文';
      case 'vi': return 'Tiếng Việt';
      case 'en': return 'English';
      default: return 'Language';
    }
  };

  const getCategoryDisplay = (cat: Category) => {
    switch (cat) {
      case 'vocabulary': return { label: t('vocab'), icon: <BookA size={16} /> };
      case 'characters': return { label: t('chars'), icon: <Languages size={16} /> };
      case 'grammar': return { label: t('grammar'), icon: <ScrollText size={16} /> };
      case 'tasks': return { label: t('tasks'), icon: <ListTodo size={16} /> };
      case 'topics': return { label: t('topics'), icon: <MessageSquare size={16} /> };
      default: return { label: cat, icon: null };
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-paper font-sans overflow-hidden">

      {/* Sidebar: Only show in Explorer Mode */}
      {view === 'explorer' && (
        <LevelSelector
          currentLevel={currentLevel}
          onSelectLevel={(l) => {
            setIsSearching(false);
            setSearchQuery('');
            setCurrentLevel(l);
            updateUrl('explorer', l, currentCategory);
          }}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 z-20 gap-4">
          <div className="flex items-center gap-4 flex-1">
            {view === 'explorer' && (
              <button
                onClick={() => {
                  setView('home');
                  updateUrl('home');
                }}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Home"
              >
                <Home size={20} />
              </button>
            )}

            <div className="relative flex-1 max-w-xl">
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    if (view === 'home') setView('explorer');
                    performSearch(searchQuery);
                    updateUrl('explorer', currentLevel, currentCategory, searchQuery);
                  }
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-hsk-red transition-colors"
                disabled={loading.status === 'loading'}
              >
                {loading.status === 'loading' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-hsk-red border-t-transparent"></div>
                ) : (
                  <Search size={18} />
                )}
              </button>
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    if (view === 'home') setView('explorer');
                    performSearch(searchQuery);
                    updateUrl('explorer', currentLevel, currentCategory, searchQuery);
                  }
                }}
                className="w-full bg-gray-100 border-none rounded-full pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-hsk-red/20 focus:bg-white transition-all outline-none text-ink placeholder-gray-500"
              />
              {searchQuery && (
                <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-ink hover:bg-gray-100 rounded-full transition-colors"
            >
              <Globe size={18} />
              <span className="hidden sm:inline">{getLangLabel(language)}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                <button onClick={() => toggleLanguage('vi')} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 hover:text-hsk-red transition-colors flex justify-between items-center text-ink">
                  Tiếng Việt {language === 'vi' && <span className="w-1.5 h-1.5 rounded-full bg-hsk-red"></span>}
                </button>
                <button onClick={() => toggleLanguage('zh')} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 hover:text-hsk-red transition-colors flex justify-between items-center text-ink">
                  中文 {language === 'zh' && <span className="w-1.5 h-1.5 rounded-full bg-hsk-red"></span>}
                </button>
                <button onClick={() => toggleLanguage('en')} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 hover:text-hsk-red transition-colors flex justify-between items-center text-ink">
                  English {language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-hsk-red"></span>}
                </button>
              </div>
            )}
          </div>
        </header>

        {view === 'home' ? (
          <HomePage
            onNavigate={navigateToExplorer}
            onSearch={handleHeroSearch}
          />
        ) : (
          <main className="flex-1 overflow-y-auto w-full relative">
            <div className="p-4 md:p-8 max-w-6xl mx-auto">

              {/* Header (Only if not searching) - Hidden on mobile */}
              {!isSearching && (
                <div className="mb-4 md:mb-8 text-center md:text-left flex-col md:flex-row justify-between items-end hidden md:flex">
                  <div>
                    <h2 className="text-3xl font-bold text-ink mb-2 font-serif">
                      {currentLevel === 'all' ? t('allLevels') : `HSK ${t('level')} ${currentLevel}`}
                    </h2>
                    <p className="text-gray-500">{t('heroDesc')}</p>
                  </div>

                </div>
              )}

              {/* Controls (Category Selection) */}
              {!isSearching && (
                <CategoryTabs
                  currentCategory={currentCategory}
                  onSelectCategory={(c) => {
                    setCurrentCategory(c);
                    updateUrl('explorer', currentLevel, c);
                  }}
                />
              )}

              {/* Search Header & Tabs */}
              {isSearching && (
                <div className="mb-8">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-ink">{t('searchResults')}</h2>

                    {/* Search Category Tabs */}
                    {data?.items && data.items.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSearchCategory('all')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${searchCategory === 'all'
                            ? 'bg-ink text-white shadow-md'
                            : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100 hover:border-gray-200'
                            }`}
                        >
                          <Search size={16} />
                          {t('allResults')}
                        </button>
                        {Array.from(new Set(data.items.map(item => item.section).filter(Boolean)))
                          .sort()
                          .map((catString) => {
                            const cat = catString as Category;
                            const { label, icon } = getCategoryDisplay(cat);
                            return (
                              <button
                                key={cat}
                                onClick={() => setSearchCategory(cat)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${searchCategory === cat
                                  ? 'bg-ink text-white shadow-md'
                                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100 hover:border-gray-200'
                                  }`}
                              >
                                {icon}
                                {label}
                              </button>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              {loading.status === 'error' ? (
                <div className="max-w-xl mx-auto text-center p-8 bg-red-50 rounded-2xl border border-red-100">
                  <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-700 mb-2">{t('loadingError')}</h3>
                  <p className="text-red-600 mb-6">{loading.message}</p>
                  <button
                    onClick={() => loadData(true)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                  >
                    {t('tryAgain')}
                  </button>
                </div>
              ) : (
                <ErrorBoundary>
                  <ContentList
                    data={isSearching && searchCategory !== 'all' && data ? { ...data, items: data.items.filter(i => i.section === searchCategory) } : data}
                    category={isSearching ? 'search' : currentCategory}
                    level={currentLevel}
                    isLoading={loading.status === 'loading'}
                    onRefresh={() => loadData(true)}
                  />
                </ErrorBoundary>
              )}

            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default App;