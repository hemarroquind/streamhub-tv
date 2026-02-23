import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import Hls from 'hls.js';

// ============================================================
// HLS VIDEO PLAYER
// Supports: HLS.js (Chrome, Firefox, Fire TV Silk), Native HLS (Safari, iOS, tvOS)
// Features: Quality selector, PIP support, muted prop for multi-view
// ============================================================

const HLSPlayer = forwardRef(function HLSPlayer({ url, poster, onStatusChange, muted = false }, ref) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [quality, setQuality] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isPIP, setIsPIP] = useState(false);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    togglePIP: async () => {
      const video = videoRef.current;
      if (!video) return;
      try {
        if (document.pictureInPictureElement === video) {
          await document.exitPictureInPicture();
        } else if (document.pictureInPictureEnabled) {
          await video.requestPictureInPicture();
        }
      } catch (err) {
        console.warn('[PIP] Error:', err);
      }
    },
    getVideoElement: () => videoRef.current,
    isPIP: () => isPIP,
  }), [isPIP]);

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

  const selectQuality = useCallback((levelIndex) => {
    const hls = hlsRef.current;
    if (hls) {
      hls.currentLevel = levelIndex;
      setCurrentLevel(levelIndex);
    }
    setShowQualityMenu(false);
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
    setLevels([]);
    setCurrentLevel(-1);

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
        const parsedLevels = data.levels || [];
        setLevels(parsedLevels);
        if (parsedLevels.length > 0) {
          const best = parsedLevels[parsedLevels.length - 1];
          setQuality(`${best.height || '?'}p`);
        }
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        const level = hls.levels[data.level];
        if (level) setQuality(`${level.height}p`);
        setCurrentLevel(data.level);
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
    const onEnterPIP = () => setIsPIP(true);
    const onLeavePIP = () => setIsPIP(false);

    video.addEventListener('playing', onPlaying);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('error', onError);
    video.addEventListener('pause', onPause);
    video.addEventListener('enterpictureinpicture', onEnterPIP);
    video.addEventListener('leavepictureinpicture', onLeavePIP);

    return () => {
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('error', onError);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('enterpictureinpicture', onEnterPIP);
      video.removeEventListener('leavepictureinpicture', onLeavePIP);
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

  // Sync muted prop
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const handleRetry = () => {
    setRetryCount(0);
    initPlayer();
  };

  // Close quality menu on outside click
  useEffect(() => {
    if (!showQualityMenu) return;
    const close = () => setShowQualityMenu(false);
    const timer = setTimeout(() => document.addEventListener('click', close), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', close);
    };
  }, [showQualityMenu]);

  const formatBitrate = (bps) => {
    if (!bps) return '';
    const mbps = bps / 1_000_000;
    return mbps >= 1 ? `${mbps.toFixed(1)} Mbps` : `${(bps / 1000).toFixed(0)} kbps`;
  };

  return (
    <div style={styles.container}>
      <video
        ref={videoRef}
        style={styles.video}
        controls
        playsInline
        autoPlay
        muted={muted}
        poster={poster}
      />

      {/* Quality selector */}
      {quality && status === 'playing' && (
        <div style={styles.qualityWrap}>
          <button
            style={styles.qualityBadge}
            onClick={(e) => { e.stopPropagation(); setShowQualityMenu(s => !s); }}
          >
            {currentLevel === -1 ? `Auto (${quality})` : quality}
          </button>
          {showQualityMenu && levels.length > 0 && (
            <div className="quality-menu" onClick={e => e.stopPropagation()}>
              <button
                className={`quality-option ${currentLevel === -1 ? 'active' : ''}`}
                onClick={() => selectQuality(-1)}
              >
                <span className="qo-label">Auto</span>
                <span className="qo-detail">Adaptativo</span>
              </button>
              {[...levels].sort((a, b) => (b.height || 0) - (a.height || 0)).map((lvl, i) => {
                const realIndex = levels.indexOf(lvl);
                return (
                  <button
                    key={i}
                    className={`quality-option ${currentLevel === realIndex ? 'active' : ''}`}
                    onClick={() => selectQuality(realIndex)}
                  >
                    <span className="qo-label">{lvl.height}p</span>
                    <span className="qo-detail">{formatBitrate(lvl.bitrate)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
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
});

export default HLSPlayer;

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
  qualityWrap: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 6,
  },
  qualityBadge: {
    fontSize: 10,
    fontWeight: 700,
    fontFamily: "'Space Mono', monospace",
    color: 'rgba(255,255,255,0.7)',
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    padding: '3px 8px',
    borderRadius: 4,
    letterSpacing: '0.5px',
    border: '1px solid rgba(255,255,255,0.15)',
    cursor: 'pointer',
    transition: 'background 0.15s',
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
