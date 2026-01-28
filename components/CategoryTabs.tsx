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
    { id: 'vocabulary', label: t('vocab'), icon: <BookA size={18} /> },
    { id: 'characters', label: t('chars'), icon: <Languages size={18} /> },
    { id: 'grammar', label: t('grammar'), icon: <ScrollText size={18} /> },
    { id: 'tasks', label: t('tasks'), icon: <ListTodo size={18} /> },
    { id: 'topics', label: t('topics'), icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-2xl w-full max-w-2xl mx-auto mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelectCategory(tab.id)}
          className={`
            flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-xl transition-all duration-200
            ${currentCategory === tab.id
              ? 'bg-white text-ink shadow-sm ring-1 ring-black/5'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}
          `}
        >
          <span className="mr-2 opacity-70">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};