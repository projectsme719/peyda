/**
 * @file functions/saved.js
 * @version 1.0.0
 * @updated 2026-10-31
 * GET /saved - the signed-in user's saved ads (copy sent by the bot).
 */
import { toInt } from '../cf/lib.js';
import { sessionUser, redirect } from '../cf/auth.js';
import { minePage, PER_PAGE } from '../cf/mine.js';

const COLS = 'a.id, a.title, a.price, a.province, a.city, a.cond, a.deal, '
  + 'a.shop, a.created, a.photos';
const FROM = ' FROM bookmarks b JOIN ads a ON a.id = b.ad_id '
  + "WHERE b.tg_id = ?1 AND a.status = 'active'";

export async function onRequestGet({ request, env }) {
  const u = await sessionUser(request, env);
  if (!u) return redirect('/login');
  const want = toInt(new URL(request.url).searchParams.get('page')) || 1;
  const o = {
    request, env, title: 'نشان‌شده‌ها', base: '/saved', tab: 'saved',
    rows: [], total: 0, page: 1,
    empty: 'هنوز آگهی‌ای را نشان نکرده‌اید.',
  };

  try {
    const c = await env.DB.prepare('SELECT COUNT(*) AS n' + FROM)
      .bind(u.tg_id).first();
    o.total = c ? c.n : 0;
    const pages = Math.max(1, Math.ceil(o.total / PER_PAGE));
    o.page = Math.min(Math.max(1, want), pages);
    const res = await env.DB.prepare(
      `SELECT ${COLS}${FROM} ORDER BY b.pos ASC LIMIT ?2 OFFSET ?3`,
    ).bind(u.tg_id, PER_PAGE, (o.page - 1) * PER_PAGE).all();
    o.rows = res.results;
  } catch (e) {
    console.error('saved failed');
    o.status = 503;
    o.empty = 'بارگذاری ناموفق بود؛ کمی بعد دوباره تلاش کنید.';
  }
  return minePage(o);
}