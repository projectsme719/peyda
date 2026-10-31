/**
 * @file functions/me.js
 * @version 1.0.0
 * @updated 2026-10-31
 * GET /me - the signed-in user's page (private, never cached).
 */
import { ic } from '../cf/icons.js';
import { shell, esc, BOT } from '../cf/theme.js';
import { sessionUser, redirect } from '../cf/auth.js';

const CSS = '.me p{margin:6px 0}.me .btn{width:100%;border:0;'
  + 'cursor:pointer;font:inherit;font-weight:700;margin-top:10px}'
  + '.me .btn.alt{border:1px solid var(--ring)}';

export async function onRequestGet({ request, env }) {
  const u = await sessionUser(request, env);
  if (!u) return redirect('/login');
  const site = String(env.SITE_URL || new URL(request.url).origin)
    .replace(/\/+$/, '');

  const body = `<div class="box me"><h1>${ic('user')}
${esc(u.name || 'کاربر پیدا')}</h1>
${u.username ? `<p class="mt" dir="ltr">@${esc(u.username)}</p>` : ''}
<p>شما با حساب تلگرام وارد شده‌اید.</p></div>
<div class="box me"><h2>به‌زودی در سایت</h2>
<p>آگهی‌های من، نشان‌شده‌ها، ثبت آگهی و گفتگو فعلاً در ربات و Mini App
انجام می‌شود و مرحله‌به‌مرحله به سایت اضافه می‌شود.</p>
<a class="btn alt" rel="nofollow noopener" href="https://t.me/${BOT}">
${ic('chat')}باز کردن ربات</a></div>
<form class="me" method="post" action="/logout">
<button class="btn alt">خروج از حساب</button></form>`;

  return shell({
    title: 'حساب من | پیدا', desc: 'حساب کاربری', body, css: CSS,
    canon: site + '/me', robots: 'noindex, nofollow', compact: true,
    tab: '', cache: 'no-store',
  });
}