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