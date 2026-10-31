/**
 * @file cf/mine.js
 * @version 1.0.1
 * @updated 2026-10-31
 * Shared page for the signed-in user's lists (/saved and /my-ads).
 * Changing anything (unsave, edit, delete) happens in the bot.
 */
import { ic } from './icons.js';
import { shell, esc, fa, BOT } from './theme.js';
import { card } from './listing.js';

export const PER_PAGE = 12;

const CSS = '.item{display:flex;flex-direction:column}.item .card{flex:1}'
  + '.item .btn{flex:none;min-height:40px;min-width:0;margin-top:6px;'
  + 'padding:0 8px;font-size:13px;white-space:nowrap}'
  + '.item .mt{margin-top:6px}';

// o: { request, env, title, base, rows, total, page, empty, tab, status }
export function minePage(o) {
  const site = String(o.env.SITE_URL || new URL(o.request.url).origin)
    .replace(/\/+$/, '');
  const pages = Math.max(1, Math.ceil(o.total / PER_PAGE));
  const bot = (r) => `https://t.me/${BOT}?start=ad_${r.id}`;

  const items = o.rows.map((r) => `<div class="item">${card(r)}`
    + (r.status === 'sold'
      ? '<div class="mt"><span class="sold">فروخته شد</span></div>' : '')
    + `<a class="btn alt" rel="nofollow noopener" href="${bot(r)}">`
    + `${ic('chat')}باز کردن در ربات</a></div>`).join('');

  const nav = (on, rel, p, t) => (on
    ? `<a class="more" rel="${rel}" href="${o.base}?page=${p}">${t}</a>`
    : '<span></span>');
  const pager = pages > 1
    ? '<nav class="pager">' + nav(o.page > 1, 'prev', o.page - 1, 'قبلی')
      + `<span class="mt">${fa(o.page)} از ${fa(pages)}</span>`
      + nav(o.page < pages, 'next', o.page + 1, 'بعدی') + '</nav>'
    : '';

  const body = `<h1>${esc(o.title)} <span class="mt">(${fa(o.total)})</span>`
    + '</h1>'
    + (o.rows.length
      ? `<div class="grid">${items}</div>${pager}`
      : `<div class="empty">${ic('search')}${esc(o.empty)}</div>`)
    + '<p class="mt">برای تغییر (ویرایش، حذف، برداشتن نشان) آگهی را '
    + 'در ربات باز کنید.</p>';

  return shell({
    title: `${o.title} | پیدا`, desc: o.title, body, css: CSS,
    canon: site + o.base, robots: 'noindex, nofollow', compact: true,
    tab: o.tab, cache: 'no-store', status: o.status || 200,
  });
}