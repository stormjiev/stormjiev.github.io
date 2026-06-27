// 滚动揭示（IntersectionObserver）：works 卡片错峰；about-stats / about-quote 由时间线驱动，跳过
export function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".works-grid .reveal").forEach((el, i) => {
    el.style.transitionDelay = `${i * 150}ms`;
  });

  document.querySelectorAll(".reveal").forEach((el) => {
    if (el.closest(".about-stats") || el.classList.contains("about-quote")) return;
    observer.observe(el);
  });
}
