// 原创 Bauhaus/Swiss 几何背景（替代克隆自原站的星空银河）：
// 一组暖色几何基本形（圆 / 半圆 / 环 / 三角 / 长条）以极低透明度缓慢平移与自转，
// 边界环绕循环。配合 CSS 的静态栅格，构成「几何构成」母题。
// 依据：huashu-design references/design-styles.md「包豪斯几何」+ animation-best-practices（弧线·不规律·有呼吸感）。
export function initGeoBackdrop() {
  const canvas = document.getElementById("backdrop");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let shapes = [];
  let animId;

  // 暖色出版物调色：赤陶 / 赭金 / 鼠尾草 / 墨
  const PALETTE = [
    [196, 116, 86],
    [184, 138, 64],
    [138, 142, 110],
    [41, 37, 33],
  ];

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function createShapes() {
    const area = canvas.width * canvas.height;
    const count = Math.max(7, Math.min(14, Math.round(area / 150000)));
    shapes = [];
    const types = ["ring", "semicircle", "triangle", "bar", "disc"];
    for (let i = 0; i < count; i++) {
      const size = rand(70, 260);
      shapes.push({
        type: pick(types),
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        rot: Math.random() * Math.PI * 2,
        vrot: rand(-0.0015, 0.0015) || 0.0008,
        vx: rand(-0.18, 0.18),
        vy: rand(-0.12, 0.12),
        color: pick(PALETTE),
        // 大形更淡，避免压住正文
        alpha: rand(0.03, 0.07) * (size > 180 ? 0.7 : 1),
        filled: Math.random() < 0.45,
        lw: rand(1.5, 3),
      });
    }
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createShapes();
  }

  function drawShape(s) {
    const [r, g, b] = s.color;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot);
    ctx.globalAlpha = s.alpha;
    ctx.strokeStyle = `rgb(${r},${g},${b})`;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.lineWidth = s.lw;
    const h = s.size / 2;

    ctx.beginPath();
    switch (s.type) {
      case "disc":
        ctx.arc(0, 0, h, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "ring":
        ctx.arc(0, 0, h, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case "semicircle":
        ctx.arc(0, 0, h, 0, Math.PI);
        ctx.closePath();
        s.filled ? ctx.fill() : ctx.stroke();
        break;
      case "triangle":
        ctx.moveTo(0, -h);
        ctx.lineTo(h * 0.87, h * 0.5);
        ctx.lineTo(-h * 0.87, h * 0.5);
        ctx.closePath();
        s.filled ? ctx.fill() : ctx.stroke();
        break;
      case "bar":
        ctx.rect(-h, -s.lw * 1.5, s.size, s.lw * 3);
        ctx.fill();
        break;
    }
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const m = 260; // 环绕边距
    shapes.forEach((s) => {
      s.x += s.vx;
      s.y += s.vy;
      s.rot += s.vrot;
      if (s.x < -m) s.x = canvas.width + m;
      if (s.x > canvas.width + m) s.x = -m;
      if (s.y < -m) s.y = canvas.height + m;
      if (s.y > canvas.height + m) s.y = -m;
      drawShape(s);
    });
    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(draw);
  }

  resize();
  draw();

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else draw();
  });
}
