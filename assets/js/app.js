/* ROB-LINK V2: static hash routes, one catalog, one player. */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const main = $('#main');
const games = GAMES_DATA;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const unique = values => [...new Set(values)].sort((a,b) => a.localeCompare(b));
const genres = unique(games.flatMap(g => g.genres));
const ranked = games.filter(g => Number.isInteger(g.trendingRank)).sort((a,b) => a.trendingRank-b.trendingRank);
let route = '', params = new URLSearchParams(), previousRoute = '', returnRoute = '#discover';
let searchOrigin;
const play = g => `#play?game=${encodeURIComponent(g.id)}`;
const tags = g => `<div class="tags">${g.genres.slice(0,2).map(t => `<span class="tag-pill">${esc(t.toUpperCase())}</span>`).join('')}</div>`;
const picture = (g, eager = false) => `<img src="${esc(g.image)}" alt="${esc(g.title)} artwork" width="640" height="360" loading="${eager ? 'eager' : 'lazy'}" decoding="async">`;
const status = g => Catalog.statuses[Catalog.availability(g)] || 'Availability unconfirmed';

// Card presentation: Compact (with circular neon lime button) or Full catalog (with Play Now button).
function card(g, compact = false) {
  if (compact) {
    return `<article class="game-card compact">
      <div class="card-art-wrap">
        <a class="card-art" href="${play(g)}" aria-label="Play ${esc(g.title)}">
          ${picture(g)}
          <div class="card-art-gradient" aria-hidden="true"></div>
        </a>
      </div>
      <div class="card-body">
        <div class="card-meta">
          <h3><a href="${play(g)}">${esc(g.title)}</a></h3>
          <p class="card-genre">${esc(g.genres.slice(0,2).join(' · '))}</p>
        </div>
        <a class="round-lime-play" href="${play(g)}" aria-label="Play Now: ${esc(g.title)}">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="m9 6 10 6-10 6Z"/></svg>
        </a>
      </div>
    </article>`;
  }
  return `<article class="game-card ">
    <div class="card-art-wrap">
      <a class="card-art" href="${play(g)}" aria-label="Details and play: ${esc(g.title)}">
        ${picture(g)}
      </a>
      <span class="badge-browser"><span class="dot-lime" aria-hidden="true">●</span> BROWSER GAME</span>
    </div>
    <div class="card-body">
      ${tags(g)}
      <h3><a href="${play(g)}">${esc(g.title)}</a></h3>
      <p class="description">${esc(g.description)}</p>
      <div class="card-bottom">
        <p class="platform">${esc(g.platform)}</p>
        <a class="play-link" href="${play(g)}" aria-label="Play Now: ${esc(g.title)}">Play Now <span aria-hidden="true">↗</span></a>
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
  const picks = ['blade-arena','space-runner','turbo-drift','block-world']
    .map(id => games.find(g => g.id === id))
    .filter(Boolean);
  const fallback = games.slice(0, 4);
  const displayPicks = picks.length === 4 ? picks : fallback;

  return `<section class="hero">
    <div class="hero-copy">
      <div class="hero-badge"><span class="badge-icon" aria-hidden="true">🎮</span> GAMING HUB</div>
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
      <div class="hero-stats">
        <div class="stat-item"><span class="stat-icon" aria-hidden="true">🎮</span> <strong>5.2K+</strong> <span>Games</span></div>
        <span class="stat-divider" aria-hidden="true"></span>
        <div class="stat-item"><span class="stat-icon" aria-hidden="true">👥</span> <strong>1.3M+</strong> <span>Players</span></div>
        <span class="stat-divider" aria-hidden="true"></span>
        <div class="stat-item"><span class="stat-icon lime" aria-hidden="true">⚡</span> <strong>Instant</strong> <span>Play</span></div>
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
  </section>
  <div class="bottom-note">
    <span>CURATED FOR CURIOSITY</span>
    <p>Browser games. Classic ports. Community creations.</p>
    <a href="#about">Get to know ROB-LINK ↗</a>
  </div>`;
}

function filterGroup(key, title, values, twoCols = false) {
  return `<details open class="filter-group ${twoCols ? 'two-cols' : ''}">
    <summary><span class="group-title">${title}</span><span class="chevron" aria-hidden="true">▾</span></summary>
    <div class="filter-options">${values.map(v => `<label><input type="checkbox" data-filter="${key}" value="${esc(v)}" ${params.getAll(key).includes(v)?'checked':''}><span>${esc(key==='availability' ? Catalog.statuses[v] : v)}</span></label>`).join('')}</div>
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
            <option value="catalog">Newest</option>
            <option value="az">Name: A–Z</option>
            <option value="za">Name: Z–A</option>
            <option value="availability">Browser listings first</option>
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
          ${filterGroup('availability','Availability',unique(games.map(Catalog.availability)).concat(games.some(g=>Catalog.availability(g)==='unavailable')?[]:['unavailable']))}
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
  $('#filter-chips').innerHTML = [...params].filter(([k]) => ['q','genre','platform','availability','feature'].includes(k)).map(([k,v]) => `<button class="chip" data-remove-key="${k}" data-remove-value="${esc(v)}" aria-label="Remove ${esc(v)} filter">${esc(k==='availability'?Catalog.statuses[v]:v)} <span aria-hidden="true">×</span></button>`).join('');
  document.querySelectorAll('[data-filter]').forEach(input => input.checked = params.getAll(input.dataset.filter).includes(input.value));
}

function trending() {
  const lead = ranked[0] || games[0];
  const otherRanked = ranked.slice(1, 5);
  const rising = games.filter(g => !ranked.slice(0, 5).includes(g) && g.trending).slice(0, 5);

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
          <a class="button primary spotlight-play" href="${play(lead)}">▶ Play Now <span aria-hidden="true">↗</span></a>
          <button class="icon-button bookmark-btn" aria-label="Bookmark ${esc(lead.title)}" title="Bookmark">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      </div>
    </article>
    <div class="rank-list">
      ${otherRanked.map(g => `<article class="rank-row">
        <span class="rank">#${g.trendingRank}</span>
        <a class="rank-thumb" href="${play(g)}" aria-label="${esc(g.title)}">${picture(g)}</a>
        <div class="rank-body">
          <h3><a href="${play(g)}">${esc(g.title)}</a></h3>
          ${tags(g)}
        </div>
        <a class="round-lime-play" href="${play(g)}" aria-label="Play Now: ${esc(g.title)}">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="m9 6 10 6-10 6Z"/></svg>
        </a>
      </article>`).join('')}
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
      ${rising.map(g => `<article class="game-card compact">
        <div class="card-art-wrap">
          <a class="card-art" href="${play(g)}" aria-label="Play ${esc(g.title)}">
            ${picture(g)}
            <div class="card-art-gradient" aria-hidden="true"></div>
          </a>
          <span class="badge-rising" aria-label="Rising fast"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></span>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <h3><a href="${play(g)}">${esc(g.title)}</a></h3>
            <p class="card-genre">${esc(g.genres.slice(0,2).join(' · '))}</p>
          </div>
          <a class="round-lime-play" href="${play(g)}" aria-label="Play Now: ${esc(g.title)}">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="m9 6 10 6-10 6Z"/></svg>
          </a>
        </div>
      </article>`).join('')}
    </div>
  </section>`;
}

function genrePage() {
  const selected = genres.includes(params.get('genre')) ? params.get('genre') : 'Action';
  
  // High-fidelity custom SVG icons for all 8 genres
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
    <summary><span class="more-title">More ways to explore</span> <span class="more-subs">FPS, horror, multiplayer & more</span></summary>
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

function about() {
  return `${banner('<span class="eyebrow-dash">—</span> ABOUT ROB-LINK', 'Built for Players.<br>Not <span class="lime">Loading Screens.</span>', 'ROB-LINK is a gaming hub to discover, launch, and explore browser games, WebAssembly ports, and community projects — all in one place.')}
  <div class="actions about-hero-actions">
    
    
  </div>
  <div class="offer-grid section-space">
    <article class="panel fold-card fold-blue">
      <div class="fold-icon blue" aria-hidden="true"><svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>
      <div>
        <h2>Discover</h2>
        <p>Find games across multiple genres and experiences.</p>
      </div>
      <span class="fold-corner blue" aria-hidden="true"></span>
    </article>
    <article class="panel fold-card fold-red">
      <div class="fold-icon red" aria-hidden="true"><svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="m9 6 10 6-10 6Z"/></svg></div>
      <div>
        <h2>Play Instantly</h2>
        <p>Launch available games directly from ROB-LINK.</p>
      </div>
      <span class="fold-corner red" aria-hidden="true"></span>
    </article>
    <article class="panel fold-card fold-lime">
      <div class="fold-icon lime" aria-hidden="true"><svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></div>
      <div>
        <h2>Explore Projects</h2>
        <p>Browse browser games, WebAssembly ports, and community creations.</p>
      </div>
      <span class="fold-corner lime" aria-hidden="true"></span>
    </article>
  </div>
  <div class="about-grid">
    <section class="panel philosophy" id="about-philosophy">
      <p class="eyebrow"><span class="slash">/</span> Our Philosophy</p>
      <h2>Games without <span class="lime">Friction.</span></h2>
      <p class="sub-motto">Less searching. More playing.</p>
      <ul class="philosophy-list">
        <li>
          <span class="phil-icon lime" aria-hidden="true">⚡</span>
          <div>
            <h3>Simple Discovery</h3>
            <p>Find the right game, faster.</p>
          </div>
        </li>
        <li>
          <span class="phil-icon blue" aria-hidden="true">▷</span>
          <div>
            <h3>Clear Launch Options</h3>
            <p>Jump into playable experiences with ease.</p>
          </div>
        </li>
        <li>
          <span class="phil-icon red" aria-hidden="true">♡</span>
          <div>
            <h3>Respect for Creators</h3>
            <p>We showcase games while giving credit to their makers.</p>
          </div>
        </li>
      </ul>
    </section>
    <section class="panel creator">
      <p class="eyebrow"><span class="slash">/</span> Meet the Creator</p>
      <div class="creator-heading">
        <div class="creator-avatar" aria-hidden="true"><span>&lt;/&gt;</span></div>
        <div>
          <h2>Ayush</h2>
          <p class="creator-role">Creator of ROB-LINK</p>
          <span class="badge-creator">DEVELOPER &amp; BUILDER</span>
        </div>
      </div>
      <p class="creator-bio">Building ROB-LINK to make game discovery simpler, faster, and more enjoyable. One platform to explore different gaming experiences and jump into the action.</p>
      <div class="social-list">
        <div class="social-row">
          <span class="social-label-wrap"><span class="social-icon blue" aria-hidden="true">✉</span><strong>Email</strong></span>
          <span class="social-val">ayushcmd@outlook.com</span>
          <button id="copy-email" class="icon-button copy-btn" aria-label="Copy email" title="Copy email">⧉</button>
        </div>
        <div class="social-row">
          <span class="social-label-wrap"><span class="social-icon blue" aria-hidden="true">in</span><strong>LinkedIn</strong></span>
          <span class="social-val">@ayushcmd</span>
          <a class="social-link" href="https://linkedin.com/in/ayushcmd" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">↗</a>
        </div>
        <div class="social-row">
          <span class="social-label-wrap"><span class="social-icon" aria-hidden="true">🐙</span><strong>GitHub</strong></span>
          <a class="social-val social-link" href="https://github.com/ayushcmd" target="_blank" rel="noopener noreferrer">@ayushcmd ↗</a>
        </div>
        <div class="social-row">
          <span class="social-label-wrap"><span class="social-icon yellow" aria-hidden="true">☕</span><strong>Buy Me a Coffee</strong></span>
          <span class="social-val">@ayushcmd</span>
          <a class="social-link" href="https://buymeacoffee.com/ayushcmd" target="_blank" rel="noopener noreferrer" aria-label="Buy me a coffee">↗</a>
        </div>
      </div>
      <p class="contact-note">Owner confirmation pending: email spelling “outlook.com” and coffee handle “ayushcmd”. LinkedIn and coffee destinations are not yet verified.</p>
      <p id="copy-status" role="status"></p>
    </section>
    <div class="about-stack">
      <section class="panel credits-panel">
        <div class="panel-header-icon red" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <h2>Credits &amp; Transparency</h2>
        <p>Games, trademarks, and related artwork belong to their respective owners. ROB-LINK is an independent gaming hub that links to official releases, fan projects, third-party ports, and other publicly available experiences.</p>
        <p>If you're a rights holder and have a concern about a listing, feel free to contact me at <a class="inline-link" href="mailto:ayushcmd@outlook.com">ayushcmd@outlook.com</a>.</p>
      </section>
      <section class="panel awesome-panel">
        <div class="panel-header-icon lime" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </div>
        <h2>Found Something Awesome?</h2>
        <p>Suggest a game, report a broken link, or just say hi. Your feedback helps make ROB-LINK better for everyone.</p>
        <a class="button primary touch-btn" href="mailto:ayushcmd@outlook.com?subject=ROB-LINK%20feedback">
          <span aria-hidden="true">✉</span> Get in Touch <span aria-hidden="true">→</span>
        </a>
      </section>
    </div>
  </div>`;
}

function external(url, label) {
  const safe = Catalog.safeUrl(url);
  return safe ? `<a class="button secondary" href="${esc(safe)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>` : '';
}

function player() {
  const g = games.find(g => g.id === params.get('game'));
  if (!g) return `<div class="empty-state"><h1>Game not found</h1><p>This game link does not match the catalog.</p><a class="button primary" href="#discover">Back to Games</a></div>`;
  document.title = `${g.title} · ROB-LINK Player`;
  const launch = Catalog.safeUrl(g.launchUrl);
  const canTry = launch && g.availability !== 'project' && g.embedAllowed !== false;
  let message = !launch
    ? 'Launch link not added yet'
    : g.availability === 'project'
    ? 'Project / informational listing'
    : g.embedAllowed === false
    ? 'This source cannot be embedded'
    : 'Ready to try this experience?';

  return `<div class="player-heading">
    <a class="text-link" href="${esc(returnRoute)}">← Back to Games</a>
    <span class="small-label">ROB-LINK PLAYER</span>
  </div>
  <div class="player-title">
    <div>
      ${tags(g)}
      <h1>${esc(g.title)}</h1>
    </div>
    <span class="availability">${esc(status(g))}</span>
  </div>
  <section class="player-stage" id="player-stage">
    <div class="player-placeholder">
      ${picture(g, true)}
      <div>
        <span class="eyebrow">YOUR GAME SPACE</span>
        <h2>${message}</h2>
        <p>${!launch ? 'A direct game URL has not been configured. The original source may contain project information or setup instructions.' : g.embedAllowed === false ? 'The source must be opened in its own tab. ROB-LINK cannot override embedding restrictions.' : 'Third-party content may require original files, desktop controls, or its own window. Embedding support has not been confirmed.'}</p>
        ${g.availability === 'files-required' ? '<p>Use only original game files you own. See the requirements below.</p>' : ''}
        ${canTry ? '<button class="button primary" id="start-embed">Try in ROB-LINK ▷</button>' : ''}
        ${external(g.sourceUrl, 'Open Original Source')}
        ${launch && !canTry && g.availability !== 'project' ? external(launch, 'Launch Externally') : ''}
      </div>
    </div>
  </section>
  <div class="player-tools">
    <p id="player-status" role="status">${canTry ? 'Starting an embedded session connects to the third-party game site.' : 'No embedded session is running.'}</p>
    <button class="button secondary" id="fullscreen" disabled>Fullscreen ⛶</button>
  </div>
  <div class="player-information">
    <section class="panel">
      <h2>About this game</h2>
      <p>${esc(g.description)}</p>
      <p><strong>Platform:</strong> ${esc(g.platform)}</p>
    </section>
    <section class="panel">
      <h2>Before you play</h2>
      <p>${esc(g.requirements)}</p>
      <p>Availability details come from the existing catalog and are not a live service guarantee. If the frame is blank, blocked, or unresponsive, open the source directly.</p>
      <div class="actions">
        ${external(g.sourceUrl, 'Open Original Source')}
        ${launch && launch !== g.sourceUrl ? external(launch, 'Launch Externally') : ''}
      </div>
    </section>
  </div>`;
}

function startEmbed() {
  const g = games.find(g => g.id === params.get('game'));
  const url = Catalog.safeUrl(g?.launchUrl);
  if (!url || g.embedAllowed === false || g.availability === 'project') return;
  const frame = document.createElement('iframe');
  frame.title = `${g.title} — external game`;
  frame.src = url;
  frame.allow = 'fullscreen; gamepad; autoplay';
  frame.allowFullscreen = true;
  frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-pointer-lock allow-forms');
  frame.referrerPolicy = 'no-referrer';
  $('#player-stage').replaceChildren(frame);
  $('#fullscreen').disabled = false;
  $('#player-status').textContent = 'Embed requested. ROB-LINK cannot verify gameplay or detect all blocked frames. If it does not work, use Open Original Source below.';
  frame.addEventListener('error', () => $('#player-status').textContent = 'The embedded source could not load. Open Original Source below.');
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
  params = new URLSearchParams(split < 0 ? '' : raw.slice(split + 1));
  if (next === 'play' && route && route !== 'play') returnRoute = location.hash === previousRoute ? '#discover' : previousRoute;
  route = next;
  main.dataset.page = route;
  if ($('#search-dialog').open) $('#search-dialog').close();
  const pages = { home, discover, trending, genres: genrePage, about, play: player };
  document.title = `${({home:'Games without friction',discover:'Discover Games',trending:'Trending',genres:'Browse by Genre',about:'About',play:'Player'})[route] || 'Page not found'} · ROB-LINK HUB`;
  main.innerHTML = pages[route] ? pages[route]() : `<div class="empty-state"><h1>Page not found</h1><a class="button primary" href="#home">Back to Home</a></div>`;
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
  if (route === 'play') {
    const game = games.find(g => g.id === params.get('game'));
    if (game?.embedAllowed === true && ['browser','demo'].includes(game.availability)) startEmbed();
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
    ? found.map(g => `<a class="search-result" href="${play(g)}">${picture(g)}<span><strong>${esc(g.title)}</strong><small>${esc(g.genres.join(' · '))} · ${esc(status(g))}</small></span><span aria-hidden="true">↗</span></a>`).join('')
    : '<div class="empty-state"><h3>No games found</h3><p>Try another title, genre, or platform.</p></div>';
}

function openSearch() {
  searchOrigin = document.activeElement;
  $('#search-dialog').showModal();
  searchResults();
  $('#global-search').focus();
}

$('#search-open').addEventListener('click', openSearch);
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
  if (b.id === 'start-embed') startEmbed();
  if (b.id === 'fullscreen') {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await $('#player-stage').requestFullscreen();
    } catch {
      $('#player-status').textContent = 'Fullscreen is unavailable in this browser. Use the original source for more options.';
    }
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
