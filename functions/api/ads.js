/**
 * @file functions/api/ads.js
 * @version 1.1.0
 * @updated 2026-10-30
 * GET /api/ads - public list (active ads only), same shape as the
 * Mini App: { items, page, pages, total }. Search code is in cf/query.js.
 */
import { json, parseList } from '../../cf/lib.js';
import { searchAds } from '../../cf/query.js';

const item = (r) => ({
  id: r.id,
  title: r.title,
  price: r.price,
  province: r.province,
  city: r.city,
  cond: r.cond,
  deal: r.deal,
  shop: !!r.shop,
  created: r.created,
  photos: parseList(r.photos).length,
});

export async function onRequestGet({ request, env }) {
  const p = new URL(request.url).searchParams;
  const { rows, total, pages, page } = await searchAds(env, p);

  return json(
    { items: rows.map(item), page, pages, total },
    200,
    { 'cache-control': 'public, max-age=30' },
  );
}