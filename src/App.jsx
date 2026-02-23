import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PlayerView from './PlayerView';
import ChannelCard from './ChannelCard';
import RowSection from './RowSection';
import PlaylistManager from './PlaylistManager';
import MultiView from './MultiView';
import {
  CHANNELS, CATEGORY_META,
  CATEGORIES_ORDER, LANGUAGE_FILTERS
} from './channels';
import './styles.css';

export default function App({ onReady }) {
  const [view, setView] = useState('home'); // home | player | multiview
  const [selCh, setSelCh] = useState(null);
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState('all');
  const [clock, setClock] = useState(new Date());
  const [sidebar, setSidebar] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sh_favs') || '[]'); } catch { return []; }
  });
  const [customPlaylists, setCustomPlaylists] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sh_playlists') || '[]'); } catch { return []; }
  });
  const [showPlaylistMgr, setShowPlaylistMgr] = useState(false);

  // PIP state
  const [pipChannel, setPipChannel] = useState(null);
  const playerRef = useRef(null);

  // Multi-view state
  const [multiviewChannels, setMultiviewChannels] = useState([]);

  const searchRef = useRef(null);
  const rowRefs = useRef({});
  const [focusRow, setFocusRow] = useState(0);
  const [focusCol, setFocusCol] = useState(0);

  // Signal ready
  useEffect(() => { onReady?.(); }, []);

  // Clock
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // Save favorites
  useEffect(() => {
    try { localStorage.setItem('sh_favs', JSON.stringify(favorites)); } catch {}
  }, [favorites]);

  // Save custom playlists
  useEffect(() => {
    try { localStorage.setItem('sh_playlists', JSON.stringify(customPlaylists)); } catch {}
  }, [customPlaylists]);

  const addPlaylist = (pl) => setCustomPlaylists(prev => [...prev, pl]);
  const deletePlaylist = (id) => setCustomPlaylists(prev => prev.filter(p => p.id !== id));

  const toggleFav = (chId) => {
    setFavorites(f => f.includes(chId) ? f.filter(x => x !== chId) : [...f, chId]);
  };

  // ---- Merged channels (built-in + custom playlists) ----
  const allChannels = useMemo(() => {
    const custom = customPlaylists.flatMap(pl => pl.channels);
    return [...CHANNELS, ...custom];
  }, [customPlaylists]);

  // ---- Filtered data ----
  const filtered = useMemo(() =>
    allChannels.filter(ch => {
      if (lang !== 'all' && !ch.languages?.includes(lang)) return false;
      if (search) {
        const q = search.toLowerCase();
        return ch.name.toLowerCase().includes(q) || ch.country.toLowerCase().includes(q) || ch.id.includes(q);
      }
      return true;
    }), [allChannels, lang, search]);

  const favChannels = useMemo(() =>
    allChannels.filter(ch => favorites.includes(ch.id)), [allChannels, favorites]);

  const allCats = useMemo(() => {
    const extra = new Set();
    filtered.forEach(ch => ch.categories.forEach(c => extra.add(c)));
    const ordered = [...CATEGORIES_ORDER];
    extra.forEach(c => { if (!ordered.includes(c)) ordered.push(c); });
    return ordered;
  }, [filtered]);

  const byCat = useMemo(() => {
    const m = {};
    allCats.forEach(c => {
      m[c] = filtered.filter(ch => ch.categories.includes(c));
    });
    return m;
  }, [filtered, allCats]);

  const activeCats = useMemo(() =>
    allCats.filter(c => (byCat[c] || []).length > 0), [allCats, byCat]);

  // Row structure for keyboard nav
  const rowKeys = useMemo(() => {
    const rows = [];
    if (favChannels.length > 0) rows.push('favorites');
    rows.push('languages');
    rows.push(...activeCats);
    return rows;
  }, [activeCats, favChannels]);

  const getRowLen = useCallback((ri) => {
    const key = rowKeys[ri];
    if (key === 'favorites') return favChannels.length;
    if (key === 'languages') return LANGUAGE_FILTERS.length;
    return (byCat[key] || []).length;
  }, [rowKeys, byCat, favChannels]);

  // ---- Keyboard navigation (Fire TV remote) ----
  useEffect(() => {
    if (view !== 'home') return;
    const h = (e) => {
      if (e.target.tagName === 'INPUT') return;
      switch (e.key) {
        case 'ArrowUp': e.preventDefault(); setFocusRow(r => Math.max(0, r - 1)); break;
        case 'ArrowDown': e.preventDefault(); setFocusRow(r => Math.min(rowKeys.length - 1, r + 1)); break;
        case 'ArrowLeft': e.preventDefault(); setFocusCol(c => Math.max(0, c - 1)); break;
        case 'ArrowRight': e.preventDefault(); setFocusCol(c => Math.min((getRowLen(focusRow) || 1) - 1, c + 1)); break;
        case 'Enter':
          e.preventDefault();
          handleRowSelect(focusRow, focusCol);
          break;
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [view, focusRow, focusCol, rowKeys, getRowLen]);

  // Clamp column
  useEffect(() => {
    const max = (getRowLen(focusRow) || 1) - 1;
    if (focusCol > max) setFocusCol(Math.max(0, max));
  }, [focusRow, focusCol, getRowLen]);

  // Scroll into view
  useEffect(() => {
    const el = rowRefs.current[focusRow];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [focusRow]);

  // ---- Play ----
  const playCh = useCallback((ch) => {
    setSelCh(ch);
    setView('player');
    setSidebar(false);
  }, []);

  const handleRowSelect = (row, col) => {
    const key = rowKeys[row];
    if (key === 'favorites') {
      const ch = favChannels[col];
      if (ch) playCh(ch);
    } else if (key === 'languages') {
      setLang(LANGUAGE_FILTERS[col]?.code || 'all');
    } else {
      const ch = byCat[key]?.[col];
      if (ch) playCh(ch);
    }
  };

  const handleBack = useCallback(() => {
    // Check if PIP is active — keep the channel reference
    if (playerRef.current?.isPIP?.()) {
      setPipChannel(selCh);
    }
    setView('home');
    setSelCh(null);
    setSidebar(false);
  }, [selCh]);

  // Multi-view handlers
  const enterMultiview = useCallback(() => {
    if (selCh) {
      setMultiviewChannels([selCh]);
    }
    setView('multiview');
    setSidebar(false);
  }, [selCh]);

  const addToMultiview = useCallback((ch) => {
    setMultiviewChannels(prev => {
      if (prev.length >= 4 || prev.find(c => c.id === ch.id)) return prev;
      return [...prev, ch];
    });
  }, []);

  const removeFromMultiview = useCallback((chId) => {
    setMultiviewChannels(prev => prev.filter(c => c.id !== chId));
  }, []);

  const handleMultiviewBack = useCallback(() => {
    setView('home');
    setMultiviewChannels([]);
  }, []);

  // Global escape
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        if (e.target.tagName === 'INPUT') return;
        e.preventDefault();
        if (sidebar) setSidebar(false);
        else if (view === 'player') handleBack();
        else if (view === 'multiview') handleMultiviewBack();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [view, sidebar, handleBack, handleMultiviewBack]);

  // ---- Multi-View ----
  if (view === 'multiview') {
    return (
      <MultiView
        channels={multiviewChannels}
        allChannels={allChannels}
        onBack={handleMultiviewBack}
        onAddChannel={addToMultiview}
        onRemoveChannel={removeFromMultiview}
      />
    );
  }

  // ---- Player View ----
  if (view === 'player' && selCh) {
    const ck = selCh.categories[0];
    const related = byCat[ck] || [];

    return (
      <PlayerView
        channel={selCh}
        related={related}
        favorites={favorites}
        onBack={handleBack}
        onToggleFav={toggleFav}
        onPlayChannel={playCh}
        sidebar={sidebar}
        onToggleSidebar={() => setSidebar(s => !s)}
        onEnterMultiview={enterMultiview}
        playerRef={playerRef}
      />
    );
  }

  // ---- Home View ----
  return (
    <div className="app-root">
      <div className="ambient-bg" />

      {/* PIP indicator */}
      {pipChannel && (
        <div className="pip-indicator" onClick={() => { playCh(pipChannel); setPipChannel(null); }}>
          <span className="pip-dot" />
          <span className="pip-text">PIP: {pipChannel.name}</span>
          <span className="pip-action">← Volver</span>
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="logo-wrap">
          <span className="logo-icon">◈</span>
          <span className="logo-text">StreamHub</span>
          <span className="logo-badge">TV - MS Crew</span>
        </div>
        <div className="search-wrap">
          <div className="search-box">
            <span className="search-icon">⌕</span>
            <input ref={searchRef} type="text" placeholder="Buscar canales, países..."
              value={search} onChange={e => setSearch(e.target.value)} className="search-input" />
            {search && <button className="btn-clear" onClick={() => setSearch('')}>✕</button>}
          </div>
        </div>
        <div className="header-right">
          <button className="btn-playlist" onClick={() => setShowPlaylistMgr(true)}>+ Playlist</button>
          <span className="clock">{clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="badge">{filtered.length} canales</span>
        </div>
      </header>

      <main className="app-main">
        {/* Hero */}
        <div className="hero">
          <div className="hero-content">
            <div className="hero-live-tag">🔴 EN VIVO</div>
            <h1 className="hero-title">TV en Vivo de Todo el Mundo</h1>
            <p className="hero-sub">{allChannels.length} canales en vivo • {activeCats.length} categorías</p>
            <div className="hero-stats">
              {[[allChannels.length, 'Canales'], [activeCats.length, 'Categorías'], [allChannels.filter(c => c.streamUrl).length, 'Streams']].map(([n, l], i, arr) => (
                <div key={l} className="hero-stat-group">
                  <div className="hero-stat">
                    <span className="hero-stat-num">{n}</span>
                    <span className="hero-stat-label">{l}</span>
                  </div>
                  {i < arr.length - 1 && <div className="hero-stat-div" />}
                </div>
              ))}
            </div>
          </div>
          <div className="hero-glow" />
        </div>

        {/* Favorites */}
        {favChannels.length > 0 && (
          <RowSection refCb={el => (rowRefs.current[rowKeys.indexOf('favorites')] = el)}
            icon="★" title="Favoritos" count={favChannels.length}>
            <div className="h-scroll">
              {favChannels.map((ch, ci) => (
                <ChannelCard key={ch.id} ch={ch}
                  meta={CATEGORY_META[ch.categories[0]] || { icon: '📺', label: '' }}
                  focused={focusRow === rowKeys.indexOf('favorites') && focusCol === ci}
                  onClick={() => playCh(ch)} />
              ))}
            </div>
          </RowSection>
        )}

        {/* Language Filters */}
        <RowSection refCb={el => (rowRefs.current[rowKeys.indexOf('languages')] = el)}
          icon="🌐" title="Idioma">
          <div className="filters-row">
            {LANGUAGE_FILTERS.map((l, i) => (
              <button key={l.code}
                className={`filter-chip ${lang === l.code ? 'active' : ''} ${focusRow === rowKeys.indexOf('languages') && focusCol === i ? 'focused' : ''}`}
                onClick={() => setLang(l.code)}>
                {l.label}
              </button>
            ))}
          </div>
        </RowSection>

        {/* Category rows */}
        {activeCats.map(ck => {
          const chs = byCat[ck];
          const mt = CATEGORY_META[ck] || { icon: '📺', label: ck };
          const ri = rowKeys.indexOf(ck);
          return (
            <RowSection key={ck} refCb={el => (rowRefs.current[ri] = el)}
              icon={mt.icon} title={mt.label} count={chs.length}>
              <div className="h-scroll">
                {chs.map((ch, ci) => (
                  <ChannelCard key={ch.id} ch={ch} meta={mt}
                    focused={focusRow === ri && focusCol === ci}
                    onClick={() => playCh(ch)} />
                ))}
              </div>
            </RowSection>
          );
        })}

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-logo">◈ StreamHub TV</div>
          <div className="footer-text">TV pública IPTV • HLS streaming</div>
          <div className="footer-nav">◀ ▶ ▲ ▼ Navegar • Enter Seleccionar • Esc Volver</div>
        </footer>
      </main>

      {showPlaylistMgr && (
        <PlaylistManager
          playlists={customPlaylists}
          onAdd={(pl) => { addPlaylist(pl); }}
          onDelete={deletePlaylist}
          onClose={() => setShowPlaylistMgr(false)}
        />
      )}
    </div>
  );
}
