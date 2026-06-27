// 时间线序列动画：进入视口后逐节点 + 流星点亮，结束后放出 stats / quote
export function initTimeline() {
  const timeline = document.getElementById("timeline");
  if (!timeline) return;

  const nodes = timeline.querySelectorAll(".timeline-node");
  const lines = timeline.querySelectorAll(".timeline-line");

  const tlObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tlObserver.unobserve(timeline);
          let step = 0;
          const totalSteps = nodes.length + lines.length;

          const statItems = document.querySelectorAll(".about-stats .reveal");
          const quote = document.querySelector(".about-quote");

          function nextStep() {
            if (step >= totalSteps) {
              const statDelay = 300;
              statItems.forEach((el, i) => {
                setTimeout(() => el.classList.add("visible"), statDelay + i * 200);
              });
              const quoteDelay = statDelay + statItems.length * 200 + 300;
              if (quote) setTimeout(() => quote.classList.add("visible"), quoteDelay);
              return;
            }
            const isNode = step % 2 === 0;
            const idx = Math.floor(step / 2);

            if (isNode) {
              nodes[idx].classList.add("show");
              setTimeout(nextStep, 500);
            } else {
              const line = lines[idx];
              line.classList.add("show");
              const meteor = line.querySelector(".timeline-meteor");
              if (meteor) meteor.classList.add("show");
              setTimeout(nextStep, 600);
            }
            step++;
          }
          nextStep();
        }
      });
    },
    { threshold: 0 }
  );
  tlObserver.observe(timeline);
}
