-- 修复时区：将所有表的默认时间从 UTC 改为北京时间 (UTC+8)
-- Fix timezone: Change all default timestamps from UTC to Beijing time (UTC+8)

-- 1. 修改 daily_visits 表
ALTER TABLE daily_visits 
  ALTER COLUMN first_visit_at SET DEFAULT (NOW() AT TIME ZONE 'Asia/Shanghai'),
  ALTER COLUMN last_visit_at SET DEFAULT (NOW() AT TIME ZONE 'Asia/Shanghai');

-- 2. 修改 language_selections 表
ALTER TABLE language_selections 
  ALTER COLUMN created_at SET DEFAULT (NOW() AT TIME ZONE 'Asia/Shanghai'),
  ALTER COLUMN updated_at SET DEFAULT (NOW() AT TIME ZONE 'Asia/Shanghai');

-- 3. 修改 leads 表
ALTER TABLE leads 
  ALTER COLUMN created_at SET DEFAULT (NOW() AT TIME ZONE 'Asia/Shanghai');

-- 4. 修改 download_clicks 表
ALTER TABLE download_clicks 
  ALTER COLUMN clicked_at SET DEFAULT (NOW() AT TIME ZONE 'Asia/Shanghai');

-- 5. 修复已有数据：将现有 UTC 时间转换为北京时间 (+8小时)
UPDATE daily_visits SET 
  first_visit_at = first_visit_at + INTERVAL '8 hours',
  last_visit_at = last_visit_at + INTERVAL '8 hours';

UPDATE language_selections SET 
  created_at = created_at + INTERVAL '8 hours',
  updated_at = updated_at + INTERVAL '8 hours';

UPDATE leads SET 
  created_at = created_at + INTERVAL '8 hours';

UPDATE download_clicks SET 
  clicked_at = clicked_at + INTERVAL '8 hours';
