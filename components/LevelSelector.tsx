import React from 'react';
import { HskLevel } from '../types';
import { Layers } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  currentLevel: HskLevel;
  onSelectLevel: (level: HskLevel) => void;
}

const levels: HskLevel[] = ['all', '1', '2', '3', '4', '5', '6', '7-9'];

export const LevelSelector: React.FC<Props> = ({ currentLevel, onSelectLevel }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full md:w-64 bg-white md:h-screen border-b md:border-b-0 md:border-r border-gray-200 flex flex-col shrink-0">
      {/* Logo - Hidden on mobile */}
      <div className="p-4 md:p-6 items-center space-x-2 border-b border-gray-100 hidden md:flex">
        <div className="bg-hsk-red text-white p-2 rounded-lg">
          <Layers size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink">HSK 3.0</h1>
          <p className="text-xs text-gray-500 font-medium tracking-wider">{t('syllabusExplorer')}</p>
        </div>
      </div>

      {/* Level Selection */}
      <div className="p-2 md:p-4 flex-1 overflow-hidden">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 md:mb-4 px-2 hidden md:block">{t('selectLevel')}</h2>
        {/* Mobile: horizontal scroll with gradient overlay */}
        <div className="relative">
          <div className="flex flex-row md:flex-col gap-1 md:gap-2 overflow-x-auto md:overflow-visible pb-1 md:pb-0 scrollbar-hide">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => onSelectLevel(level)}
                className={`
                  flex items-center px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl transition-all duration-200 text-xs md:text-sm font-medium whitespace-nowrap shrink-0
                  ${currentLevel === level
                    ? 'bg-hsk-red text-white shadow-md shadow-red-200 md:translate-x-1'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-hsk-red bg-gray-50 md:bg-transparent'}
                `}
              >
                <span className={`
                  w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-1.5 md:mr-3 text-[10px] md:text-xs font-bold
                  ${currentLevel === level ? 'bg-white text-hsk-red' : 'bg-gray-100 md:bg-gray-100 text-gray-500'}
                `}>
                  {level === 'all' ? '全' : level === '7-9' ? 'Adv' : level}
                </span>
                <span className="hidden md:inline">{level === 'all' ? t('allLevels') : `HSK ${t('level')} ${level}`}</span>
                <span className="md:hidden">{level === 'all' ? t('allLevels') : `HSK ${level}`}</span>
              </button>
            ))}
          </div>
          {/* Gradient fade indicator for horizontal scroll on mobile */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden"></div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 hidden md:block">
        <p className="text-xs text-gray-400 text-center">
          {t('basedOn')} <br />(Modern Chinese Proficiency Test)
        </p>
      </div>
    </div>
  );
};