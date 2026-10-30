/**
 * @file functions/robots.txt.js
 * @version 1.0.0
 * GET /robots.txt
 */
export async function onRequestGet({ request, env }) {
  const site = String(env.SITE_URL || new URL(request.url).origin)
    .replace(/\/+$/, '');
  const text = [
    'User-agent: *',
    'Allow: /',
    'Allow: /api/img',
    'Disallow: /api/',
    '',
    `Sitemap: ${site}/sitemap.xml`,
    '',
  ].join('\n');
  return new Response(text, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
