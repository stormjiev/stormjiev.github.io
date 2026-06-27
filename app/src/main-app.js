// 精简首页入口：仅保留几何背景、几何印记与光标辉光。
// 去掉了页码导航、滚动揭示、时间线、星座、作品、视频、二维码、i18n 等其余页面逻辑。
import { initCursorGlow } from "./modules/cursor-glow.js";
import { initGeoBackdrop } from "./modules/geo-backdrop.js";
import { initGeoMark } from "./modules/geo-mark.js";

const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

initCursorGlow(isDesktop);
initGeoBackdrop();
initGeoMark(isDesktop);
