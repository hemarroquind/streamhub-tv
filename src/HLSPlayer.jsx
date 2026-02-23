import { useState, useEffect, useRef, useCallback } from 'react';
import Hls from 'hls.js';

// ============================================================
// HLS VIDEO PLAYER
// Supports: HLS.js (Chrome, Firefox, Fire TV Silk), Native HLS (Safari, iOS, tvOS)
// ============================================================

export default function HLSPlayer({ url, poster, onStatusChange }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | loading | playing | buffering | error
  const [errorMsg, setErrorMsg] = useState('');
  const [quality, setQuality] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const updateStatus = useCallback((s, msg = '') => {
    setStatus(s);
    setErrorMsg(msg);
    onStatusChange?.(s, msg);
  }, [onStatusChange]);

  const destroyHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  const initPlayer = useCallback(() => {
    const video = videoRef.current;
    if (!video || !url) {
      updateStatus('error', 'Stream URL no disponible');
      return;
    }

    destroyHls();
    updateStatus('loading');
    setRetryCount(0);

    // ---- Native HLS support (Safari, iOS, Smart TVs, Fire TV) ----
    if (video.canPlayType('application/vnd.apple.mpegurl') || video.canPlayType('application/x-mpegURL')) {
      video.src = url;
      video.play().catch(() => {});
      return;
    }

    // ---- HLS.js (Chrome, Firefox, Edge, Fire TV Silk) ----
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        startLevel: -1,
        capLevelToPlayerSize: true,
        // Timeouts tuned for potentially slow streams
        fragLoadingTimeOut: 25000,
        fragLoadingMaxRetry: 8,
        fragLoadingRetryDelay: 1000,
        manifestLoadingTimeOut: 20000,
        manifestLoadingMaxRetry: 6,
        levelLoadingTimeOut: 20000,
        levelLoadingMaxRetry: 6,
      });

      hlsRef.current = hls;

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(url);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const levels = data.levels || [];
        if (levels.length > 0) {
          const best = levels[levels.length - 1];
          setQuality(`${best.height || '?'}p`);
        }
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        const level = hls.levels[data.level];
        if (level) setQuality(`${level.height}p`);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.warn('[HLS] Fatal error:', data.type, data.details);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (retryCount < 5) {
                console.log('[HLS] Network error, retrying...');
                setTimeout(() => hls.startLoad(), 1000 * (retryCount + 1));
                setRetryCount(c => c + 1);
                updateStatus('loading', `Reconectando... (${retryCount + 1}/5)`);
              } else {
                updateStatus('error', 'Error de red. El stream puede no estar disponible.');
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('[HLS] Media error, recovering...');
              hls.recoverMediaError();
              break;
            default:
              updateStatus('error', 'Error de reproducción');
              break;
          }
        }
      });

      hls.attachMedia(video);
    } else {
      // Fallback: try direct
      video.src = url;
      video.play().catch(() => {
        updateStatus('error', 'Tu navegador no soporta HLS. Usa Chrome, Firefox o Safari.');
      });
    }
  }, [url, destroyHls, updateStatus, retryCount]);

  // Video element event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlaying = () => updateStatus('playing');
    const onWaiting = () => updateStatus('buffering');
    const onError = () => {
      if (status !== 'error') {
        updateStatus('error', 'Error de reproducción');
      }
    };
    const onPause = () => {
      if (status === 'playing') updateStatus('idle');
    };

    video.addEventListener('playing', onPlaying);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('error', onError);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('error', onError);
      video.removeEventListener('pause', onPause);
    };
  }, [updateStatus, status]);

  // Initialize on URL change
  useEffect(() => {
    initPlayer();
    return () => {
      destroyHls();
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };
  }, [url]);

  const handleRetry = () => {
    setRetryCount(0);
    initPlayer();
  };

  return (
    <div style={styles.container}>
      <video
        ref={videoRef}
        style={styles.video}
        controls
        playsInline
        autoPlay
        poster={poster}
      />

      {/* Quality badge */}
      {quality && status === 'playing' && (
        <div style={styles.qualityBadge}>{quality}</div>
      )}

      {/* Loading overlay */}
      {(status === 'loading' || status === 'buffering') && (
        <div style={styles.overlay}>
          <div style={styles.spinner}>
            <div style={styles.spinnerRing} />
          </div>
          <div style={styles.overlayText}>
            {status === 'loading' ? 'Conectando stream...' : 'Buffering...'}
          </div>
          {errorMsg && <div style={styles.overlaySubtext}>{errorMsg}</div>}
        </div>
      )}

      {/* Error overlay */}
      {status === 'error' && (
        <div style={styles.overlay}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📡</div>
          <div style={styles.overlayText}>{errorMsg || 'Error de reproducción'}</div>
          <button style={styles.retryBtn} onClick={handleRetry}>
            ↻ Reintentar
          </button>
          <div style={styles.overlayHint}>
            Algunos streams pueden estar temporalmente no disponibles
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    background: '#000',
  },
  qualityBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    fontSize: 10,
    fontWeight: 700,
    fontFamily: "'Space Mono', monospace",
    color: 'rgba(255,255,255,0.7)',
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    padding: '3px 8px',
    borderRadius: 4,
    letterSpacing: '0.5px',
    zIndex: 6,
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.82)',
    zIndex: 5,
  },
  spinner: {
    width: 52,
    height: 52,
    marginBottom: 14,
  },
  spinnerRing: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    border: '3px solid rgba(255,255,255,0.08)',
    borderTopColor: '#FF5A32',
    animation: 'spin 0.8s linear infinite',
  },
  overlayText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 15,
    fontFamily: "'Outfit', sans-serif",
    marginBottom: 6,
  },
  overlaySubtext: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    fontFamily: "'Space Mono', monospace",
  },
  retryBtn: {
    background: '#FF5A32',
    color: '#fff',
    border: 'none',
    borderRadius: 9,
    padding: '10px 26px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
    marginTop: 8,
    transition: 'transform 0.15s',
  },
  overlayHint: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 11,
    fontFamily: "'Outfit', sans-serif",
    marginTop: 12,
  },
};
