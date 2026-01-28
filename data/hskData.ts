import { VocabItem, CharItem, GrammarItem } from '../types';

interface HskDataStore {
  vocabulary: Record<string, VocabItem[]>;
  characters: Record<string, CharItem[]>;
  grammar: Record<string, GrammarItem[]>;
}

// -------------------------------------------------------------------------
// OFFICIAL HSK 3.0 DATA
// -------------------------------------------------------------------------
export const OFFICIAL_DATA: HskDataStore = {
  vocabulary: {
    '1': [
      { ordinal: 1, hanzi: '爱', pinyin: 'ài', partOfSpeech: '动', definition: 'to love', exampleSentence: '妈妈，我爱你。', source: 'official' },
      { ordinal: 2, hanzi: '八', pinyin: 'bā', partOfSpeech: '数', definition: 'eight', exampleSentence: '我有八个苹果。', source: 'official' },
      { ordinal: 3, hanzi: '爸爸', pinyin: 'bàba', partOfSpeech: '名', definition: 'father', exampleSentence: '我爸爸是医生。', source: 'official' },
      { ordinal: 4, hanzi: '吧', pinyin: 'ba', partOfSpeech: '助', definition: 'particle (suggestion)', exampleSentence: '我们走吧。', source: 'official' },
      { ordinal: 5, hanzi: '白天', pinyin: 'báitian', partOfSpeech: '名', definition: 'daytime', exampleSentence: '白天我在工作。', source: 'official' },
      { ordinal: 6, hanzi: '百', pinyin: 'bǎi', partOfSpeech: '数', definition: 'hundred', exampleSentence: '这里有一百个人。', source: 'official' },
      { ordinal: 7, hanzi: '半', pinyin: 'bàn', partOfSpeech: '数、(副)', definition: 'half', exampleSentence: '现在两点半。', source: 'official' },
      { ordinal: 8, hanzi: '包子', pinyin: 'bāozi', partOfSpeech: '名', definition: 'steamed bun', exampleSentence: '我想吃包子。', source: 'official' },
      { ordinal: 9, hanzi: '杯子', pinyin: 'bēizi', partOfSpeech: '名', definition: 'cup', exampleSentence: '这是一个杯子。', source: 'official' },
      { ordinal: 10, hanzi: '本', pinyin: 'běn', partOfSpeech: '量', definition: 'measure word for books', exampleSentence: '一本书。', source: 'official' },
      { ordinal: 11, hanzi: '边', pinyin: 'biān', partOfSpeech: '名、后缀', definition: 'side', exampleSentence: '在左边。', source: 'official' },
      { ordinal: 12, hanzi: '病', pinyin: 'bìng', partOfSpeech: '名、动', definition: 'illness; sick', exampleSentence: '他病了。', source: 'official' },
    ]
  },
  characters: {
    '1': [
      // 认读字 (Reading)
      { char: '爱', type: 'reading', source: 'official' },
      { char: '八', type: 'reading', source: 'official' },
      { char: '爸', type: 'reading', source: 'official' },
      { char: '吧', type: 'reading', source: 'official' },
      { char: '白', type: 'reading', source: 'official' },
      { char: '百', type: 'reading', source: 'official' },
      { char: '班', type: 'reading', source: 'official' },
      { char: '半', type: 'reading', source: 'official' },
      { char: '包', type: 'reading', source: 'official' },
      { char: '杯', type: 'reading', source: 'official' },
      { char: '本', type: 'reading', source: 'official' },
      { char: '边', type: 'reading', source: 'official' },
      { char: '便', type: 'reading', source: 'official' },
      { char: '病', type: 'reading', source: 'official' },
      { char: '不', type: 'reading', source: 'official' },
      { char: '菜', type: 'reading', source: 'official' },
      { char: '茶', type: 'reading', source: 'official' },
      { char: '常', type: 'reading', source: 'official' },
      { char: '唱', type: 'reading', source: 'official' },
      { char: '超', type: 'reading', source: 'official' },
      { char: '车', type: 'reading', source: 'official' },
      { char: '吃', type: 'reading', source: 'official' },
      { char: '出', type: 'reading', source: 'official' },
      { char: '穿', type: 'reading', source: 'official' },
      { char: '床', type: 'reading', source: 'official' },
      { char: '打', type: 'reading', source: 'official' },
    ],
    '5': [
       // 书写字 (Writing)
      { char: '版', type: 'writing', source: 'official' },
      { char: '扮', type: 'writing', source: 'official' },
      { char: '伴', type: 'writing', source: 'official' },
      { char: '宝', type: 'writing', source: 'official' },
      { char: '贝', type: 'writing', source: 'official' },
      { char: '币', type: 'writing', source: 'official' },
      { char: '闭', type: 'writing', source: 'official' },
      { char: '补', type: 'writing', source: 'official' },
      { char: '布', type: 'writing', source: 'official' },
      { char: '采', type: 'writing', source: 'official' },
      { char: '册', type: 'writing', source: 'official' },
      { char: '测', type: 'writing', source: 'official' },
      { char: '叉', type: 'writing', source: 'official' },
      { char: '吵', type: 'writing', source: 'official' },
      { char: '沉', type: 'writing', source: 'official' },
      { char: '称', type: 'writing', source: 'official' },
      { char: '承', type: 'writing', source: 'official' },
      { char: '尺', type: 'writing', source: 'official' },
      { char: '冲', type: 'writing', source: 'official' },
      { char: '充', type: 'writing', source: 'official' },
      { char: '虫', type: 'writing', source: 'official' },
      { char: '抽', type: 'writing', source: 'official' },
      { char: '丑', type: 'writing', source: 'official' },
      { char: '臭', type: 'writing', source: 'official' },
      { char: '传', type: 'writing', source: 'official' },
      { char: '创', type: 'writing', source: 'official' },
    ]
  },
  grammar: {
    '1': [
      {
        category: '短语',
        subCategory: '联合短语',
        name: '联合短语 (Union Phrase)',
        pattern: 'A + B',
        explanation: 'Two or more words of the same part of speech connected together.',
        example: '老师和学生 (Teachers and students)',
        source: 'official'
      },
      {
        category: '短语',
        subCategory: '偏正短语',
        name: '偏正短语 (Modifier-Head Phrase)',
        pattern: 'Modifier + Head',
        explanation: 'A phrase where the first part modifies the meaning of the second part.',
        example: '好书 (Good book)',
        source: 'official'
      },
      {
        category: '句子成分',
        subCategory: '主语',
        name: '主语 (Subject)',
        pattern: 'Noun/Pronoun as Subject',
        explanation: '名词、代词或名词性短语作主语',
        example: '我在吃饭。 (I am eating.)',
        source: 'official'
      },
      {
        category: '句子成分',
        subCategory: '谓语',
        name: '谓语 (Predicate)',
        pattern: 'Verb/Adj as Predicate',
        explanation: '名词、代词、数词或数量短语作谓语; 动词或动词性短语、形容词或形容词性短语作谓语',
        example: '今天星期一。 (Today is Monday.)',
        source: 'official'
      }
    ]
  }
};