/**
 * @file functions/login.js
 * @version 1.0.0
 * @updated 2026-10-31
 * GET/POST /login - sign in with a one-time code sent by the Telegram bot.
 * Step 1: start (nonce cookie + bot link). Step 2: type the 6-digit code.
 */
import { rateLimit, normalize } from '../cf/lib.js';
import { ic } from '../cf/icons.js';
import { shell, esc, fa, BOT } from '../cf/theme.js';
import {
  NONCE_COOKIE, SESSION_COOKIE, SESSION_DAYS, NONCE_TTL, MAX_TRIES,
  now, randomToken, getCookie, cookie, redirect, codeHash, same,
  createSession, sessionUser,
} from '../cf/auth.js';

const NONCE = /^[A-Za-z0-9_-]{22}$/;
const CSS = '.lg p{margin:8px 0}.lg ol{margin:8px 0;'
  + 'padding-inline-start:22px;line-height:2}'
  + '.lg form{margin-top:12px}.lg .btn{width:100%;margin-top:10px;'
  + 'border:0;cursor:pointer;font:inherit;font-weight:700}'
  + '.lg .btn.alt{border:1px solid var(--ring)}'
  + '.lg input{width:100%;height:56px;border:1px solid var(--border);'
  + 'border-radius:12px;background:var(--input);color:var(--foreground);'
  + 'font:inherit;font-size:24px;letter-spacing:8px;text-align:center}'
  + '.err{color:var(--destructive);font-weight:700}';

const err = (m) => (m ? `<p class="err">${esc(m)}</p>` : '');

const step1 = (m) => `<div class="box lg"><h1>ورود یا ساخت حساب</h1>
<p>با حساب تلگرام وارد شوید؛ رمز عبور لازم نیست. ربات پیدا یک کد ۶ رقمی
برایتان می‌فرستد.</p>${err(m)}
<form method="post" action="/login">
<input type="hidden" name="a" value="start">
<button class="btn">${ic('chat')}دریافت کد از ربات تلگرام</button>
</form></div>`;

const step2 = (nonce, m) => `<div class="box lg"><h1>کد ورود</h1><ol>
<li>روی دکمهٔ زیر بزنید و در تلگرام «Start» را بزنید.</li>
<li>کد ۶ رقمی که ربات می‌فرستد را همین‌جا وارد کنید.</li></ol>
<a class="btn alt" rel="nofollow noopener"
href="https://t.me/${BOT}?start=login_${esc(nonce)}">
${ic('chat')}باز کردن ربات</a>${err(m)}
<form method="post" action="/login">
<input type="hidden" name="a" value="verify">
<input name="code" inputmode="numeric" autocomplete="one-time-code"
maxlength="6" dir="ltr" placeholder="------" required>
<button class="btn">ورود</button></form>
<p class="mt">کد ${fa(5)} دقیقه اعتبار دارد. آن را به هیچ‌کس ندهید.</p>
</div>`;

function page(request, env, body, o = {}) {
  const site = String(env.SITE_URL || new URL(request.url).origin)
    .replace(/\/+$/, '');
  const res = shell({
    title: 'ورود | پیدا', desc: 'ورود با حساب تلگرام', body,
    canon: site + '/login', robots: 'noindex, nofollow', compact: true,
    tab: '', cache: 'no-store', css: CSS, status: o.status || 200,
  });
  (o.cookies || []).forEach((c) => res.headers.append('set-cookie', c));
  return res;
}

const clearNonce = () => cookie(NONCE_COOKIE, '', 0);
const down = (request, env) => page(request, env,
  step1('سرویس ورود آماده نیست؛ کمی بعد دوباره تلاش کنید.'),
  { status: 503 });
const busy = (request, env) => page(request, env,
  step1('تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید.'),
  { status: 429 });

async function start(request, env) {
  if (!(await rateLimit(env, request, 'lstart', 10))) {
    return busy(request, env);
  }
  const nonce = randomToken(16);
  const t = now();
  try {
    await env.DB.prepare(
      'INSERT INTO login_codes (nonce, expires) VALUES (?1, ?2)',
    ).bind(nonce, t + NONCE_TTL).run();
    if (Math.random() < 0.05) {
      await env.DB.batch([
        env.DB.prepare('DELETE FROM login_codes WHERE expires < ?1').bind(t),
        env.DB.prepare('DELETE FROM sessions WHERE expires < ?1').bind(t),
      ]);
    }
  } catch (e) {
    console.error('login start failed');
    return down(request, env);
  }
  return page(request, env, step2(nonce, ''),
    { cookies: [cookie(NONCE_COOKIE, nonce, NONCE_TTL)] });
}

async function verify(request, env, form) {
  const nonce = getCookie(request, NONCE_COOKIE);
  const again = (m) => page(request, env, step1(m),
    { status: 400, cookies: [clearNonce()] });
  if (!NONCE.test(nonce)) return again('نشست منقضی شد؛ دوباره کد بگیرید.');
  if (!(await rateLimit(env, request, 'lverify', 40))) {
    return busy(request, env);
  }
  const code = normalize(form.get('code')).replace(/\D/g, '');
  if (code.length !== 6) {
    return page(request, env, step2(nonce, 'کد باید ۶ رقم باشد.'),
      { status: 400 });
  }

  try {
    const t = now();
    const row = await env.DB.prepare(
      'SELECT code_hash, expires, used, tries FROM login_codes '
      + 'WHERE nonce = ?1',
    ).bind(nonce).first();
    if (!row || row.used || row.expires < t) {
      return again('کد منقضی شد؛ دوباره کد بگیرید.');
    }
    if (!row.code_hash) {
      return page(request, env,
        step2(nonce, 'هنوز کدی نگرفته‌اید؛ ابتدا ربات را باز کنید.'),
        { status: 400 });
    }
    // Count the attempt first (atomic), then compare.
    const r = await env.DB.prepare(
      'UPDATE login_codes SET tries = tries + 1 WHERE nonce = ?1 '
      + 'AND used = 0 AND tries < ?2 AND expires > ?3 '
      + 'RETURNING code_hash, tg_id, name, username, tries',
    ).bind(nonce, MAX_TRIES, t).first();
    if (!r) return again('تلاش‌ها تمام شد؛ دوباره کد بگیرید.');

    if (!same(r.code_hash, await codeHash(env, nonce, code))) {
      const left = MAX_TRIES - r.tries;
      if (left <= 0) return again('تلاش‌ها تمام شد؛ دوباره کد بگیرید.');
      return page(request, env,
        step2(nonce, `کد اشتباه است. ${fa(left)} تلاش دیگر باقی مانده.`),
        { status: 400 });
    }

    const used = await env.DB.prepare(
      'UPDATE login_codes SET used = 1 WHERE nonce = ?1 AND used = 0',
    ).bind(nonce).run();
    if (!used.meta || used.meta.changes !== 1) {
      return again('کد قبلاً استفاده شده است.');
    }
    await env.DB.prepare(
      'INSERT INTO users (tg_id, name, username, created, last_login) '
      + 'VALUES (?1, ?2, ?3, ?4, ?4) ON CONFLICT(tg_id) DO UPDATE SET '
      + 'name = ?2, username = ?3, last_login = ?4',
    ).bind(r.tg_id, r.name, r.username, t).run();
    const token = await createSession(env, r.tg_id);
    return redirect('/me', [
      cookie(SESSION_COOKIE, token, SESSION_DAYS * 86400), clearNonce(),
    ]);
  } catch (e) {
    console.error('login verify failed');
    return down(request, env);
  }
}

export async function onRequestGet({ request, env }) {
  if (await sessionUser(request, env)) return redirect('/me');
  return page(request, env, step1(''));
}

export async function onRequestPost({ request, env }) {
  let form;
  try {
    form = await request.formData();
  } catch (e) {
    return page(request, env, step1('درخواست نامعتبر است.'), { status: 400 });
  }
  return form.get('a') === 'verify'
    ? verify(request, env, form) : start(request, env);
}