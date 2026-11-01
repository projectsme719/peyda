/**
 * @file functions/favicon.ico.js
 * @version 1.0.0
 * @updated 2026-10-31
 * GET /favicon.ico - browsers and search engines ask for this address
 * by default; it answers with the 48x48 PNG tab icon.
 */
import { png } from '../cf/icon-data.js';

export function onRequestGet() {
  return new Response(png(48), {
    headers: {
      'content-type': 'image/png',
      'cache-control': 'public, max-age=604800',
    },
  });
}