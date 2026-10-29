/**
 * @file functions/api/ad.js
 * @version 1.0.0
 * @updated 2026-10-29
 * GET /api/ad?id=12 - one ad (active or sold). It never returns the
 * contact or the Telegram file ids.
 */
import { json, fail, toInt, parseList } from '../../cf/lib.js';

export async function onRequestGet({ request, env }) {
  const id = toInt(new URL(request.url).searchParams.get('id'));
  if (!id) return fail('BAD_ID');

  const r = await env.DB.prepare('SELECT * FROM ads WHERE id = ?1')
    .bind(id).first();
  if (!r) return fail('NOT_FOUND', 404);

  return json(
    {
      id: r.id,
      category: r.category,
      title: r.title,
      description: r.description,
      price: r.price,
      province: r.province,
      city: r.city,
      cond: r.cond,
      deal: r.deal,
      attrs: parseList(r.attrs),
      photos: parseList(r.photos).length,
      status: r.status,
      shop: !!r.shop,
      shopName: r.shop_name,
      created: r.created,
    },
    200,
    { 'cache-control': 'public, max-age=30' },
  );
}