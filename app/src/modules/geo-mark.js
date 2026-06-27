// 原创 Hero 几何构成主体（替代克隆自原站的 WebGL 地球）：
// 同心环 + 反向自转的三角与半圆 + 公转小圆点，构成一枚缓慢旋转的「包豪斯构成印记」。
// 桌面端随鼠标做轻微视差。依据：design-styles.md「包豪斯几何」。
export function initGeoMark(isDesktop) {
  const canvas = document.getElementById("heroMark");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let size = 0, cx = 0, cy = 0, animId;
  let mx = 0, my = 0, tx = 0, ty = 0; // 鼠标视差

  // 暖色出版物
  const TERRA = "rgba(196,116,86,";
  const OCHRE = "rgba(184,138,64,";
  const SAGE = "rgba(138,142,110,";
  const INK = "rgba(41,37,33,";

  function resize() {
    const rect = canvas.getBoundingClientRect();
    size = Math.min(rect.width, rect.height);
    canvas.width = rect.width * DPR;
    canvas.height = rect.height * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx = rect.width / 2;
    cy = rect.height / 2;
  }

  function ring(r, color, lw, dash) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    if (dash) ctx.setLineDash(dash); else ctx.setLineDash([]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function triangle(r, rot, color, lw, fill) {
    ctx.save();
    ctx.rotate(rot);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / 3;
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    if (fill) { ctx.fillStyle = color; ctx.fill(); }
    else { ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.stroke(); }
    ctx.restore();
  }

  function draw() {
    const t = Date.now() * 0.001;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const R = size * 0.42;

    // 鼠标视差缓动
    tx += (mx - tx) * 0.06;
    ty += (my - ty) * 0.06;

    ctx.save();
    ctx.translate(cx + tx * 18, cy + ty * 18);

    // 同心环（静态层次）
    ring(R, INK + "0.18)", 1.5);
    ring(R * 0.72, OCHRE + "0.35)", 1.5);
    ring(R * 0.46, TERRA + "0.25)", 1, [4, 6]);

    // 半圆扇区，缓慢自转
    ctx.save();
    ctx.rotate(t * 0.18);
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.72, -Math.PI / 2, Math.PI / 2);
    ctx.closePath();
    ctx.fillStyle = TERRA + "0.10)";
    ctx.fill();
    ctx.restore();

    // 两枚三角，反向自转
    triangle(R * 0.9, t * 0.12, INK + "0.22)", 1.5, false);
    triangle(R * 0.5, -t * 0.22, OCHRE + "0.5)", 0, true);

    // 公转小圆点（沿最外环）
    const pa = t * 0.5;
    ctx.beginPath();
    ctx.arc(Math.cos(pa) * R, Math.sin(pa) * R, size * 0.022, 0, Math.PI * 2);
    ctx.fillStyle = TERRA + "0.9)";
    ctx.fill();

    // 反向公转的小方块（沿中环）
    const sa = -t * 0.35 + Math.PI;
    const sx = Math.cos(sa) * R * 0.72, sy = Math.sin(sa) * R * 0.72;
    const sq = size * 0.03;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(t * 0.6);
    ctx.fillStyle = SAGE + "0.8)";
    ctx.fillRect(-sq / 2, -sq / 2, sq, sq);
    ctx.restore();

    // 中心十字基准线（Swiss registration mark）
    ctx.strokeStyle = INK + "0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-size * 0.04, 0); ctx.lineTo(size * 0.04, 0);
    ctx.moveTo(0, -size * 0.04); ctx.lineTo(0, size * 0.04);
    ctx.stroke();

    ctx.restore();
    animId = requestAnimationFrame(draw);
  }

  resize();
  draw();

  window.addEventListener("resize", resize);
  if (isDesktop) {
    window.addEventListener("mousemove", (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else draw();
  });
}
