import { useState } from 'react';

export default function ChannelCard({ ch, meta, focused, onClick }) {
  const [imgErr, setImgErr] = useState(false);
  const hasStream = !!ch.streamUrl;

  return (
    <button className={`ch-card ${focused ? 'focused' : ''}`} onClick={onClick}>
      <div className="ch-card-top">
        {ch.logo && !imgErr
          ? <img src={ch.logo} alt="" className="ch-logo" loading="lazy" onError={() => setImgErr(true)} />
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
