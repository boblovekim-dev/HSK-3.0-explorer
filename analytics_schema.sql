-- Analytics Schema for HSK Explorer
-- 用于追踪网站访问统计的数据库表

-- 每日访问统计表 (Daily visits with unique IP tracking)
CREATE TABLE IF NOT EXISTS daily_visits (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  country VARCHAR(100),
  visit_count INTEGER DEFAULT 1,
  first_visit_at TIMESTAMP DEFAULT NOW(),
  last_visit_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(date, ip_address)
);

-- 页面曝光统计表 (Page exposures by level and category)
CREATE TABLE IF NOT EXISTS page_exposures (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  level VARCHAR(10) NOT NULL,
  category VARCHAR(50) NOT NULL,
  exposure_count INTEGER DEFAULT 1,
  UNIQUE(date, level, category)
);

-- 语言选择统计表 (Language selections with unique IP)
CREATE TABLE IF NOT EXISTS language_selections (
  id BIGSERIAL PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL UNIQUE,
  language VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引以优化查询
CREATE INDEX IF NOT EXISTS idx_daily_visits_date ON daily_visits(date);
CREATE INDEX IF NOT EXISTS idx_daily_visits_country ON daily_visits(country);
CREATE INDEX IF NOT EXISTS idx_page_exposures_date ON page_exposures(date);
CREATE INDEX IF NOT EXISTS idx_page_exposures_level ON page_exposures(level);
CREATE INDEX IF NOT EXISTS idx_page_exposures_category ON page_exposures(category);

-- 启用Row Level Security
ALTER TABLE daily_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_exposures ENABLE ROW LEVEL SECURITY;
ALTER TABLE language_selections ENABLE ROW LEVEL SECURITY;

-- 允许匿名插入/更新
DROP POLICY IF EXISTS "Allow anonymous inserts" ON daily_visits;
DROP POLICY IF EXISTS "Allow anonymous updates" ON daily_visits;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON page_exposures;
DROP POLICY IF EXISTS "Allow anonymous updates" ON page_exposures;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON language_selections;
DROP POLICY IF EXISTS "Allow anonymous updates" ON language_selections;

CREATE POLICY "Allow anonymous inserts" ON daily_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous updates" ON daily_visits FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous reads" ON daily_visits FOR SELECT USING (true);

CREATE POLICY "Allow anonymous inserts" ON page_exposures FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous updates" ON page_exposures FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous reads" ON page_exposures FOR SELECT USING (true);

CREATE POLICY "Allow anonymous inserts" ON language_selections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous updates" ON language_selections FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous reads" ON language_selections FOR SELECT USING (true);

-- =====================================================
-- 留资信息表 (Lead capture data)
-- =====================================================

CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  country_code VARCHAR(10) NOT NULL DEFAULT '+86',
  learning_purpose TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);

-- 启用Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 允许匿名插入
DROP POLICY IF EXISTS "Allow anonymous inserts" ON leads;
DROP POLICY IF EXISTS "Allow anonymous reads" ON leads;

CREATE POLICY "Allow anonymous inserts" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous reads" ON leads FOR SELECT USING (true);
