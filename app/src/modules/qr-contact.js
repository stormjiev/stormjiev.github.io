// 联系区二维码点击展开（仅移动端）：点击微信/知识星球切换二维码，点击别处收起
export function initQrContact(isDesktop) {
  if (isDesktop) return;
  const qrTriggers = document.querySelectorAll(
    ".contact-wechat-trigger, .contact-zsxq-trigger"
  );
  qrTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasOpen = trigger.classList.contains("qr-open");
      qrTriggers.forEach((t) => t.classList.remove("qr-open"));
      if (!wasOpen) trigger.classList.add("qr-open");
    });
  });
  document.addEventListener("click", () => {
    qrTriggers.forEach((t) => t.classList.remove("qr-open"));
  });
}
