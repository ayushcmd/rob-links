/**
 * ROB-LINKS — Central Game Configuration & Application Script
 * 
 * A Roblox-inspired game discovery and navigation platform.
 * Configure your games below. When a game has a valid HTTPS URL,
 * clicking Play will safely navigate to that destination.
 */

// ============================================================================
// 1. GAME CONFIGURATION
// ============================================================================

/**
 * Global configuration settings
 */
const CONFIG = {
  // Set to true only if you explicitly need to support unencrypted http:// game demos
  allowHttp: false,
  // Fallback image path if a game thumbnail fails to load
  defaultThumbnail: "assets/images/games/placeholder.svg"
};

/**
 * Central Game Catalog
 * Add or edit your games in this single array.
 * 
 * Schema:
 * {
 *   id: string,              // Unique identifier (slug)
 *   title: string,           // Display name of game
 *   category: string,        // Genre / Category
 *   rating: number|null,     // Community rating (0 - 100)
 *   image: string,           // Relative path to local SVG/image asset
 *   description: string,     // Short description for cards and search
 *   url: string,             // Target external game URL (e.g. "https://your-game.example")
 *   featured: boolean,       // Show in Featured section
 *   trending: boolean        // Show in Trending section
 * }
 */
const GAMES = [
  {
    id: "blox-horror",
    title: "Blox Horror",
    category: "Horror",
    rating: 94,
    image: "assets/images/games/blox-horror.svg",
    description: "Survive the shifting corridors of an abandoned facility in this intense psychological horror experience.",
    url: "",
    featured: true,
    trending: false
  },
  {
    id: "pixel-shooter",
    title: "Pixel Shooter",
    category: "Shooter",
    rating: 91,
    image: "assets/images/games/pixel-shooter.svg",
    description: "Fast-paced tactical retro shooter with intense combat, custom loadouts, and precision gunplay.",
    url: "",
    featured: true,
    trending: false
  },
  {
    id: "zombie-survival",
    title: "Zombie Survival",
    category: "Survival",
    rating: 92,
    image: "assets/images/games/zombie-survival.svg",
    description: "Scavenge resources, fortify shelters, and withstand relentless undead hordes under the toxic moon.",
    url: "",
    featured: true,
    trending: false
  },
  {
    id: "doors",
    title: "Doors",
    category: "Horror",
    rating: 93,
    image: "assets/images/games/doors.svg",
    description: "Navigate through 100 mysterious hotel rooms while outwitting terrifying entities lurking in shadows.",
    url: "",
    featured: false,
    trending: true
  },
  {
    id: "home-alone",
    title: "Home Alone: Anomalies",
    category: "Horror",
    rating: 94,
    image: "assets/images/games/home-alone.svg",
    description: "Inspect surveillance monitors and report bizarre paranormal anomalies before morning arrives.",
    url: "",
    featured: false,
    trending: true
  },
  {
    id: "untitled-rpg",
    title: "Untitled RPG",
    category: "Adventure",
    rating: 89,
    image: "assets/images/games/untitled-rpg.svg",
    description: "Embark on an epic fantasy quest across floating islands, forge gear, and conquer ancient dungeons.",
    url: "",
    featured: false,
    trending: true
  },
  {
    id: "last-stop",
    title: "Last Stop",
    category: "Survival",
    rating: 97,
    image: "assets/images/games/last-stop.svg",
    description: "An eerie survival challenge trapped in a forgotten underground subway network after midnight.",
    url: "",
    featured: false,
    trending: true
  },
  {
    id: "retro-racer",
    title: "Retro Racer",
    category: "Racing",
    rating: 90,
    image: "assets/images/games/retro-racer.svg",
    description: "Drift along neon highways to synthwave beats with ultra-smooth retro arcade car physics.",
    url: "",
    featured: false,
    trending: false
  },
  {
    id: "puzzle-lab",
    title: "Puzzle Lab",
    category: "Puzzle",
    rating: 88,
    image: "assets/images/games/puzzle-lab.svg",
    description: "Test your intellect across quantum laser chambers, gravity switches, and spatial anomalies.",
    url: "",
    featured: false,
    trending: false
  },
  {
    id: "sandbox-world",
    title: "Sandbox World",
    category: "Sandbox",
    rating: 95,
    image: "assets/images/games/sandbox-world.svg",
    description: "Construct limitless voxel creations, mine rare minerals, and explore infinite procedural realms.",
    url: "",
    featured: false,
    trending: false
  },
  {
    id: "sports-arena",
    title: "Sports Arena",
    category: "Sports",
    rating: 86,
    image: "assets/images/games/sports-arena.svg",
    description: "High-octane stadium sports tournament with physics-based balls and electric crowd atmospheres.",
    url: "",
    featured: false,
    trending: false
  },
  {
    id: "arcade-rush",
    title: "Arcade Rush",
    category: "Arcade",
    rating: 92,
    image: "assets/images/games/arcade-rush.svg",
    description: "Relive golden era 80s coin-op action with score-chasing challenges, retro art, and bullet chaos.",
    url: "",
    featured: false,
    trending: false
  }
];

// Available Genres list for the filter bars
const GENRES = [
  "All Games",
  "Horror",
  "Shooter",
  "Adventure",
  "Racing",
  "Survival",
  "Puzzle",
  "Sandbox",
  "Sports",
  "Multiplayer",
  "Arcade"
];

// ============================================================================
// 2. DOM REFERENCES
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
  
  // Notification Modal for unconfigured / status messages
  modal: document.getElementById("unconfiguredModal"),
  modalTitle: document.getElementById("modalGameTitle"),
  modalCloseBtn: document.getElementById("modalCloseBtn"),
  modalBackdrop: document.getElementById("modalBackdrop")
};

// Application state for directory filtering
const state = {
  searchQuery: "",
  activeGenre: "All Games",
  sortBy: "featured" // "featured" | "rating" | "az" | "newest"
};

// ============================================================================
// 3. URL VALIDATION & SECURITY
// ============================================================================

/**
 * Validates external destination URLs.
 * Strictly permits HTTPS by default. HTTP is only permitted if CONFIG.allowHttp === true.
 * Rejects javascript:, data:, file:, blob:, and invalid URLs.
 * 
 * @param {string} url - URL string to inspect
 * @returns {boolean} True if the URL is valid and permitted
 */
function isValidGameUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:") {
      return true;
    }
    if (CONFIG.allowHttp && parsed.protocol === "http:") {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

// ============================================================================
// 4. GAME HELPERS
// ============================================================================

/**
 * Find a game by its unique ID
 * @param {string} id - The unique game identifier
 * @returns {object|undefined} The game object or undefined
 */
function getGameById(id) {
  if (!id) return undefined;
  return GAMES.find(g => g.id === id);
}

/**
 * Safely extract the external destination URL for a game
 * @param {object} game - The game object
 * @returns {string} Trimmed URL or empty string
 */
function getGameUrl(game) {
  if (!game || !game.url || typeof game.url !== "string") return "";
  return game.url.trim();
}

/**
 * Check whether a game has a verified, executable external URL configured
 * @param {object} game - The game object
 * @returns {boolean}
 */
function isGameConfigured(game) {
  if (!game) return false;
  const url = getGameUrl(game);
  return isValidGameUrl(url);
}

/**
 * Escape HTML to prevent injection when rendering text
 * @param {string} str - Raw string
 * @returns {string} Sanitized string
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

// ============================================================================
// 5. GAME LAUNCH & INTERACTION
// ============================================================================

/**
 * Handles launching or notifying about a game
 * @param {string} gameId - Unique ID of game
 */
function handleGameLaunch(gameId) {
  const game = getGameById(gameId);
  if (!game) {
    showModal("Game Not Found", "The requested game entry could not be located in the catalog.");
    return;
  }

  if (isGameConfigured(game)) {
    const validUrl = getGameUrl(game);
    // Safe browser navigation using window.location.assign
    window.location.assign(validUrl);
  } else {
    // Show friendly, Roblox-styled notification without navigating
    const message = `The external demo link for "${game.title}" has not been configured yet. To play, configure a valid HTTPS URL in assets/js/app.js.`;
    showModal(game.title, message);
  }
}

/**
 * Opens the accessible notification dialog
 * @param {string} title - Heading
 * @param {string} message - Explanatory body text
 */
function showModal(title, message) {
  if (!DOM.modal) return;
  if (DOM.modalTitle) DOM.modalTitle.textContent = title;
  const descEl = document.getElementById("modalGameDesc");
  if (descEl) descEl.textContent = message;

  DOM.modal.classList.add("is-visible");
  DOM.modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  if (DOM.modalCloseBtn) DOM.modalCloseBtn.focus();
}

/**
 * Closes the notification dialog
 */
function closeModal() {
  if (!DOM.modal) return;
  DOM.modal.classList.remove("is-visible");
  DOM.modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

// ============================================================================
// 6. CARD RENDERING
// ============================================================================

/**
 * Creates HTML markup for a standard game card
 * @param {object} game - The game object
 * @param {object} options - Optional rendering flags (e.g. badge)
 * @returns {string} HTML string
 */
function createGameCardHtml(game, options = {}) {
  const isConfigured = isGameConfigured(game);
  const ratingText = typeof game.rating === "number" ? `${game.rating}%` : "Unrated";
  const imageSrc = game.image || CONFIG.defaultThumbnail;
  const safeTitle = escapeHtml(game.title);
  const safeCategory = escapeHtml(game.category);
  const safeDesc = escapeHtml(game.description || "");
  const cardBadge = isConfigured 
    ? `<span class="card-status-badge is-live" title="External link verified"><span class="status-dot"></span>Playable</span>`
    : `<span class="card-status-badge is-pending" title="Demo link not configured yet"><span class="status-dot"></span>Demo Soon</span>`;

  return `
    <article class="game-card ${isConfigured ? 'is-configured' : 'is-unconfigured'}" data-game-id="${escapeHtml(game.id)}">
      <div class="card-media">
        <img 
          src="${escapeHtml(imageSrc)}" 
          alt="${safeTitle} thumbnail" 
          loading="lazy" 
          class="card-img"
          onerror="this.onerror=null; this.src='${CONFIG.defaultThumbnail}';"
        />
        <div class="card-media-overlay"></div>
        ${cardBadge}
      </div>
      <div class="card-content">
        <div class="card-meta">
          <span class="card-category">${safeCategory}</span>
          <span class="card-rating" title="Player Rating: ${ratingText}">
            <svg class="star-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            ${ratingText}
          </span>
        </div>
        <h3 class="card-title">${safeTitle}</h3>
        <p class="card-description">${safeDesc}</p>
        <div class="card-actions">
          <button 
            type="button" 
            class="btn-play ${isConfigured ? 'btn-play-primary' : 'btn-play-unconfigured'}" 
            data-launch-id="${escapeHtml(game.id)}"
            aria-label="${isConfigured ? 'Play ' + safeTitle : safeTitle + ' (Link not configured)'}"
          >
            <svg class="play-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>${isConfigured ? 'Play' : 'Demo Soon'}</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Render Featured Games section (3 cards)
 */
function renderFeaturedGames() {
  if (!DOM.featuredGrid) return;
  const featured = GAMES.filter(g => g.featured);
  DOM.featuredGrid.innerHTML = featured.map(g => createGameCardHtml(g)).join("");
}

/**
 * Render Trending Games section (4 cards)
 */
function renderTrendingGames() {
  if (!DOM.trendingGrid) return;
  const trending = GAMES.filter(g => g.trending);
  DOM.trendingGrid.innerHTML = trending.map(g => createGameCardHtml(g)).join("");
}

/**
 * Render Main Game Catalog based on current search, genre, and sort state
 */
function renderGameCatalog() {
  if (!DOM.catalogGrid) return;

  const filtered = filterGames();
  const sorted = sortGames(filtered);

  // Update counter
  if (DOM.catalogResultCount) {
    DOM.catalogResultCount.textContent = `Showing ${sorted.length} ${sorted.length === 1 ? 'game' : 'games'}`;
  }

  // Handle empty state
  if (sorted.length === 0) {
    DOM.catalogGrid.innerHTML = "";
    if (DOM.emptyState) {
      DOM.emptyState.classList.add("is-visible");
      const emptyDesc = DOM.emptyState.querySelector(".empty-subtitle");
      if (emptyDesc) {
        if (state.searchQuery.trim()) {
          emptyDesc.textContent = `No games matched "${state.searchQuery}". Try another keyword or reset filters.`;
        } else {
          emptyDesc.textContent = `No games found in category "${state.activeGenre}". Try selecting a different genre.`;
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
// 7. FILTERING, SEARCHING & SORTING
// ============================================================================

/**
 * Filters the catalog by search keyword and category
 * @returns {Array} Filtered list of games (cloned)
 */
function filterGames() {
  const query = state.searchQuery.trim().toLowerCase();
  const selectedGenre = state.activeGenre;

  return GAMES.filter(game => {
    // 1. Genre filter check
    const matchesGenre = (selectedGenre === "All Games") ||
      (game.category && game.category.toLowerCase() === selectedGenre.toLowerCase());

    if (!matchesGenre) return false;

    // 2. Search query check
    if (!query) return true;

    const titleMatch = game.title && game.title.toLowerCase().includes(query);
    const catMatch = game.category && game.category.toLowerCase().includes(query);
    const descMatch = game.description && game.description.toLowerCase().includes(query);

    return titleMatch || catMatch || descMatch;
  });
}

/**
 * Sorts games based on the selected sort criteria without mutating the original catalog
 * @param {Array} gamesList - Array of games to sort
 * @returns {Array} Sorted copy
 */
function sortGames(gamesList) {
  const list = [...gamesList];

  switch (state.sortBy) {
    case "rating":
      // Highest rated first
      return list.sort((a, b) => {
        const ratingA = typeof a.rating === "number" ? a.rating : -1;
        const ratingB = typeof b.rating === "number" ? b.rating : -1;
        return ratingB - ratingA;
      });

    case "az":
      // Alphabetical A-Z
      return list.sort((a, b) => a.title.localeCompare(b.title));

    case "newest":
      // Catalog order (recently added)
      return list;

    case "featured":
    default:
      // Featured first, preserving stable catalog order
      return list.sort((a, b) => {
        if (a.featured === b.featured) return 0;
        return a.featured ? -1 : 1;
      });
  }
}

// ============================================================================
// 8. INTERACTION HANDLERS & EVENT INITIALIZATION
// ============================================================================

/**
 * Initialize Genre Filter Pills and Sync with Catalog Toolbar
 */
function initializeGenreFilters() {
  // Populate the Explore Genres section pills
  if (DOM.genreFilterContainer) {
    DOM.genreFilterContainer.innerHTML = GENRES.map(genre => {
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

  // Populate the Toolbar dropdown select
  if (DOM.catalogGenreSelect) {
    DOM.catalogGenreSelect.innerHTML = GENRES.map(genre => {
      return `<option value="${escapeHtml(genre)}">${escapeHtml(genre)}</option>`;
    }).join("");

    DOM.catalogGenreSelect.value = state.activeGenre;
    DOM.catalogGenreSelect.addEventListener("change", (e) => {
      setGenreFilter(e.target.value);
    });
  }
}

/**
 * Updates the active genre across both the pills and the dropdown selector
 * @param {string} genre - Genre name
 */
function setGenreFilter(genre) {
  if (!genre) return;
  state.activeGenre = genre;

  // Update pills styling
  if (DOM.genreFilterContainer) {
    const pills = DOM.genreFilterContainer.querySelectorAll(".genre-pill");
    pills.forEach(pill => {
      const isMatch = pill.getAttribute("data-genre") === genre;
      pill.classList.toggle("is-active", isMatch);
      pill.setAttribute("aria-pressed", isMatch ? "true" : "false");
    });
  }

  // Sync toolbar select
  if (DOM.catalogGenreSelect) {
    DOM.catalogGenreSelect.value = genre;
  }

  renderGameCatalog();
}

/**
 * Initialize Search Input handling
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
 * Setup Event Delegation for Game Cards & Play Buttons across all sections
 */
function initializeGameCardClicks() {
  document.addEventListener("click", (e) => {
    // 1. Play button click
    const playBtn = e.target.closest("[data-launch-id]");
    if (playBtn) {
      e.stopPropagation();
      e.preventDefault();
      const gameId = playBtn.getAttribute("data-launch-id");
      handleGameLaunch(gameId);
      return;
    }

    // 2. Card click (clicking thumbnail or card body)
    const card = e.target.closest(".game-card");
    if (card) {
      const gameId = card.getAttribute("data-game-id");
      handleGameLaunch(gameId);
      return;
    }
  });
}

/**
 * Setup Navigation, Sticky Header, and Mobile Menu
 */
function initializeNavigation() {
  // Mobile Hamburger Toggle
  if (DOM.mobileMenuBtn && DOM.mobileNav) {
    DOM.mobileMenuBtn.addEventListener("click", () => {
      const isExpanded = DOM.mobileMenuBtn.getAttribute("aria-expanded") === "true";
      DOM.mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);
      DOM.mobileNav.classList.toggle("is-open", !isExpanded);
    });

    // Close mobile nav when clicking any link
    DOM.mobileNav.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        DOM.mobileMenuBtn.setAttribute("aria-expanded", "false");
        DOM.mobileNav.classList.remove("is-open");
      });
    });
  }

  // Active Navigation Indicator on scroll
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // Header shadow/background toggle
    if (DOM.header) {
      DOM.header.classList.toggle("is-scrolled", scrollY > 20);
    }

    // Back to top button visibility
    if (DOM.backToTopBtn) {
      DOM.backToTopBtn.classList.toggle("is-visible", scrollY > 400);
    }

    // Update active nav link
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(`.nav-link[href="#${sectionId}"]`).forEach(link => {
          link.classList.add("is-active");
        });
      } else {
        document.querySelectorAll(`.nav-link[href="#${sectionId}"]`).forEach(link => {
          link.classList.remove("is-active");
        });
      }
    });
  }, { passive: true });

  // Back to top click
  if (DOM.backToTopBtn) {
    DOM.backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Modal dialog handlers
  if (DOM.modalCloseBtn) {
    DOM.modalCloseBtn.addEventListener("click", closeModal);
  }
  if (DOM.modalBackdrop) {
    DOM.modalBackdrop.addEventListener("click", closeModal);
  }
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && DOM.modal && DOM.modal.classList.contains("is-visible")) {
      closeModal();
    }
  });
}

// ============================================================================
// 9. WEBSITE INITIALIZATION
// ============================================================================

function initializeWebsite() {
  initializeGenreFilters();
  initializeSearch();
  initializeSorting();
  initializeGameCardClicks();
  initializeNavigation();

  // Initial renders
  renderFeaturedGames();
  renderTrendingGames();
  renderGameCatalog();

  // Print helpful console message for developers
  console.info(
    "%c[ROB-LINKS]%c Ready! To configure games with live external URLs, edit the `GAMES` array at the top of `assets/js/app.js`.",
    "color: #335fff; font-weight: bold; font-size: 13px;",
    "color: #b8b8b8; font-size: 12px;"
  );
}

// Run on DOM content loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWebsite);
} else {
  initializeWebsite();
}
