/**
 * @file functions/ad/[id].js
 * @version 2.0.0
 * @updated 2026-10-30
 * GET /ad/12 - server-rendered ad page in the Mini App look
 * (HTML, meta tags, JSON-LD).
 */
import { toInt, parseList } from '../../cf/lib.js';
import { catName, ic } from '../../cf/icons.js';
import {
  shell, esc, fa, money, loc, BOT, DEALS, CONDS,
} from '../../cf/theme.js';

const MAX_PHOTOS = 10;

function jsonLd(r, canon, imgs, cat, sold) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: r.title,
    description: String(r.description).replace(/\s+/g, ' ').slice(0, 500),
    category: cat,
    url: canon,
  };
  if (imgs.length) ld.image = imgs;
  if (r.price != null) {
    ld.offers = {
      '@type': 'Offer',
      priceCurrency: 'AFN',
      price: r.price,
      url: canon,
      availability: 'https://schema.org/'
        + (sold ? 'SoldOut' : 'InStock'),
    };
  }
  return '<script type="application/ld+json">'
    + JSON.stringify(ld).replace(/</g, '\\u003c') + '</script>';
}

function details(r, cat, where) {
  const rows = [];
  if (cat) rows.push(['دسته', cat]);
  if (where) rows.push(['موقعیت', where]);
  if (DEALS[r.deal]) rows.push(['نوع معامله', DEALS[r.deal]]);
  if (CONDS[r.cond]) rows.push(['وضعیت', CONDS[r.cond]]);
  parseList(r.attrs).forEach((x) => {
    if (x && x.l && x.v) {
      rows.push([x.l, /^\d+$/.test(x.v) ? fa(x.v) : x.v]);
    }
  });
  if (r.shop && r.shop_name) rows.push(['فروشنده', r.shop_name]);
  return rows.map(([k, v]) =>
    `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
}

export async function onRequestGet({ request, env, params }) {
  const url = new URL(request.url);
  const site = String(env.SITE_URL || url.origin).replace(/\/+$/, '');
  const id = toInt(params.id);
  const r = id
    ? await env.DB.prepare('SELECT * FROM ads WHERE id = ?1').bind(id).first()
    : null;

  if (!r) {
    return shell({
      title: 'آگهی پیدا نشد | پیدا',
      desc: 'این آگهی وجود ندارد یا حذف شده است.',
      canon: site + '/', robots: 'noindex', status: 404, compact: true,
      cache: 'public, max-age=60',
      body: '<div class="box"><h1>آگهی پیدا نشد</h1>'
        + '<p>این آگهی حذف شده یا وجود ندارد.</p>'
        + '<div class="btns"><a class="btn" href="/ads">'
        + 'همهٔ آگهی‌ها</a></div></div>',
    });
  }

  const canon = `${site}/ad/${r.id}`;
  const sold = r.status === 'sold';
  const count = Math.min(parseList(r.photos).length, MAX_PHOTOS);
  const idx = Array.from({ length: count }, (_, i) => i);
  const imgs = idx.slice(0, 5).map((i) => `${site}/api/img?id=${r.id}&i=${i}`);
  const where = loc(r);
  const cat = catName(r.category);
  const flat = String(r.description).replace(/\s+/g, ' ').trim();
  const desc = (`${r.title}${where ? ' در ' + where : ''} - `
    + `${money(r.price)}. ${flat}`).slice(0, 160);

  const head = (imgs.length
    ? `<meta property="og:image" content="${esc(imgs[0])}">` : '')
    + '<meta property="og:type" content="product">'
    + '<meta name="twitter:card" content="summary_large_image">'
    + jsonLd(r, canon, imgs, cat, sold);

  const gal = count
    ? '<div class="gal">' + idx.map((i) =>
      `<img src="/api/img?id=${r.id}&i=${i}" `
      + `alt="${esc(r.title)} - ${fa(i + 1)}"`
      + `${i ? ' loading="lazy"' : ''}>`).join('') + '</div>'
    : '';

  const more = cat
    ? `<div class="box"><a href="/c/${r.category}">`
      + `آگهی‌های بیشتر در ${esc(cat)}</a></div>`
    : '';

  const body = `<article>${gal}
<div class="box">${sold ? '<span class="sold">فروخته شد</span>' : ''}
<h1>${esc(r.title)}</h1><div class="pr big">${money(r.price)}</div>
${where ? `<div class="mt">${ic('pin')}${esc(where)}</div>` : ''}</div>
<div class="box"><dl>${details(r, cat, where)}</dl></div>
<div class="box"><h2>توضیحات</h2><p>${esc(r.description)}</p></div>
<div class="box btns">
<a class="btn" href="https://t.me/${BOT}?start=ad_${r.id}" rel="nofollow">
${ic('chat')}تماس و گفتگو در تلگرام</a>
<a class="btn alt" href="/ads">${ic('search')}همهٔ آگهی‌ها</a></div>
${more}</article>`;

  return shell({
    title: `${r.title}${where ? ' - ' + where : ''} | پیدا`,
    desc, canon, robots: 'index, follow', body, head, compact: true,
  });
}