/**
 * @file functions/api/sync.js
 * @version 1.0.0
 * @updated 2026-10-29
 * POST /api/sync - the bot sends ads here (upsert or delete).
 * Needs the x-sync-key header (secret SYNC_KEY).
 */
import {
  json, fail, authed, readJson, toInt, normalize,
} from '../../cf/lib.js';

const CONTACT = /^(@[A-Za-z0-9_]{5,32}|\+?\d{9,15})$/;
const str = (v, max) => String(v ?? '').slice(0, max);

const UPSERT =
  'INSERT INTO ads (id, category, title, description, price, province, ' +
  'city, cond, deal, attrs, photos, thumbs, status, shop, shop_name, ' +
  'contact, search, created, updated) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ' +
  '?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19) ' +
  'ON CONFLICT(id) DO UPDATE SET category = ?2, title = ?3, ' +
  'description = ?4, price = ?5, province = ?6, city = ?7, cond = ?8, ' +
  'deal = ?9, attrs = ?10, photos = ?11, thumbs = ?12, status = ?13, ' +
  'shop = ?14, shop_name = ?15, contact = ?16, search = ?17, ' +
  'created = ?18, updated = ?19';

function list(v, max) {
  return Array.isArray(v) ? v.slice(0, 5).map((x) => str(x, max)) : [];
}

function attrsJson(v) {
  const s = JSON.stringify(Array.isArray(v) ? v.slice(0, 20) : []);
  return s.length <= 4000 ? s : '[]';
}

function clean(a) {
  const id = toInt(a && a.id);
  if (!id || id < 1) return null;
  const title = str(a.title, 120).trim();
  const description = str(a.description, 1000).trim();
  const category = str(a.category, 30);
  if (!title || !description || !category) return null;
  const price = toInt(a.price);
  const photos = list(a.photos, 300);
  const thumbs = photos.map((p, i) => str((a.thumbs || [])[i], 300));
  const contact = str(a.contact, 40);
  const now = Math.floor(Date.now() / 1000);
  return [
    id,
    category,
    title,
    description,
    price !== null && price > 0 ? price : null,
    str(a.province, 40) || null,
    str(a.city, 40) || null,
    str(a.cond, 10) || null,
    str(a.deal, 12) || null,
    attrsJson(a.attrs),
    JSON.stringify(photos),
    JSON.stringify(thumbs),
    a.status === 'sold' ? 'sold' : 'active',
    a.shop ? 1 : 0,
    a.shop ? str(a.shopName, 60) || null : null,
    CONTACT.test(contact) ? contact : null,
    normalize(`${title} ${description}`).slice(0, 1600),
    toInt(a.created) || now,
    now,
  ];
}

export async function onRequestPost({ request, env }) {
  if (!authed(request, env)) return fail('UNAUTHORIZED', 401);
  const body = await readJson(request);
  if (!body) return fail('BAD_JSON');

  if (body.op === 'delete') {
    const id = toInt(body.id);
    if (!id) return fail('BAD_ID');
    await env.DB.prepare('DELETE FROM ads WHERE id = ?1').bind(id).run();
    return json({ ok: true });
  }

  if (body.op === 'upsert') {
    const values = clean(body.ad);
    if (!values) return fail('BAD_AD');
    await env.DB.prepare(UPSERT).bind(...values).run();
    return json({ ok: true });
  }

  return fail('BAD_OP');
}