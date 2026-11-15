# ROB-LINK HUB — V2

A static game discovery hub with a restrained origami identity, electric blue actions, red artwork accents, and lime play indicators. Built with HTML, CSS, and vanilla JavaScript; no build step, framework, server-side runtime, or production dependencies.

## What is included

- Home, Discover, Trending, Genres, and About as separate hash-routed views.
- All 36 original game records, artwork, original URLs, requirements, logo, and favicon preserved.
- Artwork-led game cards, an original SVG controller, folded navigation accents, and responsive layouts.
- Discover search, combined genre/platform/availability/feature filters, removable chips, counts, five sorting modes, and grid/list views.
- Global search with `/`, Escape, clear, keyboard focus handling, and empty states.
- Editorial trending rankings; no fabricated player counts or growth statistics.
- Eight primary genre tiles, additional categories in an expandable section, real counts, and prefiltered Discover links.
- One internal player route for every Play Now action, original-source links, missing-URL states, optional embedded launch, and fullscreen controls.
- Mobile navigation, collapsible filters, visible focus states, semantic controls, and reduced-motion support.

## Files

```text
index.html                         Application shell and search dialog
404.html                           Standalone error page
assets/css/style.css               Design system, layouts, and responsive styling
assets/js/games-data.js             Single source of game information and launch settings
assets/js/catalog.js                Search, filtering, sorting, and URL validation
assets/js/app.js                    View templates, navigation, search UI, and player
assets/images/origami-controller.svg New lightweight hero illustration
assets/images/logo.svg             Original logo (unchanged)
assets/images/favicon.svg          Original favicon (unchanged)
assets/images/hero-illustration.svg Original illustration (retained)
assets/images/games/                Original artwork (unchanged)
tests/regression.cjs                Optional dependency-free development checks
```

## Run locally

Open `index.html` in a modern browser. For a localhost preview, run from the repository directory:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000`. Python is only an optional preview tool. Node is only needed if running the optional checks; neither is needed by the website or GitHub Pages.

## Game records and launch URLs

Edit the corresponding record in `assets/js/games-data.js`. Keep IDs unique and stable. All views use this one catalog.

```javascript
{
  id: "my-game",
  slug: "my-game",
  title: "My Game",
  genres: ["Adventure"],
  category: "Adventure",
  description: "An accurate description of the experience.",
  image: "assets/images/games/my-game.jpg",
  launchUrl: null,
  embedAllowed: null,
  trendingRank: null,
  gameUrl: null,
  platform: "WebGL",
  availability: "unavailable",
  availabilityLabel: "URL pending",
  buttonText: "Play Now",
  homePick: false,
  trending: false,
  keywords: ["adventure"],
  requirements: "Describe any real requirements here.",
  sourceUrl: null
}
```

- `launchUrl`: direct HTTPS runtime URL, or `null` if not configured. Change this field to update the player; HTML edits are unnecessary.
- `sourceUrl`: original project, official information, or source destination. Kept separate from the runtime URL.
- `gameUrl`: retained original URL for reference; V2 does not use it as an implicit fallback launcher.
- `embedAllowed`: `null` means unknown and offers an explicit “Try in ROB-LINK” action; `false` explains embedding is unavailable; `true` allows automatic embedding for browser/demo listings after the owner has verified compatibility. File-dependent listings always require an explicit start.
- `availability`: `browser`, `demo`, `files-required`, `project`, or `unavailable`. A browser listing without a safe launch URL displays URL pending. Project and file-dependent records retain their explanatory status.
- `trendingRank`: unique positive integer for editorial ordering; `null` excludes it from the ranked list. Keep at least five ranked records for the intended layout.
- `trending`: selects additional entries for More to Explore.

Existing browser URLs were copied to `launchUrl`; project and file-dependent records keep their original URLs but start with `launchUrl: null`. No external runtime has been newly certified as working or licensed. Verify a destination before enabling automatic embedding.

Home's four curated IDs are near `home()` in `app.js`. Genre names and counts are derived from `genres` in each game record. Platform filters are derived from actual platform strings. Feature filters use explicit genre metadata for Multiplayer/Open World and existing singleplayer descriptions; no unsupported features are invented. To add a new genre, add it to the appropriate records; it appears in Discover and the additional genre section automatically.

## Search and navigation

Examples:

```text
index.html#discover
index.html#discover?genre=FPS&platform=WebAssembly&q=quake&sort=az
index.html#genres?genre=Racing
index.html#play?game=gta-vc
```

Filters match any selection within a group and all selected groups together. Search matches every entered word across title, description, genres, keywords, and platform. Hash routes support direct opening, refresh, and browser back navigation without server rewriting. Search/filter/sort edits replace the current history entry to avoid a history entry per keystroke; genre navigation creates history entries. Back to Games retains the current browsing filters when entering the player.

## Player limitations

Third-party sites may reject iframes with CSP or X-Frame-Options. ROB-LINK does not bypass these headers, proxy content, or automatically open external windows. A frame load is never presented as proof that gameplay works. The source fallback remains available throughout the session. The sandbox allows scripts, same-origin runtime behavior, forms, and pointer lock, but not top-level navigation or popups. Some games may need a separate tab for storage, authentication, controls, or other browser capabilities.

Fullscreen depends on browser support and user activation. If unavailable, the player displays a fallback message. Clipboard copying may require HTTPS or localhost. Original files must be supplied by their owner where required. The catalog's descriptions were preserved and are not live availability guarantees.

## Contact details awaiting owner confirmation

The About page deliberately preserves:

- Email: `ayushcmd@outlookk.com` 
- Buy Me a Coffee: `ayushcmd` 
- LinkedIn: `ayushcmd` 
- GitHub: `https://github.com/ayushcmd`.

Email copy and mailto use the supplied spelling. LinkedIn and coffee remain plain handles until their destinations are confirmed. No silent corrections were made.

## Validation

Optional developer checks:

```sh
node --check assets/js/app.js
node tests/regression.cjs
```

The regression suite checks data/artwork preservation against Git HEAD, search, combined filters, sorting, URL validation, routes, internal links, player states, and escaped rendering. It uses a lightweight DOM contract harness, not a real browser layout engine. The preservation baseline is the current committed catalog; revise baseline expectations deliberately when adding games.

During implementation, all 17 checks passed before the visual polish pass. Browser interactions covered combined filtering/search/sorting, internal player navigation, empty results, and embedded-frame controls. A focused visual review covered all five sections plus mobile Home, correcting mobile hero composition and ranked-thumbnail sizing. Browser fullscreen completion and third-party gameplay were not verified. No claim is made that all external games work.

## GitHub Pages

After reviewing the local changes and approving publication:

1. Commit and push the intended files to `ayushcmd/rob-links`.
2. In repository Settings → Pages, choose deployment from the desired branch and `/ (root)`.
3. The site is served at `https://ayushcmd.github.io/rob-links/`.

There is no build command. Asset paths are relative to the repository root. The standalone 404 page explicitly returns to `/rob-links/index.html#discover` on the configured GitHub Pages host, including from nested invalid paths. Update that 404 host/base-path check if moving the site to another repository.

No changes were pushed or published during this implementation.

## Credits

ROB-LINK is an independent discovery hub. Titles, trademarks, and artwork belong to their respective owners; inclusion does not imply association. ROB-LINK does not claim to host or distribute the listed games.
