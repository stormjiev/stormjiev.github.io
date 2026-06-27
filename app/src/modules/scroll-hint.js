// 点击向下箭头平滑滚动到「关于我」
export function initScrollHint() {
  const hint = document.querySelector(".scroll-hint");
  if (!hint) return;
  hint.addEventListener("click", () => {
    document.getElementById("about").scrollIntoView({ behavior: "smooth" });
  });
}
