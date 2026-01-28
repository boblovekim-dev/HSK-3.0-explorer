import React, { useState, useEffect } from 'react';
import { Category, SyllabusResponse, VocabItem, CharItem, GrammarItem, TaskItem, TopicItem } from '../types';
import { Volume2, Sparkles, ShieldCheck, PenTool, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Pagination } from './Pagination';

interface Props {
  data: SyllabusResponse | null;
  category: Category;
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

export const ContentList: React.FC<Props> = ({ data, category, isLoading, onRefresh }) => {
  const { t } = useLanguage();

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    setCurrentPage(1);
  }, [category, data, onRefresh]);

  const renderContent = () => {
    const totalPages = Math.ceil(data.items.length / itemsPerPage);
    const displayedItems = data.items.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    switch (category) {
      case 'vocabulary':

        return (
          <div className="space-y-4">
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold w-16">No.</th>
                      <th className="px-6 py-4 font-semibold">{t('word')}</th>
                      <th className="px-6 py-4 font-semibold">{t('pinyin')}</th>
                      <th className="px-6 py-4 font-semibold">{t('pos')}</th>
                      <th className="px-6 py-4 font-semibold">{t('defAndExample')}</th>
                      <th className="px-6 py-4 font-semibold w-24">{t('source')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(displayedItems as VocabItem[]).map((item, idx) => (
                      <tr key={idx} className="hover:bg-red-50/30 transition-colors group">
                        <td className="px-6 py-4 text-gray-400 font-mono text-sm">{item.ordinal || (currentPage - 1) * itemsPerPage + idx + 1}</td>
                        <td className="px-6 py-4 text-xl font-serif text-ink font-medium">{item.hanzi}</td>
                        <td className="px-6 py-4 text-gray-600 font-mono">{item.pinyin}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                            {item.partOfSpeech}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-800 font-medium mb-1">{item.definition}</p>
                          {item.exampleSentence && (
                            <p className="text-gray-500 text-xs italic">"{item.exampleSentence}"</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <SourceBadge source={item.source} />
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
                <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:border-hsk-red/30 transition-colors relative">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-hsk-red/5 flex items-center justify-center mb-1">
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
          <div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
            {readings.length > 0 && renderCharGrid(readings, t('reading'), <Eye size={16} />)}
            {writings.length > 0 && renderCharGrid(writings, t('writing'), <PenTool size={16} />)}

            {readings.length === 0 && writings.length === 0 && (
              <div className="text-center py-12 text-gray-400">{t('noChars')}</div>
            )}
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
        return (
          <div className="space-y-6">
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
            {(displayedItems as GrammarItem[]).map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-hsk-red/20 group-hover:bg-hsk-red transition-colors"></div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{item.category}</span>
                      {item.subCategory && <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">› {item.subCategory}</span>}
                    </div>
                    <h3 className="text-lg font-bold text-ink">{item.name}</h3>
                  </div>
                  <SourceBadge source={item.source} />
                </div>

                <div className="mb-4">
                  <code className="text-sm bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg font-mono inline-block border border-blue-100">
                    {item.pattern}
                  </code>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed text-sm">{item.explanation}</p>

                <div className="flex items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <Volume2 size={16} className="text-hsk-red mt-0.5 mr-3 shrink-0" />
                  <p className="text-ink font-medium text-sm">{item.example}</p>
                </div>
              </div>
            ))}
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
          <div className="space-y-6">
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
            {(data.items as TaskItem[]).map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-ink">{item.category}</h3>
                  <SourceBadge source={item.source} />
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
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        );

      case 'topics':
        return (
          <div className="space-y-4">
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold w-1/4">Primary Topic</th>
                      <th className="px-6 py-4 font-semibold w-1/4">Secondary Topic</th>
                      <th className="px-6 py-4 font-semibold">Items</th>
                      <th className="px-6 py-4 font-semibold w-24">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(displayedItems as TopicItem[]).map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-ink font-bold align-top">{item.primary}</td>
                        <td className="px-6 py-4 text-gray-700 font-medium align-top">{item.secondary}</td>
                        <td className="px-6 py-4 align-top">
                          <div className="flex flex-wrap gap-2">
                            {item.items.map((sub, i) => (
                              <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                                {sub}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <SourceBadge source={item.source} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </div>
        );

      case 'search':
        return (
          <div className="space-y-4">
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
            {displayedItems.map((item, idx) => {
              // Determine type based on fields
              if ('hanzi' in item) {
                // Vocab Item Card
                return (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-hsk-red/30 transition-colors flex justify-between items-start">
                    <div>
                      <div className="flex items-baseline gap-3 mb-1">
                        <h3 className="text-xl font-bold font-serif text-ink">{item.hanzi}</h3>
                        <span className="text-sm font-mono text-gray-500">{item.pinyin}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{item.partOfSpeech}</span>
                      </div>
                      <p className="text-gray-800 text-sm mb-1">{item.definition}</p>
                      {item.exampleSentence && <p className="text-gray-500 text-xs italic">"{item.exampleSentence}"</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{t('vocab')}</span>
                      {item.level && <span className="text-[10px] font-bold uppercase tracking-wider text-hsk-red bg-red-50 px-2 py-0.5 rounded border border-red-100">HSK {item.level}</span>}
                      <SourceBadge source={item.source} />
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
                      <div className="w-12 h-12 rounded-lg bg-hsk-red/5 flex items-center justify-center text-2xl font-serif text-hsk-red">
                        {item.char}
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
                      {item.level && <span className="text-[10px] font-bold uppercase tracking-wider text-hsk-red bg-red-50 px-2 py-0.5 rounded border border-red-100">HSK {item.level === '1-2' ? '1-2' : item.level}</span>}
                      <SourceBadge source={item.source} />
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
                        <code className="text-xs bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-mono">
                          {item.pattern}
                        </code>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.explanation}</p>
                      <p className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded inline-block">{item.example}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{t('grammar')}</span>
                      {item.level && <span className="text-[10px] font-bold uppercase tracking-wider text-hsk-red bg-red-50 px-2 py-0.5 rounded border border-red-100">HSK {item.level}</span>}
                      <SourceBadge source={item.source} />
                    </div>
                  </div>
                );
              }
              return null;
            })}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-6 bg-paper border border-gray-200 p-4 rounded-xl flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {data.description}
        </p>
        <div className="text-xs text-gray-400 font-mono">
          {data.items.length} Items
        </div>
      </div>

      {renderContent()}


    </div>
  );
};