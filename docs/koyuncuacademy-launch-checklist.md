# Koyuncu Academy Launch Checklist

Production domain: https://koyuncuacademy.com

Recommended deployment route:

1. Porkbun remains the registrar.
2. Cloudflare manages DNS.
3. Cloudflare Pages deploys the static website from GitHub.
4. The primary public domain should be https://koyuncuacademy.com.
5. The www version should redirect to the apex domain.

## Domain status

- Nameservers have been changed at Porkbun.
- Cloudflare shows the domain as protected.
- Next step: create a Cloudflare Pages project connected to this GitHub repository.

## Cloudflare Pages setup

- Connect repository: batuhan-koyuncu/batuhan-koyuncu.github.io
- Production branch: main
- Framework preset: None / Static site
- Build command: leave empty
- Build output directory: leave empty or use repository root, depending on Cloudflare UI

## Custom domains

Add both domains in Cloudflare Pages:

- koyuncuacademy.com
- www.koyuncuacademy.com

Recommended canonical domain:

- https://koyuncuacademy.com

Redirect www to the apex domain.

## Repository tasks before public launch

- Update canonical URLs from the GitHub Pages URL to https://koyuncuacademy.com.
- Update Open Graph URLs.
- Update sitemap.xml.
- Add or verify robots.txt.
- Review Impressum and Datenschutzerklaerung before using the site commercially in Germany.
- Keep private teaching materials outside the public GitHub repository.
