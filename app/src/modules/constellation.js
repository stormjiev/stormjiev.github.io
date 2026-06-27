// 「我在做什么」星座区：流星沿路径扫过点亮 star-node 与连线，结束后核心闪烁。
// 移动端降级为依次淡入。
export function initConstellation(isDesktop) {
  const constellation = document.getElementById("constellation");
  if (!constellation) return;

  const starNodes = constellation.querySelectorAll(".star-node");
  const lines = constellation.querySelectorAll(".constellation-line");
  const meteor = document.getElementById("cMeteor");
  const cores = constellation.querySelectorAll(".star-core");

  lines.forEach((line) => {
    const len = line.getTotalLength() || 500;
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
  });

  const sweepPath = [
    { x: -10, y: 35 },
    { x: 50, y: 6, star: 0 },
    { x: 84, y: 27, star: 1, line: 0 },
    { x: 84, y: 73, star: 2, line: 1 },
    { x: 50, y: 94, star: 3, line: 2 },
    { x: 16, y: 73, star: 4, line: 3 },
    { x: 16, y: 27, star: 5, line: 4 },
    { x: 50, y: 6, line: 5 },
  ];

  function calcAngle(from, to, rect) {
    return (
      (Math.atan2((to.y - from.y) * rect.height, (to.x - from.x) * rect.width) * 180) /
      Math.PI
    );
  }

  function calcDuration(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return Math.max(800, Math.min(1500, Math.round(Math.sqrt(dx * dx + dy * dy) * 30)));
  }

  function startSweep() {
    const rect = constellation.getBoundingClientRect();
    const entryX = -(rect.left / rect.width) * 100;
    const entryY =
      8 + Math.tan((25 * Math.PI) / 180) * (50 - entryX) * (rect.width / rect.height);
    sweepPath[0] = { x: entryX, y: Math.min(entryY, 95) };

    meteor.style.left = sweepPath[0].x + "%";
    meteor.style.top = sweepPath[0].y + "%";
    meteor.style.transform = "rotate(" + calcAngle(sweepPath[0], sweepPath[1], rect) + "deg)";

    setTimeout(() => {
      meteor.classList.add("active");
      let step = 0;

      function flyToNext() {
        if (step >= sweepPath.length - 1) {
          setTimeout(() => meteor.classList.remove("active"), 300);
          lines.forEach((l) => {
            l.style.strokeDasharray = "";
            l.style.strokeDashoffset = "";
            l.classList.add("flowing");
          });
          startFlashing();
          return;
        }

        const from = sweepPath[step];
        const to = sweepPath[step + 1];
        const duration = calcDuration(from, to);

        meteor.style.transform = "rotate(" + calcAngle(from, to, rect) + "deg)";
        meteor.style.transition =
          "left " + duration + "ms ease-in-out, top " + duration + "ms ease-in-out";

        if (to.line !== undefined) {
          lines[to.line].style.transition =
            "stroke-dashoffset " + duration + "ms ease-in-out";
          lines[to.line].style.strokeDashoffset = "0";
        }

        meteor.style.left = to.x + "%";
        meteor.style.top = to.y + "%";

        setTimeout(() => {
          if (to.star !== undefined) {
            starNodes[to.star].classList.add("visible");
            setTimeout(() => {
              starNodes[to.star].classList.add("show-info");
              step++;
              setTimeout(flyToNext, 500);
            }, 300);
          } else {
            step++;
            setTimeout(flyToNext, 300);
          }
        }, duration);
      }

      flyToNext();
    }, 300);
  }

  function startFlashing() {
    cores.forEach((core) => {
      function flash() {
        const scale = 1 + Math.random() * 1.5;
        core.style.transform = "scale(" + scale + ")";
        core.classList.add("flash");
        setTimeout(() => {
          core.classList.remove("flash");
          core.style.transform = "";
        }, 400 + Math.random() * 500);
        setTimeout(flash, 600 + Math.random() * 3000);
      }
      setTimeout(flash, Math.random() * 2000);
    });
  }

  const cObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        cObserver.unobserve(constellation);
        if (!isDesktop) {
          starNodes.forEach((node, i) =>
            setTimeout(() => node.classList.add("visible"), i * 150)
          );
          return;
        }
        startSweep();
      });
    },
    { threshold: 0 }
  );
  cObserver.observe(constellation);
}
