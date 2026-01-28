-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: entries_vocabulary
create table public.entries_vocabulary (
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
create table public.entries_character (
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
create table public.entries_grammar (
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

-- Row Level Security (RLS)
-- Enable read access for everyone (since it's a public educational app)
alter table public.entries_vocabulary enable row level security;
create policy "Allow public read access" on public.entries_vocabulary for select using (true);

alter table public.entries_character enable row level security;
create policy "Allow public read access" on public.entries_character for select using (true);

alter table public.entries_grammar enable row level security;
create policy "Allow public read access" on public.entries_grammar for select using (true);
