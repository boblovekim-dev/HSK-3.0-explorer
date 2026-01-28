import React, { useState } from 'react';
import { HskLevel, Category } from '../types';
import { Layers, BookA, Languages, ScrollText, Search, ArrowRight, ListTodo, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  onNavigate: (level: HskLevel, category: Category) => void;
  onSearch: (query: string) => void;
}

export const HomePage: React.FC<Props> = ({ onNavigate, onSearch }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-paper">
      {/* Hero Section */}
      <div
        className="py-24 px-6 relative overflow-hidden bg-cover bg-center"
        style={{
          // TODO: Replace this URL with your local image path (e.g. '/bamboo-bg.jpg')
          backgroundImage: "url('https://img.freepik.com/free-vector/chinese-ink-painting-bamboo-background_23-2148886361.jpg?w=1380')",
          backgroundColor: '#f9f7f2' // Fallback color
        }}
      >
        {/* Overlay gradient to ensure text readability if image is too busy */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-paper/90 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight text-ink drop-shadow-sm">
            {t('heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('heroDesc')}
          </p>

          <div className="w-full max-w-lg mx-auto relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-hsk-red pointer-events-none">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-white/90 backdrop-blur-sm text-ink pl-14 pr-14 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all border border-gray-200/50 outline-none focus:ring-2 focus:ring-hsk-red/20 text-base"
            />
            <button
              onClick={handleSearchSubmit}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-hsk-red text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-sm"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Index */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-ink mb-8 flex items-center">
          <Layers className="mr-2 text-hsk-red" />
          {t('levelIndex')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['1', '2', '3', '4', '5', '6', '7-9'].map((level) => (
            <div key={level} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-ink">{t('level')} {level}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${level === '7-9' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                  {level === '7-9' ? t('advanced') : t('standard')}
                </span>
              </div>

              <div className="space-y-2">
                <button onClick={() => onNavigate(level as HskLevel, 'vocabulary')} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 group text-sm text-gray-600">
                  <span className="flex items-center"><BookA size={16} className="mr-3 text-hsk-red opacity-70 group-hover:opacity-100" /> {t('vocab')}</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-hsk-red" />
                </button>
                <button onClick={() => onNavigate(level as HskLevel, 'characters')} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 group text-sm text-gray-600">
                  <span className="flex items-center"><Languages size={16} className="mr-3 text-hsk-red opacity-70 group-hover:opacity-100" /> {t('chars')}</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-hsk-red" />
                </button>
                <button onClick={() => onNavigate(level as HskLevel, 'grammar')} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 group text-sm text-gray-600">
                  <span className="flex items-center"><ScrollText size={16} className="mr-3 text-hsk-red opacity-70 group-hover:opacity-100" /> {t('grammar')}</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-hsk-red" />
                </button>
                <div className="border-t border-gray-50 my-1"></div>
                <button onClick={() => onNavigate(level as HskLevel, 'tasks')} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 group text-sm text-gray-600">
                  <span className="flex items-center"><ListTodo size={16} className="mr-3 text-hsk-red opacity-70 group-hover:opacity-100" /> {t('tasks')}</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-hsk-red" />
                </button>
                <button onClick={() => onNavigate(level as HskLevel, 'topics')} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 group text-sm text-gray-600">
                  <span className="flex items-center"><MessageSquare size={16} className="mr-3 text-hsk-red opacity-70 group-hover:opacity-100" /> {t('topics')}</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-hsk-red" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats / Info Footer */}
        <div className="mt-16 grid grid-cols-3 gap-4 text-center border-t border-gray-200 pt-12">
          <div>
            <p className="text-3xl font-bold text-hsk-red font-serif">11,092</p>
            <p className="text-sm text-gray-500 uppercase tracking-wider mt-1">{t('totalWords')}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-hsk-red font-serif">3,000</p>
            <p className="text-sm text-gray-500 uppercase tracking-wider mt-1">{t('totalChars')}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-hsk-red font-serif">572</p>
            <p className="text-sm text-gray-500 uppercase tracking-wider mt-1">{t('totalGrammar')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};