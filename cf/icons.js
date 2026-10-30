/**
 * @file cf/icons.js
 * @version 1.0.0
 * @updated 2026-10-30
 * Categories and SVG icons (same set as the Mini App).
 */
export const CATS = [
  { k: 'realestate', n: 'خانه و املاک', i: 'home' },
  { k: 'vehicles', n: 'موتر', i: 'car' },
  { k: 'mobile', n: 'موبایل و تبلت', i: 'phone' },
  { k: 'computer', n: 'کامپیوتر و لوازم جانبی', i: 'laptop' },
  { k: 'home', n: 'لوازم خانگی و آشپزخانه', i: 'sofa' },
  { k: 'jobs', n: 'استخدام و کار', i: 'briefcase' },
  { k: 'services', n: 'خدمات', i: 'wrench' },
  { k: 'fashion', n: 'لباس و مد', i: 'shirt' },
  { k: 'pets', n: 'حیوانات خانگی', i: 'paw' },
  { k: 'other', n: 'سایر موارد', i: 'grid' },
];

export const catName = (k) => {
  const c = CATS.find((x) => x.k === k);
  return c ? c.n : '';
};

export const ic = (n) => `<svg class="ic"><use href="#i-${n}"/></svg>`;

const I = {
  home: '<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
  car: '<path d="M4 15l1.6-5.2A2 2 0 0 1 7.5 8.4h9a2 2 0 0 1 1.9 1.4'
    + 'L20 15M3 15h18v3.5H3z"/>'
    + '<circle cx="7" cy="18.5" r="1.6"/><circle cx="17" cy="18.5" r="1.6"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/>'
    + '<path d="M11 18.5h2"/>',
  laptop: '<rect x="4.5" y="5" width="15" height="10.5" rx="1.8"/>'
    + '<path d="M2.5 19h19"/>',
  sofa: '<path d="M5 11V8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5V11"/>'
    + '<path d="M3 13.5a2 2 0 0 1 4 0V15h10v-1.5a2 2 0 0 1 4 0V19H3z"/>'
    + '<path d="M6 19v1.5M18 19v1.5"/>',
  briefcase: '<rect x="3" y="7.5" width="18" height="12.5" rx="2"/>'
    + '<path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3 13h18"/>',
  wrench: '<path d="M14.5 6.5a4 4 0 0 0-5 5l-6 6 3 3 6-6a4 4 0 0 0 5-5'
    + 'l-2.5 2.5-2.5-.5-.5-2.5z"/>',
  shirt: '<path d="M8.5 3.5L3.5 6l2 4 2.5-1v11.5h8V9l2.5 1 2-4-5-2.5'
    + 'a3.5 3.5 0 0 1-7 0z"/>',
  paw: '<circle cx="6" cy="10" r="2"/><circle cx="10" cy="5.5" r="2"/>'
    + '<circle cx="14" cy="5.5" r="2"/><circle cx="18" cy="10" r="2"/>'
    + '<path d="M12 11c-3 0-6 3-6 6a3 3 0 0 0 3 3c1.2 0 2-.6 3-.6'
    + 's1.8.6 3 .6a3 3 0 0 0 3-3c0-3-3-6-6-6z"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/>'
    + '<rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/>'
    + '<rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/>'
    + '<rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  pin: '<path d="M12 21s6.5-5.6 6.5-10.8a6.5 6.5 0 0 0-13 0C5.5 15.4 12 21'
    + ' 12 21z"/><circle cx="12" cy="10" r="2.3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  image: '<rect x="3" y="5" width="18" height="14" rx="2.5"/>'
    + '<circle cx="9" cy="10.5" r="1.6"/>'
    + '<path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5"/>',
  chat: '<path d="M20.5 12a8.5 8.5 0 0 1-12.2 7.6L3.5 20.5l1-4.5A8.5 8.5'
    + ' 0 1 1 20.5 12z"/>',
  store: '<path d="M3 9l2-5h14l2 5M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0'
    + ' 0 6 0 3 3 0 0 0 6 0M5 12v8h14v-8"/>',
};

export const SPRITE = '<svg width="0" height="0" aria-hidden="true" '
  + 'style="position:absolute"><defs>'
  + Object.keys(I).map((k) =>
    `<symbol id="i-${k}" viewBox="0 0 24 24">${I[k]}</symbol>`).join('')
  + '</defs></svg>';