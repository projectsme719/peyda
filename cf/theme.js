/**
 * @file cf/theme.js
 * @version 1.0.0
 * @updated 2026-10-30
 * Mini App look for the server pages: helpers, CSS and page shell.
 */
import { SPRITE, ic } from './icons.js';

export const BOT = 'PEYDA_YaarBot';
export const DEALS = {
  sale: 'فروشی', exchange: 'معاوضه', rent: 'کرایه', mortgage: 'گروی',
};
export const CONDS = { new: 'جدید', used: 'مستعمل' };

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const fa = (s) => String(s).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
export const money = (p) => (p == null ? 'توافقی'
  : fa(String(p).replace(/\B(?=(\d{3})+(?!\d))/g, ',')) + ' افغانی');
export const loc = (r) => [r.province, r.city].filter(Boolean).join('، ');

const FONT = 'https://fonts.googleapis.com/css2?family=Vazirmatn:'
  + 'wght@400;500;700;800&display=swap';

const CSS = `:root{--bg:#EEF1F6;--d:rgba(163,177,198,.6);--l:#fff;
--g:#00B894;--gd:#006644;--gl:#A7E22E;--ink:#1F2937;--mute:#6B7280;
--out:6px 6px 14px var(--d),-6px -6px 14px var(--l);
--sm:3px 3px 8px var(--d),-3px -3px 8px var(--l);
--in:inset 3px 3px 7px var(--d),inset -3px -3px 7px var(--l)}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0;background:var(--bg);color:var(--ink);font-size:14px;
font-family:Vazirmatn,system-ui,sans-serif;line-height:1.8}
a{color:inherit;text-decoration:none}
.ic{width:1.25em;height:1.25em;fill:none;stroke:currentColor;
stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none;
vertical-align:-.25em}
.top{background:linear-gradient(135deg,var(--gd),#00805a);color:#fff;
padding:12px 16px 20px;border-radius:0 0 28px 28px;
box-shadow:0 8px 20px rgba(0,100,70,.25)}
.top>*{max-width:900px;margin-inline:auto}
.row{display:flex;align-items:center;gap:10px}
.logo{font-weight:800;font-size:20px;line-height:1.1}
.logo small{display:block;font-size:9px;letter-spacing:3px;opacity:.8;
font-weight:500}
.pill{margin-inline-start:auto;background:rgba(255,255,255,.18);
color:#fff;border-radius:99px;padding:8px 12px;font-size:13px;
display:flex;gap:6px;align-items:center}
.slogan{margin-block:14px 10px;font-weight:700}
.search{display:flex;gap:8px}
.search input{flex:1;min-width:0;border:0;border-radius:14px;
padding:12px 14px;outline:none;background:#fff;color:var(--ink);
box-shadow:inset 2px 2px 6px rgba(0,0,0,.12);font:inherit;font-size:16px}
.search button{border:0;border-radius:14px;background:var(--gl);
color:var(--gd);font:inherit;font-weight:700;padding:0 14px;
display:flex;align-items:center;gap:6px;cursor:pointer}
main{padding:14px 14px 40px;max-width:900px;margin:0 auto}
h1{font-size:15px;margin:8px 2px 12px;display:flex;align-items:center;
gap:8px}
.cats{display:grid;gap:10px;margin-bottom:16px;
grid-template-columns:repeat(auto-fill,minmax(64px,1fr))}
.cat{display:block;background:var(--bg);box-shadow:var(--sm);
border-radius:16px;padding:10px 2px 8px;text-align:center;
font-size:10.5px;line-height:1.5}
.cat .ci{width:38px;height:38px;border-radius:50%;margin:0 auto 5px;
display:grid;place-items:center;color:var(--g);box-shadow:var(--in);
font-size:16px}
.cat.on{box-shadow:var(--in)}
.cat.on .ci{color:#fff;background:var(--g);box-shadow:var(--sm)}
.seg{display:flex;background:var(--bg);box-shadow:var(--in);
border-radius:16px;padding:4px;gap:4px;margin:0 0 12px}
.seg a{flex:1;text-align:center;border-radius:12px;padding:9px 4px;
color:var(--mute);font-size:13px}
.seg a.on{background:var(--g);color:#fff;box-shadow:var(--sm);
font-weight:700}
.grid{display:grid;gap:12px;
grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}
.card{display:block;background:var(--bg);box-shadow:var(--out);
border-radius:20px;overflow:hidden}
.ph{display:grid;place-items:center;width:100%;aspect-ratio:4/3;
object-fit:cover;background:#dfe5ec;color:#9aa5b4;font-size:30px}
.cb{padding:9px 11px 12px}
.cb h3{margin:0 0 5px;font-size:13px;line-height:1.6;overflow:hidden;
display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.pr{color:var(--gd);font-weight:800;font-size:13px}
.pr.big{font-size:19px;margin:6px 0}
.mt{color:var(--mute);font-size:11px;margin-top:4px;line-height:1.7;
display:flex;gap:4px;align-items:center;flex-wrap:wrap}
.tags{display:flex;gap:4px;flex-wrap:wrap;margin-top:6px}
.tg{font-size:10px;padding:2px 8px;border-radius:99px;color:var(--mute);
background:var(--bg);box-shadow:var(--in);display:inline-flex;gap:3px;
align-items:center}
.tg.shop{color:var(--gd);font-weight:700}
.pager{display:flex;justify-content:space-between;align-items:center;
margin:18px 2px}
.more{background:var(--g);color:#fff;border-radius:14px;
padding:10px 22px;font-weight:700;box-shadow:var(--sm)}
.empty{text-align:center;color:var(--mute);padding:40px 0;line-height:2}
.empty .ic{width:42px;height:42px;display:block;margin:0 auto 8px;
opacity:.6}
.box{background:var(--bg);box-shadow:var(--out);border-radius:20px;
padding:14px;margin-bottom:14px}
.box h2{font-size:15px;margin:0 0 6px}
.box p{white-space:pre-wrap;margin:6px 0}
.gal{display:flex;gap:8px;overflow-x:auto;scroll-snap-type:x mandatory;
border-radius:20px;margin-bottom:14px;box-shadow:var(--out)}
.gal img{flex:0 0 100%;width:100%;aspect-ratio:4/3;object-fit:cover;
scroll-snap-align:center;background:#dfe5ec}
.sold{background:#b91c1c;color:#fff;border-radius:12px;padding:4px 12px;
display:inline-block;margin-bottom:6px}
dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:4px 14px}
dt{color:var(--mute)}dd{margin:0}
.btns{display:flex;gap:10px;flex-wrap:wrap}
.btn{flex:1;min-width:150px;display:flex;gap:8px;justify-content:center;
align-items:center;background:var(--g);color:#fff;border-radius:14px;
padding:12px;font-weight:700;box-shadow:var(--sm)}
.btn.alt{background:var(--bg);color:var(--gd)}`;

// o: { title, desc, canon, robots, body, head, q, action, compact,
//      status, cache }
export function shell(o) {
  const search = o.compact ? '' : '<div class="slogan">'
    + 'بازار آنلاین نیازمندی‌های افغانستان</div>'
    + `<form class="search" action="${esc(o.action || '/ads')}" method="get">`
    + `<input name="q" type="search" value="${esc(o.q || '')}" `
    + 'placeholder="جستجو در آگهی‌ها…" maxlength="60">'
    + `<button>${ic('search')}جستجو</button></form>`;

  const html = `<!doctype html><html lang="fa" dir="rtl"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<meta name="robots" content="${o.robots}">
<link rel="canonical" href="${esc(o.canon)}">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:url" content="${esc(o.canon)}">
<meta property="og:locale" content="fa_AF">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONT}" rel="stylesheet">
${o.head || ''}<style>${CSS}</style></head><body>${SPRITE}
<header class="top"><div class="row"><a class="logo" href="/">پیدا
<small>PEYDA</small></a><a class="pill" href="https://t.me/${BOT}"
rel="nofollow">${ic('plus')}ثبت آگهی</a></div>${search}</header>
<main>${o.body}</main></body></html>`;

  return new Response(html, {
    status: o.status || 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': o.cache || 'public, max-age=300, s-maxage=600',
    },
  });
}