/**
 * @file web/app.js
 * @version 13.0.0
 * @updated 2026-11-03
 * The whole Mini App script (moved out of index.html without any
 * change to the code). Loaded by index.html as /app.js?v=13.
 */
(function () {
  var tg = (window.Telegram && window.Telegram.WebApp) || {};
  var isTg = !!(tg.initData && tg.Serverless);
    if (isTg) { var sn = document.getElementById('seo'); if (sn) sn.remove(); }
  if (isTg) {
    try {
      tg.ready();
      tg.expand();
      if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();
    } catch (e) {}
  }

  // ---------- تم روشن/تیره (همسان با سایت) ----------
  // داخل تلگرام: از تم خود تلگرام؛ بیرون از آن: از تنظیم گوشی.
  function applyTheme() {
    const dark = isTg && tg.colorScheme
      ? tg.colorScheme === 'dark'
      : !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (!isTg) return;
    try {
      const c = dark ? '#171717' : '#ffffff';
      tg.setHeaderColor(c); tg.setBackgroundColor(c); tg.setBottomBarColor(c);
    } catch (e) {}
  }
  applyTheme();
  if (isTg && tg.onEvent) tg.onEvent('themeChanged', applyTheme);
  else if (window.matchMedia) {
    try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme); } catch (e) {}
  }

  // ---------- لوگوی متحرک (همان لوگوی سایت) ----------
const LG = {
  frame: [
    'M318 4l-31 10l-22 12l-16 12l-36 39l-134 159l-18 26l-19 35l-13 ',
    '31l-15 50l-9 49l-5 54v56l5 60l10 57l15 51l14 34l35 65v140l8 29l13 ',
    '23l18 19l14 10l56 25l150 74l148 76l103 55l16 4l16 -1l22 -9l100 ',
    '-55l154 -79l168 -81l27 -11l16 -11l18 -19l12 -21l8 -29l1 -143l16 ',
    '-27l15 -30l16 -41l17 -61l8 -46l4 -39l1 -66l-5 -58l-10 -52l-7 ',
    '-25l-15 -39l-26 -50l-22 -33l-148 -181l-28 -25l-25 -14l-23 -8l-23 ',
    '-4l-357 -1l-191 1zM672 467l12 1l254 51l118 22l18 2l12 5l14 12l6 ',
    '10l4 15v347l-3 16l-6 14l-9 12l-11 10l-21 10l-34 8l-312 63h-15l-7 ',
    '-2l-9 -5l-6 -6l-6 -12zM612 457l14 16l7 18l1 7v534l-4 16l-10 17l-14',
    ' 13l-11 6l-13 4h-18l-369 -79l-34 -10l-11 -5l-10 -7l-17 -21l-6 ',
    '-14l-3 -17l1 -358l4 -14l9 -15l16 -14l18 -8l284 -56l119 -26h17l9 ',
    '2l14 6zM766 37h124l13 2l19 6l19 10l13 10l14 14l85 104l43 50l8 ',
    '11l10 20l5 16l2 14v18l-4 20l-11 25l-11 15l-14 14l-19 13l-12 6l-18 ',
    '6l-24 4l-33 -1l-36 -9l-25 -12l-23 -16l-24 -23l-20 -28l-15 -35l-22 ',
    '-86l-46 -165zM459 37l2 3l-46 160l-29 105l-12 24l-18 25l-25 24l-22 ',
    '15l-28 13l-33 8l-33 1l-28 -5l-24 -10l-23 -16l-22 -26l-12 -28l-3 ',
    '-14v-25l7 -27l10 -20l8 -11l35 -39l96 -115l14 -14l16 -12l19 -9l25 ',
    '-6zM509 36h206l3 3l55 226l4 23v19l-7 27l-14 25l-24 25l-22 15l-16 ',
    '8l-20 7l-26 5l-64 1l-25 -3l-34 -11l-26 -15l-26 -24l-15 -22l-10 ',
    '-26l-2 -10v-23l60 -247z',
  ].join(''),
  house: [
    'M218 663l-1 10l5 6l4 2h15l3 2v101l3 8l5 5l6 3l75 -1v-79l3 -8l5 ',
    '-5l7 -3h40l9 3l5 5l2 4l1 84l76 -1l7 -5l4 -8v-102l3 -3l18 -1l7 ',
    '-7v-8l-5 -6l-133 -98l-10 -4h-5l-8 3z',
  ].join(''),
  car: [
    'M729 699l-3 12l1 44l4 10l11 10v19l3 9l5 5l6 3h18l5 -2l6 -6l3 ',
    '-7v-19l3 -3h165l3 3v21l3 6l4 4l7 3h17l5 -2l7 -7l2 -5v-20l12 -13l5 ',
    '-14v-43l-2 -9l-4 -8l-8 -9l-15 -8l-25 -52l-5 -7l-13 -10l-12 ',
    '-4h-120l-14 4l-13 8l-8 9l-25 51l-4 4l-11 6l-7 7zM970 701l8 1l8 4l5',
    ' 5l4 9v10l-3 7l-8 8l-8 3h-10l-7 -3l-7 -7l-4 -9v-8l3 -8l8 -8zM771 ',
    '702l8 -1l11 4l5 4l5 8l1 12l-2 6l-9 10l-7 3h-10l-8 -3l-8 -8l-3 ',
    '-8v-9l4 -9zM788 669l15 -30l7 -7l10 -5h107l6 2l10 8l17 34l-2 ',
    '2h-169z',
  ].join(''),
  hl1: [
    'M183 861v10l4 8l4 4l12 4l292 19h35l6 -3l7 -9v-11l-2 -4l-5 -5l-8 ',
    '-3l-206 -13l-112 -11h-12l-7 3l-5 5z',
  ].join(''),
  hl2: [
    'M184 938l1 11l5 6l9 4l53 3l182 14l26 -1l9 -7l2 -5l-1 -11l-5 -6l-9 ',
    '-4l-70 -4l-171 -13l-20 1l-8 6z',
  ].join(''),
  cl1: [
    'M1039 861l-2 -6l-6 -6l-4 -2h-12l-69 9l-189 19l-12 4l-5 5l-3 10l1 ',
    '5l5 8l6 3l7 1l204 -23l64 -6l8 -4l6 -8z',
  ].join(''),
  cl2: [
    'M980 938l-3 -7l-6 -5l-20 -1l-198 21l-9 4l-5 6l-1 11l3 6l5 4l6 ',
    '2h8l202 -21l7 -2l7 -5l3 -5z',
  ].join(''),
};

const LOGO = '<svg class="lgo" viewBox="0 0 1225 1260" '
  + 'aria-hidden="true" focusable="false">'
  + '<g fill="currentColor" fill-rule="evenodd">'
  + `<path class="lg-f" d="${LG.frame}"/>`
  + `<path class="lg-i lg-a" d="${LG.house}"/>`
  + `<path class="lg-l" d="${LG.hl1}"/>`
  + `<path class="lg-l lg-2" d="${LG.hl2}"/>`
  + `<path class="lg-i lg-b" d="${LG.car}"/>`
  + `<path class="lg-l lg-3" d="${LG.cl1}"/>`
  + `<path class="lg-l lg-4" d="${LG.cl2}"/>`
  + '</g></svg>';

  const CATS = [
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
  const PROVS = ['کابل','هرات','بلخ','قندهار','ننگرهار','کندز','بغلان','غزنی','پروان','کاپیسا','پنجشیر','بامیان','دایکندی','غور','هلمند','جوزجان','سرپل','فاریاب','بادغیس','نیمروز','فراه','زابل','ارزگان','پکتیا','پکتیکا','خوست','کنر','لغمان','لوگر','میدان وردک','نورستان','سمنگان','تخار','بدخشان'];
  const SORTS = { new: 'جدیدترین', cheap: 'ارزان‌ترین', exp: 'گران‌ترین', views: 'پربازدیدترین' };
  const BOT = 'PEYDA_YaarBot';
  let CFG = null;
  let DEALS = { sale: 'فروشی', exchange: 'معاوضه', rent: 'کرایه', mortgage: 'گروی' };
  let CONDS = { new: 'جدید', used: 'مستعمل' };
  let cfgP = null;
  function ensureCfg() {
    if (CFG) return Promise.resolve();
    if (!cfgP) {
      cfgP = call('config', {}).then((r) => { CFG = r.cfg; DEALS = r.deals; CONDS = r.conds; })
        .catch((e) => { cfgP = null; throw e; });
    }
    return cfgP;
  }

  const $ = (s) => document.querySelector(s);
  const view = $('#view');
  const sheet = $('#sheet');
  const detail = $('#detail');
  const composer = $('#composer');
  const chatEl = $('#chat');

  const ic = (n, c) => '<svg class="ic' + (c ? ' ' + c : '') + '"><use href="#i-' + n + '"/></svg>';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fa = (s) => String(s).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const toLat = (s) => String(s).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  const latin = (s) => toLat(s).replace(/[^\d]/g, '');
  const money = (p) => (p == null ? 'توافقی' : fa(String(p).replace(/\B(?=(\d{3})+(?!\d))/g, ',')) + ' افغانی');
  const loc = (a) => [a.province, a.city].filter(Boolean).join('، ') || '—';
  const catOf = (k) => CATS.find((x) => x.k === k) || { n: '', i: 'grid' };
  const ago = (t) => {
    if (!t) return '';
    const s = Math.max(0, Math.floor(Date.now() / 1000) - t);
    if (s < 60) return 'همین الان';
    if (s < 3600) return fa(Math.floor(s / 60)) + ' دقیقه پیش';
    if (s < 86400) return fa(Math.floor(s / 3600)) + ' ساعت پیش';
    return fa(Math.floor(s / 86400)) + ' روز پیش';
  };
  const hm = (t) => {
    const d = new Date(t * 1000);
    return fa(('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2));
  };
  const waNum = (c) => {
    let d = String(c).replace(/\D/g, '');
    if (d.indexOf('00') === 0) d = d.slice(2);
    else if (d[0] === '0') d = '93' + d.slice(1);
    else if (d.length === 9 && d[0] === '7') d = '93' + d;
    return d.length >= 10 ? d : '';
  };
  const btn = (icon, text, attrs, cls) => '<button class="btn ' + (cls || '') + '" ' + attrs + '>' + ic(icon) + '<span>' + text + '</span></button>';

  let tt;
  function toast(m) {
    const t = $('#toast');
    t.textContent = m;
    t.classList.add('on');
    clearTimeout(tt);
    tt = setTimeout(() => t.classList.remove('on'), 2800);
  }

  const call = (name, input) => new Promise((resolve, reject) => {
    if (isTg) {
      tg.Serverless.call(name, input || {}, (err, data) => (err ? reject(err) : resolve(data)));
      return;
    }
    input = input || {};
    if (name === 'config') {
      resolve({
        cfg: {
          realestate: { fields: [{ k: 'rooms', l: 'تعداد اتاق', t: 'select', o: ['۱', '۲', '۳', '۴+'] }], cond: false, deals: ['sale', 'rent', 'mortgage'] },
          vehicles: { fields: [{ k: 'year', l: 'سال ساخت', t: 'num' }], cond: true, deals: ['sale', 'exchange'] },
          mobile: { fields: [], cond: true, deals: ['sale', 'exchange'] },
          computer: { fields: [], cond: true, deals: ['sale', 'exchange'] },
          home: { fields: [], cond: true, deals: ['sale', 'exchange'] },
          jobs: { fields: [], cond: false, deals: [] },
          services: { fields: [], cond: false, deals: [] },
          fashion: { fields: [], cond: true, deals: ['sale'] },
          pets: { fields: [], cond: false, deals: ['sale'] },
          other: { fields: [], cond: true, deals: ['sale', 'exchange'] }
        },
        deals: { sale: 'فروشی', exchange: 'معاوضه', rent: 'کرایه', mortgage: 'گروی' },
        conds: { new: 'جدید', used: 'مستعمل' }
      });
      return;
    }
    if (name === 'ads') {
      const q = new URLSearchParams();
      if (input.q) q.set('q', input.q);
      if (input.category) q.set('category', input.category);
      if (input.province) q.set('province', input.province);
      if (input.minPrice) q.set('minPrice', input.minPrice);
      if (input.maxPrice) q.set('maxPrice', input.maxPrice);
      if (input.sort) q.set('sort', input.sort);
      if (input.seller) q.set('seller', input.seller);
      if (input.page) q.set('page', input.page);
      fetch('/api/ads?' + q.toString())
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error('خطا در دریافت آگهی‌ها'))))
        .then(resolve).catch(reject);
      return;
    }
    if (name === 'ad') {
      fetch('/api/ad?id=' + encodeURIComponent(input.id))
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error('آگهی پیدا نشد'))))
        .then((data) => {
          fetch('/api/contact?id=' + encodeURIComponent(input.id))
            .then((r) => (r.ok ? r.json() : { contact: null }))
            .then((cr) => { data.contact = cr.contact || null; resolve(data); })
            .catch(() => { resolve(data); });
        }).catch(reject);
      return;
    }
    if (name === 'photo') {
      resolve({ src: '/api/img?id=' + encodeURIComponent(input.id) + '&i=' + encodeURIComponent(input.i || 0) + '&t=' + (input.t ? '1' : '0') });
      return;
    }
    if (name === 'canPost') {
      resolve({ ok: true, limit: 10, used: 0, isShop: false });
      return;
    }
    if (name === 'myAds' || name === 'bookmarks' || name === 'chatList') {
      resolve({ items: [], page: 1, pages: 1, total: 0, unread: 0 });
      return;
    }
    if (name === 'me') {
      resolve({ isShop: false, shopName: null, limit: 10, used: 0 });
      return;
    }
    reject(new Error('این قابلیت خارج از تلگرام محدود می‌باشد'));
  });
  const errCode = (e) => (e && e.parameters && e.parameters.code) || '';

  // ---------- وضعیت ----------
  let savedF = {};
  try { savedF = JSON.parse(localStorage.getItem('peyda_f') || '{}'); } catch (e) {}
  const F = { q: '', category: '', province: savedF.province || '', minPrice: '', maxPrice: '', sort: 'new', seller: 'all' };
  const S = { tab: 'home', page: 1, pages: 1, total: 0, items: [], req: 0 };
  const SV = { page: 1, pages: 1, items: [], req: 0 };
  const P = { title: '', cat: '', attrs: {}, cond: '', deal: '', exchangeFor: '', price: '', nego: false, desc: '', files: [], prov: '', city: '', contact: '', useTg: false, busy: false, username: null, info: null };
  const C = { id: null, last: 0, meta: null, timer: null, sending: false, blocked: undefined };
  function resetP() {
    P.title = ''; P.cat = ''; P.attrs = {}; P.cond = ''; P.deal = ''; P.exchangeFor = ''; P.price = '';
    P.nego = false; P.desc = ''; P.files = []; P.prov = F.province || ''; P.city = ''; P.contact = '';
    P.useTg = false; P.busy = false;
  }

  // ---------- عکس‌ها (صف و بارگذاری تنبل) ----------
  const imgCache = new Map();
  const queue = [];
  let active = 0;
  function pump() {
    while (active < 3 && queue.length) {
      const t = queue.shift();
      active++;
      call('photo', { id: Number(t.id), i: Number(t.i), t: t.t ? 1 : 0 })
        .then((d) => t.res(d.src))
        .catch(t.rej)
        .finally(() => { active--; pump(); });
    }
  }
  function fetchPhoto(id, i, thumb) {
    const k = id + ':' + i + ':' + (thumb ? 1 : 0);
    if (imgCache.has(k)) return imgCache.get(k);
    const p = new Promise((res, rej) => { queue.push({ id, i, t: thumb, res, rej }); pump(); });
    imgCache.set(k, p);
    p.catch(() => imgCache.delete(k));
    return p;
  }
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = e.target;
    fetchPhoto(el.dataset.id, el.dataset.i, el.dataset.t === '1')
      .then((src) => { el.style.backgroundImage = 'url("' + src + '")'; el.innerHTML = ''; })
      .catch(() => {});
  }), { rootMargin: '300px 600px' });
  const observe = (root) => root.querySelectorAll('[data-lazy]').forEach((el) => io.observe(el));
  const phHtml = (a, thumb) => (a.photos > 0
    ? '<div class="ph" data-lazy data-t="' + (thumb ? 1 : 0) + '" data-id="' + a.id + '" data-i="0">' + ic('image') + '</div>'
    : '<div class="ph">' + ic('image') + '</div>');

  // ---------- کارت آگهی ----------
  function tagsHtml(a) {
    const t = [];
    if (a.shop) t.push('<span class="tg shop">' + ic('store') + 'دوکان‌دار</span>');
    if (a.cond) t.push('<span class="tg">' + esc(CONDS[a.cond] || '') + '</span>');
    if (a.deal && a.deal !== 'sale') t.push('<span class="tg">' + esc(DEALS[a.deal] || '') + '</span>');
    return t.length ? '<div class="tags">' + t.join('') + '</div>' : '';
  }
  function cardHtml(a) {
    return '<article class="card" data-open="' + a.id + '">' + phHtml(a, true) +
      '<div class="cb"><h3>' + esc(a.title) + '</h3><div class="pr">' + money(a.price) + '</div>' +
      '<div class="mt">' + ic('pin') + esc(loc(a)) + '</div><div class="mt">' + ago(a.created) + '</div>' +
      tagsHtml(a) + (a.note ? '<div class="mt">' + esc(a.note) + '</div>' : '') + '</div></article>';
  }

  // ---------- فیلترها ----------
  function chipsHtml() {
    const c = [];
    if (F.q) c.push(['q', '«' + F.q + '»']);
    if (F.category) c.push(['category', catOf(F.category).n]);
    if (F.province) c.push(['province', F.province]);
    if (F.minPrice || F.maxPrice) c.push(['price', (F.minPrice ? 'از ' + money(F.minPrice) : '') + ' ' + (F.maxPrice ? 'تا ' + money(F.maxPrice) : '')]);
    if (F.sort !== 'new') c.push(['sort', SORTS[F.sort]]);
    const pv = F.province ? '' : '<button class="chip" data-act="filter">' + ic('pin') + 'همه ولایت‌ها</button>';
    return pv + c.map((x) => '<button class="chip" data-rm="' + x[0] + '">' + esc(x[1]) + ic('close') + '</button>').join('');
  }
  const hasFilters = () => !!(F.q || F.category || F.province || F.minPrice || F.maxPrice || F.sort !== 'new');

  // ---------- خانه ----------
  function renderHome() {
    view.innerHTML =
      '<header class="top"><div class="row"><div class="logo"><span class="lt">پیدا' +
      '<small>بازار آنلاین نیازمندی‌های افغانستان</small></span>' + LOGO + '</div></div>' +
      '<div class="search"><input id="q" placeholder="جستجو در آگهی‌ها…" enterkeyhint="search" value="' + esc(F.q) + '">' +
      '<button data-act="goq">' + ic('search') + '</button><button class="sq" data-act="filter">' + ic('sliders') + '</button></div></header>' +
      '<main><div class="cats">' + CATS.map((c) => '<button class="cat ' + (F.category === c.k ? 'on' : '') + '" data-cat="' + c.k + '"><span class="ci">' + ic(c.i) + '</span>' + esc(c.n) + '</button>').join('') + '</div>' +
      '<div class="chips" id="chips">' + chipsHtml() + '</div>' +
      '<h2 id="lt">آخرین آگهی‌ها</h2>' +
      '<div class="seg" id="seg">' + [['all', 'همه'], ['shop', 'دوکان‌دار'], ['person', 'شخصی']].map((s) => '<button class="' + (F.seller === s[0] ? 'on' : '') + '" data-seller="' + s[0] + '">' + s[1] + '</button>').join('') + '</div>' +
      '<div id="list" class="grid"></div><div id="more"></div></main>';
    const qi = $('#q');
    qi.addEventListener('input', () => { F.q = qi.value.trim(); });
    qi.addEventListener('keydown', (e) => { if (e.key === 'Enter') { qi.blur(); S.tab = 'home'; render(); } });
    loadList(true);
  }

  async function loadList(reset) {
    const my = ++S.req;
    if (reset) {
      S.page = 1;
      S.items = [];
      const l = $('#list');
      if (l) l.innerHTML = '<div class="empty" style="grid-column:1/-1">در حال بارگذاری…</div>';
    }
    try {
      const r = await call('ads', Object.assign({}, F, { page: S.page }));
      if (my !== S.req) return;
      S.items = reset ? r.items : S.items.concat(r.items);
      S.page = r.page;
      S.pages = r.pages;
      S.total = r.total;
      paintList();
    } catch (e) {
      if (my === S.req) toast(e.message || 'خطا در بارگذاری');
    }
  }

  function paintList() {
    const l = $('#list');
    if (!l) return;
    l.innerHTML = S.items.length ? S.items.map(cardHtml).join('') : '<div class="empty" style="grid-column:1/-1">' + ic('search') + 'آگهی‌ای پیدا نشد</div>';
    const m = $('#more');
    if (m) m.innerHTML = S.page < S.pages ? '<button class="more" data-more="1">نمایش بیشتر</button>' : '';
    const lt = $('#lt');
    if (lt) lt.textContent = (hasFilters() ? 'نتایج جستجو' : 'آخرین آگهی‌ها') + ' (' + fa(S.total) + ')';
    observe(l);
  }

  // ---------- گفتگوها (لیست) ----------
  function setBadge(n) {
    const b = $('#bdg');
    if (!b) return;
    b.textContent = fa(n);
    b.classList.toggle('hidden', !n);
  }
  async function refreshBadge() {
    try {
      const r = await call('chatList', {});
      setBadge(r.unread);
      return r;
    } catch (e) {
      return null;
    }
  }
  function chatRow(c) {
    return '<div class="crow" data-conv="' + c.id + '"><div class="cav">' + ic(c.role === 'buyer' ? 'store' : 'user') + '</div>' +
      '<div class="cmid"><b>' + esc(c.title) + '</b><div class="mt">' + (c.role === 'buyer' ? 'فروشنده' : 'خریدار') + ': ' + esc(c.last) + '</div></div>' +
      '<div class="cend"><div class="mt">' + ago(c.at) + '</div>' + (c.unread ? '<i class="bdg">' + fa(c.unread) + '</i>' : '') + '</div></div>';
  }
  function renderChats() {
    view.innerHTML = '<main class="pt"><h2>' + ic('chat') + 'گفتگوها</h2><div id="clist"><div class="empty">در حال بارگذاری…</div></div></main>';
    loadChats();
  }
  async function loadChats() {
    const r = await refreshBadge();
    const el = $('#clist');
    if (!el) return;
    if (!r) { el.innerHTML = '<div class="empty">خطا در بارگذاری گفتگوها</div>'; return; }
    el.innerHTML = r.items.length ? r.items.map(chatRow).join('') : '<div class="empty">' + ic('chat') + 'هنوز گفتگویی ندارید.<br>در صفحه آگهی روی «گفتگو با فروشنده» بزنید.</div>';
  }

  // ---------- صفحه چت ----------
  function sizeChat() { chatEl.style.height = (tg.viewportHeight || window.innerHeight) + 'px'; }
  if (tg.onEvent) {
    tg.onEvent('viewportChanged', () => {
      if (chatEl.classList.contains('hidden')) return;
      sizeChat();
      const m = $('#msgs');
      if (m) m.scrollTop = m.scrollHeight;
    });
  }

  async function startChat(adId) {
    try {
      const r = await call('chatStart', { adId: adId });
      openChat(r.id);
    } catch (e) {
      toast(e.message || 'خطا');
    }
  }

  async function openChat(id) {
    C.id = id; C.last = 0; C.meta = null; C.blocked = undefined;
    chatEl.classList.remove('hidden');
    chatEl.innerHTML = '<div class="chatbox"><div class="chead"><button class="cx" data-act="chatclose">' + ic('close') + '</button>' +
      '<div class="ct"><b id="ctitle">…</b><small id="csub"></small></div><button class="cx" data-act="chatmenu">' + ic('dots') + '</button></div>' +
      '<div class="msgs" id="msgs"></div><div class="cin" id="cin"></div></div>';
    sizeChat();
    syncBack();
    await pollChat(true);
    clearInterval(C.timer);
    C.timer = setInterval(() => pollChat(false), 3000);
  }

  function closeChat() {
    clearInterval(C.timer);
    C.timer = null;
    C.id = null;
    chatEl.classList.add('hidden');
    chatEl.innerHTML = '';
    syncBack();
    if (S.tab === 'chats') loadChats(); else refreshBadge();
  }

  async function pollChat(first) {
    if (!C.id || (document.hidden && !first)) return;
    const id = C.id;
    try {
      const r = await call('chatMessages', { id: id, after: C.last });
      if (id !== C.id) return;
      applyMeta(r.meta);
      appendMsgs(r.messages, first);
    } catch (e) {
      if (first) { toast(e.message || 'خطا'); closeChat(); }
    }
  }

  function applyMeta(meta) {
    C.meta = meta;
    const t = $('#ctitle');
    if (t) t.textContent = meta.title;
    const s = $('#csub');
    if (s) s.textContent = meta.role === 'buyer' ? 'گفتگو با فروشنده' : 'گفتگو با خریدار';
    if (meta.blocked !== C.blocked) {
      C.blocked = meta.blocked;
      const box = $('#cin');
      if (!box) return;
      if (meta.blocked) {
        box.innerHTML = '<div class="cblock">' + ic('ban') + (meta.blockedByMe ? 'شما این گفتگو را بسته‌اید.' : 'این گفتگو بسته شده است.') +
          (meta.blockedByMe ? '<button class="mini" data-act="chatunblock">باز کردن گفتگو</button>' : '') + '</div>';
      } else {
        box.innerHTML = '<textarea id="cinput" rows="1" maxlength="500" placeholder="پیام خود را بنویسید…"></textarea><button class="send" data-act="chatsend">' + ic('send') + '</button>';
      }
    }
  }

  function appendMsgs(list, force) {
    const box = $('#msgs');
    if (!box) return;
    const near = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
    let added = false;
    list.forEach((m) => {
      if (m.id <= C.last) return;
      C.last = m.id;
      const d = document.createElement('div');
      d.className = 'b ' + (m.mine ? 'me' : 'they');
      d.innerHTML = '<div class="bt">' + esc(m.text) + '</div><div class="tm">' + hm(m.created) + '</div>';
      box.appendChild(d);
      added = true;
    });
    if (added && (force || near)) box.scrollTop = box.scrollHeight;
  }

  async function sendChat() {
    if (C.sending || !C.id) return;
    const inp = $('#cinput');
    if (!inp) return;
    const text = inp.value.trim();
    if (!text) return;
    C.sending = true;
    try {
      const m = await call('chatSend', { id: C.id, text: text });
      inp.value = '';
      inp.style.height = 'auto';
      appendMsgs([m], true);
    } catch (e) {
      toast(e.message || 'خطا در ارسال');
      pollChat(false);
    } finally {
      C.sending = false;
    }
  }

  async function chatAct(a) {
    try {
      const r = await call('chatAction', { id: C.id, action: a });
      toast(a === 'report' ? 'گزارش ثبت شد' : (r.blocked ? 'گفتگو بسته شد' : 'گفتگو دوباره باز شد'));
      pollChat(false);
    } catch (e) {
      toast(e.message || 'خطا');
    }
  }

  function chatMenu() {
    const buttons = [];
    if (!C.meta || !C.meta.blocked) buttons.push({ id: 'block', type: 'default', text: 'بستن گفتگو' });
    buttons.push({ id: 'report', type: 'destructive', text: 'گزارش گفتگو' });
    buttons.push({ type: 'cancel' });
    if (tg.showPopup) {
      tg.showPopup({ message: 'گزینه‌های گفتگو', buttons: buttons }, (id) => {
        if (id === 'block' || id === 'report') chatAct(id);
      });
    } else {
      if (confirm('آیا می‌خواهید این گفتگو را ببندید یا گزارش دهید؟')) chatAct('block');
    }
  }

  // ---------- نشان‌شده‌ها ----------
  function renderSaved() {
    view.innerHTML = '<main class="pt"><h2>' + ic('star') + 'نشان‌شده‌ها</h2><div id="slist" class="grid"></div><div id="smore"></div></main>';
    loadSaved(true);
  }
  async function loadSaved(reset) {
    const my = ++SV.req;
    if (reset) { SV.page = 1; SV.items = []; }
    try {
      const r = await call('bookmarks', { page: SV.page });
      if (my !== SV.req) return;
      SV.items = reset ? r.items : SV.items.concat(r.items);
      SV.page = r.page;
      SV.pages = r.pages;
      const l = $('#slist');
      if (!l) return;
      l.innerHTML = SV.items.length ? SV.items.map(cardHtml).join('') : '<div class="empty" style="grid-column:1/-1">' + ic('star') + 'هنوز آگهی‌ای را نشان نکرده‌اید.<br>در صفحه هر آگهی روی ستاره بزنید.</div>';
      const m = $('#smore');
      if (m) m.innerHTML = SV.page < SV.pages ? '<button class="more" data-smore="1">نمایش بیشتر</button>' : '';
      observe(l);
    } catch (e) {
      if (my === SV.req) toast(e.message || 'خطا');
    }
  }

  // ---------- من: پروفایل، دوکان‌دار و آگهی‌های من ----------
  function renderMe() {
    const u = (tg.initDataUnsafe && tg.initDataUnsafe.user) || {};
    view.innerHTML = '<main class="pt"><div class="me"><div class="av">' + ic('user') + '</div><h2 style="justify-content:center;margin:0">' +
      esc([u.first_name, u.last_name].filter(Boolean).join(' ') || 'کاربر پیدا') + '</h2>' +
      (u.username ? '<div class="mt" style="justify-content:center"><bdi>@' + esc(u.username) + '</bdi></div>' : '') + '</div>' +
      '<div id="shopbox"></div>' +
      btn('plus', 'ثبت آگهی جدید', 'data-act="newad"') +
      '<h2 style="margin-top:20px">' + ic('grid') + 'آگهی‌های من</h2><div id="mine" class="grid"></div>' +
      btn('megaphone', 'کانال پیدا', 'data-act="channel"', 'alt') + btn('bot', 'باز کردن ربات', 'data-act="bot"', 'alt') + '</main>';
    loadMine();
    loadShop();
  }

  async function loadShop() {
    try {
      const r = await call('me', {});
      const el = $('#shopbox');
      if (!el) return;
      if (r.isShop) {
        el.innerHTML = '<div class="sec"><div class="sh">' + ic('store') + 'حساب دوکان‌دار' + (r.shopName ? ' — ' + esc(r.shopName) : '') + '</div>' +
          '<div class="mt">سقف روزانه: ' + fa(r.limit) + ' آگهی • امروز: ' + fa(r.used) + '</div></div>';
      } else {
        el.innerHTML = '<div class="sec"><div class="sh">' + ic('store') + 'دوکان‌دار هستید؟</div>' +
          '<div class="mt" style="margin:0 0 8px">دوکان‌داران روزانه تا ۱۰۰ آگهی ثبت می‌کنند و نشان دوکان‌دار می‌گیرند.</div>' +
          '<input id="shopname" maxlength="40" placeholder="نام دوکان">' + btn('send', 'ارسال درخواست', 'data-act="shopreq"', 'alt') + '</div>';
      }
    } catch (e) {}
  }

  async function shopReq() {
    const inp = $('#shopname');
    const name = inp ? inp.value.trim() : '';
    if (name.length < 2) return toast('نام دوکان را بنویسید');
    try {
      await call('shopRequest', { name: name });
      toast('درخواست شما برای مدیر ارسال شد');
      if (inp) inp.value = '';
    } catch (e) {
      toast(e.message || 'خطا');
    }
  }

  function mineCard(a) {
    const stl = { active: 'فعال', sold: 'فروخته‌شده', pending: 'مخفی', hidden: 'مخفی', rejected: 'رد شده' }[a.status] || a.status;
    let btns = '';
    if (a.status === 'active') {
      btns += '<button class="mini" data-act="aa" data-id="' + a.id + '" data-a="sold">' + ic('check') + 'فروخته شد</button>' +
        '<button class="mini" data-act="aa" data-id="' + a.id + '" data-a="renew">' + ic('refresh') + 'انتشار مجدد</button>';
    } else if (a.status === 'sold') {
      btns += '<button class="mini" data-act="aa" data-id="' + a.id + '" data-a="active">' + ic('refresh') + 'فعال‌سازی</button>';
    }
    btns += '<button class="mini" data-act="aa" data-id="' + a.id + '" data-a="delete">' + ic('trash') + 'حذف</button>';
    return '<article class="card"><div data-open="' + a.id + '">' + phHtml(a, true) +
      '<div class="cb"><h3>' + esc(a.title) + '</h3><div class="pr">' + money(a.price) + '</div>' +
      '<div class="mt"><span class="st ' + esc(a.status) + '"><i></i>' + stl + '</span> • ' + ic('eye') + fa(a.views || 0) + '</div></div></div><div class="cb act">' + btns + '</div></article>';
  }

  async function loadMine() {
    try {
      const r = await call('myAds', {});
      const el = $('#mine');
      if (!el) return;
      el.innerHTML = r.items.length ? r.items.map(mineCard).join('') : '<div class="empty" style="grid-column:1/-1">هنوز آگهی‌ای ثبت نکرده‌اید.</div>';
      observe(el);
    } catch (e) {
      toast(e.message || 'خطا');
    }
  }

  function doAction(id, action) {
    const run = async () => {
      try {
        await call('adAction', { id: id, action: action });
        toast('انجام شد');
        loadMine();
      } catch (e) {
        toast(e.message || 'خطا');
      }
    };
    if (action === 'delete') {
      if (tg.showConfirm) {
        tg.showConfirm('این آگهی حذف شود؟ (از کانال هم پاک می‌شود)', (ok) => { if (ok) run(); });
      } else if (confirm('این آگهی حذف شود؟ (از کانال هم پاک می‌شود)')) {
        run();
      }
    } else {
      run();
    }
  }

  // ---------- صفحه آگهی ----------
  function contactBtns(c) {
    if (!c) return '';
    if (c[0] === '@') return btn('send', 'پیام در تلگرام', 'data-tg="' + esc(c.slice(1)) + '"', 'alt');
    const wa = waNum(c);
    return (wa ? btn('chat', 'واتساپ', 'data-wa="' + wa + '"', 'alt') : '') +
      '<a class="btn alt" href="tel:' + esc(c) + '">' + ic('call') + '<span>تماس تلفنی (' + esc(fa(c)) + ')</span></a>';
  }

  function syncBack() {
    if (!isTg || !tg.BackButton) return;
    const open = !sheet.classList.contains('hidden') || !detail.classList.contains('hidden') ||
      !composer.classList.contains('hidden') || !chatEl.classList.contains('hidden');
    if (open) tg.BackButton.show(); else tg.BackButton.hide();
  }

  const xbtn = (act) => '<button class="x ib" data-act="' + act + '">' + ic('close') + '</button>';

  async function openAd(id) {
    detail.classList.remove('hidden');
    detail.innerHTML = xbtn('closead') + '<div class="empty">در حال بارگذاری…</div>';
    detail.scrollTop = 0;
    syncBack();
    try {
      await ensureCfg().catch(() => {});
      paintDetail(await call('ad', { id: id }));
    } catch (e) {
      toast(e.message || 'خطا');
      closeAd();
    }
  }
  function closeAd() {
    detail.classList.add('hidden');
    detail.innerHTML = '';
    syncBack();
  }

  function paintDetail(a) {
    let slides;
    if (a.photos) {
      slides = '<div class="slider" id="sl">' +
        Array.from({ length: a.photos }, (_, i) => '<div class="slide" data-lazy data-id="' + a.id + '" data-i="' + i + '">' + ic('image') + '</div>').join('') + '</div>' +
        (a.photos > 1 ? '<div class="dots" id="dots">' + fa(1) + ' / ' + fa(a.photos) + '</div>' : '');
    } else {
      slides = '<div class="slide">' + ic('image') + '</div>';
    }
    const kv = [];
    kv.push(['دسته‌بندی', catOf(a.category).n]);
    if (a.cond) kv.push(['وضعیت', CONDS[a.cond] || '']);
    if (a.deal) kv.push(['نوع معامله', DEALS[a.deal] || '']);
    (a.attrs || []).forEach((x) => kv.push([x.l, /^\d+$/.test(x.v) ? fa(x.v) : x.v]));
    const chatBtn = !a.owner && a.status === 'active' ? btn('chat', 'گفتگو با فروشنده', 'data-chat="' + a.id + '"') : '';
    detail.innerHTML = xbtn('closead') + '<div class="in">' + slides +
      '<div class="dbody"><div class="row"><h1>' + esc(a.title) + '</h1>' +
      (a.owner ? '' : '<button class="ib" id="bm" data-bm="' + a.id + '">' + ic('star', a.bookmarked ? 'on' : '') + '</button>') + '</div>' +
      '<div class="pr big">' + money(a.price) + '</div>' +
      '<div class="mt">' + ic('pin') + esc(loc(a)) + ' • ' + ago(a.created) + ' • ' + ic('eye') + fa(a.views) + '</div>' +
      (a.shop ? '<div class="tags"><span class="tg shop">' + ic('store') + esc(a.shopName || 'دوکان‌دار') + '</span></div>' : '') +
      '<div class="kvbox">' + kv.map((x) => '<div class="kv"><span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b></div>').join('') + '</div>' +
      (a.status !== 'active' ? '<div class="warn">وضعیت آگهی: ' + esc(a.status) + '</div>' : '') +
      '<h2 style="margin-top:14px">توضیحات</h2><p class="desc">' + esc(a.description) + '</p>' +
      (a.note ? '<div class="note">' + ic('star') + esc(a.note) + '</div>' : '') +
      (a.owner ? '<div class="note">' + ic('user') + '<span>این آگهی شماست. فروخته شد، انتشار مجدد و حذف را از تب «من» انجام دهید.</span></div>' : chatBtn + contactBtns(a.contact)) +
      btn('share', 'اشتراک‌گذاری', 'data-share="' + a.id + '" data-t="' + esc(a.title) + '"', 'alt') + '</div></div>';
    observe(detail);
    const sl = $('#sl');
    if (sl) sl.addEventListener('scroll', () => {
      const i = Math.round(Math.abs(sl.scrollLeft) / (sl.clientWidth || 1));
      const d = $('#dots');
      if (d) d.textContent = fa(i + 1) + ' / ' + fa(a.photos);
    });
  }

  async function toggleBm(id) {
    try {
      const r = await call('toggleBookmark', { id: id });
      const b = $('#bm');
      if (b) b.innerHTML = ic('star', r.bookmarked ? 'on' : '');
      if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    } catch (e) {
      toast(e.message || 'خطا');
    }
  }

  // ---------- ثبت آگهی ----------
  async function openComposer() {
    composer.classList.remove('hidden');
    composer.innerHTML = xbtn('closecomp') + '<div class="dbody comp"><div class="empty">در حال بررسی…</div></div>';
    syncBack();
    try {
      await ensureCfg();
      const r = await call('canPost', {});
      if (!r.ok) { paintBlocked(r); return; }
      P.username = r.username || null;
      P.info = r;
      paintComposer();
    } catch (e) {
      toast(e.message || 'خطا');
      closeComposer();
    }
  }

  function closeComposer() {
    composer.classList.add('hidden');
    composer.innerHTML = '';
    syncBack();
    if (S.tab === 'home') loadList(true);
    if (S.tab === 'me') loadMine();
  }

  function paintBlocked(r) {
    composer.innerHTML = xbtn('closecomp') + '<div class="dbody comp"><div class="me"><div class="av">' + ic(r.reason === 'NOT_MEMBER' ? 'megaphone' : 'ban') + '</div><h2 style="justify-content:center;margin:0">' + esc(r.message) + '</h2></div>' +
      (r.reason === 'NOT_MEMBER' ? btn('megaphone', 'عضویت در کانال', 'data-act="channel"') : '') +
      btn('refresh', 'بررسی دوباره', 'data-act="recheck"', 'alt') + '</div>';
  }

  const segHtml = (key, opts, cur) => '<div class="seg" style="margin:0">' + opts.map((o) => '<button type="button" class="' + (cur === o[0] ? 'on' : '') + '" data-pset="' + key + '" data-v="' + esc(o[0]) + '">' + esc(o[1]) + '</button>').join('') + '</div>';
  const sec = (n, title, body) => '<div class="sec"><div class="sh"><b>' + fa(n) + '</b>' + title + '</div>' + body + '</div>';

  function fieldHtml(f) {
    const v = P.attrs[f.k] || '';
    if (f.t === 'select') {
      return '<label class="l">' + esc(f.l) + (f.req ? ' *' : '') + '<select data-attr="' + f.k + '"><option value="">انتخاب کنید</option>' +
        f.o.map((o) => '<option' + (v === o ? ' selected' : '') + '>' + esc(o) + '</option>').join('') + '</select></label>';
    }
    return '<label class="l">' + esc(f.l) + '<input data-attr="' + f.k + '" maxlength="40"' + (f.t === 'num' ? ' inputmode="numeric"' : '') + ' value="' + esc(v) + '"></label>';
  }

  function paintComposer() {
    const st = composer.scrollTop;
    const cfg = CFG && P.cat ? CFG[P.cat] : null;
    let n = 1;
    let h = xbtn('closecomp') + '<div class="dbody form comp"><h2>' + ic('plus') + 'ثبت آگهی جدید</h2>';
    if (P.info) h += '<div class="mt" style="margin:-4px 2px 12px">امروز ' + fa(P.info.used) + ' از ' + fa(P.info.limit) + ' آگهی' + (P.info.isShop ? ' (دوکان‌دار)' : '') + '</div>';

    h += sec(n++, 'عنوان آگهی', '<input id="p_title" maxlength="70" placeholder="مثلاً آیفون ۱۳ پرو" value="' + esc(P.title) + '">');
    h += sec(n++, 'دسته‌بندی', '<div class="cats">' + CATS.map((c) => '<button type="button" class="cat ' + (P.cat === c.k ? 'on' : '') + '" data-pcat="' + c.k + '"><span class="ci">' + ic(c.i) + '</span>' + esc(c.n) + '</button>').join('') + '</div>');

    if (cfg) {
      if (cfg.fields.length) h += sec(n++, 'مشخصات', cfg.fields.map(fieldHtml).join(''));
      if (cfg.cond) h += sec(n++, 'وضعیت', segHtml('cond', Object.keys(CONDS).map((k) => [k, CONDS[k]]), P.cond));
      if (cfg.deals.length) h += sec(n++, 'نوع معامله', segHtml('deal', cfg.deals.map((k) => [k, DEALS[k]]), P.deal));

      if (P.deal === 'exchange') {
        h += sec(n++, 'معاوضه', '<label class="l">در ازای چه چیزی معاوضه می‌کنید؟<input id="p_ex" maxlength="60" value="' + esc(P.exchangeFor) + '"></label>');
      } else {
        const lbl = { rent: 'کرایه (افغانی)', mortgage: 'مبلغ گرو (افغانی)' }[P.deal] || (cfg.deals.length ? 'قیمت (افغانی)' : 'معاش / اجرت (افغانی)');
        h += sec(n++, 'قیمت',
          '<label class="l">' + lbl + '<input id="p_price" inputmode="numeric" value="' + esc(P.price) + '"' + (P.nego ? ' disabled' : '') + '></label>' +
          '<label class="chk"><input type="checkbox" id="p_nego"' + (P.nego ? ' checked' : '') + '>توافقی</label>');
      }
    }

    h += sec(n++, 'توضیحات', '<textarea id="p_desc" rows="5" maxlength="500" placeholder="جزئیات آگهی…">' + esc(P.desc) + '</textarea>');
    h += sec(n++, 'عکس‌ها (تا ۵ عکس)', '<div class="thumbs" id="p_thumbs"></div><input type="file" id="p_files" accept="image/*" multiple hidden>');
    h += sec(n++, 'موقعیت و تماس',
      '<label class="l">ولایت<select id="p_prov"><option value="">انتخاب کنید</option>' + PROVS.map((p) => '<option' + (P.prov === p ? ' selected' : '') + '>' + p + '</option>').join('') + '</select></label>' +
      '<label class="l">شهر / منطقه<input id="p_city" maxlength="40" value="' + esc(P.city) + '"></label>' +
      (P.username ? '<label class="chk"><input type="checkbox" id="p_usetg"' + (P.useTg ? ' checked' : '') + '>استفاده از آیدی تلگرام من (@' + esc(P.username) + ')</label>' : '') +
      '<label class="l">شماره تماس / واتساپ<input id="p_contact" inputmode="tel" placeholder="0799123456" value="' + esc(P.contact) + '"' + (P.useTg ? ' disabled' : '') + '></label>');

    h += '<div class="mt" id="p_st" style="justify-content:center"></div>' + btn('check', 'انتشار آگهی', 'id="p_submit" data-act="submitad"') + '</div>';
    composer.innerHTML = h;
    composer.scrollTop = st;
    paintThumbs();
  }

  function paintThumbs() {
    const el = $('#p_thumbs');
    if (!el) return;
    el.innerHTML = P.files.map((d, i) => '<div class="th" style="background-image:url(\'' + d + '\')"><b data-act="rmph" data-i="' + i + '">' + ic('close') + '</b></div>').join('') +
      (P.files.length < 5 ? '<button type="button" class="addph" data-act="addph">' + ic('plus') + '</button>' : '');
  }

  function compress(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const r = Math.min(1, 1024 / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * r));
        c.height = Math.max(1, Math.round(img.height * r));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL('image/jpeg', 0.78));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('عکس خوانده نشد')); };
      img.src = url;
    });
  }

  async function addFiles(list) {
    const room = 5 - P.files.length;
    const arr = Array.from(list).slice(0, Math.max(0, room));
    for (const f of arr) {
      try { P.files.push(await compress(f)); } catch (e) { toast('یکی از عکس‌ها خوانده نشد'); }
    }
    paintThumbs();
  }

  function setSt(t) { const s = $('#p_st'); if (s) s.textContent = t; }

  async function submitAd() {
    if (P.busy) return;
    const cfg = CFG && P.cat ? CFG[P.cat] : null;
    const title = P.title.trim();
    const desc = P.desc.trim();
    if (title.length < 3) return toast('عنوان حداقل ۳ حرف باشد');
    if (!cfg) return toast('دسته‌بندی را انتخاب کنید');
    for (const f of cfg.fields) {
      if (f.req && !(P.attrs[f.k] || '').trim()) return toast('«' + f.l + '» را انتخاب کنید');
    }
    if (cfg.cond && !P.cond) return toast('جدید یا مستعمل را انتخاب کنید');
    if (cfg.deals.length && !P.deal) return toast('نوع معامله را انتخاب کنید');
    let price = null;
    if (P.deal !== 'exchange' && !P.nego) {
      const n = Number(latin(P.price));
      if (!n) return toast('قیمت را بنویسید یا «توافقی» را بزنید');
      price = n;
    }
    if (desc.length < 5) return toast('توضیحات حداقل ۵ حرف باشد');
    if (!P.prov) return toast('ولایت را انتخاب کنید');
    let contact;
    if (P.useTg && P.username) contact = '@' + P.username;
    else {
      contact = toLat(P.contact).replace(/[\s\-()]/g, '');
      if (!/^\+?\d{9,15}$/.test(contact)) return toast('شماره تماس معتبر نیست');
    }

    P.busy = true;
    const b = $('#p_submit');
    if (b) b.disabled = true;
    try {
      const photos = [];
      for (let i = 0; i < P.files.length; i++) {
        setSt('در حال آپلود عکس ' + fa(i + 1) + ' از ' + fa(P.files.length) + '…');
        const r = await call('uploadPhoto', { data: P.files[i].split(',')[1] });
        photos.push({ id: r.id, thumb: r.thumb });
      }
      setSt('در حال انتشار…');
      const r = await call('createAd', {
        title: title, category: P.cat, attrs: P.attrs, cond: P.cond || null, deal: P.deal || null,
        exchangeFor: P.exchangeFor, price: price, description: desc,
        province: P.prov, city: P.city.trim(), contact: contact, photos: photos,
      });
      resetP();
      composer.innerHTML = xbtn('closecomp') + '<div class="dbody comp"><div class="me"><div class="av">' + ic('check') + '</div><h2 style="justify-content:center;margin:0">آگهی شما منتشر شد</h2><div class="mt" style="justify-content:center">در کانال، ربات و مینی‌اپ دیده می‌شود.</div></div>' +
        (r.channelUrl ? btn('megaphone', 'مشاهده در کانال', 'data-url="' + esc(r.channelUrl) + '"') : '') +
        btn('eye', 'مشاهده آگهی', 'data-open="' + r.id + '"', 'alt') + btn('close', 'بستن', 'data-act="closecomp"', 'alt') + '</div>';
    } catch (e) {
      P.busy = false;
      if (b) b.disabled = false;
      setSt('');
      const c = errCode(e);
      if (c === 'NOT_MEMBER' || c === 'LIMIT') paintBlocked({ reason: c, message: e.message });
      else toast(e.message || 'خطا در ثبت آگهی');
    }
  }

  // ---------- برگه فیلتر ----------
  function openSheet() {
    sheet.innerHTML = '<div class="box"><h2>' + ic('sliders') + 'فیلترها</h2>' +
      '<label class="l">دسته‌بندی<select id="f_cat"><option value="">همه</option>' + CATS.map((c) => '<option value="' + c.k + '"' + (F.category === c.k ? ' selected' : '') + '>' + esc(c.n) + '</option>').join('') + '</select></label>' +
      '<label class="l">ولایت<select id="f_prov"><option value="">همه</option>' + PROVS.map((p) => '<option' + (F.province === p ? ' selected' : '') + '>' + p + '</option>').join('') + '</select></label>' +
      '<div class="two"><label class="l">حداقل قیمت (افغانی)<input id="f_min" inputmode="numeric" value="' + esc(F.minPrice) + '"></label>' +
      '<label class="l">حداکثر قیمت (افغانی)<input id="f_max" inputmode="numeric" value="' + esc(F.maxPrice) + '"></label></div>' +
      '<label class="l">مرتب‌سازی<select id="f_sort">' + Object.keys(SORTS).map((k) => '<option value="' + k + '"' + (F.sort === k ? ' selected' : '') + '>' + SORTS[k] + '</option>').join('') + '</select></label>' +
      '<div class="two">' + btn('check', 'اعمال', 'data-act="apply"') + btn('refresh', 'پاک‌کردن', 'data-act="clear"', 'alt') + '</div></div>';
    sheet.classList.remove('hidden');
    syncBack();
  }
  function closeSheet() { sheet.classList.add('hidden'); sheet.innerHTML = ''; syncBack(); }

  // ---------- رندر ----------
  function render() {
    document.querySelectorAll('#nav [data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === S.tab));
    window.scrollTo(0, 0);
    if (S.tab === 'home') renderHome();
    else if (S.tab === 'chats') renderChats();
    else if (S.tab === 'saved') renderSaved();
    else renderMe();
  }

  // ---------- رویدادها ----------
  document.addEventListener('input', (e) => {
    const t = e.target;
    const id = t.id;
    if (t.dataset && t.dataset.attr) P.attrs[t.dataset.attr] = t.value;
    else if (id === 'p_title') P.title = t.value;
    else if (id === 'p_desc') P.desc = t.value;
    else if (id === 'p_price') P.price = t.value;
    else if (id === 'p_city') P.city = t.value;
    else if (id === 'p_contact') P.contact = t.value;
    else if (id === 'p_ex') P.exchangeFor = t.value;
    else if (id === 'cinput') {
      t.style.height = 'auto';
      t.style.height = Math.min(110, t.scrollHeight) + 'px';
    }
  });

  document.addEventListener('change', async (e) => {
    const t = e.target;
    const id = t.id;
    if (t.dataset && t.dataset.attr) P.attrs[t.dataset.attr] = t.value;
    else if (id === 'p_prov') P.prov = t.value;
    else if (id === 'p_nego') { P.nego = t.checked; const pr = $('#p_price'); if (pr) pr.disabled = P.nego; }
    else if (id === 'p_usetg') { P.useTg = t.checked; const c = $('#p_contact'); if (c) c.disabled = P.useTg; }
    else if (id === 'p_files') { await addFiles(t.files); t.value = ''; }
  });

  document.addEventListener('click', (e) => {
    if (e.target === sheet) { closeSheet(); return; }
    if (e.target.closest('#fab')) { resetP(); openComposer(); return; }
    const t = e.target.closest('[data-open],[data-cat],[data-pcat],[data-pset],[data-seller],[data-tab],[data-bm],[data-share],[data-tg],[data-wa],[data-url],[data-chat],[data-conv],[data-more],[data-smore],[data-rm],[data-act]');
    if (!t) return;
    const d = t.dataset;
    if (d.open) { openAd(Number(d.open)); return; }
    if (d.chat) { startChat(Number(d.chat)); return; }
    if (d.conv) { openChat(Number(d.conv)); return; }
    if (d.pcat) { P.cat = d.pcat; P.attrs = {}; P.cond = ''; P.deal = ''; paintComposer(); return; }
    if (d.pset) { P[d.pset] = d.v; paintComposer(); return; }
    if (d.seller) {
      F.seller = d.seller;
      document.querySelectorAll('#seg button').forEach((b) => b.classList.toggle('on', b.dataset.seller === F.seller));
      loadList(true);
      return;
    }
    if (d.cat) { F.category = F.category === d.cat && S.tab === 'home' ? '' : d.cat; S.tab = 'home'; render(); return; }
    if (d.tab) { S.tab = d.tab; render(); return; }
    if (d.bm) { toggleBm(Number(d.bm)); return; }
    if (d.share) {
      const link = 'https://t.me/' + BOT + '?start=ad_' + d.share;
      const shareUrl = 'https://t.me/share/url?url=' + encodeURIComponent(link) + '&text=' + encodeURIComponent(d.t || '');
      if (tg.openTelegramLink) tg.openTelegramLink(shareUrl); else window.open(shareUrl, '_blank');
      return;
    }
    if (d.tg) {
      const url = 'https://t.me/' + d.tg;
      if (tg.openTelegramLink) tg.openTelegramLink(url); else window.open(url, '_blank');
      return;
    }
    if (d.wa) {
      const url = 'https://wa.me/' + d.wa;
      if (tg.openLink) tg.openLink(url); else window.open(url, '_blank');
      return;
    }
    if (d.url) {
      if (tg.openTelegramLink) tg.openTelegramLink(d.url); else window.open(d.url, '_blank');
      return;
    }
    if (d.more) { S.page += 1; loadList(false); return; }
    if (d.smore) { SV.page += 1; loadSaved(false); return; }
    if (d.rm) {
      if (d.rm === 'price') { F.minPrice = ''; F.maxPrice = ''; }
      else if (d.rm === 'sort') F.sort = 'new';
      else F[d.rm] = '';
      render();
      return;
    }
    switch (d.act) {
      case 'goq': S.tab = 'home'; render(); break;
      case 'filter': openSheet(); break;
      case 'apply':
        F.category = $('#f_cat').value;
        F.province = $('#f_prov').value;
        F.minPrice = latin($('#f_min').value);
        F.maxPrice = latin($('#f_max').value);
        F.sort = $('#f_sort').value;
        try { localStorage.setItem('peyda_f', JSON.stringify({ province: F.province })); } catch (err) {}
        closeSheet();
        S.tab = 'home';
        render();
        break;
      case 'clear':
        F.q = ''; F.category = ''; F.province = ''; F.minPrice = ''; F.maxPrice = ''; F.sort = 'new';
        try { localStorage.setItem('peyda_f', '{}'); } catch (err) {}
        closeSheet();
        S.tab = 'home';
        render();
        break;
      case 'closead': closeAd(); break;
      case 'newad': resetP(); openComposer(); break;
      case 'closecomp': closeComposer(); break;
      case 'recheck': openComposer(); break;
      case 'addph': { const fi = $('#p_files'); if (fi) fi.click(); break; }
      case 'rmph': P.files.splice(Number(d.i), 1); paintThumbs(); break;
      case 'submitad': submitAd(); break;
      case 'aa': doAction(Number(d.id), d.a); break;
      case 'shopreq': shopReq(); break;
      case 'chatclose': closeChat(); break;
      case 'chatsend': sendChat(); break;
      case 'chatmenu': chatMenu(); break;
      case 'chatunblock': chatAct('unblock'); break;
      case 'bot': {
        const url = 'https://t.me/' + BOT;
        if (tg.openTelegramLink) tg.openTelegramLink(url); else window.open(url, '_blank');
        break;
      }
      case 'channel': {
        const url = 'https://t.me/PeydaAds';
        if (tg.openTelegramLink) tg.openTelegramLink(url); else window.open(url, '_blank');
        break;
      }
    }
  });

  if (tg.BackButton && tg.BackButton.onClick) {
    tg.BackButton.onClick(() => {
      if (!sheet.classList.contains('hidden')) closeSheet();
      else if (!chatEl.classList.contains('hidden')) closeChat();
      else if (!detail.classList.contains('hidden')) closeAd();
      else if (!composer.classList.contains('hidden')) closeComposer();
    });
  }

  // نشان گفتگوی نخوانده: هر ۲۵ ثانیه
  setInterval(() => {
    if (document.hidden || !chatEl.classList.contains('hidden')) return;
    if (S.tab === 'chats') loadChats(); else refreshBadge();
  }, 25000);

  render();
  refreshBadge();
  ensureCfg().then(() => { if (S.tab === 'home') paintList(); }).catch(() => {});
  // باز شدن مستقیم یک گفتگو از دکمه نوتیفیکیشن ربات
    // باز شدن مستقیم آگهی یا گفتگو (از دکمه‌های ربات، کانال و لینک‌های startapp)
  
  const qs = new URLSearchParams(location.search);
  const sp = (tg.initDataUnsafe && tg.initDataUnsafe.start_param) || '';
  const mAd = sp.match(/^ad_(\d+)$/);
  const mChat = sp.match(/^chat_(\d+)$/);
  const adParam = Number(qs.get('ad')) || (mAd ? Number(mAd[1]) : 0);
  const chatParam = Number(qs.get('chat')) || (mChat ? Number(mChat[1]) : 0);
  if (chatParam) openChat(chatParam);
  else if (adParam) openAd(adParam);
  else if (sp === 'new') { resetP(); openComposer(); }
})();