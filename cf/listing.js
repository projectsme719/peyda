/**
 * @file cf/listing.js
 * @version 2.0.0
 * @updated 2026-10-30
 * Server-rendered list pages: /, /ads and /c/<category> with search,
 * sort and category grid in the Mini App look.
 */
import { parseList } from './lib.js';
import { searchAds, SORTS } from './query.js';
import { CATS, catName, ic } from './icons.js';
import {
  shell, esc, fa, money, loc, DEALS, CONDS,
} from './theme.js';

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

function card(r) {
  const has = parseList(r.photos).length > 0;
  const tags = [];
  const tag = (t, c) => tags.push(`<span class="tg${c || ''}">${t}</span>`);
  if (r.shop) tag(`${ic('store')}دوکان‌دار`, ' shop');
  if (DEALS[r.deal]) tag(DEALS[r.deal]);
  if (CONDS[r.cond]) tag(CONDS[r.cond]);
  const where = loc(r);
  return `<a class="card" href="/ad/${r.id}">`
    + (has
      ? `<img class="ph" src="/api/img?id=${r.id}&i=0&t=1" `
        + `alt="${esc(r.title)}" loading="lazy">`
      : `<div class="ph">${ic('image')}</div>`)
    + `<div class="cb"><h3>${esc(r.title)}</h3>`
    + `<div class="pr">${money(r.price)}</div>`
    + (where ? `<div class="mt">${ic('pin')}${esc(where)}</div>` : '')
    + (tags.length ? `<div class="tags">${tags.join('')}</div>` : '')
    + '</div></a>';
}

function catGrid(category) {
  return '<div class="cats">' + CATS.map((c) => {
    const on = c.k === category;
    const to = on ? '/ads' : '/c/' + c.k;
    return `<a class="cat${on ? ' on' : ''}" href="${to}">`
      + `<span class="ci">${ic(c.i)}</span>${esc(c.n)}</a>`;
  }).join('') + '</div>';
}

export async function renderListing({ request, env, category }) {
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

  const q = (url.searchParams.get('q') || '').trim().slice(0, 60);
  const sort = SORTS[url.searchParams.get('sort')]
    ? url.searchParams.get('sort') : 'new';
  const sp = new URLSearchParams({
    q, sort, page: url.searchParams.get('page') || '',
  });
  const base = category ? `/c/${category}` : '/ads';
  const { rows, total, pages, page } = await searchAds(env, sp, category);

  const plain = !q && sort === 'new';
  const name = catName(category);
  const h1 = q ? `نتیجهٔ جستجو برای «${q}»`
    : (category ? `آگهی‌های ${name}` : 'همهٔ آگهی‌ها');
  const suffix = page > 1 ? ` - صفحهٔ ${fa(page)}` : '';
  const title = `${h1} در افغانستان${suffix} | پیدا`;
  const what = category ? 'در دستهٔ ' + name : 'نیازمندی';
  const desc = `${fa(total)} آگهی ${what} در افغانستان. `
    + 'خرید و فروش موتر، خانه، موبایل و بیشتر در پیدا.';
  const pg = page > 1 ? page : '';
  const canon = site + (plain ? href(base, { page: pg }) : base);

  const keep = { q, sort: sort === 'new' ? '' : sort };
  const seg = '<div class="seg">' + Object.keys(SORT_NAMES).map((k) =>
    `<a class="${k === sort ? 'on' : ''}" `
    + `href="${href(base, { q, sort: k === 'new' ? '' : k })}">`
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

  const body = catGrid(category)
    + `<h1>${esc(h1)} <span class="mt">(${fa(total)})</span></h1>${seg}`
    + (total
      ? `<div class="grid">${rows.map(card).join('')}</div>${pager}`
      : `<div class="empty">${ic('search')}آگهی‌ای پیدا نشد</div>`);

  return shell({
    title, desc, canon, body, q, action: base,
    robots: total && plain ? 'index, follow' : 'noindex, follow',
    cache: q ? 'public, max-age=60' : undefined,
  });
}