# Koyuncu Academy Launch Readiness Audit

This document tracks the remaining work before treating the first version of `koyuncuacademy.com` as launch-ready.

## Current production setup

- Domain: `koyuncuacademy.com`
- Registrar: Porkbun
- DNS provider: Cloudflare
- Hosting: Cloudflare Pages
- Repository: `batuhan-koyuncu/batuhan-koyuncu.github.io`
- Public contact email: `contact@koyuncuacademy.com`
- Core brand: Koyuncu Academy
- Tutor identity: Batuhan Koyuncu

## Current service scope

### English side

Focus:

- University tutoring
- Exam preparation
- Academic support
- Study notes and learning resources

The English side should not actively sell Germany-study consulting.

### German side

Focus:

- Nachhilfe
- Universitätsnachhilfe
- Prüfungsvorbereitung
- Akademische Unterstützung

The German side should not actively sell Studieren-in-Deutschland consulting.

### Turkish side

Focus:

- Özel ders
- Sınav hazırlığı
- Almanya’da eğitim danışmanlığı
- Almanya’da öğrenci yaşamı / akademik hazırlık yazıları

Germany-study consulting is active only on the Turkish side.

## Pre-launch checks

### Domain and deployment

- [ ] `https://koyuncuacademy.com` loads the website.
- [ ] `https://www.koyuncuacademy.com` works or redirects cleanly.
- [ ] `https://batuhan-koyuncu-github-io.pages.dev` still loads the Cloudflare Pages deployment.
- [ ] Cloudflare Pages latest deployment is green.
- [ ] DNS records for `@` and `www` point to the Cloudflare Pages project.
- [ ] No Porkbun parking, forwarding, `pixie`, or old GitHub Pages DNS records remain.

### Email

- [ ] `contact@koyuncuacademy.com` forwards to Gmail.
- [ ] A test message from a different email account arrives successfully.
- [ ] Contact buttons on EN/DE/TR contact pages open the correct email address.
- [ ] Gmail filters or labels are configured for Koyuncu Academy inquiries.

### Legal placeholders

- [ ] `impressum.html` exists.
- [ ] `datenschutz.html` exists.
- [ ] Footer links to Impressum and Datenschutz/Privacy exist on core pages.
- [ ] Placeholder provider details are replaced before commercial launch.
- [ ] Datenschutzerklärung is completed before using analytics, forms, payments, booking tools, student accounts, newsletter tools, or embedded third-party content.

### SEO and indexing

- [ ] `robots.txt` points to `https://koyuncuacademy.com/sitemap.xml`.
- [ ] `sitemap.xml` uses `https://koyuncuacademy.com` URLs.
- [ ] Canonical URLs use `https://koyuncuacademy.com`.
- [ ] Old `batuhan-koyuncu.github.io` URLs are removed from page metadata.
- [ ] EN/DE transition pages for Germany-study consulting are marked `noindex`.
- [ ] No hidden keyword stuffing is used.
- [ ] Page titles are readable and subject-specific.
- [ ] Meta descriptions are written for humans, not just search engines.

### Content consistency

- [ ] Header brand says `Koyuncu Academy` on all public-facing pages.
- [ ] Footer uses `Koyuncu Academy / Batuhan Koyuncu` where appropriate.
- [ ] English pages focus on tutoring, exam preparation and academic resources.
- [ ] German pages focus on Nachhilfe, Prüfungsvorbereitung and academic support.
- [ ] Turkish pages keep Almanya’da Eğitim danışmanlığı active.
- [ ] Contact pages use `contact@koyuncuacademy.com`.
- [ ] Old text such as “contact email coming soon” is removed from active contact/tutoring pages.

### UX checks

- [ ] Navigation works on desktop.
- [ ] Navigation works on mobile.
- [ ] Language switchers point to the correct EN/DE/TR equivalents.
- [ ] Theme toggle still works.
- [ ] Profile image fallback works if `assets/img/profile.jpg` is missing.
- [ ] Email buttons open mail client correctly.
- [ ] No core page has a dead CTA.

## Recommended next content improvements

### Highest priority

1. Replace the legal placeholders with real business/provider details.
2. Add a real profile photo at `assets/img/profile.jpg`.
3. Add a concise pricing or lesson-model section, even if prices are not public yet.
4. Add a first FAQ section for tutoring and exam preparation.
5. Add a first Turkish FAQ section for Almanya’da Eğitim danışmanlığı.

### Medium priority

1. Add one real article or teaching sample to make the articles/resources pages less placeholder-like.
2. Add testimonials only when real and permission-based.
3. Add a booking process after deciding whether to use email, Calendly, TidyCal, Google Calendar appointment schedules, or a custom form.
4. Add privacy-friendly analytics only after updating the Datenschutzerklärung.

### Later platform features

1. Protected student area with real authentication.
2. Course library.
3. Payment links or invoicing workflow.
4. Newsletter.
5. CMS/blog workflow.
6. Admin dashboard.

## Do not do yet

- Do not add fake password protection for student materials.
- Do not store private PDFs in the public repository.
- Do not add payment processing before legal/privacy pages are ready.
- Do not add tracking/analytics before the privacy policy is updated.
- Do not promise admission, visa success, scholarships, or official legal outcomes for Germany-study consulting.
