/**
 * @file functions/icons/[name].js
 * @version 1.0.0
 * @updated 2026-10-31
 * GET /icons/favicon.svg, /icons/48.png, /icons/192.png - site icons.
 */
import { PNG, png } from '../../cf/icon-data.js';
import { PATHS, LOGO_BOX } from '../../cf/logo.js';

const HEAD = { 'cache-control': 'public, max-age=604800' };
const [W, H] = LOGO_BOX;

// Tab icon: dark in light browsers, white in dark ones. The view box is
// made square so the logo stays centered.
const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" `
  + `viewBox="${-(H - W) / 2} 0 ${H} ${H}"><style>path{fill:#171717}`
  + '@media(prefers-color-scheme:dark){path{fill:#fafafa}}</style>'
  + '<g fill-rule="evenodd">'
  + PATHS.map((d) => `<path d="${d}"/>`).join('') + '</g></svg>';

export function onRequestGet({ params }) {
  const name = String(params.name);
  if (name === 'favicon.svg') {
    return new Response(FAVICON, {
      headers: { ...HEAD, 'content-type': 'image/svg+xml' },
    });
  }
  const m = name.match(/^(\d+)\.png$/);
  if (m && PNG[m[1]]) {
    return new Response(png(m[1]), {
      headers: { ...HEAD, 'content-type': 'image/png' },
    });
  }
  return new Response('Not found', { status: 404 });
}