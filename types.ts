export type HskLevel = 'all' | '1' | '2' | '3' | '4' | '5' | '6' | '7-9';

export type Category = 'vocabulary' | 'characters' | 'grammar' | 'tasks' | 'topics' | 'search';

export interface BaseItem {
  source?: 'official' | 'ai';
  level?: string;
  section?: Category;
}

export interface VocabItem extends BaseItem {
  ordinal?: number;      // 序号
  hanzi: string;         // 词语
  pinyin: string;        // 拼音
  partOfSpeech: string;  // 词性
  definition: string;    // English definition (kept for UI)
  exampleSentence?: string;
}

export interface CharItem extends BaseItem {
  ordinal?: number;
  char: string;
  pinyin?: string;
  meaning?: string;
  strokes?: number;
  type?: 'reading' | 'writing'; // 认读字 vs 书写字
}

export interface GrammarItem extends BaseItem {
  category: string;      // e.g. 短语 (Phrase), 句子成分 (Sentence Component)
  subCategory?: string;  // e.g. 联合短语 (Union Phrase)
  pattern: string;       // Structure/Pattern
  name: string;          // Specific name
  explanation: string;
  example: string;
  // Translation fields (optional, from DB)
  category_en?: string;
  category_vi?: string;
  sub_category_en?: string;
  sub_category_vi?: string;
  name_en?: string;
  name_vi?: string;
}

export interface TaskItem extends BaseItem {
  category: string;      // e.g. "一、 问答个人基本信息"
  description: string;
  canDo: string[];       // List of can-do statements
}

export interface TopicItem extends BaseItem {
  primary: string;       // e.g. "一、 基本信息"
  secondary: string;     // e.g. "1. 个人信息"
  items: string[];       // tertiary items like "姓名、国籍"
}

export interface SyllabusResponse {
  items: (VocabItem | CharItem | GrammarItem | TaskItem | TopicItem)[];
  description: string;
}

export interface LoadingState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}