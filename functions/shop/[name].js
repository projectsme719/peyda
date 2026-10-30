/**
 * @file functions/shop/[name].js
 * @version 1.0.0
 * @updated 2026-10-30
 * GET /shop/<name> - active ads of one shop (matched by shop name).
 */
import { renderListing } from '../../cf/listing.js';
import { shell } from '../../cf/theme.js';

export const onRequestGet = ({ request, env }) => {
  const url = new URL(request.url);
  let name = '';
  try {
    name = decodeURIComponent(url.pathname.split('/')[2] || '').trim();
  } catch (e) {
    name = '';
  }
  if (!name) {
    const site = String(env.SITE_URL || url.origin).replace(/\/+$/, '');
    return shell({
      title: 'صفحه پیدا نشد | پیدا', desc: 'این دوکان وجود ندارد.',
      canon: site + '/ads', robots: 'noindex', status: 404, compact: true,
      body: '<div class="box">این دوکان وجود ندارد. '
        + '<a href="/ads">همهٔ آگهی‌ها</a></div>',
    });
  }
  return renderListing({
    request, env, category: null, shop: name.slice(0, 60),
  });
};
