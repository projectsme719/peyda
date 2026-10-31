/**
 * @file functions/my-ads.js
 * @version 1.0.0
 * @updated 2026-10-31
 * GET /my-ads - the signed-in user's published and sold ads. Ads that
 * are pending or rejected are never sent to the site (only in the bot).
 */
import { toInt } from '../cf/lib.js';
import { sessionUser, redirect } from '../cf/auth.js';
import { minePage, PER_PAGE } from '../cf/mine.js';

const COLS = 'id, title, price, province, city, cond, deal, shop, '
  + 'created, photos, status';
const FROM = " FROM ads WHERE owner_tg = ?1 AND status IN ('active', 'sold')";

export async function onRequestGet({ request, env }) {
  const u = await sessionUser(request, env);
  if (!u) return redirect('/login');
  const want = toInt(new URL(request.url).searchParams.get('page')) || 1;
  const o = {
    request, env, title: 'آگهی‌های من', base: '/my-ads', tab: 'me',
    rows: [], total: 0, page: 1,
    empty: 'هنوز آگهی منتشرشده‌ای ندارید.',
  };

  try {
    const c = await env.DB.prepare('SELECT COUNT(*) AS n' + FROM)
      .bind(u.tg_id).first();
    o.total = c ? c.n : 0;
    const pages = Math.max(1, Math.ceil(o.total / PER_PAGE));
    o.page = Math.min(Math.max(1, want), pages);
    const res = await env.DB.prepare(
      `SELECT ${COLS}${FROM} ORDER BY id DESC LIMIT ?2 OFFSET ?3`,
    ).bind(u.tg_id, PER_PAGE, (o.page - 1) * PER_PAGE).all();
    o.rows = res.results;
  } catch (e) {
    console.error('my-ads failed');
    o.status = 503;
    o.empty = 'بارگذاری ناموفق بود؛ کمی بعد دوباره تلاش کنید.';
  }
  return minePage(o);
}