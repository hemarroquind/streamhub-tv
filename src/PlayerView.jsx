import { useRef, useState, useEffect, useCallback } from 'react';
import HLSPlayer from './HLSPlayer';
import { CATEGORY_META } from './channels';

export default function PlayerView({ channel, related, favorites, onBack, onToggleFav, onPlayChannel, sidebar, onToggleSidebar, onEnterMultiview, playerRef: externalRef }) {
  const ck = channel.categories[0];
  const mt = CATEGORY_META[ck] || { icon: '📺', label: ck };
  const isFav = favorites.includes(channel.id);
  const internalRef = useRef(null);
  const playerRef = externalRef || internalRef;
  const [showControls, setShowControls] = useState(false);
  const hideTimer = useRef(null);

  const supportsPIP = typeof document !== 'undefined' && document.pictureInPictureEnabled;

  const revealControls = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!sidebar) setShowControls(false);
    }, 3500);
  }, [sidebar]);

  // Keep controls visible while sidebar is open
  useEffect(() => {
    if (sidebar) {
      setShowControls(true);
      clearTimeout(hideTimer.current);
    }
  }, [sidebar]);

  // Cleanup timer
  useEffect(() => () => clearTimeout(hideTimer.current), []);

  // Show controls on any interaction
  useEffect(() => {
    const show = () => revealControls();
    window.addEventListener('mousemove', show);
    window.addEventListener('touchstart', show);
    window.addEventListener('keydown', show);
    return () => {
      window.removeEventListener('mousemove', show);
      window.removeEventListener('touchstart', show);
      window.removeEventListener('keydown', show);
    };
  }, [revealControls]);

  const handleClick = () => {
    if (!showControls) {
      revealControls();
    }
  };

  return (
    <div className="player-root" onClick={handleClick}>
      {/* Video — fills entire screen */}
      <div className="player-video-area player-video-fullscreen">
        {channel.streamUrl ? (
          <HLSPlayer ref={playerRef} url={channel.streamUrl} poster={channel.logo} />
        ) : (
          <div className="no-stream">
            <div style={{ fontSize: 52, marginBottom: 10 }}>📡</div>
            <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{channel.name}</div>
            <div style={{ fontSize: 13, opacity: 0.45 }}>Stream no disponible</div>
          </div>
        )}
      </div>

      {/* Top bar — auto-hide */}
      <div className={`player-topbar ${showControls ? 'visible' : 'hidden'}`} onClick={e => e.stopPropagation()}>
        <button className="btn-ghost" onClick={onBack}>
          ← Volver
        </button>
        <div className="player-info">
          {channel.logo && (
            <img src={channel.logo} alt="" className="player-logo" loading="lazy"
              onError={e => { e.target.style.display = 'none'; }} />
          )}
          <div className="player-text">
            <div className="player-name">{channel.name}</div>
            <div className="player-meta">
              {mt.icon} {mt.label} • {channel.country}
              {channel.streamUrl && <span className="live-tag-sm">● EN VIVO</span>}
            </div>
          </div>
        </div>
        <button className={`btn-ghost btn-fav ${isFav ? 'active' : ''}`}
          onClick={() => onToggleFav(channel.id)}>
          {isFav ? '★' : '☆'}
        </button>
        {supportsPIP && (
          <button className="btn-ghost" onClick={() => playerRef.current?.togglePIP()} title="Picture-in-Picture">
            ⧉ PIP
          </button>
        )}
        {onEnterMultiview && (
          <button className="btn-ghost" onClick={onEnterMultiview} title="Multi-view">
            ⊞ Multi
          </button>
        )}
        <button className="btn-ghost" onClick={onToggleSidebar}>
          ☰ Canales
        </button>
      </div>

      {/* Channel sidebar */}
      {sidebar && (
        <div className="channel-sidebar" onClick={e => e.stopPropagation()}>
          <div className="sidebar-header">
            <span>{mt.icon} {mt.label}</span>
            <button className="btn-close" onClick={onToggleSidebar}>✕</button>
          </div>
          <div className="sidebar-list">
            {related.map(ch => (
              <button key={ch.id}
                className={`sidebar-item ${ch.id === channel.id ? 'active' : ''}`}
                onClick={() => onPlayChannel(ch)}>
                <div className="sidebar-logo-wrap">
                  {ch.logo
                    ? <img src={ch.logo} alt="" className="sidebar-logo" loading="lazy" onError={e => { e.target.style.display = 'none'; }} />
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
