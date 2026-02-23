import { useState } from 'react';
import HLSPlayer from './HLSPlayer';
import { CATEGORY_META } from './channels';

export default function MultiView({ channels, allChannels, onBack, onAddChannel, onRemoveChannel }) {
  const [activeAudio, setActiveAudio] = useState(channels[0]?.id || null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  const gridClass = `mv-grid mv-grid-${Math.min(channels.length, 4)}`;

  const pickerChannels = allChannels.filter(ch => {
    if (!ch.streamUrl) return false;
    if (channels.find(c => c.id === ch.id)) return false;
    if (pickerSearch) {
      const q = pickerSearch.toLowerCase();
      return ch.name.toLowerCase().includes(q) || ch.country.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="multiview-root">
      {/* Top bar */}
      <div className="mv-topbar">
        <button className="btn-ghost" onClick={onBack}>← Volver</button>
        <div className="mv-topbar-info">
          <span className="mv-topbar-title">Multi-View</span>
          <span className="mv-topbar-count">{channels.length}/4 canales</span>
        </div>
        {channels.length < 4 && (
          <button className="btn-ghost" onClick={() => setShowPicker(true)}>+ Canal</button>
        )}
      </div>

      {/* Grid */}
      {channels.length === 0 ? (
        <div className="mv-empty">
          <div style={{ fontSize: 48, marginBottom: 12 }}>⊞</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Multi-View</div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16 }}>Añade canales para verlos simultáneamente</div>
          <button className="btn-ghost" onClick={() => setShowPicker(true)}>+ Añadir canal</button>
        </div>
      ) : (
        <div className={gridClass}>
          {channels.map(ch => {
            const isAudio = activeAudio === ch.id;
            const mt = CATEGORY_META[ch.categories?.[0]] || { icon: '📺', label: '' };
            return (
              <div
                key={ch.id}
                className={`mv-cell ${isAudio ? 'audio-active' : ''}`}
                onClick={() => setActiveAudio(ch.id)}
              >
                <HLSPlayer url={ch.streamUrl} poster={ch.logo} muted={!isAudio} />
                <div className="mv-cell-overlay">
                  <div className="mv-cell-info">
                    <span className="mv-cell-name">{ch.name}</span>
                    {isAudio && <span className="mv-audio-badge">🔊</span>}
                  </div>
                  <button
                    className="mv-cell-remove"
                    onClick={(e) => { e.stopPropagation(); onRemoveChannel(ch.id); }}
                    title="Quitar"
                  >✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Channel picker */}
      {showPicker && (
        <div className="mv-picker-overlay" onClick={() => { setShowPicker(false); setPickerSearch(''); }}>
          <div className="mv-picker" onClick={e => e.stopPropagation()}>
            <div className="mv-picker-header">
              <h3 className="mv-picker-title">Añadir canal</h3>
              <button className="btn-close" onClick={() => { setShowPicker(false); setPickerSearch(''); }}>✕</button>
            </div>
            <div className="mv-picker-search">
              <input
                type="text"
                className="pl-input"
                placeholder="Buscar canal..."
                value={pickerSearch}
                onChange={e => setPickerSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="mv-picker-list">
              {pickerChannels.slice(0, 50).map(ch => {
                const mt = CATEGORY_META[ch.categories?.[0]] || { icon: '📺', label: '' };
                return (
                  <button
                    key={ch.id}
                    className="mv-picker-item"
                    onClick={() => {
                      onAddChannel(ch);
                      if (!activeAudio) setActiveAudio(ch.id);
                      setShowPicker(false);
                      setPickerSearch('');
                    }}
                  >
                    <span className="mv-picker-icon">{mt.icon}</span>
                    <div className="mv-picker-item-text">
                      <div className="mv-picker-item-name">{ch.name}</div>
                      <div className="mv-picker-item-meta">{ch.country} • {mt.label}</div>
                    </div>
                  </button>
                );
              })}
              {pickerChannels.length === 0 && (
                <div className="pl-empty">No hay canales disponibles</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
