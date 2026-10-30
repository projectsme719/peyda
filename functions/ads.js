/**
 * @file functions/ads.js
 * @version 1.0.0
 * GET /ads - all active ads (server-rendered).
 */
import { renderListing } from '../cf/listing.js';

export const onRequestGet = ({ request, env }) =>
  renderListing({ request, env, category: null });
