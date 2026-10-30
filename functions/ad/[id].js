/**
 * @file functions/ad/[id].js
 * @version 1.0.0
 * GET /ad/12 - server-rendered ad page (HTML, meta, JSON-LD).
 */
import { toInt, parseList } from '../../cf/lib.js';

const BOT = 'PEYDA_YaarBot';
const CATS = {
  realestate: 'خانه و املاک', vehicles: 'موتر', mobile: 'موبایل و تبلت',
  computer: 'کامپیوتر و لوازم جانبی', home: 'لوازم خانگی و آشپزخانه',
  jobs: 'استخدام و کار', services: 'خدمات', fashion: 'لباس و مد',
  pets: 'حیوانات خانگی', other: 'سایر موارد',
};
const DEALS = { sale: 'فروشی', exchange: 'معاوضه', rent: 'کرایه', mortgage: 'گروی' };
const CONDS = { new: 'جدید', used: 'مستعمل' };

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fa = (s) => String(s).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
const money = (p) => (p == null ? 'توافقی'
  : fa(String(p).replace(/\B(?=(\d{3})+(?!\d))/g, ',')) + ' افغانی');

const CSS = `:root{--bg:#EEF1F6;--g:#00B894;--gd:#006644;--ink:#1F2937;--mute:#6B7280}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);
font-family:Vazirmatn,system-ui,sans-serif;line-height:1.9}
header{background:linear-gradient(135deg,var(--gd),#00805a);color:#fff;padding:14px 16px}
header a{color:#fff;font-weight:800;font-size:20px;text-decoration:none}
main{max-width:640px;margin:0 auto;padding:14px}
.card{background:var(--bg);border-radius:18px;padding:14px;margin-bottom:14px;
box-shadow:6px 6px 14px rgba(163,177,198,.6),-6px -6px 14px #fff}
.ph{display:grid;gap:10px}.ph img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:14px;background:#dfe5ec}
h1{font-size:19px;margin:0 0 6px}.price{color:var(--gd);font-weight:800;font-size:18px}
.mute{color:var(--mute);font-size:13px}.sold{background:#b91c1c;color:#fff;border-radius:12px;padding:6px 12px;display:inline-block;margin-bottom:8px}
dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:4px 12px}dt{color:var(--mute)}dd{margin:0}
.btns{display:flex;gap:10px;flex-wrap:wrap}.btn{flex:1;min-width:140px;text-align:center;
background:var(--g);color:#fff;border-radius:14px;padding:12px;text-decoration:none;font-weight:700}
.btn.alt{background:#fff;color:var(--gd)}p{white-space:pre-wrap;margin:6px 0}`;

function page({ title, desc, canon, robots, body, head = '' }) {
  return `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<meta name="robots" content="${robots}"><link rel="canonical" href="${esc(canon)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700;800&display=swap" rel="stylesheet">
${head}<style>${CSS}</style></head><body>
<header><a href="/">پیدا | PEYDA</a></header><main>${body}</main></body></html>`;
}

export async function onRequestGet({ request, env, params }) {
  const url = new URL(request.url);
  const site = String(env.SITE_URL || url.origin).replace(/\/+$/, '');
  const id = toInt(params.id);
  const r = id
    ? await env.DB.prepare('SELECT * FROM ads WHERE id = ?1').bind(id).first()
    : null;

  if (!r) {
    return new Response(page({
      title: 'آگهی پیدا نشد | پیدا', desc: 'این آگهی وجود ندارد یا حذف شده است.',
      canon: site + '/', robots: 'noindex',
      body: '<div class="card"><h1>آگهی پیدا نشد</h1><p>این آگهی حذف شده یا وجود ندارد.</p>'
        + '<a class="btn" href="/">بازگشت به پیدا</a></div>',
    }), { status: 404, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60' } });
  }

  const canon = `${site}/ad/${r.id}`;
  const sold = r.status === 'sold';
  const photos = parseList(r.photos).length;
  const imgs = Array.from({ length: Math.min(photos, 5) }, (_, i) => `${site}/api/img?id=${r.id}&i=${i}`);
  const loc = [r.province, r.city].filter(Boolean).join('، ');
  const cat = CATS[r.category] || '';
  const flat = String(r.description).replace(/\s+/g, ' ').trim();
  const desc = `${r.title}${loc ? ' در ' + loc : ''} - ${money(r.price)}. ${flat}`.slice(0, 160);

  const rows = [];
  if (cat) rows.push(['دسته', cat]);
  if (loc) rows.push(['موقعیت', loc]);
  if (DEALS[r.deal]) rows.push(['نوع معامله', DEALS[r.deal]]);
  if (CONDS[r.cond]) rows.push(['وضعیت', CONDS[r.cond]]);
  parseList(r.attrs).forEach((x) => {
    if (x && x.l && x.v) rows.push([x.l, /^\d+$/.test(x.v) ? fa(x.v) : x.v]);
  });
  if (r.shop && r.shop_name) rows.push(['فروشنده', r.shop_name]);

  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: r.title,
    description: flat.slice(0, 500), category: cat, url: canon,
  };
  if (imgs.length) ld.image = imgs;
  if (r.price != null) {
    ld.offers = {
      '@type': 'Offer', priceCurrency: 'AFN', price: r.price, url: canon,
      availability: sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    };
  }
  const head = (imgs.length ? `<meta property="og:image" content="${esc(imgs[0])}">` : '')
    + `<meta property="og:type" content="product"><meta property="og:title" content="${esc(r.title)}">`
    + `<meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${esc(canon)}">`
    + '<meta property="og:locale" content="fa_AF"><meta name="twitter:card" content="summary_large_image">'
    + `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;

  const body = `<article>
${imgs.length ? '<div class="card ph">' + imgs.map((s, i) =>
    `<img src="/api/img?id=${r.id}&i=${i}" alt="${esc(r.title)} - ${fa(i + 1)}" ${i ? 'loading="lazy"' : ''}>`).join('') + '</div>' : ''}
<div class="card">${sold ? '<span class="sold">فروخته شد</span>' : ''}
<h1>${esc(r.title)}</h1><div class="price">${money(r.price)}</div>
<div class="mute">${esc(loc)}</div></div>
<div class="card"><dl>${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>
<div class="card"><h2>توضیحات</h2><p>${esc(r.description)}</p></div>
<div class="card btns">
<a class="btn" href="https://t.me/${BOT}?start=ad_${r.id}" rel="nofollow">تماس و گفتگو در تلگرام</a>
<a class="btn alt" href="/?ad=${r.id}" rel="nofollow">باز کردن در وب‌باز کردن در وب‌اپ</a></div>
${cat ? `<div class="card"><a href="/c/${r.category}">آگهی‌های بیشتر در ${esc(cat)}</a> · <a href="/ads">همهٔ آگهی‌ها</a></div>` : ''}</article>`;


  return new Response(page({
    title: `${r.title}${loc ? ' - ' + loc : ''} | پیدا`, desc, canon, robots: 'index, follow', body, head,
  }), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300, s-maxage=600' } });
}
