import React, { useState, useEffect } from 'react';
import { Category, SyllabusResponse, VocabItem, CharItem, GrammarItem, TaskItem, TopicItem } from '../types';
import { Volume2, Sparkles, ShieldCheck, PenTool, Eye, Search, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translateGrammarTerm } from '../utils/translations';
import { Pagination } from './Pagination';
import { ttsService } from '../services/ttsService';

interface Props {
  data: SyllabusResponse | null;
  category: Category;
  level: string;
  isLoading: boolean;
  onRefresh: () => void;
}

const SourceBadge: React.FC<{ source?: 'official' | 'ai' }> = ({ source }) => {
  const { t } = useLanguage();
  if (source === 'official') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide border border-green-200">
        <ShieldCheck size={10} className="mr-1" />
        {t('official')}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wide border border-amber-200">
      <Sparkles size={10} className="mr-1" />
      {t('ai')}
    </span>
  );
};

const renderLevelBadge = (level: string) => {
  const match = level.match(/^(\d+)\s*[（(](\d+)[）)]$/);
  if (match) {
    return (
      <span className="flex items-start justify-center leading-none">
        <span>{match[1]}</span>
        <span className="text-[0.6em] relative -top-0.5 ml-[1px]">{match[2]}</span>
      </span>
    );
  }
  return level;
};

const renderHanzi = (text: string) => {
  const match = text.match(/^(.+?)(\d+)$/);
  if (match) {
    return (
      <span>
        {match[1]}
        <span className="text-[0.6em] align-top relative top-0.5 ml-[1px] text-gray-500 font-sans">{match[2]}</span>
      </span>
    );
  }
  return text;
};

// PlayButton Component
const PlayButton: React.FC<{ text: string, className?: string, iconSize?: number }> = ({ text, className = "", iconSize = 16 }) => {
  const [playing, setPlaying] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playing || !text) return;
    setPlaying(true);
    try {
      await ttsService.speak(text);
    } catch (err) {
      console.error("TTS Error", err);
    } finally {
      setPlaying(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={playing}
      className={`p-1.5 rounded-full hover:bg-hsk-red/10 text-gray-400 hover:text-hsk-red transition-all ${playing ? 'animate-pulse text-hsk-red bg-hsk-red/5' : ''} ${className}`}
      title="Listen"
      aria-label="Play audio"
    >
      <Volume2 size={iconSize} />
    </button>
  );
};

export const ContentList: React.FC<Props> = ({ data, category, level, isLoading, onRefresh }) => {
  const { t, language } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid gap-4 w-full animate-pulse max-w-5xl mx-auto mt-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm h-16 w-full bg-gray-100"></div>
        ))}
      </div>
    );
  }

  if (!data) return null;


  // Helper to strip tones for pinyin search
  const normalizePinyin = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedGrammarCat, setSelectedGrammarCat] = useState('');
  const [selectedGrammarSub, setSelectedGrammarSub] = useState('');
  const [selectedGrammarPat, setSelectedGrammarPat] = useState('');

  // Topic Filter State
  const [selectedTopicPrim, setSelectedTopicPrim] = useState('');
  const [selectedTopicSec, setSelectedTopicSec] = useState('');

  const [activeTaskId, setActiveTaskId] = useState('');
  const [charType, setCharType] = useState<'reading' | 'writing'>('reading');

  // Tasks use infinite scroll/sidebar, others use pagination
  const itemsPerPage = category === 'tasks' ? 5000 : 50;

  useEffect(() => {
    setCurrentPage(1);
    setActiveTaskId('');
    if (category !== 'grammar') {
      // Reset grammar filters when leaving grammar tab
      setSelectedGrammarCat('');
      setSelectedGrammarSub('');
      setSelectedGrammarPat('');
    }
    if (category !== 'topics') {
      setSelectedTopicPrim('');
      setSelectedTopicSec('');
    }
  }, [category, data, onRefresh, filterQuery, selectedGrammarCat, selectedGrammarSub, selectedGrammarPat]);

  // Scroll to top when page changes
  useEffect(() => {
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const scrollToTask = (idx: number) => {
    const el = document.getElementById(`task-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Manually set active to provide instant feedback
      setActiveTaskId(`task-${idx}`);
    }
  };

  const getSearchPlaceholder = () => {
    const levelText = level === 'all'
      ? (language === 'en' ? 'All Levels' : (language === 'vi' ? 'Tất cả cấp độ' : '全部等级'))
      : `HSK ${level}`;

    let catText = '';
    switch (category) {
      case 'vocabulary': catText = t('vocab'); break;
      case 'characters': catText = t('chars'); break;
      case 'grammar': catText = t('grammar'); break;
      case 'tasks': catText = t('tasks'); break;
      case 'topics': catText = t('topics'); break;
      default: catText = t('allResults');
    }

    if (language === 'zh') return `搜索 ${level === 'all' ? '全部等级' : 'HSK ' + level} ${catText}...`;
    if (language === 'vi') return `Tìm kiếm ${catText} ${level === 'all' ? 'Tất cả cấp độ' : 'HSK ' + level}...`;
    return `Search ${levelText} ${catText}...`;
  };

  useEffect(() => {
    if (category !== 'tasks') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveTaskId(entry.target.id);
        }
      });
    }, { rootMargin: '-10% 0px -70% 0px' });

    const elements = document.querySelectorAll('[id^="task-"]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [category, data]);

  const renderContent = () => {
    // Filter items based on local search query
    const filteredItems = data.items.filter(item => {
      // Handle Grammar Specific Filters (Cascading)
      if (category === 'grammar') {
        const gItem = item as GrammarItem;

        // Regex to match various dash types (hyphen, en-dash, em-dash)
        const dashRegex = /[-–—]/;

        // 1. Category Filter
        if (selectedGrammarCat && gItem.category !== selectedGrammarCat) {
          return false;
        }

        // 2. SubCategory Filter (Derived)
        if (selectedGrammarSub) {
          let catNameRaw = gItem.subCategory;
          if (gItem.subCategory && dashRegex.test(gItem.subCategory)) {
            catNameRaw = gItem.subCategory.split(dashRegex)[0].trim();
          }
          if (catNameRaw !== selectedGrammarSub) return false;
        }

        // 3. Pattern/Details Filter (Derived)
        if (selectedGrammarPat) {
          let detailsRaw = '/';
          if (gItem.subCategory && dashRegex.test(gItem.subCategory)) {
            const parts = gItem.subCategory.split(dashRegex);
            detailsRaw = parts[1] ? parts[1].trim() : parts[0];
          } else if (gItem.pattern && gItem.pattern !== gItem.name) {
            detailsRaw = gItem.name;
          }
          if (detailsRaw !== selectedGrammarPat) return false;
        }

        // 4. Text Search (if exists)
        if (filterQuery) {
          const q = filterQuery.toLowerCase();
          return gItem.name.toLowerCase().includes(q) ||
            (gItem.pattern && gItem.pattern.toLowerCase().includes(q));
        }

        return true;
      }

      // Handle Topic Specific Filters (Cascading)
      if (category === 'topics') {
        const tItem = item as TopicItem;

        // 1. Primary Filter
        if (selectedTopicPrim && tItem.primary !== selectedTopicPrim) return false;

        // 2. Secondary Filter
        if (selectedTopicSec && tItem.secondary !== selectedTopicSec) return false;

        // 3. Text Search
        if (filterQuery) {
          const q = filterQuery.toLowerCase();
          return tItem.primary.toLowerCase().includes(q) ||
            tItem.secondary.toLowerCase().includes(q);
        }

        return true;
      }

      if (!filterQuery) return true;

      if (filterQuery.startsWith('prim:')) {
        const query = filterQuery.slice(5);
        return (item as TopicItem).primary === query;
      }

      if (filterQuery.startsWith('sec:')) {
        const query = filterQuery.slice(4);
        return (item as TopicItem).secondary === query;
      }

      const q = filterQuery.toLowerCase();
      const qNorm = normalizePinyin(q);

      if ('hanzi' in item) { // Vocab
        return item.hanzi.includes(q) ||
          item.pinyin.toLowerCase().includes(q) ||
          normalizePinyin(item.pinyin).includes(qNorm);
      }
      if ('char' in item) { // Char
        return item.char.includes(q) ||
          (item.pinyin && (item.pinyin.toLowerCase().includes(q) || normalizePinyin(item.pinyin).includes(qNorm)));
      }
      if ('name' in item) { // Grammar - basic search fallback if category check skipped? 
        // Logic handled above in special grammar block, but satisfying typescript/safety
        return true;
      }
      if ('category' in item && 'description' in item) { // Task
        return item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
      }
      if ('primary' in item) { // Topic
        const tItem = item as TopicItem;

        // 1. Primary Filter
        if (selectedTopicPrim && tItem.primary !== selectedTopicPrim) return false;

        // 2. Secondary Filter
        if (selectedTopicSec && tItem.secondary !== selectedTopicSec) return false;

        // 3. Text Search
        const q = filterQuery.toLowerCase();
        return tItem.primary.toLowerCase().includes(q) ||
          tItem.secondary.toLowerCase().includes(q);
      }

      return false;
    });

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const displayedItems = filteredItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    switch (category) {
      case 'vocabulary':

        return (
          <div className="space-y-4">
            {/* Filter/Search Bar */}
            {/* Filter/Search Bar */}
            <div className="flex justify-end mb-2">
              <label className="relative block w-full max-w-sm">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  placeholder={getSearchPlaceholder()}
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-hsk-red/20 shadow-sm bg-white hover:bg-gray-50 transition-all text-gray-700 placeholder-gray-400"
                />
                {filterQuery && (
                  <button
                    onClick={() => setFilterQuery('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </label>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold w-16">No.</th>
                      {level === 'all' && <th className="px-4 py-4 font-semibold w-16">HSK</th>}
                      <th className="px-6 py-4 font-semibold">{t('word')}</th>
                      <th className="px-6 py-4 font-semibold">{t('pinyin')}</th>
                      <th className="px-6 py-4 font-semibold">{t('pos')}</th>
                      <th className="px-6 py-4 font-semibold w-16">Audio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(displayedItems as VocabItem[]).map((item, idx) => (
                      <tr key={idx} className="hover:bg-red-50/30 transition-colors group">
                        <td className="px-6 py-4 text-gray-400 font-mono text-sm">{item.ordinal || (currentPage - 1) * itemsPerPage + idx + 1}</td>
                        {level === 'all' && (
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center justify-center h-6 ${item.level && item.level.length > 2 ? 'px-1.5 min-w-[1.5rem]' : 'w-6'} bg-hsk-red text-white text-[10px] font-bold rounded-full whitespace-nowrap`}>
                              {renderLevelBadge(item.level)}
                            </span>
                          </td>
                        )}
                        <td className="px-6 py-4 text-xl font-serif text-ink font-medium">{renderHanzi(item.hanzi)}</td>
                        <td className="px-6 py-4 text-gray-600 font-mono">{item.pinyin}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                            {item.partOfSpeech}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <PlayButton text={item.hanzi} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        );

      case 'characters':
        // Group by type based on displayed items
        const readings = (displayedItems as CharItem[]).filter(i => i.type === 'reading' || !i.type);
        const writings = (displayedItems as CharItem[]).filter(i => i.type === 'writing');

        const renderCharGrid = (items: CharItem[], title: string, icon: React.ReactNode) => (
          <div className="mb-8 last:mb-0">
            <h3 className="text-lg font-bold text-ink mb-4 flex items-center">
              <span className="bg-gray-100 p-1.5 rounded-lg mr-2 text-gray-600">{icon}</span>
              {title}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {items.map((item, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:border-hsk-red/30 transition-colors relative group">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayButton text={item.char} iconSize={14} className="bg-white shadow-sm border border-gray-100" />
                  </div>
                  {level === 'all' && item.level && (
                    <span className={`absolute top-1 left-1 text-[9px] font-bold text-white bg-hsk-red rounded-full h-4 flex items-center justify-center ${item.level.length > 1 ? 'px-1.5 min-w-[1.25rem]' : 'w-4'} whitespace-nowrap`}>
                      {renderLevelBadge(item.level)}
                    </span>
                  )}
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-hsk-red/5 flex items-center justify-center mb-1 mt-2">
                    <span className="text-xl md:text-2xl font-serif text-hsk-red">{item.char}</span>
                  </div>
                  {item.pinyin && <p className="font-mono text-xs text-gray-500">{item.pinyin}</p>}
                  {item.meaning && <p className="text-xs font-medium text-ink truncate w-full mt-1" title={item.meaning}>{item.meaning}</p>}
                </div>
              ))}
            </div>
          </div>
        );

        return (
          <div className="space-y-6">
            {/* Search Bar */}
            {/* Search Bar */}
            {/* Combined Toolbar: Toggles + Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Type Toggles (Left) */}
              <div className="bg-gray-100 p-1 rounded-xl inline-flex gap-1 shadow-inner">
                <button
                  onClick={() => { setCharType('reading'); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${charType === 'reading'
                    ? 'bg-white text-hsk-red shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <Eye size={16} />
                  {t('reading')}

                </button>
                <button
                  onClick={() => { setCharType('writing'); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${charType === 'writing'
                    ? 'bg-white text-hsk-red shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <PenTool size={16} />
                  {t('writing')}

                </button>
              </div>

              {/* Search Bar (Right) */}
              <label className="relative block w-full md:max-w-xs">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  placeholder={getSearchPlaceholder()}
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hsk-red/20 shadow-sm bg-gray-50 hover:bg-white transition-all text-gray-700 placeholder-gray-400"
                />
                {filterQuery && (
                  <button
                    onClick={() => setFilterQuery('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </label>
            </div>

            {charType === 'reading' && readings.length > 0 && renderCharGrid(readings, t('reading'), <Eye size={16} />)}
            {charType === 'writing' && writings.length > 0 && renderCharGrid(writings, t('writing'), <PenTool size={16} />)}

            {(charType === 'reading' && readings.length === 0) || (charType === 'writing' && writings.length === 0) ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                <div className="flex justify-center mb-3">
                  {charType === 'reading' ? <Eye size={32} className="opacity-20" /> : <PenTool size={32} className="opacity-20" />}
                </div>
                {t('noChars')}
              </div>
            ) : null}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        );

      case 'grammar':
        // Get unique values for filters
        const allGrammarItems = data.items as GrammarItem[];

        // Helper to resolve translation for a given item's field
        const getTranslatedField = (item: GrammarItem, field: 'category' | 'subCategory' | 'name') => {
          if (language === 'en') {
            if (field === 'category') return item.category_en || translateGrammarTerm(item.category, 'en');
            if (field === 'subCategory') return item.sub_category_en || translateGrammarTerm(item.subCategory, 'en');
            if (field === 'name') return item.name_en || translateGrammarTerm(item.name, 'en');
          }
          if (language === 'vi') {
            if (field === 'category') return item.category_vi || translateGrammarTerm(item.category, 'vi');
            if (field === 'subCategory') return item.sub_category_vi || translateGrammarTerm(item.subCategory, 'vi');
            if (field === 'name') return item.name_vi || translateGrammarTerm(item.name, 'vi');
          }
          // Fallback or Chinese
          if (field === 'category') return translateGrammarTerm(item.category, language);
          if (field === 'subCategory') return translateGrammarTerm(item.subCategory, language);
          return item.name;
        };

        // Helper to get derived fields matching table logic (Raw & Display)
        const getDerivedGrammarFields = (item: GrammarItem) => {
          let catNameRaw = item.subCategory;
          let detailsRaw = '/';
          let displayCatName = '';
          let displayDetails = '/';
          let contentRaw = item.name;

          // Regex to match various dash types (hyphen, en-dash, em-dash)
          const dashRegex = /[-–—]/;

          if (item.subCategory && dashRegex.test(item.subCategory)) {
            const parts = item.subCategory.split(dashRegex);
            catNameRaw = parts[0].trim();
            detailsRaw = parts[1] ? parts[1].trim() : parts[0];

            const subEn = item.sub_category_en;
            const subVi = item.sub_category_vi;

            // Debug log to verify data arrival
            // console.log('Processing item:', item.subCategory, 'VI:', subVi);

            if (language === 'en' && subEn) {
              // Try to split the translation with the same flexibile regex
              const trParts = subEn.split(dashRegex);
              if (trParts.length >= 2) {
                displayCatName = trParts[0].trim();
                displayDetails = trParts[1].trim();
              } else {
                // Fallback: use full string for category, try to translate details separately
                displayCatName = subEn;
                // Try to keep details from raw if we can't translate it separately
                displayDetails = translateGrammarTerm(detailsRaw, language) || detailsRaw;
              }
            } else if (language === 'vi' && subVi) {
              const trParts = subVi.split(dashRegex);
              if (trParts.length >= 2) {
                displayCatName = trParts[0].trim();
                displayDetails = trParts[1].trim();
              } else {
                displayCatName = subVi;
                displayDetails = translateGrammarTerm(detailsRaw, language) || detailsRaw;
              }
            } else {
              displayCatName = translateGrammarTerm(catNameRaw, language);
              displayDetails = translateGrammarTerm(detailsRaw, language) || detailsRaw;
            }
          }
          else if (item.pattern && item.pattern !== item.name) {
            catNameRaw = item.subCategory;
            detailsRaw = item.name;
            contentRaw = item.pattern;

            displayCatName = getTranslatedField(item, 'subCategory');
            // Check if name has translation in name_en/vi specific to Details column
            if (language === 'en' && item.name_en) displayDetails = item.name_en;
            else if (language === 'vi' && item.name_vi) displayDetails = item.name_vi;
            else displayDetails = translateGrammarTerm(detailsRaw, language) || detailsRaw;
          }
          else {
            catNameRaw = item.subCategory;
            detailsRaw = '/';
            displayCatName = getTranslatedField(item, 'subCategory');
            displayDetails = '/';
          }

          return { catNameRaw, detailsRaw, category: item.category, displayCatName: displayCatName || '-', displayDetails, contentRaw };
        };

        // Calculate cascading options
        // 1. Categories: All available
        const uniqueCategories = Array.from(new Set(allGrammarItems.map(i => i.category).filter(Boolean)));

        // 2. SubCategories: Based on selected Category
        const availableForSub = selectedGrammarCat
          ? allGrammarItems.filter(i => i.category === selectedGrammarCat)
          : allGrammarItems;

        const uniqueSubCategories = Array.from(new Set(availableForSub.map(i => {
          const { catNameRaw } = getDerivedGrammarFields(i);
          return catNameRaw;
        }).filter(Boolean)));

        // 3. Patterns: Based on selected Category AND SubCategory
        const availableForPat = availableForSub.filter(i => {
          if (!selectedGrammarSub) return true;
          const { catNameRaw } = getDerivedGrammarFields(i);
          return catNameRaw === selectedGrammarSub;
        });

        const uniquePatterns = Array.from(new Set(availableForPat.map(i => {
          const { detailsRaw } = getDerivedGrammarFields(i);
          return detailsRaw === '/' ? '' : detailsRaw;
        }).filter(Boolean)));

        // Helper to get display label using translations
        const getLabelForCategory = (cat: string) => {
          const match = allGrammarItems.find(i => i.category === cat);
          if (match) return getTranslatedField(match, 'category');
          return translateGrammarTerm(cat, language);
        };
        const getLabelForSubCat = (subRaw: string) => {
          // Look in available items for better match context
          const match = availableForSub.find(i => getDerivedGrammarFields(i).catNameRaw === subRaw);
          if (match) return getDerivedGrammarFields(match).displayCatName;
          return translateGrammarTerm(subRaw, language);
        };
        const getLabelForPattern = (patRaw: string) => {
          // Look in available items
          const match = availableForPat.find(i => getDerivedGrammarFields(i).detailsRaw === patRaw);
          if (match) return getDerivedGrammarFields(match).displayDetails;
          return translateGrammarTerm(patRaw, language) || patRaw;
        };

        return (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex flex-nowrap gap-2 items-center overflow-x-auto pb-1 scrollbar-hide">
                <span className="text-sm font-medium text-gray-500 whitespace-nowrap">{t('filterBy')}:</span>

                {/* Category Filter */}
                <select
                  className="px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hsk-red/20 bg-white max-w-[140px] truncate"
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedGrammarCat(val);
                    setSelectedGrammarSub(''); // Reset Sub
                    setSelectedGrammarPat(''); // Reset Pat
                    setCurrentPage(1);
                  }}
                  value={selectedGrammarCat}
                >
                  <option value="">{t('category')}</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{getLabelForCategory(cat)}</option>
                  ))}
                </select>

                {/* SubCategory Filter (Derived Category Name) */}
                <select
                  className="px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hsk-red/20 bg-white max-w-[140px] truncate"
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedGrammarSub(val);
                    setSelectedGrammarPat(''); // Reset Pat
                    setCurrentPage(1);
                  }}
                  value={selectedGrammarSub}
                >
                  <option value="">{t('categoryName')}</option>
                  {uniqueSubCategories.map(sub => (
                    <option key={sub} value={sub}>{getLabelForSubCat(sub)}</option>
                  ))}
                </select>

                {/* Pattern Filter (Derived Details) */}
                <select
                  className="px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hsk-red/20 bg-white max-w-[140px] truncate"
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedGrammarPat(val);
                    setCurrentPage(1);
                  }}
                  value={selectedGrammarPat}
                >
                  <option value="">{t('details')}</option>
                  {uniquePatterns.map(pat => (
                    <option key={pat} value={pat}>{getLabelForPattern(pat)}</option>
                  ))}
                </select>

                {(selectedGrammarCat || selectedGrammarSub || selectedGrammarPat) && (
                  <button
                    onClick={() => {
                      setSelectedGrammarCat('');
                      setSelectedGrammarSub('');
                      setSelectedGrammarPat('');
                    }}
                    className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1 whitespace-nowrap"
                  >
                    <X size={14} /> {t('tryAgain')}
                  </button>
                )}

                <div className="flex-1 min-w-4" />

                {/* Search Box - Integrated */}
                <label className="relative block ml-auto flex-shrink-0">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder={getSearchPlaceholder()}
                    value={!filterQuery.includes(':') ? filterQuery : ''}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hsk-red/20 w-48 shadow-sm bg-white placeholder-gray-400/80"
                  />
                  {filterQuery && (
                    <button
                      onClick={() => setFilterQuery('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </label>
              </div>
            </div>

            {/* Grammar Index Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                      {level === 'all' && <th className="px-4 py-3 font-semibold w-16">HSK</th>}
                      <th className="px-4 py-3 font-semibold">{t('category')}</th>
                      <th className="px-4 py-3 font-semibold">{t('categoryName')}</th>
                      <th className="px-4 py-3 font-semibold">{t('details')}</th>
                      <th className="px-4 py-3 font-semibold">{t('grammarContent')}</th>
                      <th className="px-4 py-3 font-semibold w-16">Audio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(displayedItems as GrammarItem[]).map((item, idx) => {
                      const { displayCatName, displayDetails, contentRaw } = getDerivedGrammarFields(item);
                      const displayCategory = getTranslatedField(item, 'category');

                      return (
                        <tr key={idx} className="hover:bg-red-50/30 transition-colors group">
                          {level === 'all' && (
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center justify-center h-6 ${item.level && item.level.length > 2 ? 'px-1.5 min-w-[1.5rem]' : 'w-6'} bg-hsk-red text-white text-[10px] font-bold rounded-full whitespace-nowrap`}>
                                {renderLevelBadge(item.level)}
                              </span>
                            </td>
                          )}
                          <td className="px-4 py-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {displayCategory}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-ink">
                              {displayCatName}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-ink mb-1">
                              {displayDetails}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-ink">
                              {contentRaw}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <PlayButton text={contentRaw || item.name} iconSize={14} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        );

      case 'tasks':
        return (
          <div className="flex flex-col gap-6 relative">

            {/* Search Bar for Tasks */}
            {/* Search Bar Removed for Tasks */}

            <div className="flex gap-6 items-start">
              {/* Sidebar TOC */}
              <div className="hidden lg:block w-64 sticky top-6 max-h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="font-bold mb-3 px-2 text-gray-800 text-sm uppercase tracking-wider">{t('directory')}</h3>
                <div className="space-y-1">
                  {(displayedItems as TaskItem[]).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToTask(idx)}
                      className={`text-left w-full py-2 px-3 text-sm rounded-lg transition-all duration-200 flex items-start gap-2 ${activeTaskId === `task-${idx}`
                        ? 'bg-white shadow-sm text-blue-700 font-bold border-l-4 border-blue-600'
                        : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-blue-600 border-l-4 border-transparent'
                        }`}
                      title={item.category}
                    >
                      {level === 'all' && item.level && (
                        <span className={`inline-flex items-center justify-center shrink-0 h-5 ${item.level.length > 2 ? 'px-1 min-w-[1.25rem]' : 'w-5'} bg-hsk-red text-white text-[9px] font-bold rounded-full whitespace-nowrap mt-0.5`}>
                          {renderLevelBadge(item.level)}
                        </span>
                      )}
                      <span>{item.category}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0 space-y-6">
                {(displayedItems as TaskItem[]).map((item, idx) => (
                  <div
                    key={idx}
                    id={`task-${idx}`}
                    className={`bg-white p-6 rounded-2xl border transition-all duration-300 scroll-mt-24 ${activeTaskId === `task-${idx}` ? 'border-blue-200 shadow-md ring-1 ring-blue-100' : 'border-gray-100 shadow-sm'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-ink flex items-center gap-3">
                        {level === 'all' && item.level && (
                          <span className={`inline-flex items-center justify-center h-6 ${item.level.length > 2 ? 'px-1.5 min-w-[1.5rem]' : 'w-6'} bg-hsk-red text-white text-[10px] font-bold rounded-full whitespace-nowrap`}>
                            {renderLevelBadge(item.level)}
                          </span>
                        )}
                        {item.category}
                      </h3>
                    </div>
                    {item.description && (
                      <p className="text-gray-600 mb-4">{item.description}</p>
                    )}

                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-50">
                      <h4 className="text-sm font-bold text-blue-800 mb-3 uppercase tracking-wide">Can-do Statements</h4>
                      <ul className="space-y-2">
                        {item.canDo && item.canDo.length > 0 ? (
                          item.canDo.map((cando, i) => (
                            <li key={i} className="flex gap-2 text-ink text-sm">
                              <span className="text-blue-500 mt-0.5">•</span>
                              <span>{cando}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-400 text-sm italic">No details available.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'topics':
        const allTopics = data.items as TopicItem[];

        // Cascading Logic
        const uniquePrimTopics = Array.from(new Set(allTopics.map(t => t.primary).filter(Boolean)));

        const availableForSec = selectedTopicPrim
          ? allTopics.filter(t => t.primary === selectedTopicPrim)
          : allTopics;

        const uniqueSecTopics = Array.from(new Set(availableForSec.map(t => t.secondary).filter(Boolean)));

        return (
          <div className="space-y-4">
            {/* Filter Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex flex-nowrap gap-2 items-center overflow-x-auto pb-1 scrollbar-hide">
                <span className="text-sm font-medium text-gray-500 whitespace-nowrap">{t('filterBy')}:</span>

                {/* Primary Topic Filter */}
                <select
                  className="px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hsk-red/20 bg-white max-w-[140px] truncate capitalize"
                  onChange={(e) => {
                    setSelectedTopicPrim(e.target.value);
                    setSelectedTopicSec(''); // Reset secondary
                    setCurrentPage(1);
                  }}
                  value={selectedTopicPrim}
                >
                  <option value="">{t('primaryTopic')}</option>
                  {uniquePrimTopics.map(p => (
                    <option key={p} value={p} className="capitalize">{p}</option>
                  ))}
                </select>

                {/* Secondary Topic Filter */}
                <select
                  className="px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hsk-red/20 bg-white max-w-[140px] truncate capitalize"
                  onChange={(e) => {
                    setSelectedTopicSec(e.target.value);
                    setCurrentPage(1);
                  }}
                  value={selectedTopicSec}
                >
                  <option value="">{t('secondaryTopic')}</option>
                  {uniqueSecTopics.map(s => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>

                {(selectedTopicPrim || selectedTopicSec) && (
                  <button
                    onClick={() => {
                      setSelectedTopicPrim('');
                      setSelectedTopicSec('');
                    }}
                    className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1 whitespace-nowrap"
                  >
                    <X size={14} /> {t('tryAgain')}
                  </button>
                )}

                <div className="flex-1 min-w-4" />

                {/* Search Box */}
                <label className="relative block ml-auto flex-shrink-0">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder={getSearchPlaceholder()}
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hsk-red/20 w-48 shadow-sm bg-white placeholder-gray-400/80"
                  />
                  {filterQuery && (
                    <button
                      onClick={() => setFilterQuery('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                      {level === 'all' && <th className="px-6 py-4 font-semibold w-16">HSK</th>}
                      <th className="px-6 py-4 font-semibold">{t('primaryTopic')}</th>
                      <th className="px-6 py-4 font-semibold">{t('secondaryTopic')}</th>
                      <th className="px-6 py-4 font-semibold">Items</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(displayedItems as TopicItem[]).map((item, idx) => (
                      <tr key={idx} className="hover:bg-red-50/30 transition-colors group">
                        {level === 'all' && (
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center justify-center h-6 ${item.level && item.level.length > 2 ? 'px-1.5 min-w-[1.5rem]' : 'w-6'} bg-hsk-red text-white text-[10px] font-bold rounded-full whitespace-nowrap`}>
                              {renderLevelBadge(item.level)}
                            </span>
                          </td>
                        )}
                        <td className="px-6 py-4 text-ink font-bold align-top capitalize">{item.primary}</td>
                        <td className="px-6 py-4 text-gray-700 font-medium align-top capitalize">{item.secondary}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {(item.items || []).map((sub, i) => (
                              <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm mb-1 inline-block mr-1">
                                {sub}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        );

      case 'search':
        return (
          <div className="space-y-4">
            {displayedItems.map((item, idx) => {
              // Determine type based on fields
              if ('hanzi' in item) {
                // Vocab Item Card
                return (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-hsk-red/30 transition-colors flex justify-between items-start">
                    <div>
                      <div className="flex items-baseline gap-3 mb-1">
                        <h3 className="text-xl font-bold font-serif text-ink">{renderHanzi(item.hanzi)}</h3>
                        <PlayButton text={item.hanzi} className="mt-1" />
                        <span className="text-sm font-mono text-gray-500">{item.pinyin}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{item.partOfSpeech}</span>
                      </div>
                      <p className="text-gray-800 text-sm mb-1">{item.definition}</p>
                      {item.exampleSentence && <p className="text-gray-500 text-xs italic">"{item.exampleSentence}"</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{t('vocab')}</span>
                      {item.level && <span className="text-[10px] font-bold uppercase tracking-wider text-hsk-red bg-red-50 px-2 py-0.5 rounded border border-red-100">HSK {item.level}</span>}
                    </div>
                  </div>
                );
              } else if ('char' in item) {
                // Character Item Card
                const isWriting = (item.level === '1-2' || item.type === 'writing');
                const label = isWriting ? t('writing') : t('reading');

                return (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-hsk-red/30 transition-colors flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-hsk-red/5 flex items-center justify-center text-2xl font-serif text-hsk-red relative group">
                        {item.char}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/80 rounded-lg transition-opacity">
                          <PlayButton text={item.char} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-sm font-semibold">{item.pinyin}</span>
                          <span className="text-xs text-gray-400 border border-gray-100 px-1 rounded">{item.strokes} strokes</span>
                        </div>
                        <p className="text-sm text-gray-600">{item.meaning}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded text-center">{label}</span>
                      {item.level && <span className="text-[10px] font-bold uppercase tracking-wider text-hsk-red bg-red-50 px-2 py-0.3 rounded border border-red-100">HSK {item.level === '1-2' ? '1-2' : item.level}</span>}
                    </div>
                  </div>
                );
              } else if ('pattern' in item) {
                // Grammar Item Card
                return (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-hsk-red/30 transition-colors flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-md font-bold text-ink">{item.name}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{item.category}</span>
                      </div>
                      <div className="bg-gray-50 px-3 py-2 rounded-lg mb-2 font-mono text-sm text-hsk-red">
                        {item.pattern}
                      </div>
                      <p className="text-sm text-gray-700">{item.explanation}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{t('grammar')}</span>
                      {item.level && <span className="text-[10px] font-bold uppercase tracking-wider text-hsk-red bg-red-50 px-2 py-0.5 rounded border border-red-100">HSK {item.level}</span>}
                    </div>
                  </div>
                );
              }
              // Add other types as needed
              return null;
            })}
          </div>
        );

      default:
        return <div>{t('comingSoon')}</div>;
    }
  };

  return (
    <div>
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
};