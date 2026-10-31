-- @file cf/schema.sql
-- @version 1.2.0
-- @updated 2026-10-31
-- Paste into the D1 console (run once). Safe to run again.
-- Existing database (made before 1.2.0)? Also run this ONE time:
--   ALTER TABLE ads ADD COLUMN owner_tg INTEGER;

CREATE TABLE IF NOT EXISTS ads (
  id INTEGER PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER,
  province TEXT,
  city TEXT,
  cond TEXT,
  deal TEXT,
  attrs TEXT NOT NULL DEFAULT '[]',
  photos TEXT NOT NULL DEFAULT '[]',
  thumbs TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL,
  shop INTEGER NOT NULL DEFAULT 0,
  shop_name TEXT,
  contact TEXT,
  search TEXT NOT NULL DEFAULT '',
  created INTEGER NOT NULL,
  updated INTEGER NOT NULL,
  owner_tg INTEGER
);

CREATE INDEX IF NOT EXISTS idx_ads_status ON ads (status, id DESC);
CREATE INDEX IF NOT EXISTS idx_ads_cat ON ads (category, status, id DESC);
CREATE INDEX IF NOT EXISTS idx_ads_prov ON ads (province, status, id DESC);
CREATE INDEX IF NOT EXISTS idx_ads_owner ON ads (owner_tg, id DESC);

CREATE TABLE IF NOT EXISTS hits (
  k TEXT PRIMARY KEY,
  n INTEGER NOT NULL,
  t INTEGER NOT NULL
);

-- Website login (Telegram one-time code). Added in 1.1.0.
CREATE TABLE IF NOT EXISTS users (
  tg_id INTEGER PRIMARY KEY,
  name TEXT,
  username TEXT,
  created INTEGER NOT NULL,
  last_login INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS login_codes (
  nonce TEXT PRIMARY KEY,
  code_hash TEXT,
  tg_id INTEGER,
  name TEXT,
  username TEXT,
  expires INTEGER NOT NULL,
  tries INTEGER NOT NULL DEFAULT 0,
  used INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  tg_id INTEGER NOT NULL,
  expires INTEGER NOT NULL,
  created INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_exp ON sessions (expires);
CREATE INDEX IF NOT EXISTS idx_codes_exp ON login_codes (expires);

-- A user's saved ads, sent by the bot (pos 0 = newest). Added in 1.2.0.
CREATE TABLE IF NOT EXISTS bookmarks (
  tg_id INTEGER NOT NULL,
  ad_id INTEGER NOT NULL,
  pos INTEGER NOT NULL,
  PRIMARY KEY (tg_id, ad_id)
);
