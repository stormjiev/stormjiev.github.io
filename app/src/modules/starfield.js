// 全屏星空背景：程序化银河（离屏 canvas 缓存）+ 闪烁星点 + 流星。
// 噪声/绘点助手仅本模块使用，故内聚于此。
export function initStarfield() {
  const starCanvas = document.getElementById("starfield");
  const starCtx = starCanvas.getContext("2d");
  let stars = [];
  let starAnimId;

  const milkyCanvas = document.createElement("canvas");
  const milkyCtx = milkyCanvas.getContext("2d");
  const milkyPad = 80;

  const tmp1 = document.createElement("canvas");
  const c1 = tmp1.getContext("2d");
  const tmp2 = document.createElement("canvas");
  const c2 = tmp2.getContext("2d");

  function dot(ctx, x, y, r, style) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = style;
    ctx.fill();
  }

  function resizeStarfield() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
    milkyCanvas.width = starCanvas.width + milkyPad * 2;
    milkyCanvas.height = starCanvas.height + milkyPad * 2;
    drawMilkyWay();
  }

  function hash(n) {
    let x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  function noise1D(x) {
    const i = Math.floor(x);
    const f = x - i;
    const u = f * f * (3 - 2 * f);
    return hash(i) * (1 - u) + hash(i + 1) * u;
  }

  function fbm(x, octaves) {
    let val = 0,
      amp = 0.5,
      freq = 1;
    for (let o = 0; o < octaves; o++) {
      val += amp * noise1D(x * freq);
      amp *= 0.5;
      freq *= 2.1;
    }
    return val;
  }

  function milkyPath(t, w, h) {
    const x = -w * 0.1 + w * 1.2 * t;
    const wobble = fbm(t * 8, 4) * h * 0.06 - h * 0.03;
    const curve = Math.sin(t * Math.PI * 1.1) * h * 0.1;
    const y = h * 0.9 + h * -0.95 * t + curve + wobble;
    return [x, y];
  }

  function drawMilkyWay() {
    const w = milkyCanvas.width;
    const h = milkyCanvas.height;
    milkyCtx.clearRect(0, 0, w, h);
    tmp1.width = w;
    tmp1.height = h;
    tmp2.width = w;
    tmp2.height = h;

    const steps = 1200;

    // Pass A: diffuse nebula glow
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const [cx, cy] = milkyPath(t, w, h);
      const intensity = Math.pow(Math.sin(t * Math.PI), 0.5);
      const bandW = (160 + intensity * 140) * (0.7 + fbm(t * 5 + 10, 3) * 0.6);

      for (let j = 0; j < 5; j++) {
        const ri = i * 40 + j;
        const ang = hash(ri) * Math.PI * 2;
        const dist = Math.pow(hash(ri + 2000), 0.4) * bandW;
        const px = cx + Math.cos(ang) * dist;
        const py = cy + Math.sin(ang) * dist * 0.45;
        const sz = hash(ri + 4000) * 12 + 6;
        const falloff = 1 - dist / bandW;
        const a = falloff * falloff * 0.04 * intensity;

        const cRoll = hash(ri + 6000);
        let r, g, b;
        if (cRoll < 0.4) {
          r = 80;
          g = 100;
          b = 180;
        } else if (cRoll < 0.7) {
          r = 100;
          g = 80;
          b = 160;
        } else {
          r = 60;
          g = 90;
          b = 150;
        }

        dot(c1, px, py, sz, `rgba(${r},${g},${b},${a})`);
      }
    }

    // Pass B: core cloud + color temperature
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const [cx, cy] = milkyPath(t, w, h);
      const intensity = Math.pow(Math.sin(t * Math.PI), 0.7);
      const densityNoise = fbm(t * 12, 4);
      const coreW = (70 + intensity * 80) * (0.6 + densityNoise * 0.8);

      for (let j = 0; j < 30; j++) {
        const ri = i * 120 + j + 20000;
        const ang = hash(ri) * Math.PI * 2;
        const dist = Math.pow(hash(ri + 1000), 0.65) * coreW;
        const px = cx + Math.cos(ang) * dist;
        const py = cy + Math.sin(ang) * dist * 0.4;
        const distR = dist / coreW;

        const sz = hash(ri + 3000) * 1.8 + 0.2;
        const a =
          Math.pow(1 - distR, 1.2) * 0.12 * intensity * (0.5 + densityNoise * 0.5);

        const temp = hash(ri + 5000);
        let r, g, b;
        if (distR < 0.3) {
          if (temp < 0.3) {
            r = 255;
            g = 240;
            b = 220;
          } else if (temp < 0.6) {
            r = 240;
            g = 220;
            b = 200;
          } else {
            r = 255;
            g = 250;
            b = 245;
          }
        } else if (distR < 0.6) {
          if (temp < 0.4) {
            r = 210;
            g = 220;
            b = 255;
          } else if (temp < 0.7) {
            r = 200;
            g = 200;
            b = 240;
          } else {
            r = 230;
            g = 225;
            b = 250;
          }
        } else {
          if (temp < 0.5) {
            r = 160;
            g = 180;
            b = 240;
          } else {
            r = 140;
            g = 160;
            b = 220;
          }
        }

        dot(c2, px, py, sz, `rgba(${r},${g},${b},${a})`);
      }
    }

    // Pass C: bright spine
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const [cx, cy] = milkyPath(t, w, h);
      const intensity = Math.pow(Math.sin(t * Math.PI), 1.5);
      const spineNoise = fbm(t * 15 + 5, 3);
      const spineW = (12 + intensity * 18) * (0.5 + spineNoise * 0.5);

      for (let j = 0; j < 8; j++) {
        const ri = i * 50 + j + 60000;
        const ang = hash(ri) * Math.PI * 2;
        const dist = Math.pow(hash(ri + 700), 1.5) * spineW;
        const px = cx + Math.cos(ang) * dist;
        const py = cy + Math.sin(ang) * dist * 0.35;
        const sz = hash(ri + 800) * 0.9 + 0.2;
        const a =
          Math.pow(1 - dist / spineW, 1.5) * 0.2 * intensity * (0.6 + spineNoise * 0.4);

        dot(c2, px, py, sz, `rgba(245,240,255,${a})`);
      }
    }

    // Pass D: dust lanes
    c2.globalCompositeOperation = "destination-out";
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const [cx, cy] = milkyPath(t, w, h);
      const intensity = Math.sin(t * Math.PI);

      const dustDensity = fbm(t * 10 + 3.7, 4);
      if (dustDensity > 0.45) {
        const offset = (fbm(t * 20, 3) - 0.5) * 30;
        const sz = (dustDensity - 0.45) * 80 + 3;
        const a = intensity * (dustDensity - 0.45) * 0.8;

        dot(c2, cx + offset, cy + offset * 0.3, sz, `rgba(0,0,0,${a})`);
      }
    }
    c2.globalCompositeOperation = "source-over";

    // Pass E: bright embedded stars
    for (let i = 0; i < 300; i++) {
      const t = hash(i + 90000);
      const [cx, cy] = milkyPath(t, w, h);
      const intensity = Math.pow(Math.sin(t * Math.PI), 0.5);
      const spread = (30 + intensity * 40) * (0.5 + hash(i + 91000) * 0.5);
      const ang = hash(i + 92000) * Math.PI * 2;
      const dist = Math.pow(hash(i + 93000), 0.8) * spread;
      const px = cx + Math.cos(ang) * dist;
      const py = cy + Math.sin(ang) * dist * 0.4;
      const sz = hash(i + 94000) * 1.5 + 0.5;
      const a = (1 - dist / spread) * intensity * 0.5;

      dot(c2, px, py, sz, `rgba(240,245,255,${a})`);
      if (sz > 1.2) dot(c2, px, py, sz * 2.5, `rgba(200,220,255,${a * 0.08})`);
    }

    // Composite: nebula glow + detail
    function blend(src, alpha, blur) {
      milkyCtx.globalAlpha = alpha;
      milkyCtx.filter = `blur(${blur}px)`;
      milkyCtx.drawImage(src, 0, 0);
    }
    blend(tmp1, 0.45, 16);
    blend(tmp1, 0.45, 8);
    blend(tmp2, 0.5, 1.5);
    blend(tmp2, 0.25, 5);
    milkyCtx.filter = "none";
    milkyCtx.globalAlpha = 1;
  }

  function createStars() {
    stars = [];
    const density = 0.00012;
    const count = Math.floor(starCanvas.width * starCanvas.height * density);
    for (let i = 0; i < count; i++) {
      const type = Math.random();
      let r, color, twinkleSpeed;

      if (type < 0.6) {
        r = Math.random() * 0.8 + 0.2;
        color = [255, 255, 255];
        twinkleSpeed = Math.random() * 0.008 + 0.002;
      } else if (type < 0.85) {
        r = Math.random() * 1.0 + 0.5;
        color = [180, 220, 255];
        twinkleSpeed = Math.random() * 0.02 + 0.005;
      } else {
        r = Math.random() * 1.2 + 0.8;
        color = [56, 249, 215];
        twinkleSpeed = Math.random() * 0.015 + 0.005;
      }

      stars.push({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        r: r,
        baseR: r,
        baseOpacity: Math.random() * 0.5 + 0.2,
        color: color,
        twinkleSpeed: twinkleSpeed,
        twinklePhase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.8,
        driftY: (Math.random() - 0.5) * 0.4,
        flashing: false,
        spikeAngle: Math.random() * Math.PI * 0.5,
      });
    }
  }

  let milkyOffset = 0;

  function drawStars() {
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    milkyOffset += 0.15;
    const mx = Math.sin(milkyOffset * 0.004) * 60 - milkyPad;
    const my = Math.cos(milkyOffset * 0.003) * 30 - milkyPad;
    starCtx.drawImage(milkyCanvas, mx, my);
    const time = Date.now() * 0.001;
    const w = starCanvas.width;
    const h = starCanvas.height;

    stars.forEach((s) => {
      s.x += s.driftX;
      s.y += s.driftY;
      if (s.x < -10) s.x = w + 10;
      if (s.x > w + 10) s.x = -10;
      if (s.y < -10) s.y = h + 10;
      if (s.y > h + 10) s.y = -10;

      let opacity =
        s.baseOpacity * (0.5 + 0.5 * Math.sin(time * s.twinkleSpeed * 60 + s.twinklePhase));
      let r = s.baseR;

      let flash = 0;
      if (s.flashing) {
        s.flashTimer++;
        const progress = s.flashTimer / s.flashDuration;
        flash = Math.sin(progress * Math.PI) * s.flashPeak;
        opacity = Math.min(1, opacity + flash * 0.8);
        r = s.baseR * (1 + flash * 0.5);
        if (s.flashTimer >= s.flashDuration) {
          s.flashing = false;
        }
      } else if (Math.random() < 0.0005) {
        s.flashing = true;
        s.flashTimer = 0;
        s.flashDuration = 25 + Math.floor(Math.random() * 50);
        s.flashPeak = 0.15 + Math.random() * 0.85;
        s.flashScale = 0.4 + Math.random() * 1.6;
      }

      const c = s.color;
      dot(starCtx, s.x, s.y, r, `rgba(${c[0]},${c[1]},${c[2]},${opacity})`);
      if (r > 1.2)
        dot(starCtx, s.x, s.y, r * 3, `rgba(${c[0]},${c[1]},${c[2]},${opacity * 0.08})`);

      if (s.flashing && flash > 0.15) {
        const sc = s.flashScale;
        const spikeLen = r * (3 + flash * 6) * sc;
        const spikeW = r * (0.2 + flash * 0.25) * sc;
        const sa = s.spikeAngle;
        const spikeAlpha = opacity * flash * 0.6;

        starCtx.save();
        starCtx.translate(s.x, s.y);
        starCtx.rotate(sa);
        starCtx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${spikeAlpha})`;

        for (let k = 0; k < 4; k++) {
          starCtx.beginPath();
          starCtx.moveTo(0, -spikeW);
          starCtx.lineTo(spikeLen, 0);
          starCtx.lineTo(0, spikeW);
          starCtx.lineTo(-spikeLen, 0);
          starCtx.closePath();
          starCtx.fill();
          starCtx.rotate(Math.PI / 4);
        }

        starCtx.restore();

        const glowR = r * (2.5 + flash * 4) * sc;
        const grd = starCtx.createRadialGradient(s.x, s.y, r, s.x, s.y, glowR);
        grd.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${flash * 0.15})`);
        grd.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
        dot(starCtx, s.x, s.y, glowR, grd);
      }
    });
    drawMeteors();
    starAnimId = requestAnimationFrame(drawStars);
  }

  // 流星（canvas，全屏）
  let meteors = [];

  function spawnMeteor() {
    const w = starCanvas.width;
    const h = starCanvas.height;
    const angle = 25 + Math.random() * 15;
    const rad = (angle * Math.PI) / 180;
    const len = 60 + Math.random() * 200;
    const speed = 6 + Math.random() * 10;
    const thickness = 0.4 + Math.random() * 1.2;

    const x = -len;
    const y = Math.random() * h * 0.9;

    const travelDist = w + len + 200;
    const maxLife = Math.ceil(travelDist / (Math.cos(rad) * speed));

    meteors.push({ x, y, rad, len, speed, thickness, life: 0, maxLife: maxLife });
  }

  function drawMeteors() {
    if (meteors.length < 5 && Math.random() < 0.025) spawnMeteor();

    meteors = meteors.filter((m) => m.life < m.maxLife);

    meteors.forEach((m) => {
      m.life++;
      m.x += Math.cos(m.rad) * m.speed;
      m.y -= Math.sin(m.rad) * m.speed;

      const fadeIn = Math.min(m.life / 6, 1);
      const fadeOut = Math.max(1 - (m.life - m.maxLife + 12) / 12, 0);
      const opacity = fadeIn * fadeOut;

      const tailX = m.x - Math.cos(m.rad) * m.len;
      const tailY = m.y + Math.sin(m.rad) * m.len;

      const grad = starCtx.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0, `rgba(255,255,255,0)`);
      grad.addColorStop(0.7, `rgba(255,255,255,${opacity * 0.4})`);
      grad.addColorStop(1, `rgba(255,255,255,${opacity * 0.9})`);

      starCtx.beginPath();
      starCtx.moveTo(tailX, tailY);
      starCtx.lineTo(m.x, m.y);
      starCtx.strokeStyle = grad;
      starCtx.lineWidth = m.thickness;
      starCtx.lineCap = "round";
      starCtx.stroke();
    });
  }

  resizeStarfield();
  createStars();
  drawStars();

  window.addEventListener("resize", () => {
    resizeStarfield();
    createStars();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(starAnimId);
    } else {
      drawStars();
    }
  });
}
