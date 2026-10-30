/**
 * @file functions/api/health.js
 * @version 1.2.0
 * GET /api/health - status check (used by /setsync in the bot).
 */
import { json } from '../../cf/lib.js';

export async function onRequestGet({ env }) {
  const out = {
    ok: false,
    db: !!env.DB,
    ads: null,
    key: !!env.SYNC_KEY,
    bot: !!env.BOT_TOKEN,
  };
  try {
    const r = await env.DB.prepare('SELECT COUNT(*) AS n FROM ads').first();
    out.ads = r.n;
    out.ok = true;
  } catch (e) {
    console.error('health: database not ready');
  }
  return json(out);
}
