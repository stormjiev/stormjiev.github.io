// 大改版入口（Bauhaus/Swiss 原创动画）：
// 复用通用逻辑模块（页码导航 / 滚动揭示 / 时间线序列 / 作品悬停 / 视频 / 二维码 / i18n / 光标辉光），
// 但把克隆自原站的「标志性运动」全部替换为原创几何模块：
//   星空银河 → geo-backdrop（几何构成漂移）
//   WebGL 地球 → geo-mark（旋转几何构成印记）
//   流星绕环扫场 → geo-constellation（Swiss 制图式线条生长）
// timeline / works 的彗星与 3D 景深观感由 style-geo.css 改为平面 Bauhaus。
import { initScrollHint } from "./modules/scroll-hint.js";
import { initPageNav } from "./modules/page-nav.js";
import { initCursorGlow } from "./modules/cursor-glow.js";
import { initReveal } from "./modules/reveal.js";
import { initTimeline } from "./modules/timeline.js";
import { initGeoBackdrop } from "./modules/geo-backdrop.js";
import { initGeoMark } from "./modules/geo-mark.js";
import { initGeoConstellation } from "./modules/geo-constellation.js";
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
initGeoBackdrop();
initGeoMark(isDesktop);
initGeoConstellation(isDesktop);
initWorksDepth(isDesktop);
initVideoModal();
initQrContact(isDesktop);
initI18n();
