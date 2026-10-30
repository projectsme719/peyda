/**
 * @file cf/style.js
 * @version 1.1.0
 * @updated 2026-10-30
 * Site CSS: neutral shadcn-style theme (light + dark) and components.
 * Colors are the given oklch palette converted to HEX (old phones).
 */
export const CSS = `:root{color-scheme:light dark;
--background:#fff;--foreground:#0a0a0a;--card:#fdfdfd;--muted:#eee;
--muted-foreground:#737373;--border:#eee;--input:#f5f5f5;
--primary:#171717;--primary-foreground:#fafafa;--ring:#a1a1a1;
--destructive:#e7000b;--radius:1rem;--shadow:0 1px 3px 0 rgba(0,0,0,.1)}
@media(prefers-color-scheme:dark){:root{--background:#171717;
--foreground:#fafafa;--card:#0e0e0e;--muted:#262626;
--muted-foreground:#a1a1a1;--border:#262626;--input:#262626;
--primary:#e5e5e5;--primary-foreground:#171717;--ring:#737373;
--destructive:#ff6467}}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0;background:var(--background);color:var(--foreground);
font:15px/1.8 "DM Sans",Vazirmatn,system-ui,sans-serif}
a{color:inherit;text-decoration:none}
:focus-visible{outline:2px solid var(--ring);outline-offset:2px}
.ic{width:1.25em;height:1.25em;fill:none;stroke:currentColor;
stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none;
vertical-align:-.25em}
.top{background:var(--background);border-bottom:1px solid var(--border);
padding:calc(env(safe-area-inset-top,0px) + 10px) 14px 12px}
.top>div{max-width:900px;margin:0 auto}
.logo{display:block;font-weight:800;font-size:20px;line-height:1.3}
.logo small{display:block;font-size:12px;font-weight:400;
color:var(--muted-foreground)}
.search{display:flex;gap:8px;margin-top:10px}
.search input{flex:1}
.search input,.flt select,.flt input{width:100%;min-width:0;height:46px;
border:1px solid var(--border);border-radius:12px;padding:0 14px;
background:var(--input);color:var(--foreground);font:inherit;
font-size:16px}
.search input:focus,.flt select:focus,.flt input:focus{outline:0;
border-color:var(--ring)}
.search button,.flt button{display:flex;align-items:center;gap:6px;
height:46px;border:0;border-radius:12px;padding:0 18px;cursor:pointer;
background:var(--primary);color:var(--primary-foreground);font:inherit;
font-weight:700}
main{max-width:900px;margin:0 auto;padding:14px 14px 24px}
h1{font-size:17px;margin:6px 2px 12px;display:flex;align-items:center;
gap:8px}
h2{font-size:15px;margin:0 0 8px}
.cats{display:grid;gap:6px;padding:0 0 12px;
grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}
.cat{display:flex;align-items:center;justify-content:center;gap:5px;
min-height:40px;padding:0 10px;border:1px solid var(--border);
border-radius:99px;background:var(--card);font-size:13px}
.cat.on{background:var(--primary);color:var(--primary-foreground);
border-color:var(--primary)}
.seg{display:flex;gap:4px;margin:0 0 14px;overflow-x:auto;
border-bottom:1px solid var(--border)}
.seg a{padding:10px 14px;min-height:44px;white-space:nowrap;
color:var(--muted-foreground);border-bottom:2px solid transparent;
border-radius:10px 10px 0 0}
.seg a.on{color:var(--foreground);font-weight:700;background:var(--muted);
border-bottom-color:var(--foreground)}
.grid{display:grid;gap:12px;
grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}
.card{display:block;background:var(--card);border:1px solid var(--border);
border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
.ph{display:grid;place-items:center;width:100%;aspect-ratio:4/3;
object-fit:cover;background:var(--muted);color:var(--muted-foreground);
font-size:30px}
.cb{padding:10px 12px 12px}
.cb h3{margin:0 0 4px;font-size:14px;line-height:1.6;overflow:hidden;
display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.pr{font-weight:800;font-size:15px}
.pr.big{font-size:22px;margin:6px 0}
.mt{color:var(--muted-foreground);font-size:12px;margin-top:4px;
line-height:1.7}
.mt .ic{margin-inline-end:4px}
.tags{display:flex;gap:4px;flex-wrap:wrap;margin-top:8px}
.tg{display:inline-flex;gap:3px;align-items:center;padding:1px 8px;
border-radius:99px;background:var(--muted);font-size:12px}
.tg.shop{font-weight:700}
.pager{display:flex;justify-content:space-between;align-items:center;
margin:18px 2px}
.more,.btn{display:flex;gap:8px;justify-content:center;align-items:center;
min-height:46px;padding:0 22px;border-radius:12px;font-weight:700;
background:var(--primary);color:var(--primary-foreground)}
.empty{text-align:center;color:var(--muted-foreground);padding:40px 0;
line-height:2}
.empty .ic{width:42px;height:42px;display:block;margin:0 auto 8px;
opacity:.6}
.box{background:var(--card);border:1px solid var(--border);
border-radius:var(--radius);box-shadow:var(--shadow);padding:16px;
margin-bottom:12px}
.box h2{margin:0 0 6px}
.box p{white-space:pre-wrap;margin:6px 0}
.gal{display:flex;gap:8px;overflow-x:auto;scroll-snap-type:x mandatory;
border:1px solid var(--border);border-radius:var(--radius);
margin-bottom:12px}
.gal img{flex:0 0 100%;width:100%;aspect-ratio:4/3;object-fit:cover;
scroll-snap-align:center;background:var(--muted)}
.sold{display:inline-block;margin-bottom:6px;padding:2px 12px;
border-radius:99px;background:var(--destructive);color:#fff}
dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:6px 16px}
dt{color:var(--muted-foreground)}
dd{margin:0}
dd a{font-weight:700;text-decoration:underline}
.btns{display:flex;gap:10px;flex-wrap:wrap}
.btn{flex:1;min-width:160px}
.btn.alt{background:var(--background);color:var(--foreground);
border:1px solid var(--ring)}
.flt{background:var(--card);border:1px solid var(--border);
border-radius:var(--radius);margin-bottom:12px}
.flt summary{list-style:none;cursor:pointer;min-height:48px;padding:0 16px;
display:flex;gap:8px;align-items:center;font-weight:700}
.flt summary::-webkit-details-marker{display:none}
.flt form{padding:0 16px 16px;display:grid;gap:12px}
.flt label{display:grid;gap:4px;font-size:13px;
color:var(--muted-foreground)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.acts{display:flex;gap:16px;align-items:center}
.rst{color:var(--muted-foreground);font-size:14px;
text-decoration:underline}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}
.chip{display:inline-flex;align-items:center;min-height:40px;
padding:0 14px;border-radius:99px;background:var(--muted);font-size:13px}
.foot{text-align:center;font-size:13px;color:var(--muted-foreground);
padding:0 14px calc(90px + env(safe-area-inset-bottom,0px))}
.foot a{text-decoration:underline}
.soc{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;
margin-bottom:12px}
.soc a{display:inline-flex;align-items:center;gap:6px;min-height:40px;
padding:0 14px;border:1px solid var(--border);border-radius:99px;
background:var(--card);color:var(--foreground);text-decoration:none}
.bnav{position:fixed;inset-inline:0;bottom:0;z-index:30;
background:var(--background);border-top:1px solid var(--border);
padding-bottom:env(safe-area-inset-bottom,0px)}
.bnav>div{max-width:520px;margin:0 auto;display:grid;
grid-template-columns:repeat(5,1fr);align-items:center}
.bnav a{display:flex;flex-direction:column;align-items:center;
justify-content:center;gap:2px;min-height:60px;font-size:12px;
color:var(--muted-foreground)}
.bnav a.on{color:var(--foreground);font-weight:700}
.bnav .ic{width:24px;height:24px}
.bnav .fab{width:54px;height:54px;min-height:0;margin:-18px auto 0;
border-radius:50%;background:var(--primary);color:var(--primary-foreground);
box-shadow:0 4px 12px rgba(0,0,0,.25)}`;