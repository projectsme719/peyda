/**
 * @file cf/lib.js
 * @version 1.0.0
 * @updated 2026-10-29
 * Shared helpers for the Pages Functions (this file is not a route).
 */
export const PAGE_SIZE = 20;

export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extra,
    },
  });
}

export const fail = (error, status = 400) =>
  json({ ok: false, error }, status);

export async function readJson(request) {
  try {
    return await request.json();
  } catch (e) {
    return null;
  }
}

export function toInt(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isSafeInteger(n) ? n : null;
}

export function parseList(text) {
  try {
    const v = JSON.parse(text || '[]');
    return Array.isArray(v) ? v : [];
  } catch (e) {
    return [];
  }
}

// Compares the x-sync-key header with the SYNC_KEY secret.
export function authed(request, env) {
  const key = String(env.SYNC_KEY || '');
  const got = request.headers.get('x-sync-key') || '';
  if (key.length < 20 || got.length !== key.length) return false;
  let diff = 0;
  for (let i = 0; i < key.length; i++) {
    diff |= key.charCodeAt(i) ^ got.charCodeAt(i);
  }
  return diff === 0;
}

const FA = '۰۱۲۳۴۵۶۷۸۹';
const AR = '٠١٢٣٤٥٦٧٨٩';

// Makes Persian/Arabic text comparable (digits, ی/ک, ZWNJ, marks).
export function normalize(s) {
  return String(s ?? '')
    .replace(/[۰-۹]/g, (d) => FA.indexOf(d))
    .replace(/[٠-٩]/g, (d) => AR.indexOf(d))
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[\u064B-\u065F\u200c\u200d]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Max `max` calls per IP per hour. Allows the call if the DB fails.
export async function rateLimit(env, request, name, max) {
  try {
    const ip = request.headers.get('cf-connecting-ip') || 'x';
    const hour = Math.floor(Date.now() / 3600000);
    const row = await env.DB.prepare(
      'INSERT INTO hits (k, n, t) VALUES (?1, 1, ?2) ' +
      'ON CONFLICT(k) DO UPDATE SET n = n + 1 RETURNING n',
    ).bind(`${name}:${ip}:${hour}`, hour).first();
    if (Math.random() < 0.02) {
      await env.DB.prepare('DELETE FROM hits WHERE t < ?1')
        .bind(hour - 1).run();
    }
    return !row || row.n <= max;
  } catch (e) {
    console.error('rateLimit failed');
    return true;
  }
}