/**
 * @file cf/query.js
 * @version 1.1.0
 * @updated 2026-10-30
 * Shared ad search: used by /api/ads and the server-rendered pages.
 */
import { toInt, normalize, PAGE_SIZE } from './lib.js';

export const SORTS = {
  new: 'id DESC',
  cheap: 'price IS NULL, price ASC, id DESC',
  exp: 'price IS NULL, price DESC, id DESC',
};

const DEALS = ['sale', 'exchange', 'rent', 'mortgage'];
const CONDS = ['new', 'used'];

const COLS =
  'id, title, price, province, city, cond, deal, shop, created, photos';

function filters(p, category) {
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

  const cat = category || p.get('category');
  if (cat) add('category = ?', String(cat).slice(0, 30));
  const prov = p.get('province');
  if (prov) add('province = ?', prov.slice(0, 40));

  const min = toInt(normalize(p.get('minPrice')));
  if (min && min > 0) add('price >= ?', min);
  const max = toInt(normalize(p.get('maxPrice')));
  if (max && max > 0) add('price <= ?', max);

  const deal = p.get('deal');
  if (DEALS.includes(deal)) add('deal = ?', deal);
  const cond = p.get('cond');
  if (CONDS.includes(cond)) add('cond = ?', cond);

  const seller = p.get('seller');
  if (seller === 'shop') where.push('shop = 1');
  if (seller === 'person') where.push('shop = 0');

  return { sql: ' WHERE ' + where.join(' AND '), args };
}

// p = URLSearchParams. category (optional) overrides p's category.
export async function searchAds(env, p, category) {
  const { sql, args } = filters(p, category);

  const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM ads' + sql)
    .bind(...args).first();
  const total = row ? row.n : 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, toInt(p.get('page')) || 1), pages);

  const order = SORTS[p.get('sort')] || SORTS.new;
  const res = await env.DB.prepare(
    `SELECT ${COLS} FROM ads${sql} ORDER BY ${order} LIMIT ? OFFSET ?`,
  ).bind(...args, PAGE_SIZE, (page - 1) * PAGE_SIZE).all();

  return { rows: res.results, total, pages, page };
}