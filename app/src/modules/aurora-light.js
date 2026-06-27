// 浅色背景动效（深色 starfield 的暖色等价物）：
// 暖色水彩漂移由 CSS 负责（body::after），本模块只画轻量的「浮尘微粒 + 偶发柔光划过」。
// 设计依据：huashu-design animation-best-practices §0 —— 让像素像有重量的「物体」，弧线、不规律、有呼吸感。
export function initAuroraLight() {
  const canvas = document.getElementById("aurora");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let motes = [];
  let glints = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createMotes();
  }

  function dot(x, y, r, style) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = style;
    ctx.fill();
  }

  // 浮尘：暖白发光尘 + 赤陶色暗尘混合，缓慢上浮 + 轻微横向漂移 + 呼吸闪烁
  function createMotes() {
    motes = [];
    const density = 0.00008;
    const count = Math.floor(canvas.width * canvas.height * density);
    for (let i = 0; i < count; i++) {
      const warm = Math.random();
      let color;
      if (warm < 0.55) color = [255, 250, 240]; // 暖白发光尘
      else if (warm < 0.85) color = [216, 151, 111]; // 赤陶 #D8976F 暖尘
      else color = [150, 160, 130]; // 一抹鼠尾草绿，避免单调
      motes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.5,
        baseOpacity: Math.random() * 0.35 + 0.12,
        color,
        twinkleSpeed: Math.random() * 0.012 + 0.003,
        twinklePhase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.25,
        driftY: -(Math.random() * 0.28 + 0.06), // 整体缓慢上浮
        sway: Math.random() * 0.02 + 0.005,
        swayPhase: Math.random() * Math.PI * 2,
      });
    }
  }

  // 柔光划过：浅色版的「流星」——不是白色锐线，而是暖金色、低对比、慢、带柔晕的一道光
  function spawnGlint() {
    const w = canvas.width;
    const h = canvas.height;
    const angle = 18 + Math.random() * 12;
    const rad = (angle * Math.PI) / 180;
    const len = 90 + Math.random() * 160;
    const speed = 2.2 + Math.random() * 2.4; // 比深色流星慢，更优雅
    const x = -len;
    const y = Math.random() * h * 0.7;
    const travel = w + len + 200;
    const maxLife = Math.ceil(travel / (Math.cos(rad) * speed));
    glints.push({ x, y, rad, len, speed, life: 0, maxLife });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const time = Date.now() * 0.001;
    const w = canvas.width;
    const h = canvas.height;

    motes.forEach((m) => {
      m.y += m.driftY;
      m.x += m.driftX + Math.sin(time * m.sway * 8 + m.swayPhase) * 0.15;
      if (m.y < -10) { m.y = h + 10; m.x = Math.random() * w; }
      if (m.x < -10) m.x = w + 10;
      if (m.x > w + 10) m.x = -10;

      const opacity =
        m.baseOpacity * (0.45 + 0.55 * Math.sin(time * m.twinkleSpeed * 60 + m.twinklePhase));
      const c = m.color;
      dot(m.x, m.y, m.r, `rgba(${c[0]},${c[1]},${c[2]},${opacity})`);
      if (m.r > 1.0)
        dot(m.x, m.y, m.r * 3.5, `rgba(${c[0]},${c[1]},${c[2]},${opacity * 0.07})`);
    });

    drawGlints();
    animId = requestAnimationFrame(draw);
  }

  function drawGlints() {
    if (glints.length < 2 && Math.random() < 0.006) spawnGlint();
    glints = glints.filter((g) => g.life < g.maxLife);
    glints.forEach((g) => {
      g.life++;
      g.x += Math.cos(g.rad) * g.speed;
      g.y -= Math.sin(g.rad) * g.speed;

      const fadeIn = Math.min(g.life / 14, 1);
      const fadeOut = Math.max(1 - (g.life - g.maxLife + 24) / 24, 0);
      const opacity = fadeIn * fadeOut * 0.5;

      const tailX = g.x - Math.cos(g.rad) * g.len;
      const tailY = g.y + Math.sin(g.rad) * g.len;
      const grad = ctx.createLinearGradient(tailX, tailY, g.x, g.y);
      grad.addColorStop(0, `rgba(216,151,111,0)`);
      grad.addColorStop(0.75, `rgba(216,151,111,${opacity * 0.5})`);
      grad.addColorStop(1, `rgba(240,200,160,${opacity})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(g.x, g.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      ctx.stroke();

      // 头部柔晕
      const glow = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, 6);
      glow.addColorStop(0, `rgba(255,235,210,${opacity * 0.6})`);
      glow.addColorStop(1, `rgba(255,235,210,0)`);
      dot(g.x, g.y, 6, glow);
    });
  }

  resize();
  draw();

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else draw();
  });
}
