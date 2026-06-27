// 原创「几何装配」揭示（替代克隆自原站的流星绕六边形扫场）：
// 进入视口后，节点以 overshoot 弹入（CSS 控制几何形态），连线同步以 stroke-dashoffset
// 沿环序逐段「绘制生长」。没有彗星 / 拖尾，纯 Swiss 制图式线条生长。
export function initGeoConstellation(isDesktop) {
  const constellation = document.getElementById("constellation");
  if (!constellation) return;

  // DOM 顺序的节点恰为环序：top → 右上 → 右下 → bottom → 左下 → 左上
  const nodes = constellation.querySelectorAll(".star-node");
  const lines = constellation.querySelectorAll(".constellation-line");
  const meteor = document.getElementById("cMeteor");
  if (meteor) meteor.style.display = "none"; // 不再使用彗星

  lines.forEach((line) => {
    const len = line.getTotalLength() || 500;
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
    line.style.transition = "stroke-dashoffset 0.55s cubic-bezier(0.16,1,0.3,1)";
  });

  function reveal() {
    nodes.forEach((node, i) => {
      setTimeout(() => {
        node.classList.add("visible");
        // 礼让观众：形出现后再放说明文字
        setTimeout(() => node.classList.add("show-info"), 220);
        // 同步绘制本节点引出的连线
        if (lines[i]) lines[i].style.strokeDashoffset = "0";
      }, i * 260);
    });

    // 全部装配完成后，连线转为持续的虚线流动（保留生命感）
    const total = nodes.length * 260 + 700;
    setTimeout(() => {
      lines.forEach((l) => {
        l.style.transition = "";
        l.style.strokeDasharray = "";
        l.style.strokeDashoffset = "";
        l.classList.add("flowing");
      });
    }, total);
  }

  function revealMobile() {
    nodes.forEach((n, i) => setTimeout(() => n.classList.add("visible"), i * 150));
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(constellation);
        isDesktop ? reveal() : revealMobile();
      });
    },
    { threshold: 0.15 }
  );
  obs.observe(constellation);
}
