/**
 * @file functions/p/[prov].js
 * @version 1.0.0
 * GET /p/kabul - active ads of one province (server-rendered).
 */
import { renderListing } from '../../cf/listing.js';
import { provFromSlug } from '../../cf/filters.js';
import { shell } from '../../cf/theme.js';

export const onRequestGet = ({ request, env, params }) => {
  const province = provFromSlug(String(params.prov));
  if (!province) {
    const site = String(env.SITE_URL || new URL(request.url).origin)
      .replace(/\/+$/, '');
    return shell({
      title: 'صفحه پیدا نشد | پیدا', desc: 'این ولایت وجود ندارد.',
      canon: site + '/ads', robots: 'noindex', status: 404, compact: true,
      body: '<div class="box">این ولایت وجود ندارد. '
        + '<a href="/ads">همهٔ آگهی‌ها</a></div>',
    });
  }
  return renderListing({ request, env, category: null, province });
};
