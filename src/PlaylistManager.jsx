import { useState, useRef } from 'react';
import { parseM3U } from './m3uParser';

export default function PlaylistManager({ playlists, onAdd, onDelete, onClose }) {
  const [mode, setMode] = useState('url');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const handleUrlLoad = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(url.trim());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const id = `pl_${Date.now()}`;
      const channels = parseM3U(text, id);
      if (channels.length === 0) throw new Error('No se encontraron canales en el archivo');
      const name = extractNameFromUrl(url.trim());
      onAdd({ id, name, dateAdded: new Date().toISOString(), channels });
      setUrl('');
    } catch (err) {
      setError(err.message || 'Error al cargar la playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const id = `pl_${Date.now()}`;
        const channels = parseM3U(reader.result, id);
        if (channels.length === 0) throw new Error('No se encontraron canales en el archivo');
        const name = file.name.replace(/\.(m3u8?|txt)$/i, '');
        onAdd({ id, name, dateAdded: new Date().toISOString(), channels });
      } catch (err) {
        setError(err.message || 'Error al leer el archivo');
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Error al leer el archivo');
      setLoading(false);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="pl-overlay" onClick={onClose}>
      <div className="pl-modal" onClick={e => e.stopPropagation()}>
        <div className="pl-header">
          <h2 className="pl-title">Gestionar Playlists</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        {/* Input modes */}
        <div className="pl-tabs">
          <button className={`pl-tab ${mode === 'url' ? 'active' : ''}`} onClick={() => setMode('url')}>
            URL
          </button>
          <button className={`pl-tab ${mode === 'file' ? 'active' : ''}`} onClick={() => setMode('file')}>
            Archivo
          </button>
        </div>

        <div className="pl-input-area">
          {mode === 'url' ? (
            <div className="pl-url-row">
              <input
                type="text"
                className="pl-input"
                placeholder="https://ejemplo.com/playlist.m3u"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleUrlLoad()}
              />
              <button className="pl-btn" onClick={handleUrlLoad} disabled={loading || !url.trim()}>
                {loading ? '...' : 'Cargar'}
              </button>
            </div>
          ) : (
            <div className="pl-file-row">
              <button className="pl-btn pl-btn-file" onClick={() => fileRef.current?.click()} disabled={loading}>
                {loading ? 'Cargando...' : 'Seleccionar archivo .m3u / .m3u8'}
              </button>
              <input ref={fileRef} type="file" accept=".m3u,.m3u8,.txt" onChange={handleFile} hidden />
            </div>
          )}
          {error && <div className="pl-error">{error}</div>}
        </div>

        {/* Saved playlists */}
        <div className="pl-list">
          {playlists.length === 0 ? (
            <div className="pl-empty">No hay playlists guardadas</div>
          ) : (
            playlists.map(pl => (
              <div key={pl.id} className="pl-item">
                <div className="pl-item-info">
                  <div className="pl-item-name">{pl.name}</div>
                  <div className="pl-item-meta">{pl.channels.length} canales</div>
                </div>
                <button className="pl-item-del" onClick={() => onDelete(pl.id)} title="Eliminar">✕</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function extractNameFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const filename = pathname.split('/').pop() || '';
    const name = filename.replace(/\.(m3u8?|txt)$/i, '');
    return name || 'Playlist importada';
  } catch {
    return 'Playlist importada';
  }
}
