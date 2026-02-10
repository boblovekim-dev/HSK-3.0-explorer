export type Language = 'zh' | 'en' | 'vi';

// Grammar category translations (Chinese key -> translated value)
export const grammarCategoryTranslations: Record<Language, Record<string, string>> = {
  en: {
    '语素': 'Morpheme',
    '词类': 'Parts of Speech',
    '短语': 'Phrase',
    '句子成分': 'Sentence Component',
    '句子的类型': 'Sentence Types',
    '动作的态': 'Verb Aspect',
    '特殊表达法': 'Special Expressions',
    '固定格式': 'Fixed Patterns',
    '前缀': 'Prefix',
    '后缀': 'Suffix',
    // SubCategories
    '联合短语': 'Coordinate Phrase',
    '偏正短语': 'Modifier-Head Phrase',
    '动宾短语': 'Verb-Object Phrase',
    '补充短语': 'Complement Phrase',
    '主谓短语': 'Subject-Predicate Phrase',
    '连谓短语': 'Serial Verb Phrase',
    '兼语短语': 'Pivotal Phrase',
    '方位短语': 'Locative Phrase',
    '介词短语': 'Prepositional Phrase',
    '的字短语': '的-Phrase',
    '比况短语': 'Simile Phrase',
    '数量短语': 'Numeral-Measure Phrase',
    '名词': 'Noun',
    '动词': 'Verb',
    '形容词': 'Adjective',
    '数词': 'Numeral',
    '量词': 'Measure Word',
    '代词': 'Pronoun',
    '副词': 'Adverb',
    '介词': 'Preposition',
    '连词': 'Conjunction',
    '助词': 'Particle',
    '叹词': 'Interjection',
    '拟声词': 'Onomatopoeia',
    '主语': 'Subject',
    '谓语': 'Predicate',
    '宾语': 'Object',
    '定语': 'Attributive',
    '状语': 'Adverbial',
    '补语': 'Complement',
    '陈述句': 'Declarative',
    '疑问句': 'Interrogative',
    '祈使句': 'Imperative',
    '感叹句': 'Exclamatory',
    '时间表示法': 'Time Expression',
    '钟点表示法': 'Telling Time',
    '年、月、日表示法': 'Date Expression',
    '钱数表示法': 'Currency Expression',
    '号玛表示法': 'Number Code Expression',
    '进行态': 'Progressive Aspect',
    // Details (Grammar Points)
    '方位名词': 'Locative Noun',
    '时间名词': 'Time Noun',
    '处所名词': 'Place Noun',
    '人称代词': 'Personal Pronoun',
    '指示代词': 'Demonstrative Pronoun',
    '疑问代词': 'Interrogative Pronoun',
    '能愿动词': 'Modal Verb',
    '趋向动词': 'Directional Verb',
    '离合词': 'Separable Word',
    '关系动词': 'Relational Verb',
    '程度副词': 'Adverb of Degree',
    '范围副词': 'Adverb of Scope',
    '时间副词': 'Adverb of Time',
    '否定副词': 'Adverb of Negation',
    '频率副词': 'Adverb of Frequency',
    '语气副词': 'Adverb of Mood',
    '结构助词': 'Structural Particle',
    '动态助词': 'Aspect Particle',
    '语气助词': 'Modal Particle',
    '名量词': 'Nominal Measure Word',
    '动量词': 'Verbal Measure Word',
    '时量词': 'Time Measure Word',
    '并列连词': 'Coordinating Conjunction',
    '偏正连词': 'Subordinating Conjunction',
  },
  vi: {
    '语素': 'Hình vị',
    '词类': 'Từ loại',
    '短语': 'Cụm từ',
    '句子成分': 'Thành phần câu',
    '句子的类型': 'Loại câu',
    '动作的态': 'Thể của động từ',
    '特殊表达法': 'Cách diễn đạt đặc biệt',
    '固定格式': 'Cấu trúc cố định',
    '前缀': 'Tiền tố',
    '后缀': 'Hậu tố',
    // SubCategories
    '联合短语': 'Cụm từ liên hợp',
    '偏正短语': 'Cụm từ chính phụ',
    '动宾短语': 'Cụm động tân',
    '补充短语': 'Cụm bổ ngữ',
    '主谓短语': 'Cụm chủ vị',
    '连谓短语': 'Cụm động từ liên tiếp',
    '兼语短语': 'Cụm kiêm ngữ',
    '方位短语': 'Cụm phương vị',
    '介词短语': 'Cụm giới từ',
    '的字短语': 'Cụm từ có "的"',
    '比况短语': 'Cụm so sánh',
    '数量短语': 'Cụm số lượng',
    '名词': 'Danh từ',
    '动词': 'Động từ',
    '形容词': 'Tính từ',
    '数词': 'Số từ',
    '量词': 'Lượng từ',
    '代词': 'Đại từ',
    '副词': 'Phó từ',
    '介词': 'Giới từ',
    '连词': 'Liên từ',
    '助词': 'Trợ từ',
    '叹词': 'Thán từ',
    '拟声词': 'Từ tượng thanh',
    '主语': 'Chủ ngữ',
    '谓语': 'Vị ngữ',
    '宾语': 'Tân ngữ',
    '定语': 'Định ngữ',
    '状语': 'Trạng ngữ',
    '补语': 'Bổ ngữ',
    '陈述句': 'Câu trần thuật',
    '疑问句': 'Câu nghi vấn',
    '祈使句': 'Câu cầu khiến',
    '感叹句': 'Câu cảm thán',
    '时间表示法': 'Cách biểu đạt thời gian',
    '钟点表示法': 'Cách nói giờ',
    '年、月、日表示法': 'Cách nói ngày tháng',
    '钱数表示法': 'Cách nói tiền tệ',
    '号玛表示法': 'Cách nói số hiệu',
    '进行态': 'Thể tiếp diễn',
    // Details (Grammar Points)
    '方位名词': 'Danh từ chỉ phương vị',
    '时间名词': 'Danh từ chỉ thời gian',
    '处所名词': 'Danh từ chỉ nơi chốn',
    '人称代词': 'Đại từ nhân xưng',
    '指示代词': 'Đại từ chỉ thị',
    '疑问代词': 'Đại từ nghi vấn',
    '能愿动词': 'Động từ năng nguyện',
    '趋向动词': 'Động từ xu hướng',
    '离合词': 'Từ ly hợp',
    '动词-动词重叠': 'Lặp lại động từ',
    '动词重叠': 'Lặp lại động từ',
    '形容词重叠': 'Lặp lại tính từ',
    '四字格': 'Thành ngữ bốn chữ',
    '关系动词': 'Động từ quan hệ',
    '其他': 'Khác',
    '程度副词': 'Phó từ chỉ mức độ',
    '范围副词': 'Phó từ chỉ phạm vi',
    '时间副词': 'Phó từ chỉ thời gian',
    '否定副词': 'Phó từ phủ định',
    '频率副词': 'Phó từ chỉ tần suất',
    '语气副词': 'Phó từ chỉ ngữ khí',
    '结构助词': 'Trợ từ kết cấu',
    '动态助词': 'Trợ từ động thái',
    '语气助词': 'Trợ từ ngữ khí',
    '名量词': 'Danh lượng từ',
    '动量词': 'Động lượng từ',
    '时量词': 'Thời lượng từ',
    '并列连词': 'Liên từ đẳng lập',
    '偏正连词': 'Liên từ chính phụ',
    '关联副词': 'Phó từ liên kết',
    '持续态': 'Thể duy trì',
    '程度补语1': 'Bổ ngữ trình độ 1',
    '程度补语2': 'Bổ ngữ trình độ 2',
    '程度补语3': 'Bổ ngữ trình độ 3',
    '状态补语2': 'Bổ ngữ trạng thái 2',
    '情态副词': 'Phó từ tình thái',
    '判断副词': 'Phó từ phán đoán',
    '引出目的、 原因': 'Biểu thị mục đích, nguyên nhân',
    '目的复句': 'Câu phức chỉ mục đích',
    '紧缩复句': 'Câu phức rút gọn',
    '引出凭借 、依据': 'Biểu thị căn cứ, cơ sở',
    '其他 （话语标记）': 'Khác (Dấu hiệu diễn ngôn)',
    '其他（话语标记）': 'Khác (Dấu hiệu diễn ngôn)', // Without space
  },
  zh: {} // Chinese doesn't need translation, use original
};

// Part of speech abbreviation translations (for vocabulary)
export const partOfSpeechTranslations: Record<Language, Record<string, string>> = {
  en: {
    '名': 'N',        // Noun
    '动': 'V',        // Verb
    '形': 'Adj',      // Adjective
    '副': 'Adv',      // Adverb
    '数': 'Num',      // Numeral
    '量': 'MW',       // Measure Word
    '代': 'Pron',     // Pronoun
    '介': 'Prep',     // Preposition
    '连': 'Conj',     // Conjunction
    '助': 'Part',     // Particle
    '叹': 'Interj',   // Interjection
    '拟声': 'Onom',   // Onomatopoeia
    '后缀': 'Suf',    // Suffix
    '前缀': 'Pref',   // Prefix
    '语素': 'Morph',  // Morpheme
  },
  vi: {
    '名': 'DT',       // Danh từ
    '动': 'ĐT',       // Động từ
    '形': 'TT',       // Tính từ
    '副': 'PT',       // Phó từ
    '数': 'ST',       // Số từ
    '量': 'LT',       // Lượng từ
    '代': 'ĐaT',      // Đại từ
    '介': 'GT',       // Giới từ
    '连': 'LiT',      // Liên từ
    '助': 'TrT',      // Trợ từ
    '叹': 'ThT',      // Thán từ
    '拟声': 'TT',     // Tượng thanh
    '后缀': 'HT',     // Hậu tố
    '前缀': 'TiT',    // Tiền tố
    '语素': 'HV',     // Hình vị
  },
  zh: {} // Chinese uses original
};

// Translate part of speech string (handles compound like "名、动" or "形、介、（动、量）")
export const translatePartOfSpeech = (pos: string | undefined, language: Language): string => {
  if (!pos) return '';
  if (language === 'zh') return pos;

  const translations = partOfSpeechTranslations[language];

  // Replace each Chinese part of speech abbreviation with its translation
  let result = pos;

  // Sort by length descending to match longer terms first (e.g., "拟声" before "声")
  const sortedKeys = Object.keys(translations).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    result = result.split(key).join(translations[key]);
  }

  // Replace Chinese punctuation with English equivalents
  result = result.replace(/、/g, ', ');  // 顿号 to comma
  result = result.replace(/（/g, '(');   // Full-width parentheses
  result = result.replace(/）/g, ')');

  return result;
};

// Helper function to translate grammar terms
export const translateGrammarTerm = (term: string | undefined, language: Language): string => {
  if (!term) return '';
  if (language === 'zh') return term;

  // Try exact match first
  let translation = grammarCategoryTranslations[language][term];
  if (translation) return translation;

  // Try with normalized spaces (remove extra spaces around parentheses)
  const normalized = term.replace(/\s*（/g, '（').replace(/\s+/g, ' ').trim();
  translation = grammarCategoryTranslations[language][normalized];
  if (translation) return translation;

  // Try with space before parenthesis
  const withSpace = term.replace(/（/g, ' （');
  translation = grammarCategoryTranslations[language][withSpace];
  if (translation) return translation;

  return term;
};

export const translations = {
  en: {
    appTitle: "HSK 3.0 Syllabus Explorer",
    heroTitle: "HSK 3.0 Standard Syllabus",
    heroDesc: "Explore the official vocabulary, characters, and grammar outline for the modern Chinese Proficiency Test.",
    searchPlaceholder: "Search for a word, character or grammar point...",
    levelIndex: "Level Index",
    totalWords: "Total Words",
    totalChars: "Characters",
    totalGrammar: "Grammar Points",
    vocab: "Vocabulary",
    chars: "Characters",
    grammar: "Grammar",
    official: "Official",
    ai: "AI",
    loadAi: "Load AI Supplement",
    standard: "Standard",
    advanced: "Advanced",
    level: "Level",
    selectLevel: "Select Level",
    basedOn: "Based on the HSK 3.0 Standards",
    aiAvailable: "AI-Powered Examples Available",
    searchResults: "Search Results",
    foundMatches: "Found {count} matches for \"{query}\"",
    tryAgain: "Reset",
    loadingError: "Unable to load content",
    word: "Word",
    pinyin: "Pinyin",
    pos: "Part of Speech",
    defAndExample: "Definition & Example",
    source: "Source",
    reading: "Reading Recognition",
    writing: "Writing Requirements",
    noChars: "No characters found for this selection.",
    phrase: "Phrase",
    sentenceComponent: "Sentence Component",
    syllabusExplorer: "SYLLABUS EXPLORER",
    tasks: "Tasks",
    topics: "Topics",
    allResults: "All Results",
    allLevels: "All Levels",
    category: "Category",
    categoryName: "Category Name",
    details: "Details",
    filterBy: "Filter by",
    primaryTopic: "Primary Topic",
    secondaryTopic: "Secondary Topic",
    directory: "Directory",
    grammarContent: "Grammar Content",
    scanToDownload: "Scan to download APP",
    downloadNow: "Download Now",
    wanliHsk: "WanLi HSK",
    grammarPromoTitle: "HSK Grammar Pass Package, Free for a Limited Time!",
    grammarPromoDesc: "Scan code to add exclusive customer service: [Zalo] 🎁 Reply: \"Grammar Materials\" to claim",
    scanToAdd: "Scan to add Zalo",
    customerService: "Customer Service",
    backToTop: "Back to Top",
    downloadApp: "Download App",
    bannerTitle: "Prepare for HSK, one App is enough",
    bannerSubtitle: "Scan to download immediately",
    bannerScanText: "iOS & Android Scan to Download"
  },
  vi: {
    appTitle: "Khám phá HSK 3.0",
    heroTitle: "Đại cương tiêu chuẩn HSK 3.0",
    heroDesc: "Khám phá đề cương từ vựng, chữ Hán và ngữ pháp chính thức cho kỳ thi năng lực Hán ngữ hiện đại.",
    searchPlaceholder: "Tìm kiếm từ vựng, chữ Hán hoặc ngữ pháp...",
    levelIndex: "Danh sách cấp độ",
    totalWords: "Tổng số từ",
    totalChars: "Chữ Hán",
    totalGrammar: "Điểm ngữ pháp",
    vocab: "Từ vựng",
    chars: "Chữ Hán",
    grammar: "Ngữ pháp",
    official: "Chính thức",
    ai: "AI",
    loadAi: "Tải bổ sung AI",
    standard: "Tiêu chuẩn",
    advanced: "Cao cấp",
    level: "Cấp độ",
    selectLevel: "Chọn cấp độ",
    basedOn: "Dựa trên tiêu chuẩn HSK 3.0",
    aiAvailable: "Có sẵn ví dụ AI",
    searchResults: "Kết quả tìm kiếm",
    foundMatches: "Tìm thấy {count} kết quả cho \"{query}\"",
    tryAgain: "Đặt lại",
    loadingError: "Không thể tải nội dung",
    word: "Từ vựng",
    pinyin: "Phiên âm",
    pos: "Từ loại",
    defAndExample: "Định nghĩa & Ví dụ",
    source: "Nguồn",
    reading: "Nhận biết (Đọc)",
    writing: "Yêu cầu viết",
    noChars: "Không tìm thấy chữ Hán nào.",
    phrase: "Cụm từ",
    sentenceComponent: "Thành phần câu",
    syllabusExplorer: "KHÁM PHÁ ĐẠI CƯƠNG",
    tasks: "Nhiệm vụ",
    topics: "Chủ đề",
    allResults: "Tất cả",
    allLevels: "Tất cả cấp độ",
    category: "Loại",
    categoryName: "Tên loại",
    details: "Chi tiết",
    filterBy: "Lọc theo",
    primaryTopic: "Chủ đề chính",
    secondaryTopic: "Chủ đề phụ",
    directory: "Mục lục",
    grammarContent: "Nội dung ngữ pháp",
    scanToDownload: "Quét mã tải APP",
    downloadNow: "Tải ngay",
    wanliHsk: "WanLi HSK",
    grammarPromoTitle: "Gói tài liệu ngữ pháp HSK, nhận miễn phí trong thời gian giới hạn!",
    grammarPromoDesc: "Quét mã để thêm CSKH: [Zalo] 🎁 Trả lời: \"Tài liệu ngữ pháp\" để nhận",
    scanToAdd: "Quét mã thêm Zalo",
    customerService: "Chăm sóc khách hàng",
    backToTop: "Về đầu trang",
    downloadApp: "Tải APP",
    bannerTitle: "Luyện thi HSK, một App là đủ",
    bannerSubtitle: "Quét mã tải ngay, bắt đầu hành trình học tập hiệu quả",
    bannerScanText: "iOS & Android Quét mã tải xuống"
  },
  zh: {
    appTitle: "HSK 3.0 考纲探索",
    heroTitle: "HSK 3.0 标准大纲",
    heroDesc: "探索现代汉语水平考试的官方词汇、汉字和语法大纲。",
    searchPlaceholder: "搜索词汇、汉字或语法点...",
    levelIndex: "等级索引",
    totalWords: "词汇总量",
    totalChars: "汉字总量",
    totalGrammar: "语法点",
    vocab: "词汇",
    chars: "汉字",
    grammar: "语法",
    official: "官方",
    ai: "AI",
    loadAi: "加载 AI 补充",
    standard: "标准",
    advanced: "高等",
    level: "等级",
    selectLevel: "选择等级",
    basedOn: "基于 HSK 3.0 标准",
    aiAvailable: "支持 AI 生成示例",
    searchResults: "搜索结果",
    foundMatches: "找到 {count} 个关于 \"{query}\" 的结果",
    tryAgain: "重置",
    loadingError: "无法加载内容",
    word: "词语",
    pinyin: "拼音",
    pos: "词性",
    defAndExample: "释义与例句",
    source: "来源",
    reading: "认读字",
    writing: "书写字",
    noChars: "未找到相关汉字。",
    phrase: "短语",
    sentenceComponent: "句子成分",
    syllabusExplorer: "大纲探索",
    tasks: "任务",
    topics: "话题",
    allResults: "全部结果",
    allLevels: "全部等级",
    category: "类别",
    categoryName: "类别名称",
    details: "细目",
    filterBy: "筛选",
    primaryTopic: "一级话题",
    secondaryTopic: "二级话题",
    directory: "目录",
    grammarContent: "语法内容",
    scanToDownload: "扫码下载APP",
    downloadNow: "立即下载",
    wanliHsk: "万里HSK",
    grammarPromoTitle: "HSK语法通关资料包，限时0元领！",
    grammarPromoDesc: "扫码添加专属客服：[Zalo二维码] 🎁 回复：语法资料 领取",
    scanToAdd: "扫码添加Zalo",
    customerService: "专属客服",
    backToTop: "返回顶部",
    downloadApp: "下载APP",
    bannerTitle: "备考 HSK，一个万里 APP 就够了",
    bannerSubtitle: "扫码立即下载，开启高效学习之旅",
    bannerScanText: "iOS & Android 扫一扫下载"
  }
};