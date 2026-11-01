/**
 * @file functions/manifest.webmanifest.js
 * @version 1.0.0
 * @updated 2026-10-31
 * GET /manifest.webmanifest - name and icons used when the site is added
 * to the phone home screen. "display" can be changed to "browser" if the
 * icon should open the site inside the normal browser.
 */
export function onRequestGet() {
  const manifest = {
    name: 'پیدا | Peyda',
    short_name: 'پیدا',
    description: 'بازار آنلاین نیازمندی‌های افغانستان',
    lang: 'fa',
    dir: 'rtl',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#171717',
    theme_color: '#171717',
    icons: [
      {
        src: '/icons/192.png', sizes: '192x192', type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icons/favicon.svg', sizes: 'any', type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
  return new Response(JSON.stringify(manifest), {
    headers: {
      'content-type': 'application/manifest+json; charset=utf-8',
      'cache-control': 'public, max-age=86400',
    },
  });
}