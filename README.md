# Corepoint Healthcare website

Multi-page website for **Corepoint Healthcare**, Ahmedabad: the four Aura dental chairs, dental equipment, services, gallery and enquiries.

**Stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4, React Router 7, three.js with React Three Fiber and Drei, Framer Motion and Lucide icons. Frontend only: there is no Next.js and no server code.

## Run it locally

You need Node.js 20.19 or newer (GitHub Actions builds with Node 24).

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173/corepoint/ (the same path as on GitHub Pages).

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Type-checks, then builds to `dist/` (including per-page HTML, `sitemap.xml` and `robots.txt`) |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript only |

## Pages

| URL | Page |
| --- | --- |
| `/` | Home: Aura-500 hero, the Aura range, installations, equipment, services, about |
| `/dental-chairs` | The four Aura chairs and the Aura colour chart |
| `/dental-chairs/:slug` | One page per chair. The Aura-500 page adds the product explorer (photo hotspots + 3D prototype), features and benefits |
| `/equipment` | Equipment by category |
| `/compare` | Up to three chairs side by side (shareable, e.g. `/compare?chairs=aura-500,aura-200`) |
| `/services` | Clinic set-up, chair repair, RVG sensor repair |
| `/gallery` | Every photo, filterable |
| `/about`, `/contact` | Company details; contact details and enquiry form |
| `/privacy`, `/terms` | Placeholders: replace before launch |

## Where content lives

All content is typed data. TypeScript reports anything you get wrong.

```
src/config/site.ts          Company name, phones, email, WhatsApp, addresses, GSTIN, domain
src/data/
  chairs.ts                 The four Aura chairs: Aura-500/400/300/200 (from the brochures)
  components.ts, viewer.ts  Aura-500 explorer: parts, photo hotspot positions, 3D camera presets
  features.ts, benefits.ts  Aura-500 feature stories and key benefits
  colours.ts                Aura upholstery colour chart CH1–CH14
  equipment.ts              Equipment and categories
  services.ts, company.ts   Services page and About page text
  gallery.ts                Gallery (built from the data above)
  enquiry.ts                Enquiry types and the product list in the form
  pages.ts                  Title, description and preview image for every page
  images.ts                 Photo helpers and installation photos
src/types/product.ts        The data model
```

Prices are deliberately not shown anywhere. Product pages have a "Request a quote" button that opens the contact form pre-filled (`/contact?type=quotation&product=<id>`); "Request a Demo" appears only in the header. The closing band on each page offers WhatsApp and phone.

## Photos

- `public/images/products/`: product photos from Corepoint Healthcare's IndiaMART listings, each in a 1000 px and a 500 px version. Their pixel sizes are recorded in `src/data/generated/productImages.json`. Use them in data with `productPhoto('<name>', 'alt text')`.
- `public/images/installations/` and `public/images/brochures/`: clinic photos and brochure pages supplied by Corepoint Healthcare, converted to WebP.

To add a new photo, convert it first:

```bash
node scripts/optimise-image.mjs path/to/photo.jpg public/images/installations/new-clinic --widths 1600,800
```

Then reference it with `localPhoto(...)` in `src/data/images.ts` (see `installationPhotos` for an example). Products without a photo show a labelled "Photo to follow" placeholder. Only use photos you have the right to publish.

## Adding a chair

Add a `Product` to `src/data/chairs.ts` (copy `aura400` as a starting point) and include it in `auraChairs`. It automatically gets its own page, a card on `/dental-chairs`, a Compare option, an entry in the enquiry form, a sitemap entry and preview HTML.

## The product explorer and 3D model

The Aura-500 explorer opens on the real product photo with numbered hotspots (`photo: { x, y }` in `src/data/viewer.ts`, as percentages of the photo). The **3D** view is a simplified prototype built from basic shapes and is always badged "not the actual product".

To use a real 3D model instead:

1. Create a `public/models/` folder and put a GLB (Draco or Meshopt compressed, ideally under 5 MB) in it, e.g. `public/models/aura-500.glb`.
2. In `src/data/viewer.ts`, replace `model: { kind: 'prototype' }` with `{ kind: 'gltf', url: '/models/aura-500.glb', meshMap: { headrest: ['Headrest'], … }, upholsteryMaterials: ['Upholstery'] }`, using the mesh and material names from the file.
3. Move each hotspot's 3D `position` and `focus` camera to match the model.

The prototype badge disappears automatically and the colour picker recolours the named upholstery materials.

## Connecting the enquiry form

Enquiries are emailed to corepointhealthcare@gmail.com through [Web3Forms](https://web3forms.com) (free up to 250 a month):

1. Go to https://web3forms.com, enter `corepointhealthcare@gmail.com` and create an access key. The key arrives by email.
2. Paste it into `src/config/site.ts`: `enquiry: { web3formsAccessKey: 'your-key' }`. The key is designed to be public, so it is fine in the code.
3. Rebuild and redeploy. Each enquiry then arrives as an email with the subject "Website enquiry: <type> – <product>"; pressing Reply answers the visitor directly.

The form reports success only when Web3Forms confirms the email was accepted. Until a key is set, or if sending fails, it says so honestly and offers one-tap buttons to send the same details by email, WhatsApp or phone. The sending code is in `src/services/enquiryService.ts`.

## Search and link previews

`npm run build` writes `dist/<page>/index.html` for every page in `src/data/pages.ts`, each with its own title, description, canonical URL and preview image. Links shared on WhatsApp, Facebook or LinkedIn therefore show the right product, and crawlers see the right title without running JavaScript. In the browser, `usePageMeta` keeps the same tags in step as visitors navigate. Product structured data (JSON-LD) is emitted for chairs marked `verified: true`; no prices are included.

## Hosting on GitHub Pages

The site is hosted at **https://rutul20.github.io/corepoint/** from the repository https://github.com/Rutul20/corepoint. Every push to `main` runs `.github/workflows/deploy.yml`, which installs dependencies, lints, type-checks, builds and publishes `dist/` to GitHub Pages. Follow progress in the repository's **Actions** tab; a deployment takes about two minutes.

**One-time setup:** in the repository, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.

**Day to day:**

```bash
git add -A
```

```bash
git commit -m "Describe the change"
```

```bash
git push
```

How it works on GitHub Pages, which has no URL rewrites:

- The site's address in `src/config/site.ts` (`url`) sets the path it is built for (`/corepoint/`). Data uses plain paths such as `/images/...`; `src/utils/asset.ts` adds the path at runtime.
- Every page is built as its own `index.html` (`dist/dental-chairs/aura-500/index.html` …), so direct links and refreshes work. Unknown addresses get `404.html`, which loads the site and shows its "page not found" page.

**Moving to your own domain later:** change `url` in `src/config/site.ts` to the domain (for example `https://www.corepointhealthcare.in`), add a `public/CNAME` file containing just the domain, set the custom domain in Settings → Pages, and add the DNS records GitHub lists there. Everything else, including the base path, follows from `url`.

## Before going live

- [x] Hosting: GitHub Pages, rebuilt on every push to `main`
- [ ] Optional: move to your own domain (see above)
- [ ] Replace the redrawn SVG logo (`src/components/layout/Logo.tsx`, `public/favicon.svg`) with the official logo file
- [ ] Write the privacy policy and terms (`src/pages/PrivacyPage.tsx`, `TermsPage.tsx`)
- [ ] Confirm dimensions, power, warranty and certifications for each Aura model (shown as "to be confirmed")
- [x] Add the Web3Forms access key and send one test enquiry (done: Web3Forms accepted the test)
- [ ] Optional: supply a real 3D model

## How it behaves

- **Performance:** about 165 kB of gzipped JavaScript on first load; each inner page loads its own small chunk; the 3D viewer (~275 kB gzipped) downloads in the background only when the explorer is near the screen.
- **Fallbacks:** without WebGL, or if the 3D view fails, the explorer stays on the product photo and says why.
- **Accessibility:** keyboard-operable hotspots, gallery, lightbox, menu and form; visible focus; labelled errors; reduced-motion support.
