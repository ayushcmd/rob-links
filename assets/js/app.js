/* ROB-LINK V2: static hash routes, direct external game launching. */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const main = $('#main');
const games = GAMES_DATA;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const unique = values => [...new Set(values)].sort((a,b) => a.localeCompare(b));
const genres = unique(games.flatMap(g => g.genres));
const ranked = games.filter(g => Number.isInteger(g.trendingRank)).sort((a,b) => a.trendingRank-b.trendingRank);
let route = '', params = new URLSearchParams(), previousRoute = '';
let searchOrigin;
const tags = g => `<div class="tags">${g.genres.slice(0,2).map(t => `<span class="tag-pill">${esc(t.toUpperCase())}</span>`).join('')}</div>`;
const picture = (g, eager = false) => `<img src="${esc(g.image)}" alt="${esc(g.title)} artwork" width="640" height="360" loading="${eager ? 'eager' : 'lazy'}" decoding="async">`;
const status = g => Catalog.statuses[Catalog.availability(g)] || 'Link Pending';

// Card presentation: Direct external link when configured; Link Pending when awaiting configuration.
function card(g, compact = false) {
  const launch = Catalog.safeUrl(g.launchUrl);
  if (compact) {
    const action = launch
      ? `<a class="round-lime-play" href="${esc(launch)}" target="_blank" rel="noopener noreferrer" aria-label="Play Now: ${esc(g.title)}"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="m9 6 10 6-10 6Z"/></svg></a>`
      : `<span class="round-lime-play pending" title="Link Pending" aria-label="Link Pending: ${esc(g.title)}"><span class="pending-dash" aria-hidden="true">—</span></span>`;
    const artLink = launch
      ? `<a class="card-art" href="${esc(launch)}" target="_blank" rel="noopener noreferrer" aria-label="Play ${esc(g.title)}">${picture(g)}<div class="card-art-gradient" aria-hidden="true"></div></a>`
      : `<div class="card-art">${picture(g)}<div class="card-art-gradient" aria-hidden="true"></div></div>`;
    const titleLink = launch
      ? `<a href="${esc(launch)}" target="_blank" rel="noopener noreferrer">${esc(g.title)}</a>`
      : `<span>${esc(g.title)}</span>`;

    return `<article class="game-card compact">
      <div class="card-art-wrap">
        ${artLink}
      </div>
      <div class="card-body">
        <div class="card-meta">
          <h3>${titleLink}</h3>
          <p class="card-genre">${esc(g.genres.slice(0,2).join(' · '))}</p>
        </div>
        ${action}
      </div>
    </article>`;
  }

  // Full catalog card for Discover
  const action = launch
    ? `<a class="play-link" href="${esc(launch)}" target="_blank" rel="noopener noreferrer" aria-label="Play Now: ${esc(g.title)}">Play Now <span aria-hidden="true">↗</span></a>`
    : `<button class="play-link pending" disabled aria-label="Link Pending: ${esc(g.title)}">Link Pending</button>`;
  const artLink = launch
    ? `<a class="card-art" href="${esc(launch)}" target="_blank" rel="noopener noreferrer" aria-label="Play ${esc(g.title)}">${picture(g)}</a>`
    : `<div class="card-art">${picture(g)}</div>`;
  const titleLink = launch
    ? `<a href="${esc(launch)}" target="_blank" rel="noopener noreferrer">${esc(g.title)}</a>`
    : `<span>${esc(g.title)}</span>`;

  const badgeClass = g.availability === 'offline' ? 'badge-offline' : g.availability === 'files-required' ? 'badge-files' : launch ? 'badge-browser' : 'badge-pending';
  const badgeLabel = g.availability === 'offline' ? 'OFFLINE' : g.availability === 'files-required' ? 'FILES REQUIRED' : launch ? 'BROWSER GAME' : 'LINK PENDING';
  const dotColor = g.availability === 'offline' ? 'dot-red' : g.availability === 'files-required' ? 'dot-cyan' : launch ? 'dot-lime' : 'dot-muted';

  return `<article class="game-card ">
    <div class="card-art-wrap">
      ${artLink}
      <span class="badge-browser ${badgeClass}"><span class="${dotColor}" aria-hidden="true">●</span> ${badgeLabel}</span>
    </div>
    <div class="card-body">
      ${tags(g)}
      <h3>${titleLink}</h3>
      <p class="description">${esc(g.description)}</p>
      <div class="card-bottom">
        <div class="card-meta-row">
          <p class="platform">${esc(g.platform)}</p>
          <span class="availability-tag">${esc(status(g))}</span>
        </div>
        ${action}
      </div>
    </div>
  </article>`;
}

const sectionHeading = (title, link, label) => `<div class="section-heading"><h2>${title}</h2>${link ? `<a class="text-link" href="${link}">${label} <span aria-hidden="true">→</span></a>` : ''}</div>`;
function banner(eyebrowHtml, titleHtml, text, isRed = false, isGreen = false) {
  return `<header class="page-heading">
    <div class="page-heading-content">
      <p class="eyebrow ${isRed ? 'eyebrow-red' : ''} ${isGreen ? 'eyebrow-green' : ''}">${eyebrowHtml}</p>
      <h1>${titleHtml}</h1>
      <p class="banner-sub">${text}</p>
    </div>
    <div class="fold-ribbon" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
  </header>`;
}

function home() {
  const picks = ['gta-5', 'project-igi', 'cod-bo-zombies', 'quake-3']
    .map(id => games.find(g => g.id === id))
    .filter(Boolean);
  const fallback = games.filter(g => g.launchUrl).slice(0, 4);
  const displayPicks = picks.length === 4 ? picks : fallback;

  return `<section class="hero">
    <div class="hero-copy">
      <h1>One platform.<br><span class="blue">Endless</span> <span class="lime">Games.</span></h1>
      <p class="hero-desc">Discover browser games, explore new worlds, and jump straight into the action with instant launcher links.</p>
      <div class="hero-actions">
        <a class="button primary hero-btn" href="#discover">
          <span class="btn-play-icon" aria-hidden="true">▷</span> Explore Games <span class="arrow" aria-hidden="true">→</span>
        </a>
        <a class="button secondary hero-btn trending-btn" href="#trending">
          <span class="lime" aria-hidden="true">⚡</span> Trending Now
        </a>
      </div>
      <div class="hero-search-wrap">
        <button class="hero-search-bar" id="search-open" aria-label="Search games">
          <span class="search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="7"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <span class="search-label">Search 170+ games, genres, WebAssembly ports…</span>
          <kbd aria-hidden="true">/</kbd>
        </button>
      </div>
    </div>
    <div class="hero-art-container">
      <img class="hero-art" src="assets/images/origami-controller.png" width="878" height="511" alt="Sculptural 3D origami game controller with glowing neon lime buttons, blue underglow, and geometric crystal folds">
    </div>
  </section>
  <section class="home-trending-section">
    <div class="section-heading">
      <h2><span class="slash">/</span> Trending Games</h2>
      <a class="text-link" href="#trending">View All <span aria-hidden="true">→</span></a>
    </div>
    <div class="games-grid four">${displayPicks.map(g => card(g, true)).join('')}</div>
  </section>`;
}

function filterGroup(key, title, values, twoCols = false) {
  return `<details open class="filter-group ${twoCols ? 'two-cols' : ''}">
    <summary><span class="group-title">${title}</span><span class="chevron" aria-hidden="true">▾</span></summary>
    <div class="filter-options">${values.map(v => `<label><input type="checkbox" data-filter="${key}" value="${esc(v)}" ${params.getAll(key).includes(v)?'checked':''}><span>${esc(key==='availability' ? Catalog.statuses[v] || v : v)}</span></label>`).join('')}</div>
  </details>`;
}

function discover() {
  return `${banner('<span class="eyebrow-dash">—</span> GAME LIBRARY', 'Discover <span class="lime">Games</span>', 'Play a massive collection of browser games instantly. No downloads. No installs.')}
  <div class="discover-layout">
    <section class="catalog">
      <div class="catalog-toolbar">
        <div class="toolbar-left">
          <span class="grid-sq-icon" aria-hidden="true">▦</span>
          <h2>All Games <span id="result-count" class="badge-count" role="status"></span></h2>
        </div>
        <div class="toolbar-controls">
          <label>Sort by: <select id="sort">
            <option value="catalog">Newest / Catalog</option>
            <option value="az">Name: A–Z</option>
            <option value="za">Name: Z–A</option>
            <option value="availability">Browser playable first</option>
            <option value="platform">Platform</option>
          </select></label>
          <div class="view-controls" aria-label="Catalog layout">
            <button data-view="grid" aria-label="Grid view" class="icon-button view-btn">▦</button>
            <button data-view="list" aria-label="List view" class="icon-button view-btn">☷</button>
          </div>
        </div>
      </div>
      <label class="sr-only" for="catalog-search">Search the library</label>
      <div class="search-field">
        <input id="catalog-search" type="search" placeholder="Search games, genres, or platforms…" value="${esc(params.get('q') || '')}">
        <button class="text-button" data-clear-query>Clear</button>
      </div>
      <div id="filter-chips" class="filter-chips"></div>
      <div id="catalog-grid" class="games-grid"></div>
    </section>
    <aside class="filters">
      <details id="filter-panel" open>
        <summary class="filter-heading">
          <span class="filter-title">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>
            Filters
          </span>
          <button class="text-button clear-btn" data-reset>Clear All</button>
        </summary>
        <div class="filter-content">
          <p class="filter-help">Match any within a group; match all groups.</p>
          ${filterGroup('genre','Genre',genres,true)}
          ${filterGroup('platform','Platform',unique(games.flatMap(Catalog.platforms)))}
          ${filterGroup('feature','Features',unique(games.flatMap(Catalog.features)))}
          ${filterGroup('availability','Availability',['browser','files-required','unavailable','offline'])}
        </div>
      </details>
    </aside>
  </div>`;
}

function refreshCatalog() {
  previousRoute = location.hash;
  const filtered = Catalog.filter(games, params);
  $('#result-count').textContent = `${filtered.length} / ${games.length}`;
  $('#sort').value = params.get('sort') || 'catalog';
  const list = params.get('view') === 'list';
  $('#catalog-grid').classList.toggle('list-view', list);
  document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view===(list?'list':'grid'))));
  $('#catalog-grid').innerHTML = filtered.length
    ? filtered.map(g => card(g)).join('')
    : `<div class="empty-state"><span aria-hidden="true">⌕</span><h2>No games found</h2><p>Try a different search or clear your filters.</p><button class="button secondary" data-reset>Reset All Filters</button></div>`;
  $('#filter-chips').innerHTML = [...params].filter(([k]) => ['q','genre','platform','availability','feature'].includes(k)).map(([k,v]) => `<button class="chip" data-remove-key="${k}" data-remove-value="${esc(v)}" aria-label="Remove ${esc(v)} filter">${esc(k==='availability'?Catalog.statuses[v]||v:v)} <span aria-hidden="true">×</span></button>`).join('');
  document.querySelectorAll('[data-filter]').forEach(input => input.checked = params.getAll(input.dataset.filter).includes(input.value));
}

function trending() {
  const lead = ranked[0] || games[0];
  const otherRanked = ranked.slice(1, 5);
  const rising = games.filter(g => !ranked.slice(0, 5).includes(g) && g.trending).slice(0, 5);
  const leadLaunch = Catalog.safeUrl(lead.launchUrl);
  const leadAction = leadLaunch
    ? `<a class="button primary spotlight-play" href="${esc(leadLaunch)}" target="_blank" rel="noopener noreferrer">▶ Play Now <span aria-hidden="true">↗</span></a>`
    : `<button class="button primary spotlight-play pending" disabled>Link Pending</button>`;

  return `${banner('<span class="fire-icon">🔥</span> TRENDING GAMES', "What's <span class=\"lime\">Trending Now</span>", 'The most played and popular games on ROB-LINK right now.', true)}
  <p class="editorial-note"><span class="lime">✦</span> Handpicked by ROB-LINK · Editorial ordering, not live player rankings.</p>
  <section class="trending-layout">
    <article class="spotlight">
      <div class="spotlight-badge">#1 TRENDING</div>
      <div class="spotlight-image-wrap">
        ${picture(lead, true)}
        <div class="spotlight-gradient" aria-hidden="true"></div>
      </div>
      <div class="spotlight-content">
        ${tags(lead)}
        <h2>${esc(lead.title)}</h2>
        <p>${esc(lead.description)}</p>
        <div class="spotlight-actions">
          ${leadAction}
          <button class="icon-button bookmark-btn" aria-label="Bookmark ${esc(lead.title)}" title="Bookmark">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      </div>
    </article>
    <div class="rank-list">
      ${otherRanked.map(g => {
        const gLaunch = Catalog.safeUrl(g.launchUrl);
        const thumb = gLaunch
          ? `<a class="rank-thumb" href="${esc(gLaunch)}" target="_blank" rel="noopener noreferrer">${picture(g)}</a>`
          : `<div class="rank-thumb">${picture(g)}</div>`;
        const titleLink = gLaunch
          ? `<a href="${esc(gLaunch)}" target="_blank" rel="noopener noreferrer">${esc(g.title)}</a>`
          : `<span>${esc(g.title)}</span>`;
        const playBtn = gLaunch
          ? `<a class="round-lime-play" href="${esc(gLaunch)}" target="_blank" rel="noopener noreferrer" aria-label="Play Now: ${esc(g.title)}"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="m9 6 10 6-10 6Z"/></svg></a>`
          : `<span class="round-lime-play pending" title="Link Pending"><span class="pending-dash" aria-hidden="true">—</span></span>`;
        return `<article class="rank-row">
          <span class="rank">#${g.trendingRank}</span>
          ${thumb}
          <div class="rank-body">
            <h3>${titleLink}</h3>
            ${tags(g)}
          </div>
          ${playBtn}
        </article>`;
      }).join('')}
    </div>
  </section>
  <section class="section-space">
    <div class="section-heading">
      <div>
        <h2><span class="chart-icon" aria-hidden="true">📈</span> <span class="slash">/</span> Rising Fast</h2>
        <p class="section-sub">Games that are quickly gaining players.</p>
      </div>
      <div class="carousel-nav">
        <a class="text-link" href="#discover">View All Trending <span aria-hidden="true">→</span></a>
        <div class="arrow-buttons">
          <button class="icon-button arrow-btn" id="rising-prev" aria-label="Previous">‹</button>
          <button class="icon-button arrow-btn" id="rising-next" aria-label="Next">›</button>
        </div>
      </div>
    </div>
    <div class="games-grid four rising-grid" id="rising-scroll">
      ${rising.map(g => card(g, true)).join('')}
    </div>
  </section>`;
}

function genrePage() {
  const selected = genres.includes(params.get('genre')) ? params.get('genre') : 'Action';
  
  const genreIcons = {
    Action: `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6 2 2-6-3-3"/><path d="m5 13-2 6 6 2 3-3"/><path d="M9.5 6.5 21 18v3h-3L6.5 9.5"/></svg>`,
    Adventure: `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/><circle cx="17" cy="7" r="2"/></svg>`,
    Racing: `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
    Puzzle: `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.439 7.85c0-1.57.802-2.54 2.14-2.54V3.5h-4.32c0 1.34-1 2.14-2.57 2.14-1.58 0-2.58-.8-2.58-2.14H7.8v4.35c1.33 0 2.13 1 2.13 2.57s-.8 2.58-2.13 2.58V17.3h4.31c0-1.34 1-2.14 2.58-2.14 1.57 0 2.57.8 2.57 2.14h4.32v-4.35c-1.34 0-2.14-1-2.14-2.58z"/></svg>`,
    Strategy: `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20h14M7 17l1.5-7h7l1.5 7M6 4h3v3h6V4h3v4H6V4z"/></svg>`,
    Simulation: `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    Sports: `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24"/><polygon points="12 8 15 10 14 14 10 14 9 10 12 8"/></svg>`,
    RPG: `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a9 9 0 0 0-9 9v4c0 3 2 5 5 6h8c3-1 5-3 5-6v-4a9 9 0 0 0-9-9z"/><path d="M12 7v8M7 11h10"/></svg>`
  };

  const primary = ['Action','Adventure','Racing','Puzzle','Strategy','Simulation','Sports','RPG'];
  const secondary = genres.filter(g => !primary.includes(g));

  const genreCard = g => {
    const isSelected = g === selected;
    const count = games.filter(x => x.genres.includes(g)).length;
    const toneClass = `genre-${g.toLowerCase()}`;
    return `<a class="genre-card ${toneClass} ${isSelected ? 'selected' : ''}" href="#genres?genre=${encodeURIComponent(g)}" ${isSelected ? 'aria-current="true"' : ''}>
      <span class="genre-icon" aria-hidden="true">${genreIcons[g] || genreIcons.Action}</span>
      <div class="genre-info">
        <h2>${esc(g)}</h2>
        <p>${count} Games</p>
      </div>
      <span class="genre-arrow" aria-hidden="true">→</span>
      <span class="genre-corner" aria-hidden="true"></span>
    </a>`;
  };

  const matching = games.filter(g => g.genres.includes(selected));

  return `${banner('<span class="game-icon">🎮</span> GAME GENRES', 'Browse by <span class="lime">Genre</span>', 'Find games by the type of experience you love.', false, true)}
  <div class="genre-grid primary-genre-grid">
    ${primary.map(genreCard).join('')}
  </div>
  ${secondary.length ? `<details class="more-genres" ${secondary.includes(selected)?'open':''}>
    <summary><span class="more-title">More ways to explore</span> <span class="more-subs">FPS, horror, arcade & more</span></summary>
    <div class="genre-grid secondary-genre-grid">${secondary.map(g => `<a class="genre-card genre-generic ${g===selected?'selected':''}" href="#genres?genre=${encodeURIComponent(g)}"><div class="genre-info"><h2>${esc(g)}</h2><p>${games.filter(x=>x.genres.includes(g)).length} Games</p></div><span class="genre-arrow">→</span></a>`).join('')}</div>
  </details>` : ''}
  <section class="section-space">
    <div class="section-heading">
      <h2><span class="slash">/</span> Popular in <span class="lime">${esc(selected)}</span></h2>
      <a class="text-link" href="#discover?genre=${encodeURIComponent(selected)}">View All ${esc(selected)} <span aria-hidden="true">→</span></a>
    </div>
    <div class="games-grid four">${matching.slice(0, 4).map(g => card(g, true)).join('')}</div>
  </section>`;
}

function updateParam(key, value, replace = false) {
  params.delete(key);
  if (value) params.set(key, value);
  const hash = `#${route}${params.size ? '?' + params.toString() : ''}`;
  if (replace) { history.replaceState(null, '', hash); refreshCatalog(); }
  else location.hash = hash;
}

function render() {
  if (location.hash === '#main') { main.focus(); return; }
  const raw = location.hash.slice(1) || 'home';
  const split = raw.indexOf('?');
  const next = split < 0 ? raw : raw.slice(0, split);
  if (next === 'about') {
    location.hash = '#home';
    return;
  }
  params = new URLSearchParams(split < 0 ? '' : raw.slice(split + 1));
  route = next;
  main.dataset.page = route;
  if ($('#search-dialog').open) $('#search-dialog').close();
  const pages = { home, discover, trending, genres: genrePage };
  document.title = `${({home:'Games without friction',discover:'Discover Games',trending:'Trending',genres:'Browse by Genre'})[route] || 'Page not found'} · ROB-LINK HUB`;
  main.innerHTML = pages[route] ? pages[route]() : `<div class="empty-state"><h1>Page not found</h1><p>Head back to explore browser games.</p><a class="button primary" href="#discover">Browse Games</a></div>`;
  document.querySelectorAll('#navigation a').forEach(a => {
    if (a.hash === `#${route}`) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  $('#navigation').classList.remove('open');
  $('#menu-toggle').setAttribute('aria-expanded', 'false');
  if (route === 'discover') {
    refreshCatalog();
    if (matchMedia('(max-width: 900px)').matches) $('#filter-panel').open = false;
  }
  main.focus({ preventScroll: true });
  window.scrollTo(0, 0);
  previousRoute = location.hash || '#home';
}

function searchResults() {
  const q = $('#global-search').value;
  const found = games.filter(g => Catalog.search(g, q));
  $('#search-count').textContent = `${found.length} ${found.length === 1 ? 'game' : 'games'}${q ? ' matching your search' : ''}`;
  $('#search-results').innerHTML = found.length
    ? found.map(g => {
        const launch = Catalog.safeUrl(g.launchUrl);
        return launch
          ? `<a class="search-result" href="${esc(launch)}" target="_blank" rel="noopener noreferrer">${picture(g)}<span><strong>${esc(g.title)}</strong><small>${esc(g.genres.join(' · '))} · ${esc(status(g))}</small></span><span class="ext-icon" aria-hidden="true">↗</span></a>`
          : `<div class="search-result pending-result">${picture(g)}<span><strong>${esc(g.title)}</strong><small>${esc(g.genres.join(' · '))} · Link Pending</small></span><span class="badge-pending-sm">Pending</span></div>`;
      }).join('')
    : '<div class="empty-state"><h3>No games found</h3><p>Try another title, genre, or platform.</p></div>';
}

function openSearch() {
  searchOrigin = document.activeElement;
  $('#search-dialog').showModal();
  searchResults();
  $('#global-search').focus();
}

$('#search-open')?.addEventListener('click', openSearch);
document.addEventListener('click', e => {
  if (e.target.closest('#search-open')) {
    e.preventDefault();
    openSearch();
  }
});
$('#search-close').addEventListener('click', () => $('#search-dialog').close());
$('#search-dialog').addEventListener('close', () => searchOrigin?.isConnected && searchOrigin.focus());
$('#global-search').addEventListener('input', searchResults);
$('#search-clear').addEventListener('click', () => { $('#global-search').value = ''; searchResults(); $('#global-search').focus(); });
$('#search-results').addEventListener('click', e => { if (e.target.closest('a')) $('#search-dialog').close(); });
$('#menu-toggle').addEventListener('click', () => {
  const open = $('#navigation').classList.toggle('open');
  $('#menu-toggle').setAttribute('aria-expanded', String(open));
});

main.addEventListener('input', e => {
  if (e.target.id === 'catalog-search') updateParam('q', e.target.value, true);
});

main.addEventListener('change', e => {
  if (e.target.id === 'sort') { updateParam('sort', e.target.value, true); return; }
  if (e.target.dataset.filter) {
    const key = e.target.dataset.filter;
    const values = params.getAll(key).filter(v => v !== e.target.value);
    if (e.target.checked) values.push(e.target.value);
    params.delete(key);
    values.forEach(v => params.append(key, v));
    history.replaceState(null, '', `#discover?${params}`);
    refreshCatalog();
  }
});

main.addEventListener('click', async e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.hasAttribute('data-reset')) {
    params = new URLSearchParams();
    if ($('#catalog-search')) $('#catalog-search').value = '';
    history.replaceState(null, '', '#discover');
    refreshCatalog();
  }
  if (b.hasAttribute('data-clear-query')) {
    $('#catalog-search').value = '';
    updateParam('q', '', true);
    $('#catalog-search').focus();
  }
  if (b.dataset.view) updateParam('view', b.dataset.view, true);
  if (b.dataset.removeKey) {
    const k = b.dataset.removeKey;
    const values = params.getAll(k).filter(v => v !== b.dataset.removeValue);
    params.delete(k);
    values.forEach(v => params.append(k, v));
    history.replaceState(null, '', `#discover?${params}`);
    if ($('#catalog-search')) $('#catalog-search').value = params.get('q') || '';
    refreshCatalog();
    if ($('#catalog-search')) $('#catalog-search').focus();
  }
  if (b.id === 'copy-email') {
    try {
      await navigator.clipboard.writeText('ayushcmd@outlook.com');
      $('#copy-status').textContent = 'Email copied.';
    } catch {
      $('#copy-status').textContent = 'Copy unavailable. Select and copy: ayushcmd@outlook.com';
    }
  }
  if (b.id === 'rising-prev') {
    const strip = $('#rising-scroll');
    if (strip) strip.scrollBy({ left: -300, behavior: 'smooth' });
  }
  if (b.id === 'rising-next') {
    const strip = $('#rising-scroll');
    if (strip) strip.scrollBy({ left: 300, behavior: 'smooth' });
  }
});

document.addEventListener('keydown', e => {
  if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.target.matches('input,textarea,select,[contenteditable="true"]')) {
    e.preventDefault();
    if (!$('#search-dialog').open) openSearch();
  }
  if (e.key === 'Escape' && $('#search-dialog').open) {
    e.preventDefault();
    $('#search-dialog').close();
  }
  if (e.key === 'Escape' && $('#navigation').classList.contains('open')) {
    $('#navigation').classList.remove('open');
    $('#menu-toggle').setAttribute('aria-expanded', 'false');
    $('#menu-toggle').focus();
  }
});

document.addEventListener('error', e => {
  if (e.target.tagName === 'IMG' && !e.target.dataset.fallback) {
    e.target.dataset.fallback = 'true';
    e.target.src = 'assets/images/games/placeholder.svg';
  }
}, true);

window.addEventListener('hashchange', render);
render();
})();
