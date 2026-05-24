(() => {
  try {
    const theme = localStorage.getItem("theme");
    if (theme === "light" || theme === "dark") document.documentElement.setAttribute("data-theme", theme);
  } catch {}
})();

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".site-nav");
  const langSwitcher = document.querySelector(".language-switcher");
  const navToggle = document.querySelector(".nav-toggle");
  const page = document.body.dataset.page || pageFromFilename();
  const lang = document.documentElement.lang === "de" || location.pathname.includes("/de/") ? "de"
    : document.documentElement.lang === "tr" || location.pathname.includes("/tr/") ? "tr"
    : "en";

  const items = {
    en: [["home","Home","index.html"],["private-courses","Tutoring","private-courses.html"],["lesson-model","Lesson Model","lesson-model.html"],["articles","Articles","articles.html"],["student-area","Student Area","student-area.html"],["about","About","about.html"],["contact","Contact","contact.html"]],
    de: [["home","Start","index.html"],["private-courses","Nachhilfe","nachhilfe.html"],["lesson-model","Unterrichtsmodell","unterrichtsmodell.html"],["articles","Artikel","artikel.html"],["student-area","Studentenbereich","studentenbereich.html"],["about","Über mich","ueber-mich.html"],["contact","Kontakt","kontakt.html"]],
    tr: [["home","Ana Sayfa","index.html"],["private-courses","Özel Ders","ozel-ders.html"],["lesson-model","Ders Modeli","ders-modeli.html"],["articles","Yazılar","yazilar.html"],["student-area","Öğrenci Alanı","ogrenci-alani.html"],["about","Hakkımda","hakkimda.html"],["contact","İletişim","iletisim.html"]],
  };

  const targets = {
    home: ["index.html","de/index.html","tr/index.html"],
    "private-courses": ["private-courses.html","de/nachhilfe.html","tr/ozel-ders.html"],
    "lesson-model": ["lesson-model.html","de/unterrichtsmodell.html","tr/ders-modeli.html"],
    articles: ["articles.html","de/artikel.html","tr/yazilar.html"],
    "student-area": ["student-area.html","de/studentenbereich.html","tr/ogrenci-alani.html"],
    about: ["about.html","de/ueber-mich.html","tr/hakkimda.html"],
    contact: ["contact.html","de/kontakt.html","tr/iletisim.html"],
  };

  function pageFromFilename() {
    const file = location.pathname.split("/").pop() || "index.html";
    const aliases = {
      "index.html": "home", "private-courses.html": "private-courses", "nachhilfe.html": "private-courses", "ozel-ders.html": "private-courses",
      "lesson-model.html": "lesson-model", "unterrichtsmodell.html": "lesson-model", "ders-modeli.html": "lesson-model",
      "articles.html": "articles", "artikel.html": "articles", "yazilar.html": "articles",
      "student-area.html": "student-area", "studentenbereich.html": "student-area", "ogrenci-alani.html": "student-area",
      "about.html": "about", "ueber-mich.html": "about", "hakkimda.html": "about",
      "contact.html": "contact", "kontakt.html": "contact", "iletisim.html": "contact",
    };
    return aliases[file] || "home";
  }

  function localHref(path) {
    if (lang === "en") return path;
    if (path.startsWith(`${lang}/`)) return path.slice(3);
    return `../${path}`;
  }

  if (nav) {
    nav.innerHTML = items[lang].map(([key,label,href]) =>
      `<a href="${href}" data-nav="${key}"${key === page ? ' aria-current="page"' : ""}>${label}</a>`
    ).join("");
  }

  if (langSwitcher) {
    const t = targets[page] || targets.home;
    langSwitcher.innerHTML = [["EN",t[0],"en"],["DE",t[1],"de"],["TR",t[2],"tr"]].map(([label,path,code]) =>
      `<a href="${localHref(path)}" hreflang="${code}"${code === lang ? ' aria-current="true"' : ""}>${label}</a>`
    ).join("");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  const themeToggle = document.querySelector(".theme-toggle");
  const media = matchMedia("(prefers-color-scheme: dark)");
  const activeTheme = () => document.documentElement.getAttribute("data-theme") || (media.matches ? "dark" : "light");
  const setThemeText = () => {
    if (!themeToggle) return;
    const dark = activeTheme() === "dark";
    themeToggle.textContent = dark ? "Light mode" : "Dark mode";
    themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  };
  setThemeText();
  themeToggle?.addEventListener("click", () => {
    const next = activeTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch {}
    setThemeText();
  });

  document.querySelectorAll("[data-email-user][data-email-domain]").forEach((el) => {
    const email = `${el.dataset.emailUser}@${el.dataset.emailDomain}`;
    const label = el.dataset.emailLabel || email;
    if (el.tagName.toLowerCase() === "a") el.href = `mailto:${email}`;
    el.textContent = label;
  });
});
