/**
 * @file cf/listing.js
 * @version 1.0.0
 * Server-rendered listing pages (/ads and /c/<category>).
 */
import { toInt, parseList, PAGE_SIZE } from './lib.js';

export const CATS = {
  realestate: 'خانه و املاک', vehicles: 'موتر', mobile: 'موبایل و تبلت',
  computer: 'کامپیوتر و لوازم جانبی', home: 'لوازم خانگی و آشپزخانه',
  jobs: 'استخدام و کار', services: 'خدمات', fashion: 'لباس و مد',
  pets: 'حیوانات خانگی', other: 'سایر موارد',
};

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fa = (s) => String(s).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
const money = (p) => (p == null ? 'توافقی'
  : fa(String(p).replace(/\B(?=(\d{3})+(?!\d))/g, ',')) + ' افغانی');

const CSS = `:root{--bg:#EEF1F6;--g:#00B894;--gd:#006644;--ink:#1F2937;--mute:#6B7280}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);
font-family:Vazirmatn,system-ui,sans-serif;line-height:1.8}
header{background:linear-gradient(135deg,var(--gd),#00805a);color:#fff;padding:14px 16px}
header a{color:#fff;font-weight:800;font-size:20px;text-decoration:none}
main{max-width:720px;margin:0 auto;padding:14px}h1{font-size:19px;margin:6px 2px 12px}
.chips{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 10px}
.chips a{white-space:nowrap;background:#fff;color:var(--gd);border-radius:99px;padding:6px 14px;text-decoration:none;font-size:13px}
.chips a.on{background:var(--g);color:#fff}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.item{display:block;background:var(--bg);border-radius:16px;overflow:hidden;color:inherit;text-decoration:none;
box-shadow:5px 5px 12px rgba(163,177,198,.6),-5px -5px 12px #fff}
.item img,.item .ph{width:100%;aspect-ratio:4/3;object-fit:cover;background:#dfe5ec;display:block}
.item div{padding:8px 10px}.t{font-weight:700;font-size:14px}.p{color:var(--gd);font-weight:800;font-size:13px}
.m{color:var(--mute);font-size:12px}.pager{display:flex;justify-content:space-between;margin:18px 2px}
.pager a{background:var(--g);color:#fff;border-radius:12px;padding:8px 16px;text-decoration:none;font-weight:700}
.empty{background:#fff;border-radius:16px;padding:20px;text-align:center}`;

function shell({ title, desc, canon, robots, body, status = 200 }) {
  const html = `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<meta name="robots" content="${robots}"><link rel="canonical" href="${esc(canon)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canon)}"><meta property="og:locale" content="fa_AF">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700;800&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body><header><a href="/">پیدا | PEYDA</a></header>
<main>${body}</main></body></html>`;
  return new Response(html, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=600',
    },
  });
}

export async function renderListing({ request, env, category }) {
  const url = new URL(request.url);
  const site = String(env.SITE_URL || url.origin).replace(/\/+$/, '');

  if (category && !CATS[category]) {
    return shell({
      title: 'صفحه پیدا نشد | پیدا', desc: 'این دسته وجود ندارد.',
      canon: site + '/ads', robots: 'noindex', status: 404,
      body: '<div class="empty">این دسته وجود ندارد. <a href="/ads">همهٔ آگهی‌ها</a></div>',
    });
  }

  const base = category ? `/c/${category}` : '/ads';
  const where = category ? "status = 'active' AND category = ?1" : "status = 'active'";
  const args = category ? [category] : [];

  const c = await env.DB.prepare(`SELECT COUNT(*) AS n FROM ads WHERE ${where}`)
    .bind(...args).first();
  const total = c ? c.n : 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, toInt(url.searchParams.get('page')) || 1), pages);

  const rows = await env.DB.prepare(
    'SELECT id, title, price, province, city, photos FROM ads ' +
    `WHERE ${where} ORDER BY id DESC LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`,
  ).bind(...args).all();

  const name = category ? CATS[category] : 'همهٔ آگهی‌ها';
  const h1 = category ? `آگهی‌های ${name}` : 'همهٔ آگهی‌ها';
  const suffix = page > 1 ? ` - صفحهٔ ${fa(page)}` : '';
  const title = `${h1} در افغانستان${suffix} | پیدا`;
  const desc = `${fa(total)} آگهی ${category ? 'در دستهٔ ' + name : 'نیازمندی'} در افغانستان. `
    + 'خرید و فروش موتر، خانه، موبایل و بیشتر در پیدا.';
  const canon = site + base + (page > 1 ? `?page=${page}` : '');

  const chips = ['<a href="/ads"' + (category ? '' : ' class="on"') + '>همه</a>']
    .concat(Object.keys(CATS).map((k) =>
      `<a href="/c/${k}"${k === category ? ' class="on"' : ''}>${esc(CATS[k])}</a>`)).join('');

  const cards = rows.results.map((r) => {
    const has = parseList(r.photos).length > 0;
    const loc = [r.province, r.city].filter(Boolean).join('، ');
    return `<a class="item" href="/ad/${r.id}">`
      + (has ? `<img src="/api/img?id=${r.id}&i=0&t=1" alt="${esc(r.title)}" loading="lazy">` : '<div class="ph"></div>')
      + `<div><div class="t">${esc(r.title)}</div><div class="p">${money(r.price)}</div>`
      + `<div class="m">${esc(loc)}</div></div></a>`;
  }).join('');

  const link = (p) => base + (p > 1 ? `?page=${p}` : '');
  const pager = pages > 1
    ? '<nav class="pager">'
      + (page > 1 ? `<a rel="prev" href="${link(page - 1)}">قبلی</a>` : '<span></span>')
      + `<span class="m">${fa(page)} از ${fa(pages)}</span>`
      + (page < pages ? `<a rel="next" href="${link(page + 1)}">بعدی</a>` : '<span></span>')
      + '</nav>'
    : '';

  const body = `<h1>${esc(h1)}</h1><div class="chips">${chips}</div>`
    + (total ? `<div class="grid">${cards}</div>${pager}`
      : '<div class="empty">هنوز آگهی‌ای در این بخش ثبت نشده است.</div>');

  return shell({
    title, desc, canon, body, robots: total ? 'index, follow' : 'noindex, follow',
  });
}
