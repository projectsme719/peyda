/**
 * @file cf/lightbox.js
 * @version 1.0.0
 * @updated 2026-10-31
 * Ad photo gallery: the whole photo is visible (no cropping) and a tap
 * opens a full-screen viewer (swipe sideways; X or Esc closes it).
 * Without JavaScript a tap opens the full photo in the browser.
 */
export const LB_CSS = `.gal a{flex:0 0 100%;display:block;cursor:zoom-in;
scroll-snap-align:center}
.gal img{display:block;width:100%;aspect-ratio:4/3;object-fit:contain;
background:var(--muted)}
.lb{position:fixed;inset:0;z-index:60;display:none;flex-direction:column;
background:#000;color:#fff}
.lb.on{display:flex}
.lb-bar{display:flex;align-items:center;justify-content:space-between;
padding:calc(env(safe-area-inset-top,0px) + 8px) 14px 8px}
.lb-x{width:46px;height:46px;border:0;border-radius:50%;font-size:20px;
background:rgba(255,255,255,.18);color:#fff;cursor:pointer}
.lb-s{flex:1;min-height:0;display:flex;overflow-x:auto;
scroll-snap-type:x mandatory}
.lb-s img{flex:0 0 100%;width:100%;height:100%;object-fit:contain;
scroll-snap-align:center}
html.lbo{overflow:hidden}`;

export const LB_JS = `(function () {
  var g = document.querySelector('.gal');
  if (!g) return;
  var links = [].slice.call(g.querySelectorAll('a'));
  var root = document.documentElement;
  var lb = document.createElement('div');
  lb.className = 'lb';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = '<div class="lb-bar"><span class="lb-n"></span>'
    + '<button type="button" class="lb-x" aria-label="بستن">✕</button>'
    + '</div><div class="lb-s"></div>';
  document.body.appendChild(lb);
  var s = lb.querySelector('.lb-s');
  var n = lb.querySelector('.lb-n');
  var x = lb.querySelector('.lb-x');
  var digits = '۰۱۲۳۴۵۶۷۸۹';
  function fa(v) {
    return String(v).replace(/\\d/g, function (d) { return digits[d]; });
  }
  function label() {
    var i = Math.round(Math.abs(s.scrollLeft) / (s.clientWidth || 1));
    n.textContent = fa(i + 1) + ' از ' + fa(links.length);
  }
  function show(i) {
    lb.classList.add('on');
    root.classList.add('lbo');
    s.children[i].scrollIntoView({ inline: 'center', block: 'nearest' });
    label();
    x.focus();
  }
  function hide() {
    lb.classList.remove('on');
    root.classList.remove('lbo');
  }
  links.forEach(function (a, i) {
    var im = document.createElement('img');
    im.loading = 'lazy';
    im.alt = a.getAttribute('aria-label') || '';
    im.src = a.href;
    s.appendChild(im);
    a.addEventListener('click', function (e) {
      e.preventDefault();
      show(i);
    });
  });
  s.addEventListener('scroll', label);
  x.addEventListener('click', hide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hide();
  });
})();`;