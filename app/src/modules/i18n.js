// i18n（保留，未激活）：EN 字典存在，仅暴露 window.setLang，无可见切换按钮（与原站一致）。
const I18N = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.focus": "Focus",
    "nav.works": "Works",
    "nav.contact": "Contact",

    "hero.title": "Reshape the world with AI",
    "hero.tag1": "Tech & Product",
    "hero.tag2": "Content Creator",
    "hero.tag3": "AI Entrepreneur",

    "about.title": "About Me",
    "about.t1": "Developer",
    "about.t2": "Content Creator",
    "about.t3": "Product",
    "about.t4": "Startup",
    "about.s1": "Years in Tech",
    "about.s2": "Followers",

    "grid.title": "What I Do",
    "grid.card1.title": "Content Creation",
    "grid.card1.desc":
      "Sharing insights on AI technology, product thinking, and business trends as a tech content creator",
    "grid.card2.title": "Community",
    "grid.card2.desc":
      "Running a premium community with in-depth AI tutorials, curated tools and product reviews",
    "grid.card3.title": "Tech & Product",
    "grid.card3.desc":
      "Exploring new possibilities in AI with years of experience in tech and product development",
    "grid.card4.title": "Open Source",
    "grid.card4.desc": "Building and sharing useful AI tools with the open source community",
    "grid.card5.title": "AI Entrepreneur",
    "grid.card5.desc": "Beyond open source, exploring AI-powered commercial products",
    "grid.card6.title": "Future",
    "grid.card6.desc": "Who knows? Keep exploring, keep building",

    "works.title": "Works & Tools",
    "works.item1.title": "Token Tracker",
    "works.item1.desc":
      "Say goodbye to token anxiety — persistent status bar for Claude Code & Codex, tracking 5h / daily / weekly / monthly token usage in detail",
    "works.item2.title": "AI Daily News",
    "works.item2.desc":
      "5 minutes a day — stay on top of the latest global AI news, with AI-powered Chinese summaries",
    "works.item3.title": "AI CLI Translate",
    "works.item3.desc":
      "A lightweight, free CLI translation tool for immersive AI workflows — minimal setup, a must-have for terminal developers",
    "works.item4.title": "IP Check",
    "works.item4.desc":
      "Network diagnostic tool for AI developers — detects IPv6 leaks, DNS leaks, proxy IP risk scores to keep AI tools running and avoid Claude bans",
    "works.item5.title": "AI Video",
    "works.item5.desc":
      "AI-defined video templates, code-driven product promos with blazing-fast rendering",

    "contact.title": "Find Me Here",
    "contact.wechat": "WeChat",
    "contact.wechat.qr": "Scan to follow",
    "contact.zsxq": "Community",
    "contact.zsxq.qr": "Scan to join",
  },
};

function setLang(lang) {
  if (!I18N[lang]) return;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (I18N[lang][key]) {
      if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = I18N[lang][key];
      } else {
        el.textContent = I18N[lang][key];
      }
    }
  });
}

export function initI18n() {
  // TODO: 全球化时启用自动语言检测
  // const userLang = (navigator.language || '').slice(0, 2);
  // if (userLang === 'en') setLang('en');
  window.setLang = setLang;
}
