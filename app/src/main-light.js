// 浅色版入口编排：复用全部交互模块，仅把深色专属的星空背景换成暖色 aurora，
// 光标辉光仍复用（颜色由 style-light.css 调成暖色）。
import { initScrollHint } from "./modules/scroll-hint.js";
import { initPageNav } from "./modules/page-nav.js";
import { initCursorGlow } from "./modules/cursor-glow.js";
import { initReveal } from "./modules/reveal.js";
import { initTimeline } from "./modules/timeline.js";
import { initAuroraLight } from "./modules/aurora-light.js";
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
initAuroraLight();
initConstellation(isDesktop);
initWorksDepth(isDesktop);
initVideoModal();
initQrContact(isDesktop);
initI18n();
