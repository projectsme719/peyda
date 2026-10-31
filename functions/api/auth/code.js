/**
 * @file functions/api/auth/code.js
 * @version 1.0.0
 * @updated 2026-10-31
 * POST /api/auth/code - the bot asks for a one-time login code.
 * Body: { nonce, tg_id, name, username }. Needs the x-sync-key header.
 * Answer: { ok, code, ttl }. One code per nonce.
 */
import {
  json, fail, authed, readJson, toInt,
} from '../../../cf/lib.js';
import {
  CODE_TTL, now, randomCode, codeHash,
} from '../../../cf/auth.js';

const str = (v, max) => String(v ?? '').replace(/[\r\n]+/g, ' ')
  .trim().slice(0, max);

export async function onRequestPost({ request, env }) {
  if (!authed(request, env)) return fail('unauthorized', 401);
  const b = await readJson(request);
  const nonce = str(b && b.nonce, 40);
  const tgId = toInt(b && b.tg_id);
  if (!/^[A-Za-z0-9_-]{22}$/.test(nonce) || !tgId || tgId < 1) {
    return fail('bad request');
  }

  try {
    const t = now();
    const row = await env.DB.prepare(
      'SELECT code_hash, expires, used FROM login_codes WHERE nonce = ?1',
    ).bind(nonce).first();
    if (!row || row.used || row.expires < t) return fail('expired', 410);
    if (row.code_hash) return fail('already issued', 409);

    const code = randomCode();
    const res = await env.DB.prepare(
      'UPDATE login_codes SET code_hash = ?2, tg_id = ?3, name = ?4, '
      + 'username = ?5, expires = ?6 WHERE nonce = ?1 AND code_hash IS NULL',
    ).bind(
      nonce, await codeHash(env, nonce, code), tgId,
      str(b.name, 60), str(b.username, 40), t + CODE_TTL,
    ).run();
    if (!res.meta || res.meta.changes !== 1) {
      return fail('already issued', 409);
    }
    return json({ ok: true, code, ttl: CODE_TTL });
  } catch (e) {
    console.error('auth code failed');
    return fail('server error', 500);
  }
}