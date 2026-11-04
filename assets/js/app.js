/**
 * ROB-LINKS — Gaming Discovery Platform Application Logic
 * 
 * Powered by a central 36-game catalog. Provides instant search, multi-genre filtering,
 * modal details views, and safe external navigation.
 */

// ============================================================================
// 1. GLOBAL STATE & CONFIGURATION
// ============================================================================

const CONFIG = {
  allowHttp: false,
  defaultThumbnail: "assets/images/games/placeholder.svg"
};

// Application State
const state = {
  searchQuery: "",
  activeGenre: "All Games",
  sortBy: "featured",
  selectedGameId: null
};

// ============================================================================
// 2. DOM ELEMENT REFERENCES
// ============================================================================

const DOM = {
  header: document.querySelector(".site-header"),
  navLinks: document.querySelectorAll(".nav-link"),
  mobileMenuBtn: document.getElementById("mobileMenuBtn"),
  mobileNav: document.getElementById("mobileNav"),

  featuredGrid: document.getElementById("featuredGrid"),
  trendingGrid: document.getElementById("trendingGrid"),
  catalogGrid: document.getElementById("catalogGrid"),

  searchInput: document.getElementById("gameSearch"),
  clearSearchBtn: document.getElementById("clearSearchBtn"),
  genreFilterContainer: document.getElementById("genreFilterContainer"),
  catalogGenreSelect: document.getElementById("catalogGenreSelect"),
  sortSelect: document.getElementById("catalogSortSelect"),
  catalogResultCount: document.getElementById("catalogResultCount"),

  emptyState: document.getElementById("catalogEmptyState"),
  resetFiltersBtn: document.getElementById("resetFiltersBtn"),

  backToTopBtn: document.getElementById("backToTopBtn"),

  // Game Details Modal
  modal: document.getElementById("gameDetailsModal"),
  modalBackdrop: document.getElementById("detailsModalBackdrop"),
  modalCloseBtn: document.getElementById("detailsModalCloseBtn"),
  modalMedia: document.getElementById("detailsModalMedia"),
  modalTitle: document.getElementById("detailsModalTitle"),
  modalGenres: document.getElementById("detailsModalGenres"),
  modalStatusBadge: document.getElementById("detailsModalStatusBadge"),
  modalDescription: document.getElementById("detailsModalDescription"),
  modalPlatform: document.getElementById("detailsModalPlatform"),
  modalRequirements: document.getElementById("detailsModalRequirements"),
  modalExternalNotice: document.getElementById("detailsModalExternalNotice"),
  modalLaunchBtn: document.getElementById("detailsModalLaunchBtn")
};

// ============================================================================
// 3. HELPERS & UTILITIES
// ============================================================================

/**
 * Access all games from central data
 */
function getGames() {
  return typeof GAMES_DATA !== "undefined" ? GAMES_DATA : [];
}

/**
 * Find game by unique ID
 */
function getGameById(id) {
  if (!id) return null;
  return getGames().find(g => g.id === id) || null;
}

/**
 * Validates destination URLs.
 * Strictly permits HTTPS by default. Rejects unsafe schemes.
 */
function isValidGameUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:") return true;
    if (CONFIG.allowHttp && parsed.protocol === "http:") return true;
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * Safe HTML escaping
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Creates dynamic SVG data URI fallback matching game category and title
 */
function getFallbackSvgUri(title, category) {
  const safeTitle = escapeHtml(title || "Game");
  const safeCat = escapeHtml(category || "Browser Game");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360" fill="none">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1a2333"/>
        <stop offset="100%" stop-color="#0a0f18"/>
      </linearGradient>
    </defs>
    <rect width="640" height="360" fill="url(#bg)"/>
    <circle cx="320" cy="180" r="160" fill="#335fff" fill-opacity="0.15"/>
    <rect x="30" y="30" width="580" height="300" rx="12" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
    <g transform="translate(320, 150)">
      <circle cx="0" cy="0" r="38" fill="#141c2b" stroke="#335fff" stroke-width="2"/>
      <polygon points="-8,-12 14,0 -8,12" fill="#38bdf8"/>
    </g>
    <text x="320" y="235" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="20" fill="#ffffff" text-anchor="middle">${safeTitle}</text>
    <text x="320" y="265" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="13" fill="#60a5fa" text-anchor="middle" letter-spacing="1.5">${safeCat}</text>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/**
 * Status badge markup based on availability
 */
function getAvailabilityBadgeMarkup(availability, label) {
  const safeLabel = escapeHtml(label || "External Game");
  let badgeClass = "badge-project";
  let icon = "◆";

  switch (availability) {
    case "browser":
      badgeClass = "badge-browser";
      icon = "●";
      break;
    case "demo":
      badgeClass = "badge-demo";
      icon = "■";
      break;
    case "files-required":
      badgeClass = "badge-files";
      icon = "▲";
      break;
    case "unavailable":
      badgeClass = "badge-unavailable";
      icon = "✕";
      break;
    default:
      badgeClass = "badge-project";
      icon = "◆";
  }

  return `<span class="availability-badge ${badgeClass}"><span class="badge-icon">${icon}</span>${safeLabel}</span>`;
}

// ============================================================================
// 4. RENDERING FUNCTIONS
// ============================================================================

/**
 * Creates HTML markup for an individual game card
 */
function createGameCardHtml(game) {
  const safeId = escapeHtml(game.id);
  const safeTitle = escapeHtml(game.title);
  const safeDesc = escapeHtml(game.description || "");
  const safeImg = escapeHtml(game.image || CONFIG.defaultThumbnail);
  const safeButtonText = escapeHtml(game.buttonText || "PLAY NOW");
  const fallbackUri = getFallbackSvgUri(game.title, game.category);
  const statusBadge = getAvailabilityBadgeMarkup(game.availability, game.availabilityLabel);

  // Genre pills (first 2)
  const genresList = Array.isArray(game.genres) ? game.genres : [game.category || "Game"];
  const genreTags = genresList.slice(0, 2).map(g => `<span class="card-genre-tag">${escapeHtml(g)}</span>`).join("");

  const isBrowserPlay = game.availability === "browser" || game.availability === "demo";
  const btnClass = isBrowserPlay ? "btn-play-action" : "btn-project-action";

  return `
    <article class="game-card" data-game-id="${safeId}">
      <div class="card-media">
        <img 
          src="${safeImg}" 
          alt="${safeTitle} Artwork" 
          loading="lazy" 
          class="card-img"
          onerror="this.onerror=null; this.src='${fallbackUri}';"
        />
        <div class="card-media-overlay"></div>
        <div class="card-media-badge-wrap">
          ${statusBadge}
        </div>
      </div>
      <div class="card-content">
        <div class="card-meta">
          <div class="card-genres">${genreTags}</div>
          <span class="card-platform" title="Platform Engine">${escapeHtml(game.platform || "Web")}</span>
        </div>
        <h3 class="card-title">${safeTitle}</h3>
        <p class="card-description">${safeDesc}</p>
        <div class="card-actions">
          <button 
            type="button" 
            class="btn-card-action ${btnClass}" 
            data-launch-id="${safeId}"
            aria-label="${safeButtonText} for ${safeTitle}"
          >
            <span>${safeButtonText}</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Render Featured Games section (Curated verified collection)
 */
function renderFeaturedGames() {
  if (!DOM.featuredGrid) return;
  const games = getGames();
  const featured = games.filter(g => g.featured);
  DOM.featuredGrid.innerHTML = featured.map(g => createGameCardHtml(g)).join("");
}

/**
 * Render Trending Games section
 */
function renderTrendingGames() {
  if (!DOM.trendingGrid) return;
  const games = getGames();
  const trending = games.filter(g => g.trending);
  DOM.trendingGrid.innerHTML = trending.map(g => createGameCardHtml(g)).join("");
}

/**
 * Render Main Games Directory Catalog
 */
function renderGameCatalog() {
  if (!DOM.catalogGrid) return;

  const filtered = filterGames();
  const sorted = sortGames(filtered);

  // Update count label
  if (DOM.catalogResultCount) {
    const total = getGames().length;
    DOM.catalogResultCount.textContent = `Showing ${sorted.length} of ${total} games`;
  }

  // Handle empty state
  if (sorted.length === 0) {
    DOM.catalogGrid.innerHTML = "";
    if (DOM.emptyState) {
      DOM.emptyState.classList.add("is-visible");
      const emptyDesc = DOM.emptyState.querySelector(".empty-subtitle");
      if (emptyDesc) {
        if (state.searchQuery.trim()) {
          emptyDesc.textContent = `No games matched "${state.searchQuery}". Try another keyword or genre filter.`;
        } else {
          emptyDesc.textContent = `No games found in genre "${state.activeGenre}". Try selecting All Games.`;
        }
      }
    }
    return;
  }

  if (DOM.emptyState) {
    DOM.emptyState.classList.remove("is-visible");
  }

  DOM.catalogGrid.innerHTML = sorted.map(g => createGameCardHtml(g)).join("");
}

// ============================================================================
// 5. FILTERING, SEARCHING & SORTING
// ============================================================================

/**
 * Filters the catalog by search keywords and selected genre
 */
function filterGames() {
  const query = state.searchQuery.trim().toLowerCase();
  const selectedGenre = state.activeGenre;
  const games = getGames();

  return games.filter(game => {
    // 1. Genre filter
    if (selectedGenre !== "All Games") {
      const matchCategory = game.category && game.category.toLowerCase() === selectedGenre.toLowerCase();
      const matchGenres = Array.isArray(game.genres) && game.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase());
      if (!matchCategory && !matchGenres) return false;
    }

    // 2. Search query filter
    if (!query) return true;

    const titleMatch = game.title && game.title.toLowerCase().includes(query);
    const catMatch = game.category && game.category.toLowerCase().includes(query);
    const descMatch = game.description && game.description.toLowerCase().includes(query);
    const platMatch = game.platform && game.platform.toLowerCase().includes(query);
    const genreMatch = Array.isArray(game.genres) && game.genres.some(g => g.toLowerCase().includes(query));
    const keywordMatch = Array.isArray(game.keywords) && game.keywords.some(k => k.toLowerCase().includes(query));

    return titleMatch || catMatch || descMatch || platMatch || genreMatch || keywordMatch;
  });
}

/**
 * Sorts games based on the selected sort criteria (immutable clone)
 */
function sortGames(gamesList) {
  const list = [...gamesList];

  switch (state.sortBy) {
    case "az":
      return list.sort((a, b) => a.title.localeCompare(b.title));

    case "za":
      return list.sort((a, b) => b.title.localeCompare(a.title));

    case "availability":
      // Prioritize confirmed browser games first
      return list.sort((a, b) => {
        const score = (g) => {
          if (g.availability === "browser") return 1;
          if (g.availability === "demo") return 2;
          if (g.availability === "files-required") return 3;
          if (g.availability === "project") return 4;
          return 5;
        };
        return score(a) - score(b);
      });

    case "platform":
      return list.sort((a, b) => (a.platform || "").localeCompare(b.platform || ""));

    case "featured":
    default:
      // Featured games first, preserving catalog order
      return list.sort((a, b) => {
        if (a.featured === b.featured) return 0;
        return a.featured ? -1 : 1;
      });
  }
}

// ============================================================================
// 6. GAME DETAILS MODAL & SAFE EXTERNAL LAUNCH
// ============================================================================

/**
 * Opens Game Details Modal with full metadata
 */
function openGameDetails(gameId) {
  const game = getGameById(gameId);
  if (!game || !DOM.modal) return;

  state.selectedGameId = gameId;

  // Media
  if (DOM.modalMedia) {
    const fallbackUri = getFallbackSvgUri(game.title, game.category);
    DOM.modalMedia.innerHTML = `
      <img 
        src="${escapeHtml(game.image)}" 
        alt="${escapeHtml(game.title)} Cover Art" 
        class="modal-cover-img"
        onerror="this.onerror=null; this.src='${fallbackUri}';"
      />
    `;
  }

  // Title
  if (DOM.modalTitle) {
    DOM.modalTitle.textContent = game.title;
  }

  // Genres
  if (DOM.modalGenres) {
    const genresList = Array.isArray(game.genres) ? game.genres : [game.category];
    DOM.modalGenres.innerHTML = genresList.map(g => `<span class="modal-genre-pill">${escapeHtml(g)}</span>`).join("");
  }

  // Status Badge
  if (DOM.modalStatusBadge) {
    DOM.modalStatusBadge.innerHTML = getAvailabilityBadgeMarkup(game.availability, game.availabilityLabel);
  }

  // Description
  if (DOM.modalDescription) {
    DOM.modalDescription.textContent = game.description;
  }

  // Platform & Requirements
  if (DOM.modalPlatform) {
    DOM.modalPlatform.textContent = game.platform || "Web Browser";
  }
  if (DOM.modalRequirements) {
    DOM.modalRequirements.textContent = game.requirements || "Runs in standard WebGL/WebAssembly browsers.";
  }

  // External Destination Notice
  if (DOM.modalExternalNotice) {
    try {
      const parsed = new URL(game.gameUrl);
      DOM.modalExternalNotice.textContent = `External link opens ${parsed.hostname} in a new tab.`;
    } catch (e) {
      DOM.modalExternalNotice.textContent = "Opens external game destination in a new tab.";
    }
  }

  // Launch Button
  if (DOM.modalLaunchBtn) {
    DOM.modalLaunchBtn.innerHTML = `
      <span>${escapeHtml(game.buttonText || "LAUNCH GAME")}</span>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    `;
    DOM.modalLaunchBtn.setAttribute("data-target-url", game.gameUrl);
  }

  // Show dialog
  DOM.modal.classList.add("is-visible");
  DOM.modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  if (DOM.modalCloseBtn) DOM.modalCloseBtn.focus();
}

/**
 * Closes Game Details Modal
 */
function closeGameDetails() {
  if (!DOM.modal) return;
  DOM.modal.classList.remove("is-visible");
  DOM.modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  state.selectedGameId = null;
}

/**
 * Safely launches external game URL in new tab with noopener noreferrer
 */
function launchExternalDestination(url) {
  if (!isValidGameUrl(url)) {
    alert("This external game destination is currently under verification.");
    return;
  }
  // Open cleanly in new tab preserving Rob-Links session
  window.open(url, "_blank", "noopener,noreferrer");
}

// ============================================================================
// 7. INITIALIZATION & EVENT LISTENERS
// ============================================================================

/**
 * Initialize Genre Pills and sync with Catalog dropdown
 */
function initializeGenreFilters() {
  const genres = typeof GENRES !== "undefined" ? GENRES : [
    "All Games", "FPS", "Horror", "Survival", "Open World", "Racing", 
    "Sports", "Adventure", "Strategy", "RTS", "Simulation", "Sandbox", 
    "RPG", "Action", "Multiplayer"
  ];

  // Populate Genre Pills
  if (DOM.genreFilterContainer) {
    DOM.genreFilterContainer.innerHTML = genres.map(genre => {
      const isActive = genre === state.activeGenre;
      return `
        <button 
          type="button" 
          class="genre-pill ${isActive ? 'is-active' : ''}" 
          data-genre="${escapeHtml(genre)}"
          aria-pressed="${isActive ? 'true' : 'false'}"
        >
          ${escapeHtml(genre)}
        </button>
      `;
    }).join("");

    DOM.genreFilterContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".genre-pill");
      if (!btn) return;
      const targetGenre = btn.getAttribute("data-genre");
      setGenreFilter(targetGenre);
    });
  }

  // Populate Toolbar Dropdown Select
  if (DOM.catalogGenreSelect) {
    DOM.catalogGenreSelect.innerHTML = genres.map(genre => {
      return `<option value="${escapeHtml(genre)}">${escapeHtml(genre)}</option>`;
    }).join("");

    DOM.catalogGenreSelect.value = state.activeGenre;
    DOM.catalogGenreSelect.addEventListener("change", (e) => {
      setGenreFilter(e.target.value);
    });
  }
}

/**
 * Updates active genre across pills, dropdown, and catalog
 */
function setGenreFilter(genre) {
  if (!genre) return;
  state.activeGenre = genre;

  if (DOM.genreFilterContainer) {
    const pills = DOM.genreFilterContainer.querySelectorAll(".genre-pill");
    pills.forEach(pill => {
      const isMatch = pill.getAttribute("data-genre") === genre;
      pill.classList.toggle("is-active", isMatch);
      pill.setAttribute("aria-pressed", isMatch ? "true" : "false");
    });
  }

  if (DOM.catalogGenreSelect) {
    DOM.catalogGenreSelect.value = genre;
  }

  renderGameCatalog();
}

/**
 * Initialize Search Input & Keyboard Shortcut (/)
 */
function initializeSearch() {
  if (!DOM.searchInput) return;

  DOM.searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    if (DOM.clearSearchBtn) {
      DOM.clearSearchBtn.classList.toggle("is-visible", state.searchQuery.length > 0);
    }
    renderGameCatalog();
  });

  if (DOM.clearSearchBtn) {
    DOM.clearSearchBtn.addEventListener("click", () => {
      DOM.searchInput.value = "";
      state.searchQuery = "";
      DOM.clearSearchBtn.classList.remove("is-visible");
      DOM.searchInput.focus();
      renderGameCatalog();
    });
  }

  if (DOM.resetFiltersBtn) {
    DOM.resetFiltersBtn.addEventListener("click", () => {
      if (DOM.searchInput) DOM.searchInput.value = "";
      state.searchQuery = "";
      if (DOM.clearSearchBtn) DOM.clearSearchBtn.classList.remove("is-visible");
      setGenreFilter("All Games");
    });
  }

  // Keyboard shortcut: '/' focuses search bar
  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== DOM.searchInput && !DOM.modal?.classList.contains("is-visible")) {
      e.preventDefault();
      DOM.searchInput?.focus();
    }
  });
}

/**
 * Initialize Catalog Sorting Selector
 */
function initializeSorting() {
  if (!DOM.sortSelect) return;

  DOM.sortSelect.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    renderGameCatalog();
  });
}

/**
 * Event Delegation for Game Cards, Launch Buttons, and Modal
 */
function initializeCardInteractions() {
  document.addEventListener("click", (e) => {
    // 1. Play Now / Action button on card
    const actionBtn = e.target.closest("[data-launch-id]");
    if (actionBtn) {
      e.stopPropagation();
      e.preventDefault();
      const gameId = actionBtn.getAttribute("data-launch-id");
      const game = getGameById(gameId);
      if (game) {
        // Open details modal first so player sees requirements and external redirect info
        openGameDetails(gameId);
      }
      return;
    }

    // 2. Card click opens Game Details Modal
    const card = e.target.closest(".game-card");
    if (card) {
      const gameId = card.getAttribute("data-game-id");
      openGameDetails(gameId);
      return;
    }

    // 3. Modal Launch External Game button click
    const modalLaunch = e.target.closest("#detailsModalLaunchBtn");
    if (modalLaunch) {
      e.preventDefault();
      const targetUrl = modalLaunch.getAttribute("data-target-url");
      if (targetUrl) {
        launchExternalDestination(targetUrl);
      }
      return;
    }
  });

  // Modal Close Handlers
  if (DOM.modalCloseBtn) {
    DOM.modalCloseBtn.addEventListener("click", closeGameDetails);
  }
  if (DOM.modalBackdrop) {
    DOM.modalBackdrop.addEventListener("click", closeGameDetails);
  }
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && DOM.modal?.classList.contains("is-visible")) {
      closeGameDetails();
    }
  });
}

/**
 * Header Navigation, ScrollSpy, and Mobile Drawer
 */
function initializeNavigation() {
  if (DOM.mobileMenuBtn && DOM.mobileNav) {
    DOM.mobileMenuBtn.addEventListener("click", () => {
      const isExpanded = DOM.mobileMenuBtn.getAttribute("aria-expanded") === "true";
      DOM.mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);
      DOM.mobileNav.classList.toggle("is-open", !isExpanded);
    });

    DOM.mobileNav.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        DOM.mobileMenuBtn.setAttribute("aria-expanded", "false");
        DOM.mobileNav.classList.remove("is-open");
      });
    });
  }

  // ScrollSpy for Header
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    if (DOM.header) {
      DOM.header.classList.toggle("is-scrolled", scrollY > 20);
    }

    if (DOM.backToTopBtn) {
      DOM.backToTopBtn.classList.toggle("is-visible", scrollY > 400);
    }

    sections.forEach(section => {
      const height = section.offsetHeight;
      const top = section.offsetTop - 120;
      const id = section.getAttribute("id");

      if (scrollY > top && scrollY <= top + height) {
        document.querySelectorAll(`.nav-link[href="#${id}"]`).forEach(link => link.classList.add("is-active"));
      } else {
        document.querySelectorAll(`.nav-link[href="#${id}"]`).forEach(link => link.classList.remove("is-active"));
      }
    });
  }, { passive: true });

  if (DOM.backToTopBtn) {
    DOM.backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/**
 * Main Initialization
 */
function initializeWebsite() {
  initializeGenreFilters();
  initializeSearch();
  initializeSorting();
  initializeCardInteractions();
  initializeNavigation();

  // Initial renders
  renderFeaturedGames();
  renderTrendingGames();
  renderGameCatalog();

  console.info(
    "%c[ROB-LINKS]%c Ready! 36 browser games loaded into directory.",
    "color: #335fff; font-weight: bold; font-size: 13px;",
    "color: #b8b8b8; font-size: 12px;"
  );
}

// Run when DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWebsite);
} else {
  initializeWebsite();
}
