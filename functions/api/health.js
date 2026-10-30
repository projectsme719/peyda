/**
 * @file functions/api/health.js
 * @version 1.1.0
 * @updated 2026-10-30
 * GET /api/health - status check (used by /setsync in the bot).
 * "names" lists the setting NAMES this deployment received (never the
 * values), to find a missing binding or secret. Remove it when done.
 */
import { json } from '../../cf/lib.js';

export async function onRequestGet({ env }) {
  const out = {
    ok: false,
    db: !!env.DB,
    ads: null,
    key: !!env.SYNC_KEY,
    bot: !!env.BOT_TOKEN,
    names: Object.keys(env).sort(),
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