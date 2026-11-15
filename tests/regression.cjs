/* Optional developer checks. Node is not required to run or deploy the site. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const { GAMES_DATA: games } = require('../assets/js/games-data.js');
const Catalog = require('../assets/js/catalog.js');
let passed = 0;
function check(name, test) { test(); passed++; console.log(`PASS ${name}`); }
const filter = q => Catalog.filter(games, new URLSearchParams(q));

check('173 unique records and all artwork paths exist', () => {
  assert.equal(games.length, 173);
  assert.equal(new Set(games.map(g=>g.id)).size, 173);
  games.forEach(g=>assert.ok(fs.existsSync(g.image), `${g.id}: ${g.image}`));
});

check('Original 36 game records preserved against Git HEAD', () => {
  const source = execFileSync('git',['show','HEAD:assets/js/games-data.js'],{encoding:'utf8'});
  const original = vm.runInNewContext(`${source}; GAMES_DATA`);
  assert.equal(original.length, 36);
  for (const old of original) {
    const current = games.find(g=>g.id===old.id);
    assert.ok(current, `Missing original game: ${old.id}`);
    assert.equal(current.title, old.title);
    assert.equal(current.image, old.image);
    assert.ok(fs.existsSync(current.image));
  }
});

check('Original logo, favicon, hero and game assets are unchanged', () => {
  const changed = execFileSync('git',['diff','--name-only','HEAD','--','assets/images'],{encoding:'utf8'}).trim();
  assert.equal(changed, '');
});

check('Title, genre, keyword, and platform search', () => {
  assert.equal(filter('q=vice+city')[0].id, 'gta-vc');
  assert.ok(filter('q=racing').every(g => Catalog.search(g, 'racing')));
  assert.equal(filter('q=strogg')[0].id, 'quake-2');
  assert.ok(filter('q=WebXash').length >= 1);
  assert.equal(filter('q=not-a-real-game').length, 0);
  assert.ok(filter('q=alley+cat').length >= 1);
  assert.ok(filter('q=arena+of+champions').length >= 1);
});

check('Filters combine with search and support OR within groups', () => {
  const result = filter('genre=FPS&platform=WebAssembly&availability=browser&feature=Multiplayer&q=quake');
  assert.deepEqual(result.map(g=>g.id), ['quake-3','quake-2','quake-1','urban-terror']);
  assert.ok(filter('genre=Sports&genre=Racing').some(g=>g.category==='Sports'));
  assert.ok(filter('genre=Sports&genre=Racing').some(g=>g.category==='Racing'));
  assert.equal(filter('genre=Racing&platform=HTML5').length, 0);
});

check('All sorting modes preserve the matching records', () => {
  const baseline = games.map(g=>g.id).sort();
  for(const sort of ['catalog','az','za','availability','platform']) {
    assert.deepEqual(filter(`sort=${sort}`).map(g=>g.id).sort(), baseline);
  }
  assert.deepEqual(filter('sort=az').map(g=>g.title), filter('sort=za').map(g=>g.title).reverse());
});

check('URL validation rejects unsafe schemes, credentials, and directory URLs', () => {
  for(const url of [null, '', 'javascript:alert(1)', 'data:text/html,test', 'http://example.com', 'https://user:pass@example.com', 'https://portedgames.com/test/']) {
    assert.equal(Catalog.safeUrl(url), null);
  }
  assert.equal(Catalog.safeUrl('https://example.com/game'), 'https://example.com/game');
});

check('Editorial ranks are unique and project pages do not become launch URLs', () => {
  const ranks = games.map(g=>g.trendingRank).filter(Number.isInteger);
  assert.equal(new Set(ranks).size, ranks.length);
  for(const g of games.filter(g=>g.availability==='project' || g.availability==='offline')) {
    assert.equal(g.launchUrl, null);
  }
  assert.equal(Catalog.availability({...games[0], availability:'browser', launchUrl:null}), 'unavailable');
});

// A lightweight DOM contract harness executes the actual application and events.
function appHarness(hash='#home', data=games) {
  const nodes = new Map(), windowEvents = {}, docEvents = {};
  function node(id) {
    if(nodes.has(id)) return nodes.get(id);
    const classes = new Set();
    const n = {
      innerHTML: '', textContent: '', value: '', disabled: false, open: false, isConnected: true, dataset: {}, attributes: {}, events: {},
      classList: {
        add: x => classes.add(x), remove: x => classes.delete(x), contains: x => classes.has(x),
        toggle(x, force) { const on = force ?? !classes.has(x); if(on) classes.add(x); else classes.delete(x); return on; }
      },
      addEventListener(type, fn) { this.events[type] = fn; },
      setAttribute(k, v) { this.attributes[k] = v; },
      removeAttribute(k) { delete this.attributes[k]; },
      focus() { document.activeElement = this; },
      showModal() { this.open = true; },
      close() { this.open = false; this.events.close?.(); },
      replaceChildren(...children) { this.children = children; },
      matches() { return false; }
    };
    nodes.set(id, n);
    return n;
  }
  const nav = ['home','discover','trending','genres'].map(name => Object.assign(node(`nav-${name}`), { hash: `#${name}` }));
  const views = ['grid','list'].map(view => Object.assign(node(`view-${view}`), { dataset: { view } }));
  const document = {
    querySelector: node,
    querySelectorAll: s => s === '#navigation a' ? nav : s === '[data-view]' ? views : [],
    addEventListener: (k, f) => docEvents[k] = f,
    createElement: tag => node(`created-${tag}`),
    activeElement: node('initial'),
    title: ''
  };
  const location = { hash };
  const history = { replaceState: (_, __, value) => location.hash = value };
  const window = { addEventListener: (k, f) => windowEvents[k] = f, scrollTo() {} };
  const context = {
    document, location, history, window,
    matchMedia: () => ({ matches: false }),
    GAMES_DATA: structuredClone(data),
    Catalog, URLSearchParams, URL, console,
    navigator: { clipboard: { writeText: async () => {} } }
  };
  vm.runInNewContext(fs.readFileSync('assets/js/app.js', 'utf8'), context);
  return {
    nodes, node, document, location, docEvents, context,
    go(hash) { location.hash = hash; windowEvents.hashchange(); },
    click(id) { return node('#main').events.click({ target: { closest: () => Object.assign(node(`#${id}`), { id, hasAttribute: () => false }) } }); }
  };
}

check('All core sections render and navigation has an active page', () => {
  const app = appHarness();
  for(const [route, text] of [['home','One platform'],['discover','Discover'],['trending','Editorial ordering'],['genres','Browse by']]) {
    app.go(`#${route}`);
    assert.ok(app.node('#main').innerHTML.includes(text), `Route #${route} does not include "${text}"`);
    assert.equal(app.node(`nav-${route}`).attributes['aria-current'], 'page');
  }
});

check('Discover renders all 173 catalog records with no internal player links', () => {
  const app = appHarness('#discover');
  const cardMatches = app.node('#catalog-grid').innerHTML.match(/class="game-card /g) || [];
  assert.equal(cardMatches.length, 173);
  assert.equal(app.node('#result-count').textContent, '173 / 173');
  assert.ok(!app.node('#catalog-grid').innerHTML.includes('#play?game='), 'Discovered internal player link in catalog');
});

check('Play Now buttons with valid URLs open directly in a new tab', () => {
  const app = appHarness('#discover');
  const playable = games.filter(g => Catalog.safeUrl(g.launchUrl));
  assert.ok(playable.length >= 30, `Expected at least 30 playable games, found ${playable.length}`);
  for(const g of playable) {
    const safe = Catalog.safeUrl(g.launchUrl);
    assert.ok(
      app.node('#catalog-grid').innerHTML.includes(`href="${safe}" target="_blank" rel="noopener noreferrer"`),
      `Missing direct external link for ${g.id}: ${safe}`
    );
  }
});

check('Games without usable launch URLs show Link Pending and disabled actions', () => {
  const app = appHarness('#discover');
  const pending = games.filter(g => !Catalog.safeUrl(g.launchUrl));
  assert.ok(pending.length >= 35, `Expected at least 35 pending games, found ${pending.length}`);
  assert.ok(app.node('#catalog-grid').innerHTML.includes('Link Pending'));
  assert.ok(app.node('#catalog-grid').innerHTML.includes('class="play-link pending" disabled'));
});

check('Deep links render combined filters, list layout and empty states', () => {
  const app = appHarness('#discover?genre=Sports&sort=az&view=list');
  const sportsCount = games.filter(g => g.genres.includes('Sports')).length;
  assert.equal(app.node('#result-count').textContent, `${sportsCount} / ${games.length}`);
  assert.ok(app.node('#catalog-grid').classList.contains('list-view'));
  app.go('#discover?q=does-not-exist');
  assert.ok(app.node('#catalog-grid').innerHTML.includes('No games found'));
  app.go('#genres?genre=Racing');
  assert.ok(app.node('#main').innerHTML.includes('#discover?genre=Racing'));
});

check('Global search opens, filters results, clears, and restores focus', () => {
  const app = appHarness();
  const origin = app.document.activeElement;
  app.node('#search-open').events.click();
  assert.equal(app.node('#search-dialog').open, true);
  app.node('#global-search').value = 'vice city';
  app.node('#global-search').events.input();
  assert.ok(app.node('#search-count').textContent.includes('matching your search'));
  app.node('#search-clear').events.click();
  assert.equal(app.node('#global-search').value, '');
  app.node('#search-close').events.click();
  assert.equal(app.node('#search-dialog').open, false);
  assert.equal(app.document.activeElement, origin);
});

check('Dynamic catalog strings are escaped in rendered markup', () => {
  const data = structuredClone(games);
  data[0].title = '<img src=x onerror=alert(1)>';
  const app = appHarness('#discover', data);
  assert.ok(!app.node('#catalog-grid').innerHTML.includes('<img src=x'));
  assert.ok(app.node('#catalog-grid').innerHTML.includes('&lt;img src=x'));
});

console.log(`\n${passed} checks passed. Direct game launching and catalog verified.`);
