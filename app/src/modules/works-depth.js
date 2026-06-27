// 作品卡片 3D 景深交互（仅桌面）：悬停卡片高亮、其余卡片变暗
export function initWorksDepth(isDesktop) {
  if (!isDesktop) return;
  const workCards = document.querySelectorAll(".work-card");

  workCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("depth-active");
      workCards.forEach((c) => {
        if (c !== card) c.classList.add("depth-dimmed");
      });
    });
    card.addEventListener("mouseleave", () => {
      card.classList.remove("depth-active");
      workCards.forEach((c) => c.classList.remove("depth-dimmed"));
    });
  });
}
