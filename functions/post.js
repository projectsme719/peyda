/**
 * @file functions/post.js
 * @version 1.0.0
 * @updated 2026-10-31
 * GET /post - how to post an ad (opened by the "+" menu button). Ads
 * are posted in the Telegram bot; this page explains the steps.
 */
import { ic } from '../cf/icons.js';
import { SOCIAL } from '../cf/social.js';
import { shell, BOT } from '../cf/theme.js';

const CSS = '.pg ol{margin:8px 0;padding-inline-start:22px;line-height:2}'
  + '.pg li{margin-bottom:6px}.pg p{margin:8px 0}'
  + '.pg ul{margin:8px 0;padding-inline-start:22px;line-height:2}';

export async function onRequestGet({ request, env }) {
  const site = String(env.SITE_URL || new URL(request.url).origin)
    .replace(/\/+$/, '');
  const bot = `https://t.me/${BOT}`;
  const ch = SOCIAL.channel || bot;

  const body = `<div class="box pg"><h1>ثبت آگهی در پیدا</h1>
<p>آگهی‌ها از طریق ربات تلگرام ثبت می‌شوند و هم‌زمان در کانال پیدا،
مینی‌اپ تلگرام و همین سایت نمایش داده می‌شوند.</p>
<div class="btns">
<a class="btn" rel="nofollow noopener" href="${bot}">
${ic('chat')}باز کردن ربات و ثبت آگهی</a>
<a class="btn alt" rel="nofollow noopener" href="${ch}">
${ic('send')}کانال پیدا</a></div></div>

<div class="box pg"><h2>راهنمای قدم‌به‌قدم</h2>
<ol>
<li><b>ربات را باز کنید.</b> دکمهٔ «باز کردن ربات» را بزنید و در تلگرام
Start را بزنید.</li>
<li><b>عضو کانال شوید.</b> برای ثبت آگهی باید عضو کانال
<b><bdi>@PeydaAds</bdi></b> باشید.</li>
<li><b>«ثبت آگهی» را بزنید</b> و عنوان، دسته، مشخصات، نوع معامله
(فروشی، معاوضه، کرایه، گروی)، وضعیت (نو یا مستعمل)، قیمت و توضیحات
را وارد کنید.</li>
<li><b>عکس‌ها را بفرستید.</b> آگهی با عکس بیشتر توجه بیشتری
می‌گیرد.</li>
<li><b>آگهی ثبت می‌شود</b> و در کانال و سایت نمایش داده می‌شود.
نمایش در سایت تا چند دقیقه طول می‌کشد.</li>
</ol></div>

<div class="box pg"><h2>برای آگهی بهتر</h2>
<ul>
<li>عنوان کوتاه و روشن بنویسید.</li>
<li>عکس‌های واضح و از چند زاویه بگذارید.</li>
<li>قیمت، ولایت و وضعیت کالا را درست و کامل بنویسید.</li>
</ul></div>

<div class="box pg"><h2>بعد از ثبت</h2>
<p>از بخش «آگهی‌های من» در ربات می‌توانید آگهی را ویرایش کنید،
به‌عنوان فروخته‌شده علامت بزنید، دوباره در کانال بگذارید یا حذف
کنید. بعد از ورود به سایت، آگهی‌های منتشرشدهٔ خودتان را در
<a href="/my-ads"><b>آگهی‌های من</b></a> هم می‌بینید.</p>
<p><a href="/about"><b>راهنمای کامل پیدا</b></a></p></div>`;

  return shell({
    title: 'ثبت آگهی در پیدا | راهنمای قدم‌به‌قدم',
    desc: 'ثبت آگهی در پیدا از طریق ربات تلگرام: ربات را باز کنید، عضو '
      + 'کانال شوید، اطلاعات و عکس‌ها را بفرستید.',
    canon: site + '/post', robots: 'index, follow', compact: true,
    tab: '', css: CSS, body,
  });
}