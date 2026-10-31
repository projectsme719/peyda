/**
 * @file functions/api/sync-user.js
 * @version 1.0.0
 * @updated 2026-10-31
 * POST /api/sync-user - the bot sends one user's saved ads.
 * Body: { op: 'bookmarks', tg_id, ids: [adId, ...] } (newest first).
 * The site replaces that user's list. Needs the x-sync-key header.
 */
import {
  json, fail, authed, readJson, toInt,
} from '../../cf/lib.js';

const MAX_IDS = 300;

export async function onRequestPost({ request, env }) {
  if (!authed(request, env)) return fail('UNAUTHORIZED', 401);
  const b = await readJson(request);
  const tgId = toInt(b && b.tg_id);
  if (!b || b.op !== 'bookmarks' || !tgId || tgId < 1
      || !Array.isArray(b.ids)) {
    return fail('BAD_REQUEST');
  }
  const ids = [];
  for (const v of b.ids) {
    const n = toInt(v);
    if (n && n > 0 && !ids.includes(n)) ids.push(n);
    if (ids.length >= MAX_IDS) break;
  }

  try {
    await env.DB.batch([
      env.DB.prepare('DELETE FROM bookmarks WHERE tg_id = ?1').bind(tgId),
      env.DB.prepare(
        'INSERT INTO bookmarks (tg_id, ad_id, pos) SELECT ?1, '
        + 'CAST(j.value AS INTEGER), CAST(j.key AS INTEGER) '
        + 'FROM json_each(?2) AS j',
      ).bind(tgId, JSON.stringify(ids)),
    ]);
  } catch (e) {
    console.error('sync-user failed');
    return fail('SERVER_ERROR', 500);
  }
  return json({ ok: true, n: ids.length });
}