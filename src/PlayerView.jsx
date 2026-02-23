import { useRef } from 'react';
import HLSPlayer from './HLSPlayer';
import { CATEGORY_META } from './channels';

export default function PlayerView({ channel, related, favorites, onBack, onToggleFav, onPlayChannel, sidebar, onToggleSidebar, onEnterMultiview, playerRef: externalRef }) {
  const ck = channel.categories[0];
  const mt = CATEGORY_META[ck] || { icon: '📺', label: ck };
  const isFav = favorites.includes(channel.id);
  const internalRef = useRef(null);
  const playerRef = externalRef || internalRef;

  const handlePIP = () => {
    playerRef.current?.togglePIP();
  };

  const supportsPIP = typeof document !== 'undefined' && document.pictureInPictureEnabled;

  return (
    <div className="player-root">
      {/* Top bar */}
      <div className="player-topbar">
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
          <button className="btn-ghost" onClick={handlePIP} title="Picture-in-Picture">
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

      {/* Video */}
      <div className="player-video-area">
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

      {/* Channel sidebar */}
      {sidebar && (
        <div className="channel-sidebar">
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
