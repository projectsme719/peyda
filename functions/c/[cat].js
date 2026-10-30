/**
 * @file functions/c/[cat].js
 * @version 1.0.0
 * GET /c/mobile - active ads of one category (server-rendered).
 */
import { renderListing } from '../../cf/listing.js';

export const onRequestGet = ({ request, env, params }) =>
  renderListing({ request, env, category: String(params.cat) });
