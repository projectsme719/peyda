/**
 * @file cf/auth.js
 * @version 1.0.0
 * @updated 2026-10-31
 * Login helpers: random tokens, hashing, cookies and session lookup.
 * (This file is not a route.)
 */
export const SESSION_COOKIE = '__Host-ps';
export const NONCE_COOKIE = '__Host-pn';
export const SESSION_DAYS = 30;
export const NONCE_TTL = 600;
export const CODE_TTL = 300;
export const MAX_TRIES = 5;

const enc = new TextEncoder();
export const now = () => Math.floor(Date.now() / 1000);

// URL-safe random text. 16 bytes -> 22 chars, 24 bytes -> 32 chars.
export function randomToken(bytes) {
  const b = crypto.getRandomValues(new Uint8Array(bytes));
  return btoa(String.fromCharCode(...b))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function sha256(text) {
  const d = await crypto.subtle.digest('SHA-256', enc.encode(text));
  return [...new Uint8Array(d)]
    .map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Uniform 6-digit code (000000-999999).
export function randomCode() {
  const max = 4294000000;
  let n;
  do {
    n = crypto.getRandomValues(new Uint32Array(1))[0];
  } while (n >= max);
  return String(n % 1000000).padStart(6, '0');
}

// The code hash is bound to its nonce and to the SYNC_KEY secret.
export const codeHash = (env, nonce, code) =>
  sha256(`${nonce}:${code}:${env.SYNC_KEY}`);

// Constant-time text comparison.
export function same(a, b) {
  const x = String(a || '');
  const y = String(b || '');
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) {
    diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
  }
  return diff === 0;
}

export function getCookie(request, name) {
  const parts = (request.headers.get('cookie') || '').split(';');
  for (const p of parts) {
    const i = p.indexOf('=');
    if (i > 0 && p.slice(0, i).trim() === name) return p.slice(i + 1).trim();
  }
  return '';
}

export const cookie = (name, value, maxAge) =>
  `${name}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; `
  + 'SameSite=Lax';

export function redirect(to, cookies = []) {
  const h = new Headers({ location: to, 'cache-control': 'no-store' });
  cookies.forEach((c) => h.append('set-cookie', c));
  return new Response(null, { status: 303, headers: h });
}

// Returns a new session token (the database keeps only its hash).
export async function createSession(env, tgId) {
  const token = randomToken(24);
  const t = now();
  await env.DB.prepare(
    'INSERT INTO sessions (token_hash, tg_id, expires, created) '
    + 'VALUES (?1, ?2, ?3, ?4)',
  ).bind(await sha256(token), tgId, t + SESSION_DAYS * 86400, t).run();
  return token;
}

// The signed-in user ({ tg_id, name, username }) or null.
export async function sessionUser(request, env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token || token.length > 64) return null;
  try {
    return await env.DB.prepare(
      'SELECT u.tg_id, u.name, u.username FROM sessions s '
      + 'JOIN users u ON u.tg_id = s.tg_id '
      + 'WHERE s.token_hash = ?1 AND s.expires > ?2',
    ).bind(await sha256(token), now()).first();
  } catch (e) {
    return null;
  }
}