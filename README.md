# Rob-Links

> A Roblox-inspired game discovery and launcher website built with clean, modern, zero-dependency static web technologies.

Rob-Links presents a curated directory of browser games with high-contrast dark gaming aesthetics, responsive card grids, custom SVG artwork, live search, genre filtering, community ratings, and safe external navigation.

---

## Features

- **Roblox-Inspired Dark Gaming UI**: Premium dark aesthetics (`#111111` background, `#335fff` electric blue accents, subtle glow effects, and modern card styling).
- **Featured Games**: Hero showcase highlighting top introductory browser games.
- **Trending Games**: Highlighted section for viral and popular experiences.
- **Complete Game Directory**: Dynamic responsive CSS grid displaying the full games catalog.
- **Instant Search**: Real-time, case-insensitive search across game titles, categories, and descriptions.
- **Genre Filters**: One-click category pill filters (Horror, Shooter, Adventure, Racing, Survival, Puzzle, Sandbox, Sports, Arcade, etc.).
- **Sorting Options**: Sort by Featured First, Community Rating, Alphabetical (A–Z), and Recently Added.
- **Safe External Demo Navigation**: Validates all URLs to permit only verified HTTPS destinations using native browser navigation (`window.location.assign`).
- **Unconfigured Demo State**: Friendly Roblox-style notification modal prevents broken links when a demo URL is not configured yet.
- **100% Static & Lightweight**: Zero external dependencies, no build steps, no node_modules, and instant loading on mobile.
- **GitHub Pages Ready**: Fully relative asset paths compatible with GitHub repository subpaths (`https://username.github.io/rob-links/`).
- **Custom 404 Page**: Themed fallback page for invalid routes.

---

## Tech Stack

- **HTML5**: Semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, ARIA accessibility).
- **CSS3**: Custom properties (CSS variables), modern Flexbox & CSS Grid, fluid typography (`clamp`), responsive breakpoints, and reduced-motion support.
- **Vanilla JavaScript (ES6+)**: Centralized catalog architecture, array cloning for immutable sorting, secure URL parsing, and accessible modal control.
- **Vector Graphics (SVG)**: Custom-crafted, lightweight SVG thumbnails, logo, favicon, and hero illustration without heavy external raster images.

---

## Project Structure

```text
rob-links/
│
├── index.html                  # Main gaming discovery homepage
├── 404.html                    # Themed 404 error page
├── README.md                   # Documentation & deployment guide
├── .gitignore                  # Git ignore rules
│
└── assets/
    ├── css/
    │   └── style.css           # Complete responsive stylesheet
    │
    ├── js/
    │   └── app.js              # Central game catalog & application logic
    │
    └── images/
        ├── logo.svg            # Custom ROB-LINKS brand logo
        ├── favicon.svg         # Square browser tab icon
        ├── hero-illustration.svg # Futuristic gaming hero visual
        └── games/              # Original 16:9 vector thumbnails
            ├── placeholder.svg
            ├── blox-horror.svg
            ├── pixel-shooter.svg
            ├── zombie-survival.svg
            ├── doors.svg
            ├── home-alone.svg
            ├── untitled-rpg.svg
            ├── last-stop.svg
            ├── retro-racer.svg
            ├── puzzle-lab.svg
            ├── sandbox-world.svg
            ├── sports-arena.svg
            ├── arcade-rush.svg
            ├── racing.svg
            ├── adventure.svg
            ├── puzzle.svg
            ├── sandbox.svg
            ├── retro-platformer.svg
            ├── sports.svg
            ├── multiplayer.svg
            └── arcade.svg
```

---

## Local Usage

No build tools or package managers are required.

### Option 1: Direct Browser Launch
1. Clone or download this repository:
   ```bash
   git clone https://github.com/USERNAME/rob-links.git
   ```
2. Navigate into the folder:
   ```bash
   cd rob-links
   ```
3. Open `index.html` directly in any modern browser (double-click the file, or right-click -> Open With -> Chrome / Firefox / Edge).

### Option 2: Local Static Server (Recommended for testing)
You can use Python or Node's static servers:

- **Using Python 3**:
  ```bash
  python -m http.server 8000
  ```
  Then visit `http://localhost:8000`.

- **Using Node/npx**:
  ```bash
  npx serve .
  ```

---

## How to Add or Configure Games

All game data is managed from a single central catalog located at the top of [`assets/js/app.js`](assets/js/app.js).

### Step 1: Open `assets/js/app.js`
Locate the `GAMES` array:

```javascript
const GAMES = [
  // ... existing games
];
```

### Step 2: Add or Edit an Entry

To connect a game hosted on your VPS or external server, add a new object to the array:

```javascript
{
  id: "my-vps-game",
  title: "My VPS Game",
  category: "Arcade",
  rating: 95,
  image: "assets/images/games/arcade.svg",
  description: "A fast-paced browser arcade demo hosted on my VPS.",
  url: "https://your-real-game-domain.example",
  featured: false,
  trending: false
}
```

> **Note on URLs**:
> - Replace `https://your-real-game-domain.example` with your real HTTPS game URL.
> - An empty string `""` designates that the demo is pending. Clicking the card will display an informative "Demo Soon" notification without navigating.
> - By default, only secure `https://` URLs are permitted. If you must support unencrypted `http://` VPS demos during local development, change `CONFIG.allowHttp = true;` in `assets/js/app.js`.

---

## GitHub Pages Deployment

Deploying `rob-links` to GitHub Pages takes less than a minute:

1. **Commit and push** all repository files to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit of Rob-Links static website"
   git branch -M main
   git remote add origin https://github.com/USERNAME/rob-links.git
   git push -u origin main
   ```
2. Open your repository on **GitHub** (`https://github.com/USERNAME/rob-links`).
3. Click the **Settings** tab.
4. On the left navigation menu, click **Pages** (under the "Code and automation" section).
5. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main`.
   - **Folder**: Select `/ (root)`.
6. Click **Save**.
7. Wait 30–60 seconds. GitHub will display a banner with your live URL:
   ```text
   https://USERNAME.github.io/rob-links/
   ```

Because all asset links (`assets/css/...`, `assets/images/...`, `assets/js/...`) are relative, the site operates flawlessly under subpath URLs.

---

## Disclaimer

Rob-Links is an independent gaming directory. All game titles, themes, and descriptions are provided solely for discovery and demo linking purposes. Rob-Links is not affiliated with, endorsed by, or associated with Roblox Corporation or any external game publishers.
