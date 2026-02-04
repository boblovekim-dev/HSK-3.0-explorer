import React from 'react';
import { Category } from '../types';
import { BookA, Languages, ScrollText, ListTodo, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  currentCategory: Category;
  onSelectCategory: (cat: Category) => void;
}

export const CategoryTabs: React.FC<Props> = ({ currentCategory, onSelectCategory }) => {
  const { t } = useLanguage();

  const tabs: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: 'vocabulary', label: t('vocab'), icon: <BookA size={16} /> },
    { id: 'characters', label: t('chars'), icon: <Languages size={16} /> },
    { id: 'grammar', label: t('grammar'), icon: <ScrollText size={16} /> },
    { id: 'tasks', label: t('tasks'), icon: <ListTodo size={16} /> },
    { id: 'topics', label: t('topics'), icon: <MessageSquare size={16} /> },
  ];

  return (
    <div className="relative mb-4 md:mb-8">
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl md:rounded-2xl w-full max-w-2xl mx-auto overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectCategory(tab.id)}
            className={`
              flex-1 flex items-center justify-center py-2 md:py-2.5 px-2 md:px-4 text-xs md:text-sm font-medium rounded-lg md:rounded-xl transition-all duration-200 whitespace-nowrap shrink-0
              ${currentCategory === tab.id
                ? 'bg-white text-ink shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}
            `}
          >
            <span className="mr-1 md:mr-2 opacity-70">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
          </button>
        ))}
      </div>
      {/* Gradient fade indicator for horizontal scroll on mobile */}
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-paper to-transparent pointer-events-none md:hidden"></div>
    </div>
  );
};