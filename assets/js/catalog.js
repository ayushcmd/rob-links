/* Pure catalog operations shared by the UI and the regression checks. */
const Catalog = (() => {
  const statuses = {
    browser: 'Browser playable',
    demo: 'Playable demo',
    'files-required': 'Original files required',
    project: 'Link Pending',
    unavailable: 'Link Pending',
    offline: 'Offline / removed'
  };
  const safeUrl = value => {
    try {
      const u = new URL(value);
      return u.protocol === 'https:' && !u.username && !u.password && !/portedgames\.com/i.test(u.hostname) ? u.href : null;
    } catch {
      return null;
    }
  };
  const platforms = g => {
    const found = ['WebAssembly', 'WebGL', 'HTML5', 'JavaScript', 'TeaVM', 'WebXash', 'Canvas', 'Three.js', 'Rust'].filter(p => (g.platform || '').includes(p));
    return found.length ? found : [g.platform || 'Web'];
  };
  const features = g => ['Multiplayer', 'Open World', 'RTS', 'Classic'].filter(f => (g.genres || []).includes(f)).concat(/singleplayer/i.test((g.description || '') + (g.requirements || '')) ? ['Single player'] : []);
  const availability = g => {
    if (g.availability === 'offline') return 'offline';
    if (g.availability === 'files-required') return 'files-required';
    if (!safeUrl(g.launchUrl)) return 'unavailable';
    return g.availability || 'browser';
  };
  const search = (g, q) => q.toLowerCase().trim().split(/\s+/).every(word => [g.title, g.description, g.platform, ...(g.genres || []), ...(g.keywords || [])].join(' ').toLowerCase().includes(word));
  function filter(games, params) {
    const selected = key => params.getAll(key);
    const any = (key, values) => !selected(key).length || selected(key).some(v => values.includes(v));
    const result = games.filter(g => search(g, params.get('q') || '') && any('genre', g.genres || []) && any('platform', platforms(g)) && any('availability', [availability(g)]) && any('feature', features(g)));
    const sort = params.get('sort');
    if (sort === 'az' || sort === 'za') result.sort((a,b) => a.title.localeCompare(b.title) * (sort === 'za' ? -1 : 1));
    if (sort === 'platform') result.sort((a,b) => (a.platform || '').localeCompare(b.platform || '') || a.title.localeCompare(b.title));
    if (sort === 'availability') result.sort((a,b) => ['browser','demo','files-required','project','unavailable','offline'].indexOf(availability(a)) - ['browser','demo','files-required','project','unavailable','offline'].indexOf(availability(b)));
    return result;
  }
  return { statuses, safeUrl, platforms, features, availability, search, filter };
})();
if (typeof module !== 'undefined') module.exports = Catalog;
