/**
 * @file functions/logout.js
 * @version 1.0.0
 * @updated 2026-10-31
 * POST /logout - ends the session and clears the cookie.
 */
import {
  SESSION_COOKIE, getCookie, cookie, redirect, sha256,
} from '../cf/auth.js';

export async function onRequestPost({ request, env }) {
  const token = getCookie(request, SESSION_COOKIE);
  if (token && token.length <= 64) {
    try {
      await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?1')
        .bind(await sha256(token)).run();
    } catch (e) {
      console.error('logout failed');
    }
  }
  return redirect('/', [cookie(SESSION_COOKIE, '', 0)]);
}