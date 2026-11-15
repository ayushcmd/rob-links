# ROB-LINK HUB — V2

A static game discovery hub with a restrained origami identity, electric blue actions, red artwork accents, and lime play indicators. Built with HTML, CSS, and vanilla JavaScript; no build step, framework, server-side runtime, or production dependencies.

## What is included

- Home, Discover, Trending, Genres, and About as separate hash-routed views.
- **173 curated game records** (all 36 original games fully preserved + expanded web ports, emulations, and fan projects).
- **Direct external game launching**: Clicking **Play Now ↗** opens the verified game URL directly in a new browser tab (`target="_blank" rel="noopener noreferrer"`), keeping ROB-LINK open in the original tab. No iframes, no intermediate player screens, no loading hurdles.
- **Graceful Link Pending handling**: Games without an verified direct launch URL (or requiring original files / offline) cleanly display a disabled **Link Pending** state with zero broken links.
- Artwork-led game cards, an origami controller illustration, folded navigation accents, and responsive layouts.
- Discover search, combined genre/platform/availability/feature filters, removable chips, counts, five sorting modes, and grid/list views.
- Global search with `/`, Escape, clear, keyboard focus handling, and empty states.
- Editorial trending rankings; no fabricated player counts or growth statistics.
- Eight primary genre tiles, additional categories in an expandable section, real counts, and prefiltered Discover links.
- Mobile navigation, collapsible filters, visible focus states, semantic controls, and reduced-motion support.

## Files

```text
index.html                         Application shell and search dialog
404.html                           Standalone error page
assets/css/style.css               Design system, layouts, card UI, and responsive styling
assets/js/games-data.js            Single source of 173 game records and launch settings
assets/js/catalog.js               Search, filtering, sorting, and URL validation
assets/js/app.js                   View templates, navigation, search UI, and card renderers
assets/images/origami-controller.png Hero origami controller artwork
assets/images/logo.svg             Original logo
assets/images/favicon.svg          Original favicon
assets/images/games/               Original and category artwork
tests/regression.cjs               Dependency-free development and regression test suite
```

## Run locally

Open `index.html` in a modern browser. For a localhost preview, run from the repository directory:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000`. Python is only an optional preview tool. Node is only needed if running the optional regression checks; neither is needed by the website or GitHub Pages.

## Game records and launch URLs

Game information is configured in `assets/js/games-data.js`. Keep IDs unique and stable. All views use this single catalog.

```javascript
{
  id: "chrono-divide",
  slug: "chrono-divide",
  title: "Command & Conquer: Red Alert 2",
  genres: ["Strategy", "RTS"],
  category: "Strategy",
  description: "Chrono Divide's full WebAssembly recreation of Red Alert 2. Build bases, deploy units, and battle online in your browser.",
  image: "assets/images/games/chrono-divide.jpg",
  launchUrl: "https://game.chronodivide.com/",
  trendingRank: 2,
  gameUrl: "https://game.chronodivide.com/",
  platform: "WebAssembly",
  availability: "browser",
  availabilityLabel: "Browser Game",
  buttonText: "Play Now",
  homePick: true,
  trending: true,
  keywords: ["rts", "strategy", "command and conquer", "red alert", "chrono divide"],
  requirements: "Modern browser with WebAssembly support. No downloads required.",
  sourceUrl: "https://chronodivide.com"
}
```

### Adding or Updating a Direct Launch URL

To add a direct launch URL to any game currently marked as **Link Pending**:
1. Open `assets/js/games-data.js`.
2. Locate the game record by `id` or title.
3. Update `launchUrl` with the verified direct HTTPS link:
   ```javascript
   launchUrl: "https://example.com/play-game",
   availability: "browser",
   availabilityLabel: "Browser Game",
   ```
4. Save the file. The game card will immediately render an active **Play Now ↗** button linking directly to that destination in a new tab.

### Catalog Field Reference

- `launchUrl`: direct playable HTTPS URL, or `null` if pending. When present, clicking "Play Now ↗" opens this URL in a new tab.
- `sourceUrl`: original project, repository, or source destination reference.
- `availability`: `browser` (playable), `demo` (playable preview), `files-required` (requires original game assets), or `offline` (archived/pending).
- `availabilityLabel`: display badge text (e.g., `Browser Game`, `Requires Game Files`, `Offline / Archived`, `Link Pending`).
- `trendingRank`: positive integer for editorial ordering (#1 to #5); `null` excludes it from the top leaderboard.
- `trending`: boolean indicating whether the game appears in "Trending Games" or "Rising Fast".
- `homePick`: boolean indicating whether the game appears on the Home landing page.

## Search and navigation

Hash routing provides clean, serverless navigation:

```text
index.html#discover
index.html#discover?genre=FPS&platform=WebAssembly&q=quake&sort=az
index.html#genres?genre=Racing
index.html#trending
index.html#about
```

Filters match any selection within a group and all selected groups together. Search matches every entered word across title, description, genres, keywords, and platform. Hash routes support direct opening, refresh, and browser back navigation without server rewriting.

## Direct external launch behavior

ROB-LINK operates as a clean game discovery directory:
- All active "Play Now ↗" buttons launch external games in a new tab using standard secure attributes: `target="_blank" rel="noopener noreferrer"`.
- No iframes or third-party embeddings are used, eliminating CORS, CSP (`X-Frame-Options`), and pointer-lock conflicts.
- Games requiring user-supplied asset files or those awaiting direct web links display clear status indicators rather than dead or misleading links.

## Contact details

The About page preserves verified contact and social channels:

- Email: `ayushcmd@outlook.com` 
- Buy Me a Coffee: `ayushcmd` 
- LinkedIn: `ayushcmd` 
- GitHub: `https://github.com/ayushcmd`

## Validation

Developer regression test suite:

```sh
node --check assets/js/app.js
node --check assets/js/catalog.js
node --check assets/js/games-data.js
node tests/regression.cjs
```

The regression suite verifies:
- Preservation of all 36 original game records and baseline IDs against Git HEAD.
- Catalog size of 173 games with validated artwork and direct URL mappings.
- Rejection of directory aggregator URLs as direct launch links.
- Correct rendering of direct external `target="_blank"` links and disabled `Link Pending` states.
- Search, multi-group filtering, sorting modes, and escaping.

## GitHub Pages

After reviewing the local changes and approving publication:

1. Commit and push the intended files to `ayushcmd/rob-links`.
2. In repository Settings → Pages, choose deployment from the desired branch and `/ (root)`.
3. The site is served at `https://ayushcmd.github.io/rob-links/`.

There is no build command. Asset paths are relative to the repository root.

## Credits

ROB-LINK is an independent discovery hub. Titles, trademarks, and artwork belong to their respective owners; inclusion does not imply association. ROB-LINK does not claim to host or distribute the listed games.
