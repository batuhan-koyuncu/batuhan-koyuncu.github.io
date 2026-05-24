(() => {
  try {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', storedTheme);
    }
  } catch (error) {
    // If localStorage is blocked, the site still follows the system color scheme.
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  const currentPage = document.body.dataset.page;

  if (nav && currentPage === 'lesson-model' && !nav.querySelector('[data-nav="lesson-model"]')) {
    const tutoringLink = nav.querySelector('[data-nav="private-courses"]') || nav.querySelector('a[href="private-courses.html"]');
    const lessonLink = document.createElement('a');
    lessonLink.href = 'lesson-model.html';
    lessonLink.dataset.nav = 'lesson-model';
    lessonLink.textContent = 'Lesson Model';

    if (tutoringLink) {
      tutoringLink.insertAdjacentElement('afterend', lessonLink);
    } else {
      nav.appendChild(lessonLink);
    }
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  if (currentPage) {
    document.querySelectorAll('.site-nav a').forEach((link) => {
      if (link.dataset.nav === currentPage) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  const themeToggle = document.querySelector('.theme-toggle');
  const prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const getActiveTheme = () => {
    const explicitTheme = document.documentElement.getAttribute('data-theme');
    if (explicitTheme === 'light' || explicitTheme === 'dark') return explicitTheme;
    return prefersDarkQuery.matches ? 'dark' : 'light';
  };

  const setThemeButtonText = () => {
    if (!themeToggle) return;
    const activeTheme = getActiveTheme();
    themeToggle.textContent = activeTheme === 'dark' ? 'Light mode' : 'Dark mode';
    themeToggle.setAttribute('aria-label', `Switch to ${activeTheme === 'dark' ? 'light' : 'dark'} mode`);
  };

  if (themeToggle) {
    setThemeButtonText();
    themeToggle.addEventListener('click', () => {
      const next = getActiveTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (error) {
        // Theme still changes for the current page even if storage is blocked.
      }
      setThemeButtonText();
    });

    prefersDarkQuery.addEventListener?.('change', () => {
      if (!document.documentElement.getAttribute('data-theme')) {
        setThemeButtonText();
      }
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
