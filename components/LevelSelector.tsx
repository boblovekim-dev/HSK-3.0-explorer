import React from 'react';
import { HskLevel } from '../types';
import { Layers } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  currentLevel: HskLevel;
  onSelectLevel: (level: HskLevel) => void;
}

const levels: HskLevel[] = ['1', '2', '3', '4', '5', '6', '7-9'];

export const LevelSelector: React.FC<Props> = ({ currentLevel, onSelectLevel }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full md:w-64 bg-white md:h-screen border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-6 flex items-center space-x-2 border-b border-gray-100">
        <div className="bg-hsk-red text-white p-2 rounded-lg">
            <Layers size={24} />
        </div>
        <div>
            <h1 className="text-xl font-bold text-ink">HSK 3.0</h1>
            <p className="text-xs text-gray-500 font-medium tracking-wider">{t('syllabusExplorer')}</p>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 px-2">{t('selectLevel')}</h2>
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => onSelectLevel(level)}
              className={`
                flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium whitespace-nowrap
                ${currentLevel === level 
                  ? 'bg-hsk-red text-white shadow-md shadow-red-200 translate-x-1' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-hsk-red'}
              `}
            >
              <span className={`
                w-8 h-8 rounded-full flex items-center justify-center mr-3 text-xs font-bold
                ${currentLevel === level ? 'bg-white text-hsk-red' : 'bg-gray-100 text-gray-500'}
              `}>
                {level === '7-9' ? 'Adv' : level}
              </span>
              HSK {t('level')} {level}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 hidden md:block">
        <p className="text-xs text-gray-400 text-center">
            {t('basedOn')} <br/>(Modern Chinese Proficiency Test)
        </p>
      </div>
    </div>
  );
};