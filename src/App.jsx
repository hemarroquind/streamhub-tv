import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import HLSPlayer from './HLSPlayer';
import {
  CHANNELS, STREAMING_SERVICES, CATEGORY_META,
  CATEGORIES_ORDER, LANGUAGE_FILTERS
} from './channels';
import './styles.css';

export default function App({ onReady }) {
  const [view, setView] = useState('home');
  const [selCh, setSelCh] = useState(null);
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState('all');
  const [clock, setClock] = useState(new Date());
  const [sidebar, setSidebar] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sh_favs') || '[]'); } catch { return []; }
  });
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

  const toggleFav = (chId) => {
    setFavorites(f => f.includes(chId) ? f.filter(x => x !== chId) : [...f, chId]);
  };

  // ---- Filtered data ----
  const filtered = useMemo(() =>
    CHANNELS.filter(ch => {
      if (lang !== 'all' && !ch.languages?.includes(lang)) return false;
      if (search) {
        const q = search.toLowerCase();
        return ch.name.toLowerCase().includes(q) || ch.country.toLowerCase().includes(q) || ch.id.includes(q);
      }
      return true;
    }), [lang, search]);

  const favChannels = useMemo(() =>
    CHANNELS.filter(ch => favorites.includes(ch.id)), [favorites]);

  const byCat = useMemo(() => {
    const m = {};
    CATEGORIES_ORDER.forEach(c => {
      m[c] = filtered.filter(ch => ch.categories.includes(c));
    });
    return m;
  }, [filtered]);

  const activeCats = useMemo(() =>
    CATEGORIES_ORDER.filter(c => (byCat[c] || []).length > 0), [byCat]);

  // Row structure for keyboard nav
  const rowKeys = useMemo(() => {
    const rows = ['services'];
    if (favChannels.length > 0) rows.push('favorites');
    rows.push('languages');
    rows.push(...activeCats);
    return rows;
  }, [activeCats, favChannels]);

  const getRowLen = useCallback((ri) => {
    const key = rowKeys[ri];
    if (key === 'services') return STREAMING_SERVICES.length;
    if (key === 'favorites') return favChannels.length;
    if (key === 'languages') return LANGUAGE_FILTERS.length;
    return (byCat[key] || []).length;
  }, [rowKeys, byCat, favChannels]);

  // ---- Keyboard navigation (Fire TV remote) ----
  useEffect(() => {
    if (view !== 'home') return;
    const h = (e) => {
      if (e.target.tagName === 'INPUT') return; // Don't interfere with search
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
  }, []);

  const handleRowSelect = (row, col) => {
    const key = rowKeys[row];
    if (key === 'services') {
      const svc = STREAMING_SERVICES[col];
      if (svc) window.open(svc.link, '_blank');
    } else if (key === 'favorites') {
      const ch = favChannels[col];
      if (ch) playCh(ch);
    } else if (key === 'languages') {
      setLang(LANGUAGE_FILTERS[col]?.code || 'all');
    } else {
      const ch = byCat[key]?.[col];
      if (ch) playCh(ch);
    }
  };

  // Global escape
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        if (e.target.tagName === 'INPUT') return;
        e.preventDefault();
        if (sidebar) setSidebar(false);
        else if (view === 'player') { setView('home'); setSelCh(null); }
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [view, sidebar]);

  // ============================================================
  // PLAYER VIEW
  // ============================================================
  if (view === 'player' && selCh) {
    const ck = selCh.categories[0];
    const mt = CATEGORY_META[ck] || { icon: '📺', label: ck };
    const related = byCat[ck] || [];
    const isFav = favorites.includes(selCh.id);

    return (
      <div className="player-root">
        {/* Top bar */}
        <div className="player-topbar">
          <button className="btn-ghost" onClick={() => { setView('home'); setSelCh(null); }}>
            ← Volver
          </button>
          <div className="player-info">
            {selCh.logo && (
              <img src={selCh.logo} alt="" className="player-logo"
                onError={e => { e.target.style.display = 'none'; }} />
            )}
            <div className="player-text">
              <div className="player-name">{selCh.name}</div>
              <div className="player-meta">
                {mt.icon} {mt.label} • {selCh.country}
                {selCh.streamUrl && <span className="live-tag-sm">● EN VIVO</span>}
              </div>
            </div>
          </div>
          <button className={`btn-ghost btn-fav ${isFav ? 'active' : ''}`}
            onClick={() => toggleFav(selCh.id)}>
            {isFav ? '★' : '☆'}
          </button>
          <button className="btn-ghost" onClick={() => setSidebar(!sidebar)}>
            ☰ Canales
          </button>
        </div>

        {/* Video */}
        <div className="player-video-area">
          {selCh.streamUrl ? (
            <HLSPlayer url={selCh.streamUrl} poster={selCh.logo} />
          ) : (
            <div className="no-stream">
              <div style={{ fontSize: 52, marginBottom: 10 }}>📡</div>
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{selCh.name}</div>
              <div style={{ fontSize: 13, opacity: 0.45 }}>Stream no disponible</div>
            </div>
          )}
        </div>

        {/* Channel sidebar */}
        {sidebar && (
          <div className="channel-sidebar">
            <div className="sidebar-header">
              <span>{mt.icon} {mt.label}</span>
              <button className="btn-close" onClick={() => setSidebar(false)}>✕</button>
            </div>
            <div className="sidebar-list">
              {related.map(ch => (
                <button key={ch.id}
                  className={`sidebar-item ${ch.id === selCh.id ? 'active' : ''}`}
                  onClick={() => { playCh(ch); setSidebar(false); }}>
                  <div className="sidebar-logo-wrap">
                    {ch.logo
                      ? <img src={ch.logo} alt="" className="sidebar-logo" onError={e => { e.target.style.display = 'none'; }} />
                      : <span className="sidebar-logo-fallback">{mt.icon}</span>}
                  </div>
                  <div className="sidebar-item-text">
                    <div className="sidebar-item-name">{ch.name}</div>
                    <div className="sidebar-item-meta">{ch.country}{ch.streamUrl ? ' • 🟢' : ''}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // HOME VIEW
  // ============================================================
  return (
    <div className="app-root">
      <div className="ambient-bg" />

      {/* Header */}
      <header className="app-header">
        <div className="logo-wrap">
          <span className="logo-icon">◈</span>
          <span className="logo-text">StreamHub</span>
          <span className="logo-badge">TV</span>
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
            <p className="hero-sub">{CHANNELS.length} canales públicos en vivo + {STREAMING_SERVICES.length} apps de streaming</p>
            <div className="hero-stats">
              {[[CHANNELS.length, 'Canales'], [activeCats.length, 'Categorías'], [CHANNELS.filter(c => c.streamUrl).length, 'Streams'], [STREAMING_SERVICES.length, 'Apps']].map(([n, l], i, arr) => (
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

        {/* Streaming Services */}
        <RowSection refCb={el => (rowRefs.current[rowKeys.indexOf('services')] = el)}
          icon="🚀" title="Tus Apps de Streaming" badge="Deep Link">
          <div className="h-scroll">
            {STREAMING_SERVICES.map((svc, i) => (
              <button key={svc.id}
                className={`svc-card ${focusRow === rowKeys.indexOf('services') && focusCol === i ? 'focused' : ''}`}
                style={{ background: `linear-gradient(135deg, ${svc.color}, ${svc.color}CC)` }}
                onClick={() => window.open(svc.link, '_blank')}>
                <div className="svc-icon">{svc.icon}</div>
                <div className="svc-name">{svc.name}</div>
                <div className="svc-action">Abrir →</div>
              </button>
            ))}
          </div>
        </RowSection>

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
          <div className="footer-text">TV pública IPTV • HLS.js • Deep links a streaming apps</div>
          <div className="footer-nav">◀ ▶ ▲ ▼ Navegar • Enter Seleccionar • Esc Volver</div>
        </footer>
      </main>
    </div>
  );
}

// ---- Reusable components ----
function RowSection({ icon, title, badge, count, children, refCb }) {
  return (
    <div className="section" ref={refCb}>
      <div className="section-head">
        <span className="sec-icon">{icon}</span>
        <h2 className="sec-title">{title}</h2>
        {badge && <span className="sec-badge">{badge}</span>}
        {count != null && <span className="sec-count">{count}</span>}
      </div>
      {children}
    </div>
  );
}

function ChannelCard({ ch, meta, focused, onClick }) {
  const [imgErr, setImgErr] = useState(false);
  const hasStream = !!ch.streamUrl;

  return (
    <button className={`ch-card ${focused ? 'focused' : ''}`} onClick={onClick}>
      <div className="ch-card-top">
        {ch.logo && !imgErr
          ? <img src={ch.logo} alt="" className="ch-logo" onError={() => setImgErr(true)} />
          : <span className="ch-fallback-icon">{meta.icon}</span>}
        <div className="ch-badges">
          {hasStream && (
            <span className="live-badge">
              <span className="live-dot" /> LIVE
            </span>
          )}
        </div>
        <div className="ch-country-tag">{ch.country}</div>
      </div>
      <div className="ch-card-bottom">
        <div className="ch-name">{ch.name}</div>
        <div className="ch-lang-tags">
          {ch.languages.map(l => <span key={l} className="ch-lang">{l}</span>)}
        </div>
      </div>
    </button>
  );
}
