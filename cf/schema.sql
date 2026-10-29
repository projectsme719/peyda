-- @file cf/schema.sql
-- @version 1.0.0
-- @updated 2026-10-29
-- Paste into the D1 console (run once). Safe to run again.

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
  updated INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ads_status ON ads (status, id DESC);
CREATE INDEX IF NOT EXISTS idx_ads_cat ON ads (category, status, id DESC);
CREATE INDEX IF NOT EXISTS idx_ads_prov ON ads (province, status, id DESC);

CREATE TABLE IF NOT EXISTS hits (
  k TEXT PRIMARY KEY,
  n INTEGER NOT NULL,
  t INTEGER NOT NULL
);