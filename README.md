# roji-stack.github.io

Personal engineering portfolio: project write-ups first, everything else second.
Static site built with [Astro](https://astro.build), hosted on GitHub Pages, edited through
[Sveltia CMS](https://sveltiacms.app) at `/admin`.

- No database, no backend, no paid services.
- Content pages ship **zero JavaScript**. The only script on the site is the CMS at `/admin`.
- Every save in the CMS is a Git commit to `main`, which triggers a rebuild and deploy (about 1–2 minutes).

---

## Contents

1. [Local development](#1-local-development)
2. [Deploying](#2-deploying)
3. [Set up the GitHub login for /admin](#3-set-up-the-github-login-for-admin)
4. [Adding or editing a project](#4-adding-or-editing-a-project)
5. [Changing the accent color or fonts](#5-changing-the-accent-color-or-fonts)
6. [Where things live](#6-where-things-live)
7. [Maintenance](#7-maintenance)

---

## 1. Local development

Requires **Node 24** (`node -v`; Astro 7 needs ≥ 22.23.4, and CI uses the version in `.nvmrc`). Use npm 11+, which ships with Node 24: older npm rejects the lockfile.

```sh
npm install
npm run dev        # http://localhost:4321 (Astro 7 runs it in the background; `npx astro dev stop` stops it)
npm run build      # production build into dist/
npm run preview    # serve dist/ locally
```

- Projects marked **Draft** show up in `npm run dev` with a "(draft)" label but are never included in the build.
- The CMS works locally too: open <http://localhost:4321/admin>, choose **Work with Local Repository**
  (Chrome/Edge only), and pick this folder. Edits are written straight to your files, with no commit,
  so you review and commit them yourself.

## 2. Deploying

The site deploys automatically with `.github/workflows/deploy.yml` on every push to `main`.

One-time check (already set on this repo): **GitHub → repo → Settings → Pages → Build and deployment →
Source = "GitHub Actions"**.

Using a custom domain later:
1. Add the domain under Settings → Pages → Custom domain.
2. Change `site` in `astro.config.mjs`, the `Sitemap:` line in `public/robots.txt`, and
   `site_url`/`display_url` in `public/admin/config.yml`.
3. Add the new domain to the Worker's `ALLOWED_DOMAINS` (step 3c below).

## 3. Set up the GitHub login for /admin

**Background (checked Nov 2026):** Netlify Identity / Git Gateway are deprecated and not supported by
Sveltia CMS. GitHub doesn't allow a purely client-side OAuth flow, so a tiny server has to hold the
client secret. The free option recommended by Sveltia is the **Sveltia CMS Authenticator**, a
Cloudflare Worker (Workers free plan: 100k requests/day, far more than you need), paired with a
**GitHub App**.

> **You can use the CMS before doing any of this.** On the login screen choose **Sign In Using Access Token**
> and paste a [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new)
> limited to this repository with **Contents: Read and write** and **Pull requests: Read and write**.
> The token is stored in that browser only. The steps below give you a proper "Sign in with GitHub" button.

### 3a. Deploy the Worker (≈5 min)

1. Create a free Cloudflare account at <https://dash.cloudflare.com/sign-up> if you don't have one.
2. Go to <https://github.com/sveltia/sveltia-cms-auth> and click **Deploy to Cloudflare Workers**.
   Follow the prompts (it forks the repo into your GitHub account and deploys it).
3. When it finishes, copy the Worker URL. It looks like
   `https://sveltia-cms-auth.<your-subdomain>.workers.dev`.

### 3b. Register a GitHub App

1. On the sveltia-cms-auth README, use the **"Register new GitHub App"** link (it pre-fills the
   permissions), or go to GitHub → Settings → Developer settings → GitHub Apps → **New GitHub App**.
2. Fill in:
   - **GitHub App name:** anything unique, e.g. `roji-stack-cms`
   - **Homepage URL:** `https://roji-stack.github.io`
   - Under **Identifying and authorizing users → Redirect URI** (GitHub's name for the callback URL):
     `<your Worker URL>/callback`, e.g. `https://sveltia-cms-auth.<your-subdomain>.workers.dev/callback`.
     If the box only shows grey "e.g. https://example.com/auth" text, it's empty.
   - Leave **Allow wildcard matching**, **Request user authorization (OAuth) during installation** and
     **Enable Device Flow** unchecked.
   - **Webhook:** uncheck **Active** (otherwise GitHub requires a webhook URL and won't save)
   - **Repository permissions:** Contents → *Read and write*, Pull requests → *Read and write*,
     Metadata → *Read-only* (automatic). Leave everything else as "No access".
   - **Where can this app be installed?** Only on this account.
3. Click **Create GitHub App**. On the next page:
   - Copy the **Client ID**.
   - Click **Generate a new client secret** and copy it now (it's only shown once).
4. In the left sidebar click **Install App** → install it on your account → **Only select repositories**
   → choose `roji-stack.github.io`.

### 3c. Give the Worker the credentials

Cloudflare dashboard → **Workers & Pages** → `sveltia-cms-auth` → **Settings** → **Variables and Secrets**
→ add:

| Name | Value | Type |
|---|---|---|
| `GITHUB_CLIENT_ID` | Client ID from 3b (starts with `Iv`) | **Secret** |
| `GITHUB_CLIENT_SECRET` | Client secret from 3b | **Secret** |
| `ALLOWED_DOMAINS` | `roji-stack.github.io, localhost` | **Secret** |

Set all three as **Secret**. The Worker redeploys from its Git repo with `wrangler deploy`, which deletes
plain-text dashboard variables that aren't in `wrangler.toml`; secrets are kept. Click **Deploy** after
adding them.

Check it worked: the variables table should list all three names with type *Secret*. (If it still says
"Configure API tokens and other runtime variables", the panel was closed without clicking **Deploy**.)
Opening the Worker URL directly in a browser always shows a blank page. That's normal: it only talks to
the CMS login popup. To test from a terminal:

```sh
curl -s "https://sveltia-cms-auth.<your-subdomain>.workers.dev/auth?provider=github&site_id=roji-stack.github.io" | grep -o 'not configured' \
  && echo "secrets missing" || echo "secrets OK"
```

### 3d. Point the CMS at the Worker

In `public/admin/config.yml`, uncomment `base_url` and set your Worker URL:

```yaml
backend:
  name: github
  repo: roji-stack/roji-stack.github.io
  branch: main
  base_url: https://sveltia-cms-auth.<your-subdomain>.workers.dev
```

Commit and push. After the deploy finishes, open <https://roji-stack.github.io/admin> →
**Sign In with GitHub** → authorize the app. Done.

Only GitHub accounts with write access to this repo can save anything. Everyone else gets an error,
since the CMS writes through *your* GitHub permissions.

## 4. Adding or editing a project

1. Go to <https://roji-stack.github.io/admin> and sign in.
2. **Projects → New Project.** Fill in the form:
   - **Title, Start date, One-line summary** are required. Everything else is optional.
   - **End date / Ongoing:** leave the end date empty for a single date; tick *Ongoing* for "– present".
   - **Cover image:** a real photo of the build or a screenshot. It's also the preview image when the
     link is shared. Fill in **Cover alt text** too (the build fails without it, on purpose).
   - **Featured:** shows the project in the "Featured" block on the home page.
   - **Draft:** saves the project without publishing it.
   - **Sections** (Overview → What I'd do differently): any can be left empty and won't be shown.
3. Click **Save**. That commits to `main`; the site rebuilds and is live in ~1–2 minutes
   (watch progress under the repo's **Actions** tab).
4. To delete a project, open it and use **Delete** in the editor's menu.

The page URL comes from the title when the project is first created (`/projects/smart-knee-brace/`).

### Writing in the section fields

The editors default to plain Markdown (switch to rich text with the toggle if you prefer). Markdown is
the safer mode for math and tables.

| You want | Write |
|---|---|
| Image with caption | `![What the image shows](/src/assets/media/photo.jpg "Caption text")`: use the editor's image button to upload, then add the caption in quotes |
| Video | Upload an `.mp4` (keep it under ~5 MB; a screen recording converted with `ffmpeg -i in.mov -vf scale=1000:-2 -crf 26 -an out.mp4` is plenty), then write it like an image: `![What happens in the clip](/src/assets/media/clip.mp4 "Caption")`. Optional: upload a still named `clip-poster.jpg` and it's shown before playback. Videos never autoplay |
| Embedded PDF | Upload the PDF, then put a link to it **alone on its own line**: `[Design report](/src/assets/media/report.pdf)` |
| CAD screenshot | Same as an image. Transparent PNGs get a white backing so they read in dark mode |
| Inline math | `$\omega_n = \sqrt{k/m}$` |
| Display math | `$$` on its own line, the equation, `$$` on its own line |
| Code | Three backticks plus the language: <code>```cpp</code> … <code>```</code> |
| Table | `\| Metric \| Result \|` / `\|---\|---\|` / `\| Mass \| 850 g \|` |
| Subheading inside a section | `### Heading` |
| Dollar amounts | Write `\$225` in a sentence. Two plain `$` signs in one paragraph are read as a math formula. (A single `$` per table cell is fine.) |
| Mark something unfinished | Start a paragraph with `TODO` and it gets a dashed orange box |

Images are resized and converted to WebP at build time (and large photos are also shrunk to 2400 px
in the browser when you upload them, which strips EXIF/GPS data). Animated GIFs are served as-is, so
keep them short.

### Editing the home page intro, About page and skills

**/admin → Site settings → Home page & About page.** This edits `src/data/site.json`:
intro text, what you're looking for, contact links, education, coursework, experience, skills, and
the resume file.

To replace the resume, either upload a new PDF in that form or overwrite `public/resume.pdf`.

## 5. Changing the accent color or fonts

Everything visual is controlled by CSS variables in **`src/styles/tokens.css`**:

```css
:root {
  --accent: #1f4e8c;   /* link color: the only accent on the site */
  --font-body: 'Source Serif 4', Georgia, serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
  ...
}
@media (prefers-color-scheme: dark) {
  :root { --accent: #8fb4e8; ... }   /* dark-mode accent; keep it light enough to read */
}
```

Accent ideas that pass WCAG AA on the off-white background: oxblood `#7a1f1f`, forest green `#1f5a3a`,
the current drawing blue `#1f4e8c`. Check contrast at <https://webaim.org/resources/contrastchecker/>
(aim for ≥ 4.5:1 against `--bg`).

**Changing font families:** fonts are self-hosted with Fontsource, so there are no Google requests.
1. `npm install @fontsource/<font-name>` (browse at <https://fontsource.org>).
2. Swap the `@fontsource/...` imports at the top of `src/layouts/Base.astro`.
3. Update `--font-body` / `--font-mono` in `tokens.css`.

Example, IBM Plex Sans for body text: `npm install @fontsource/ibm-plex-sans`, import
`@fontsource/ibm-plex-sans/400.css` and `/600.css`, set `--font-body: 'IBM Plex Sans', system-ui, sans-serif;`.

## 6. Where things live

```
public/
  admin/index.html, config.yml   CMS (config fields mirror the content schema)
  resume.pdf  favicon.svg  apple-touch-icon.png  robots.txt
src/
  content.config.ts              Project schema (source of truth)
  content/projects/*.md          One file per project (what the CMS edits)
  assets/media/                  All uploaded images/PDFs
  data/site.json                 Intro, About page, contact links (CMS: Site settings)
  lib/markdown.ts                Markdown → HTML: math, code, figures, PDF embeds, TODO boxes
  lib/media.ts                   Image resizing / file lookup for src/assets/media
  layouts/Base.astro             <head>, SEO/Open Graph tags, header, fonts
  pages/                         index, about, projects/[slug], 404
  styles/tokens.css              Colors, fonts, sizes  ← change the look here
```

SEO: each page sets its own `<title>` and meta description (projects use their summary), project pages
use the cover image as the Open Graph image, and `sitemap-index.xml` is generated at build time.

**Adding a field to projects:** add it to the schema in `src/content.config.ts` *and* to the
`projects` fields in `public/admin/config.yml`, then use it in `src/pages/projects/[slug].astro`.

## 7. Maintenance

- **Updating the CMS:** `public/admin/index.html` pins an exact Sveltia CMS version. To update, change the
  version number in the script URL (latest: `npm view @sveltia/cms version`), run `npm run dev`, and
  check that `/admin` still loads.
- **Dependencies:** Dependabot opens weekly PRs. `npm audit` should report 0 vulnerabilities.
  `package.json` has an `overrides` entry forcing the patched KaTeX version for `rehype-katex`/`remark-math`.
- **If the deploy fails with `Missing: … from lock file`:** the lockfile was written on macOS without
  some Linux-only entries. Check and fix it locally:
  ```sh
  npx npm@latest ci --dry-run --ignore-scripts --os=linux --cpu=x64 --libc=glibc   # reproduces the CI error
  rm package-lock.json && npx npm@latest install --package-lock-only               # regenerate, then commit it
  ```
- **Never commit** transcripts or other private documents. `.gitignore` excludes `*transcript*.pdf`.
