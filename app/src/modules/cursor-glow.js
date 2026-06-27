// 光标辉光（仅桌面）：跟随鼠标位置
export function initCursorGlow(isDesktop) {
  if (!isDesktop) return;
  const glow = document.getElementById("cursorGlow");
  glow.classList.add("active");
  document.addEventListener("mousemove", (e) => {
    glow.style.setProperty("--mouse-x", e.clientX + "px");
    glow.style.setProperty("--mouse-y", e.clientY + "px");
  });
}
