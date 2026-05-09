(() => {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'light' || storedTheme === 'dark') {
    document.documentElement.dataset.theme = storedTheme;
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const currentPage = document.body.dataset.page;
  if (currentPage) {
    document.querySelectorAll('.site-nav a').forEach((link) => {
      if (link.dataset.nav === currentPage) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  const themeToggle = document.querySelector('.theme-toggle');
  const setThemeButtonText = () => {
    if (!themeToggle) return;
    const explicitTheme = document.documentElement.dataset.theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeTheme = explicitTheme || (prefersDark ? 'dark' : 'light');
    themeToggle.textContent = activeTheme === 'dark' ? 'Light mode' : 'Dark mode';
    themeToggle.setAttribute('aria-label', `Switch to ${activeTheme === 'dark' ? 'light' : 'dark'} mode`);
  };

  if (themeToggle) {
    setThemeButtonText();
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('theme', next);
      setThemeButtonText();
    });
  }

  // GitHub Pages is static and has no backend spam filtering. Email addresses are split into data attributes
  // and revealed with JavaScript to reduce basic scraping. For stronger protection later, use an external
  // form provider such as Tally, Formspree, Google Forms, or a similar service.
  document.querySelectorAll('[data-email-user][data-email-domain]').forEach((element) => {
    const email = `${element.dataset.emailUser}@${element.dataset.emailDomain}`;
    const label = element.dataset.emailLabel || email;

    if (element.tagName.toLowerCase() === 'a') {
      element.setAttribute('href', `mailto:${email}`);
      element.textContent = label;
    } else {
      element.textContent = email;
    }
  });
});
