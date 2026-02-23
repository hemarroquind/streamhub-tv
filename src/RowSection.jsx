export default function RowSection({ icon, title, badge, count, children, refCb }) {
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
