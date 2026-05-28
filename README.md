# Portfolio — Fatima Mariana Ramirez Rodriguez

Mechatronics engineering portfolio. Static HTML/CSS site with bilingual support (EN/ES).

## Structure

```
portfolio/
├── index.html              # Home (dark theme)
├── auger.html              # Auger printhead case study (light theme)
├── css/
│   ├── base.css            # Design tokens, fonts, nav, shared styles
│   ├── home.css            # Home-specific styles
│   └── project.css         # Project page styles
├── js/
│   └── i18n.js             # Language toggle logic
├── i18n/
│   ├── en.json             # English translations
│   └── es.json             # Spanish translations
└── assets/
    ├── images/             # (TODO) project photos, videos
    ├── fonts/              # (optional) self-hosted fonts
    └── icons/              # (optional) favicons, social icons
```

## How to run locally

The site needs a local server because `fetch()` won't work from `file://` URLs.

### Option 1 — Python (built-in on Mac/Linux)
```bash
cd portfolio
python3 -m http.server 8000
```
Then open http://localhost:8000

### Option 2 — VS Code Live Server
Install the "Live Server" extension, right-click `index.html`, choose "Open with Live Server".

### Option 3 — Node.js
```bash
npx http-server -p 8000
```

## How to edit content

All text is in the JSON files under `/i18n/`. To change anything:

1. Open `i18n/en.json` and find the key you want to change
2. Edit the value
3. Open `i18n/es.json` and edit the matching key
4. Save both. The site picks up changes on next reload.

Example — to change the Home tagline:
```json
// in i18n/en.json
"home": {
  "tagline": "your new English tagline here"
}

// in i18n/es.json
"home": {
  "tagline": "tu nueva tagline en español aquí"
}
```

## How to add a new project page

1. Copy `auger.html` and rename to your project (e.g. `edapi.html`)
2. Add a new section to both `i18n/en.json` and `i18n/es.json` (e.g. `"edapi": {...}`)
3. Update the `data-i18n` attributes in your new HTML to point to the new section
4. Link to it from `index.html` — update the project card `href`

## Adding real images

Drop your images into `assets/images/`. Then in the HTML, replace the placeholder divs with `<img>` tags pointing to your files. Or modify the CSS to set `background-image` on the placeholder containers.

## Deployment

This site is hosted on Cloudflare Pages, connected to a GitHub repo. To deploy changes:

1. Commit your changes locally: `git add . && git commit -m "describe changes"`
2. Push to GitHub: `git push`
3. Cloudflare Pages auto-builds and deploys within ~1 minute

Domain: fatimamarianar.com
