/**
 * @file functions/api/contact.js
 * @version 1.0.0
 * @updated 2026-10-29
 * GET /api/contact?id=12 - seller contact, only for active ads.
 * Limited per IP per hour so numbers cannot be harvested in bulk.
 */
import { json, fail, toInt, rateLimit } from '../../cf/lib.js';

const MAX_PER_HOUR = 40;

export async function onRequestGet({ request, env }) {
  const id = toInt(new URL(request.url).searchParams.get('id'));
  if (!id) return fail('BAD_ID');

  if (!(await rateLimit(env, request, 'contact', MAX_PER_HOUR))) {
    return fail('RATE_LIMIT', 429);
  }

  const r = await env.DB.prepare(
    "SELECT contact FROM ads WHERE id = ?1 AND status = 'active'",
  ).bind(id).first();

  return json({ contact: r ? r.contact : null });
}