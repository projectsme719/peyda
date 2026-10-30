/**
 * @file functions/sitemap.xml.js
 * @version 1.0.0
 * GET /sitemap.xml - active ads, newest first (max 5000).
 */
export async function onRequestGet({ request, env }) {
  const site = String(env.SITE_URL || new URL(request.url).origin)
    .replace(/\/+$/, '');
  const rows = await env.DB.prepare(
    "SELECT id, updated FROM ads WHERE status = 'active' " +
    'ORDER BY id DESC LIMIT 5000',
  ).all();

    const cats = await env.DB.prepare(
    "SELECT DISTINCT category FROM ads WHERE status = 'active'",
  ).all();
  const urls = [`<url><loc>${site}/</loc></url>`, `<url><loc>${site}/ads</loc></url>`];
  for (const c of cats.results) {
    if (/^[a-z]{2,20}$/.test(c.category)) {
      urls.push(`<url><loc>${site}/c/${c.category}</loc></url>`);
    }
  }
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.join('\n') + '\n</urlset>';

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
