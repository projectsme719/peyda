/**
 * @file cf/logo.js
 * @version 1.0.0
 * @updated 2026-10-31
 * Animated Peyda logo: inline SVG that follows the text color (dark in
 * the light theme, white in the dark theme) and its CSS. The shapes were
 * traced from the logo image: the frame, then two icons with two lines.
 */
const P = {
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

export const LOGO = '<svg class="lgo" viewBox="0 0 1225 1260" '
  + 'aria-hidden="true" focusable="false">'
  + '<g fill="currentColor" fill-rule="evenodd">'
  + `<path class="lg-f" d="${P.frame}"/>`
  + `<path class="lg-i lg-a" d="${P.house}"/>`
  + `<path class="lg-l" d="${P.hl1}"/>`
  + `<path class="lg-l lg-2" d="${P.hl2}"/>`
  + `<path class="lg-i lg-b" d="${P.car}"/>`
  + `<path class="lg-l lg-3" d="${P.cl1}"/>`
  + `<path class="lg-l lg-4" d="${P.cl2}"/>`
  + '</g></svg>';

// Entrance (about a second), then a slow pulse of the house and the car
// in turn. Nothing moves for people who ask for reduced motion.
export const LOGO_CSS = `.logo{display:flex;align-items:center;gap:10px}
.logo .lt{display:block}
.lgo{width:46px;height:46px;flex:none;overflow:visible}
.lgo *{transform-box:fill-box;transform-origin:center}
.lg-f{animation:lgf .7s ease-out both}
.lg-i{animation:lgi .6s cubic-bezier(.3,1.6,.5,1) .35s both,
lgp 8s ease-in-out 3s infinite}
.lg-b{animation:lgi .6s cubic-bezier(.3,1.6,.5,1) .5s both,
lgp 8s ease-in-out 7s infinite}
.lg-l{animation:lgl .5s ease-out .7s both}
.lg-2,.lg-4{animation-delay:.85s}
.lg-3{animation-delay:.8s}
@keyframes lgf{from{opacity:0;transform:translateY(-12%) scale(.92)}}
@keyframes lgi{from{opacity:0;transform:scale(.2)}}
@keyframes lgl{from{opacity:0;transform:translateX(-25%)}}
@keyframes lgp{0%,8%,100%{transform:none}4%{transform:scale(1.2)}}
@media(prefers-reduced-motion:reduce){.lgo *{animation:none}}`;
