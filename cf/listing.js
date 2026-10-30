/**
 * @file cf/listing.js
 * @version 4.2.0
 * @updated 2026-10-30
 * Server-rendered list pages: /, /ads, /c/<cat>, /p/<prov>, /shop/<name>
 * with search, sort, filters and the category grid (Mini App look).
 */
import { parseList, toInt, normalize } from './lib.js';
import { searchAds, SORTS } from './query.js';
import { CATS, catName, ic } from './icons.js';
import {
  shell, esc, fa, money, loc, ago, DEALS, CONDS,
} from './theme.js';
import {
    PROVS, PROV_SLUGS, SELLERS, filterBox, chips, hidden,
} from './filters.js';

const SORT_NAMES = { new: 'جدیدترین', cheap: 'ارزان‌ترین', exp: 'گران‌ترین' };

// Builds base?key=value for the non-empty values only.
function href(base, o) {
  const p = new URLSearchParams();
  Object.keys(o).forEach((k) => {
    if (o[k]) p.set(k, o[k]);
  });
  const s = p.toString();
  return base + (s ? '?' + s : '');
}

// Digits (also Persian) -> positive integer text, or ''.
const num = (v) => {
  const n = toInt(normalize(v));
  return n && n > 0 ? String(n) : '';
};

function card(r) {
  const has = parseList(r.photos).length > 0;
  const tags = [];
  const tag = (t, c) => tags.push(`<span class="tg${c || ''}">${t}</span>`);
  if (r.shop) tag(`${ic('store')}دوکان‌دار`, ' shop');
  if (DEALS[r.deal]) tag(DEALS[r.deal]);
  if (CONDS[r.cond]) tag(CONDS[r.cond]);
  const where = loc(r);
  const time = ago(r.created);
  return `<a class="card" href="/ad/${r.id}">`
    + (has
      ? `<img class="ph" src="/api/img?id=${r.id}&i=0&t=1" `
        + `alt="${esc(r.title)}" loading="lazy">`
      : `<div class="ph">${ic('image')}</div>`)
    + `<div class="cb"><h3>${esc(r.title)}</h3>`
    + `<div class="pr">${money(r.price)}</div>`
    + (where || time
      ? `<div class="mt">${where ? ic('pin') + esc(where) : ''}`
        + `${where && time ? ' · ' : ''}${time}</div>`
      : '')
    + (tags.length ? `<div class="tags">${tags.join('')}</div>` : '')
    + '</div></a>';
}

function catGrid(category) {
  return '<nav class="cats" aria-label="دسته‌ها">' + CATS.map((c) => {
    const on = c.k === category;
    const to = on ? '/ads' : '/c/' + c.k;
    return `<a class="cat${on ? ' on' : ''}" href="${to}">`
      + `${ic(c.i)}${esc(c.n)}</a>`;
  }).join('') + '</nav>';
}

// fixed = province name (/p/<prov> pages); shop = shop name (/shop/<name>).
export async function renderListing({
  request, env, category, province: fixed = '', shop = '',
}) {
  const url = new URL(request.url);
  const site = String(env.SITE_URL || url.origin).replace(/\/+$/, '');

  if (category && !catName(category)) {
    return shell({
      title: 'صفحه پیدا نشد | پیدا', desc: 'این دسته وجود ندارد.',
      canon: site + '/ads', robots: 'noindex', status: 404, compact: true,
      body: '<div class="box">این دسته وجود ندارد. '
        + '<a href="/ads">همهٔ آگهی‌ها</a></div>',
    });
  }

  const get = (k) => url.searchParams.get(k) || '';
  const q = get('q').trim().slice(0, 60);
  const sort = SORTS[get('sort')] ? get('sort') : 'new';
  const province = fixed
    || (PROVS.includes(get('province')) ? get('province') : '');
  const minPrice = num(get('minPrice'));
  const maxPrice = num(get('maxPrice'));
  const deal = DEALS[get('deal')] ? get('deal') : '';
  const cond = CONDS[get('cond')] ? get('cond') : '';
  const seller = !shop && SELLERS[get('seller')] ? get('seller') : '';
  const sp = new URLSearchParams({
    q, sort, province, minPrice, maxPrice, deal, cond, seller,
    shopName: shop, page: get('page'),
  });
  const base = shop ? '/shop/' + encodeURIComponent(shop)
    : fixed ? `/p/${PROV_SLUGS[fixed]}`
      : (category ? `/c/${category}` : '/ads');
  const { rows, total, pages, page } = await searchAds(env, sp, category);

  const flt = {
    province: fixed ? '' : province, minPrice, maxPrice, deal, cond, seller,
  };
  const sortKey = sort === 'new' ? '' : sort;
  const keep = { q, sort: sortKey, ...flt };
  const plain = !q && !sortKey && !Object.values(flt).some(Boolean);
  const name = catName(category);
  const h1 = shop ? `دوکان ${shop}` : q ? `نتیجهٔ جستجو برای «${q}»`
    : (fixed ? `آگهی‌های ${fixed}`
      : (category ? `آگهی‌های ${name}` : 'همهٔ آگهی‌ها'));
  const suffix = page > 1 ? ` - صفحهٔ ${fa(page)}` : '';
  const title = shop || fixed ? `${h1}${suffix} | پیدا`
    : `${h1} در افغانستان${suffix} | پیدا`;
  const what = category ? 'در دستهٔ ' + name : 'نیازمندی';
  const desc = shop ? `${fa(total)} آگهی از دوکان ${shop} در پیدا.`
    : fixed
      ? `${fa(total)} آگهی در ${fixed} افغانستان. خرید و فروش موتر، `
        + `خانه، موبایل و بیشتر در ${fixed}.`
      : `${fa(total)} آگهی ${what} در افغانستان. `
        + 'خرید و فروش موتر، خانه، موبایل و بیشتر در پیدا.';
  const pg = page > 1 ? page : '';
  const canon = site + (plain ? href(base, { page: pg }) : base);

  const off = (k) => href(base, { ...keep, [k]: '' });
  const used = [];
  // On a province page the chip is the easy way back to all provinces.
  if (fixed) used.push([fixed, href('/ads', keep)]);
  if (province && !fixed) used.push([province, off('province')]);
  if (minPrice) used.push(['از ' + money(minPrice), off('minPrice')]);
  if (maxPrice) used.push(['تا ' + money(maxPrice), off('maxPrice')]);
  if (deal) used.push([DEALS[deal], off('deal')]);
  if (cond) used.push([CONDS[cond], off('cond')]);
  if (seller) used.push([SELLERS[seller], off('seller')]);

  const seg = '<div class="seg">' + Object.keys(SORT_NAMES).map((k) =>
    `<a class="${k === sort ? 'on' : ''}" `
    + `href="${href(base, { ...keep, sort: k === 'new' ? '' : k })}">`
    + `${SORT_NAMES[k]}</a>`).join('') + '</div>';

  const link = (p) => href(base, { ...keep, page: p > 1 ? p : '' });
  const nav = (on, rel, p, t) => (on
    ? `<a class="more" rel="${rel}" href="${link(p)}">${t}</a>`
    : '<span></span>');
  const pager = pages > 1
    ? '<nav class="pager">' + nav(page > 1, 'prev', page - 1, 'قبلی')
      + `<span class="mt">${fa(page)} از ${fa(pages)}</span>`
      + nav(page < pages, 'next', page + 1, 'بعدی') + '</nav>'
    : '';

  const box = filterBox({
    base: fixed ? '/ads' : base, ...flt, province, noSeller: !!shop,
    closed: !!fixed, keep: { q, sort: sortKey }, reset: href(base, { q }),
  });
  const gone = shop && !total && plain;
  const body = (shop ? '' : catGrid(category)) + box + chips(used)
    + `<h1>${esc(h1)} <span class="mt">(${fa(total)})</span></h1>${seg}`
    + (total
      ? `<div class="grid">${rows.map(card).join('')}</div>${pager}`
      : `<div class="empty">${ic('search')}آگهی‌ای پیدا نشد</div>`);

  return shell({
    title, desc, canon, body, q, action: base,
    status: gone ? 404 : 200,
    hidden: hidden({ sort: sortKey, ...flt }),
    robots: total && plain ? 'index, follow' : 'noindex, follow',
    cache: plain ? undefined : 'public, max-age=60',
  });
}