/**
 * @file cf/filters.js
 * @version 1.1.0
 * @updated 2026-10-30
 * Province, price, deal and condition filter box + active chips.
 */
import { ic } from './icons.js';
import { esc, DEALS, CONDS } from './theme.js';

export const PROVS = [
  'کابل', 'هرات', 'بلخ', 'قندهار', 'ننگرهار', 'کندز', 'بغلان', 'غزنی',
  'پروان', 'کاپیسا', 'پنجشیر', 'بامیان', 'دایکندی', 'غور', 'هلمند',
  'جوزجان', 'سرپل', 'فاریاب', 'بادغیس', 'نیمروز', 'فراه', 'زابل',
  'ارزگان', 'پکتیا', 'پکتیکا', 'خوست', 'کنر', 'لغمان', 'لوگر',
  'میدان وردک', 'نورستان', 'سمنگان', 'تخار', 'بدخشان',
];
export const PROV_SLUGS = {
  'کابل': 'kabul', 'هرات': 'herat', 'بلخ': 'balkh',
  'قندهار': 'kandahar', 'ننگرهار': 'nangarhar', 'کندز': 'kunduz',
  'بغلان': 'baghlan', 'غزنی': 'ghazni', 'پروان': 'parwan',
  'کاپیسا': 'kapisa', 'پنجشیر': 'panjshir', 'بامیان': 'bamyan',
  'دایکندی': 'daykundi', 'غور': 'ghor', 'هلمند': 'helmand',
  'جوزجان': 'jawzjan', 'سرپل': 'sar-e-pol', 'فاریاب': 'faryab',
  'بادغیس': 'badghis', 'نیمروز': 'nimroz', 'فراه': 'farah',
  'زابل': 'zabul', 'ارزگان': 'uruzgan', 'پکتیا': 'paktia',
  'پکتیکا': 'paktika', 'خوست': 'khost', 'کنر': 'kunar',
  'لغمان': 'laghman', 'لوگر': 'logar', 'میدان وردک': 'maidan-wardak',
  'نورستان': 'nuristan', 'سمنگان': 'samangan', 'تخار': 'takhar',
  'بدخشان': 'badakhshan',
};

export const provFromSlug = (s) =>
  PROVS.find((p) => PROV_SLUGS[p] === s) || '';


export const FILTER_CSS = `
.flt{background:var(--bg);box-shadow:var(--out);border-radius:20px;
margin-bottom:12px}
.flt summary{list-style:none;cursor:pointer;padding:12px 14px;
display:flex;gap:8px;align-items:center;font-weight:700;color:var(--gd)}
.flt summary::-webkit-details-marker{display:none}
.flt form{padding:0 14px 14px;display:grid;gap:10px}
.flt label{display:grid;gap:4px;font-size:12px;color:var(--mute)}
.flt select,.flt input{width:100%;border:0;border-radius:14px;
padding:11px 12px;background:#fff;color:var(--ink);font:inherit;
font-size:16px;box-shadow:inset 2px 2px 6px rgba(0,0,0,.12)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.acts{display:flex;gap:14px;align-items:center}
.flt button{border:0;background:var(--g);color:#fff;font:inherit;
font-weight:700;border-radius:14px;padding:10px 22px;cursor:pointer;
box-shadow:var(--sm)}
.rst{color:var(--mute);font-size:13px}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}
.chip{background:var(--bg);box-shadow:var(--sm);color:var(--gd);
border-radius:99px;padding:5px 11px;font-size:12px}`;

// Hidden inputs that carry the other search fields through a form.
export const hidden = (o) => Object.keys(o).filter((k) => o[k]).map((k) =>
  `<input type="hidden" name="${k}" value="${esc(o[k])}">`).join('');

// o: { base, province, minPrice, maxPrice, deal, cond, keep, reset }
// keep = fields to carry through (q, sort); reset = clear-all link.
export function filterBox(o) {
    const on = !o.closed
    && (o.province || o.minPrice || o.maxPrice || o.deal || o.cond);
  const opts = ['<option value="">همه ولایت‌ها</option>']
    .concat(PROVS.map((p) =>
      `<option${p === o.province ? ' selected' : ''}>${esc(p)}</option>`))
    .join('');
  const num = (name, label, v) => `<label>${label}`
    + `<input name="${name}" inputmode="numeric" maxlength="12" `
    + `value="${esc(v)}"></label>`;
  const pick = (name, label, map, cur) => `<label>${label}`
    + `<select name="${name}"><option value="">همه</option>`
    + Object.keys(map).map((k) => `<option value="${k}"`
      + `${k === cur ? ' selected' : ''}>${map[k]}</option>`).join('')
    + '</select></label>';
  return `<details class="flt"${on ? ' open' : ''}>`
    + `<summary>${ic('pin')}فیلتر ولایت، قیمت و معامله</summary>`
    + `<form action="${esc(o.base)}" method="get">${hidden(o.keep)}`
    + `<label>ولایت<select name="province">${opts}</select></label>`
    + '<div class="two">'
    + num('minPrice', 'از قیمت (افغانی)', o.minPrice)
    + num('maxPrice', 'تا قیمت (افغانی)', o.maxPrice)
    + '</div><div class="two">'
    + pick('deal', 'نوع معامله', DEALS, o.deal)
    + pick('cond', 'وضعیت', CONDS, o.cond)
    + '</div><div class="acts"><button>اعمال فیلتر</button>'
    + `<a class="rst" href="${esc(o.reset)}">پاک کردن</a></div>`
    + '</form></details>';
}

// items: [[label, removeHref], ...]
export const chips = (items) => (items.length
  ? '<div class="chips">' + items.map((c) =>
    `<a class="chip" href="${esc(c[1])}">${esc(c[0])} ×</a>`).join('')
    + '</div>'
  : '');