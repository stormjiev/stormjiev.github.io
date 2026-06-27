// 入口编排：按原站顺序初始化各交互模块。
// 拆分自原单文件 IIFE，行为/像素零变化（hero WebGL 地球由 index.html 内联 module 单独初始化）。
import { initScrollHint } from "./modules/scroll-hint.js";
import { initPageNav } from "./modules/page-nav.js";
import { initCursorGlow } from "./modules/cursor-glow.js";
import { initReveal } from "./modules/reveal.js";
import { initTimeline } from "./modules/timeline.js";
import { initStarfield } from "./modules/starfield.js";
import { initConstellation } from "./modules/constellation.js";
import { initWorksDepth } from "./modules/works-depth.js";
import { initVideoModal } from "./modules/video-modal.js";
import { initQrContact } from "./modules/qr-contact.js";
import { initI18n } from "./modules/i18n.js";

const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

initScrollHint();
initPageNav();
initCursorGlow(isDesktop);
initReveal();
initTimeline();
initStarfield();
initConstellation(isDesktop);
initWorksDepth(isDesktop);
initVideoModal();
initQrContact(isDesktop);
initI18n();
