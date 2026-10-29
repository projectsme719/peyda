/**
 * @file functions/api/img.js
 * @version 1.0.0
 * @updated 2026-10-29
 * GET /api/img?id=12&i=0&t=1 - ad photo (t=1 for the small one).
 * Reads the Telegram file id from the database and downloads the
 * image with the BOT_TOKEN secret. Any problem returns a neutral
 * placeholder picture, so pages never show a broken image.
 */
import { toInt, parseList } from '../../cf/lib.js';

const TG = 'https://api.telegram.org/';

const HOLDER =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">' +
  '<rect width="400" height="300" fill="#dfe5ec"/>' +
  '<path d="M120 200l50-50 40 40 30-30 40 40" fill="none" ' +
  'stroke="#9aa5b4" stroke-width="10" stroke-linecap="round"/>' +
  '<circle cx="150" cy="110" r="18" fill="#9aa5b4"/></svg>';

const holder = () =>
  new Response(HOLDER, {
    headers: {
      'content-type': 'image/svg+xml',
      'cache-control': 'public, max-age=60',
    },
  });

async function download(token, fileId) {
  const meta = await fetch(
    `${TG}bot${token}/getFile?file_id=${encodeURIComponent(fileId)}`,
  );
  const info = await meta.json();
  const path = info && info.ok && info.result && info.result.file_path;
  if (!path) return null;
  const res = await fetch(`${TG}file/bot${token}/${path}`);
  return res.ok ? res : null;
}

function pickFileId(row, i, thumb) {
  const photos = parseList(row.photos);
  const thumbs = parseList(row.thumbs);
  return (thumb && thumbs[i]) || photos[i] || null;
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = toInt(url.searchParams.get('id'));
  const i = toInt(url.searchParams.get('i')) ?? 0;
  const thumb = url.searchParams.get('t') === '1';
  if (!id || i < 0 || i > 4 || !env.BOT_TOKEN) return holder();

  let cache = null;
  try {
    cache = caches.default;
  } catch (e) {
    cache = null;
  }
  const key = new Request(
    `${url.origin}/api/img?id=${id}&i=${i}&t=${thumb ? 1 : 0}`,
  );
  if (cache) {
    try {
      const hit = await cache.match(key);
      if (hit) return hit;
    } catch (e) {
      console.error('img: cache read failed');
    }
  }

  try {
    const row = await env.DB.prepare(
      'SELECT photos, thumbs FROM ads WHERE id = ?1',
    ).bind(id).first();
    const fileId = row ? pickFileId(row, i, thumb) : null;
    if (!fileId) return holder();

    const res = await download(env.BOT_TOKEN, fileId);
    if (!res) return holder();

    const type = res.headers.get('content-type') || '';
    const out = new Response(res.body, {
      headers: {
        'content-type': type.startsWith('image/') ? type : 'image/jpeg',
        'cache-control': 'public, max-age=86400',
      },
    });
    if (cache) {
      context.waitUntil(cache.put(key, out.clone()).catch(() => {}));
    }
    return out;
  } catch (e) {
    console.error('img: download failed');
    return holder();
  }
}