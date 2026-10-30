/**
 * @file functions/ads.js
 * @version 1.0.0
 * @updated 2026-10-30
 * GET /ads - all active ads (server-rendered).
 */
import { renderListing } from '../cf/listing.js';

export const onRequestGet = ({ request, env }) =>
  renderListing({ request, env, category: null });