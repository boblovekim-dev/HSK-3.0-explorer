-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create Tables
-- Table: entries_vocabulary
create table if not exists public.entries_vocabulary (
  id uuid default uuid_generate_v4() primary key,
  level text not null,
  hanzi text not null,
  pinyin text not null,
  part_of_speech text not null,
  definition text,
  example_sentence text,
  ordinal int4,
  source text default 'official',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: entries_character
create table if not exists public.entries_character (
  id uuid default uuid_generate_v4() primary key,
  level text not null,
  char text not null,
  pinyin text,
  meaning text,
  strokes int4,
  type text CHECK (type IN ('reading', 'writing')),
  ordinal int4,
  source text default 'official',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: entries_grammar
create table if not exists public.entries_grammar (
  id uuid default uuid_generate_v4() primary key,
  level text not null,
  category text,
  sub_category text,
  name text not null,
  pattern text,
  explanation text,
  example text,
  source text default 'official',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Enable Public Read Access (RLS)
alter table public.entries_vocabulary enable row level security;
drop policy if exists "Allow public read access" on public.entries_vocabulary;
create policy "Allow public read access" on public.entries_vocabulary for select using (true);

alter table public.entries_character enable row level security;
drop policy if exists "Allow public read access" on public.entries_character;
create policy "Allow public read access" on public.entries_character for select using (true);

alter table public.entries_grammar enable row level security;
drop policy if exists "Allow public read access" on public.entries_grammar;
create policy "Allow public read access" on public.entries_grammar for select using (true);

-- 4. INSERT DATA

-- VOCABULARY (Level 1)
INSERT INTO public.entries_vocabulary (level, hanzi, pinyin, part_of_speech, definition, example_sentence, ordinal) VALUES
('1', '爱', 'ài', '动', 'to love', '妈妈，我爱你。', 1),
('1', '八', 'bā', '数', 'eight', '我有八个苹果。', 2),
('1', '爸爸', 'bàba', '名', 'father', '我爸爸是医生。', 3),
('1', '吧', 'ba', '助', 'particle (suggestion)', '我们走吧。', 4),
('1', '白天', 'báitian', '名', 'daytime', '白天我在工作。', 5),
('1', '百', 'bǎi', '数', 'hundred', '这里有一百个人。', 6),
('1', '半', 'bàn', '数、(副)', 'half', '现在两点半。', 7),
('1', '包子', 'bāozi', '名', 'steamed bun', '我想吃包子。', 8),
('1', '杯子', 'bēizi', '名', 'cup', '这是一个杯子。', 9),
('1', '本', 'běn', '量', 'measure word for books', '一本书。', 10),
('1', '边', 'biān', '名、后缀', 'side', '在左边。', 11),
('1', '病', 'bìng', '名、动', 'illness; sick', '他病了。', 12);

-- CHARACTERS (Level 1 - Reading)
INSERT INTO public.entries_character (level, char, type, source) VALUES
('1', '爱', 'reading', 'official'),
('1', '八', 'reading', 'official'),
('1', '爸', 'reading', 'official'),
('1', '吧', 'reading', 'official'),
('1', '白', 'reading', 'official'),
('1', '百', 'reading', 'official'),
('1', '班', 'reading', 'official'),
('1', '半', 'reading', 'official'),
('1', '包', 'reading', 'official'),
('1', '杯', 'reading', 'official'),
('1', '本', 'reading', 'official'),
('1', '边', 'reading', 'official'),
('1', '便', 'reading', 'official'),
('1', '病', 'reading', 'official'),
('1', '不', 'reading', 'official'),
('1', '菜', 'reading', 'official'),
('1', '茶', 'reading', 'official'),
('1', '常', 'reading', 'official'),
('1', '唱', 'reading', 'official'),
('1', '超', 'reading', 'official'),
('1', '车', 'reading', 'official'),
('1', '吃', 'reading', 'official'),
('1', '出', 'reading', 'official'),
('1', '穿', 'reading', 'official'),
('1', '床', 'reading', 'official'),
('1', '打', 'reading', 'official');

-- CHARACTERS (Level 5 - Writing)
INSERT INTO public.entries_character (level, char, type, source) VALUES
('5', '版', 'writing', 'official'),
('5', '扮', 'writing', 'official'),
('5', '伴', 'writing', 'official'),
('5', '宝', 'writing', 'official'),
('5', '贝', 'writing', 'official'),
('5', '币', 'writing', 'official'),
('5', '闭', 'writing', 'official'),
('5', '补', 'writing', 'official'),
('5', '布', 'writing', 'official'),
('5', '采', 'writing', 'official'),
('5', '册', 'writing', 'official'),
('5', '测', 'writing', 'official'),
('5', '叉', 'writing', 'official'),
('5', '吵', 'writing', 'official'),
('5', '沉', 'writing', 'official'),
('5', '称', 'writing', 'official'),
('5', '承', 'writing', 'official'),
('5', '尺', 'writing', 'official'),
('5', '冲', 'writing', 'official'),
('5', '充', 'writing', 'official'),
('5', '虫', 'writing', 'official'),
('5', '抽', 'writing', 'official'),
('5', '丑', 'writing', 'official'),
('5', '臭', 'writing', 'official'),
('5', '传', 'writing', 'official'),
('5', '创', 'writing', 'official');

-- GRAMMAR (Level 1)
INSERT INTO public.entries_grammar (level, category, sub_category, name, pattern, explanation, example, source) VALUES
('1', '短语', '联合短语', '联合短语 (Union Phrase)', 'A + B', 'Two or more words of the same part of speech connected together.', '老师和学生 (Teachers and students)', 'official'),
('1', '短语', '偏正短语', '偏正短语 (Modifier-Head Phrase)', 'Modifier + Head', 'A phrase where the first part modifies the meaning of the second part.', '好书 (Good book)', 'official'),
('1', '句子成分', '主语', '主语 (Subject)', 'Noun/Pronoun as Subject', '名词、代词或名词性短语作主语', '我在吃饭。 (I am eating.)', 'official'),
('1', '句子成分', '谓语', '谓语 (Predicate)', 'Verb/Adj as Predicate', '名词、代词、数词或数量短语作谓语; 动词或动词性短语、形容词或形容词性短语作谓语', '今天星期一。 (Today is Monday.)', 'official');
