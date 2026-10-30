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

  const urls = [`<url><loc>${site}/</loc></url>`];
  for (const r of rows.results) {
    const day = new Date(r.updated * 1000).toISOString().slice(0, 10);
    urls.push(
      `<url><loc>${site}/ad/${r.id}</loc><lastmod>${day}</lastmod></url>`,
    );
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
