/**
 * @file functions/api/ads.js
 * @version 1.0.0
 * @updated 2026-10-29
 * GET /api/ads - public list (active ads only), same shape as the
 * Mini App: { items, page, pages, total }.
 */
import {
  json, toInt, normalize, parseList, PAGE_SIZE,
} from '../../cf/lib.js';

const SORTS = {
  new: 'id DESC',
  cheap: 'price IS NULL, price ASC, id DESC',
  exp: 'price IS NULL, price DESC, id DESC',
};

const COLS =
  'id, title, price, province, city, cond, deal, shop, created, photos';

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

function filters(p) {
  const where = ["status = 'active'"];
  const args = [];
  const add = (cond, v) => {
    where.push(cond);
    args.push(v);
  };

  const words = normalize(p.get('q')).split(' ').filter(Boolean);
  for (const w of words.slice(0, 5)) {
    add('instr(search, ?) > 0', w.slice(0, 40));
  }

  const cat = p.get('category');
  if (cat) add('category = ?', cat.slice(0, 30));
  const prov = p.get('province');
  if (prov) add('province = ?', prov.slice(0, 40));

  const min = toInt(normalize(p.get('minPrice')));
  if (min && min > 0) add('price >= ?', min);
  const max = toInt(normalize(p.get('maxPrice')));
  if (max && max > 0) add('price <= ?', max);

  const seller = p.get('seller');
  if (seller === 'shop') where.push('shop = 1');
  if (seller === 'person') where.push('shop = 0');

  return { sql: ' WHERE ' + where.join(' AND '), args };
}

export async function onRequestGet({ request, env }) {
  const p = new URL(request.url).searchParams;
  const { sql, args } = filters(p);

  const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM ads' + sql)
    .bind(...args).first();
  const total = row ? row.n : 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, toInt(p.get('page')) || 1), pages);

  const order = SORTS[p.get('sort')] || SORTS.new;
  const rows = await env.DB.prepare(
    `SELECT ${COLS} FROM ads${sql} ORDER BY ${order} LIMIT ? OFFSET ?`,
  ).bind(...args, PAGE_SIZE, (page - 1) * PAGE_SIZE).all();

  return json(
    { items: rows.results.map(item), page, pages, total },
    200,
    { 'cache-control': 'public, max-age=30' },
  );
}