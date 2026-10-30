/**
 * @file functions/index.js
 * @version 1.0.0
 * @updated 2026-10-30
 * GET / - home page: same server-rendered list as /ads.
 */
import { renderListing } from '../cf/listing.js';

export const onRequestGet = ({ request, env }) =>
  renderListing({ request, env, category: null });