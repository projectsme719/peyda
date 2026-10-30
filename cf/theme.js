/**
 * @file cf/theme.js
 * @version 2.0.0
 * @updated 2026-10-30
 * Page shell (top bar, bottom menu like the Mini App) and helpers.
 */
import { SPRITE, ic } from './icons.js';
import { CSS } from './style.js';

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

// Unix seconds -> "۲ ساعت پیش" (pages are cached, so it can be a bit old).
export const ago = (t) => {
  if (!t) return '';
  const s = Math.max(0, Math.floor(Date.now() / 1000) - t);
  if (s < 60) return 'همین الان';
  if (s < 3600) return fa(Math.floor(s / 60)) + ' دقیقه پیش';
  if (s < 86400) return fa(Math.floor(s / 3600)) + ' ساعت پیش';
  return fa(Math.floor(s / 86400)) + ' روز پیش';
};

const FONT = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;'
  + '700&family=Vazirmatn:wght@400;500;700;800&display=swap';

// Same 5 items as the Mini App menu. Chats, saved and profile need a
// Telegram login, so they open the bot.
function bottomNav(tab) {
  const tg = `https://t.me/${BOT}`;
  const item = (href, icon, label, on) => `<a href="${href}"`
    + (on ? ' class="on" aria-current="page"' : '')
    + (href === tg ? ' rel="nofollow noopener"' : '')
    + `>${ic(icon)}${label}</a>`;
  return '<nav class="bnav" aria-label="منوی اصلی"><div>'
    + item('/', 'home', 'خانه', tab === 'home')
    + item(tg, 'chat', 'گفتگو')
    + `<a class="fab" href="${tg}" rel="nofollow noopener" `
    + `aria-label="ثبت آگهی">${ic('plus')}</a>`
    + item(tg, 'star', 'نشان‌شده')
    + item(tg, 'user', 'من')
    + '</div></nav>';
}

// o: { title, desc, canon, robots, body, head, q, action, compact,
//      status, cache, css (extra), hidden (extra search inputs),
//      tab ('home' by default; '' = no active menu item) }
export function shell(o) {
  const search = o.compact ? '' : `<form class="search" `
    + `action="${esc(o.action || '/ads')}" method="get">`
    + (o.hidden || '')
    + `<input name="q" type="search" value="${esc(o.q || '')}" `
    + 'placeholder="جستجو در آگهی‌ها…" maxlength="60">'
    + `<button>${ic('search')}جستجو</button></form>`;
  const tab = o.tab === undefined ? 'home' : o.tab;

  const html = `<!doctype html><html lang="fa" dir="rtl"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#ffffff"
media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#171717"
media="(prefers-color-scheme: dark)">
<meta name="google-site-verification"
content="-EYHx7NDg4qhC3CWp0vYSDhnFMLv60tMHGlqbd01LNs">
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
<link href="${esc(FONT)}" rel="stylesheet">
${o.head || ''}<style>${CSS}${o.css || ''}</style></head><body>${SPRITE}
<header class="top"><div><a class="logo" href="/">پیدا
<small>بازار آنلاین نیازمندی‌های افغانستان</small></a>${search}</div>
</header>
<main>${o.body}</main>
<footer class="foot"><a href="/about">دربارهٔ پیدا و راهنما</a></footer>
${bottomNav(tab)}
</body></html>`;

  return new Response(html, {
    status: o.status || 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': o.cache || 'public, max-age=300, s-maxage=600',
    },
  });
}