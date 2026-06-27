// 左侧弹性圆点页码导航：随滚动变形 + 高亮当前区块（rAF 节流）
export function initPageNav() {
  const pageNav = document.getElementById("pageNav");
  const dots = document.querySelectorAll(".page-dot");
  const sectionIds = ["hero", "about", "focus", "works", "contact"];
  const sectionEls = sectionIds.map((id) => document.getElementById(id));
  const DOT_GAP = 28,
    DOT_SIZE = 8,
    MAX_STRETCH = 16;

  let prevIdx = 0,
    dir = 1;

  function updateDot() {
    const scrollY = window.scrollY;
    let idx = sectionEls.length - 1;
    for (let i = 0; i < sectionEls.length - 1; i++) {
      const top = sectionEls[i].offsetTop;
      const next = sectionEls[i + 1].offsetTop;
      if (scrollY < next) {
        idx = i + (scrollY - top) / (next - top);
        break;
      }
    }

    if (idx !== prevIdx) dir = idx > prevIdx ? 1 : -1;
    prevIdx = idx;

    const base = Math.floor(idx);
    const frac = idx - base;
    const half = frac <= 0.5;
    const t = half ? frac * 2 : (frac - 0.5) * 2;

    const dotTop = half ? base * DOT_GAP : base * DOT_GAP + t * DOT_GAP;
    const dotHeight = half
      ? DOT_SIZE + t * MAX_STRETCH
      : DOT_SIZE + MAX_STRETCH - t * MAX_STRETCH;

    const s = Math.sin(frac * Math.PI);
    const w = DOT_SIZE - s * 3.5;
    const tail = 50 - s * 32 + "%";
    const br =
      dir >= 0
        ? `50% 50% 50% 50% / ${tail} ${tail} 50% 50%`
        : `50% 50% 50% 50% / 50% 50% ${tail} ${tail}`;

    const st = pageNav.style;
    st.setProperty("--dot-top", dotTop + "px");
    st.setProperty("--dot-height", dotHeight + "px");
    st.setProperty("--dot-w", w + "px");
    st.setProperty("--dot-br", s < 0.01 ? "50%" : br);

    dots.forEach((d, i) => d.classList.toggle("active", i === Math.round(idx)));
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateDot();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
  updateDot();
}
