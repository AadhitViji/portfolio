import React from "react";

export default function Projects({ items }) {
  return (
    <div className="cards">
      {items.map((p, i) => (
        <article 
          key={i} 
          className={`card ${p.demo ? 'card-clickable' : ''}`}
          onClick={() => p.demo && window.open(p.demo, '_blank')}
          title={p.demo ? "Click to view live demo" : ""}
        >
          <div className="card-head">
            <div className="card-title-wrapper">
              <h3>{p.title}</h3>
              {p.demo && (
                <span className="live-badge" title="Live Project">
                  <span className="live-dot"></span>
                  LIVE
                </span>
              )}
            </div>
            {p.period && <span className="muted">{p.period}</span>}
          </div>
          {Array.isArray(p.stack) && (
            <div className="pillset" aria-label="tech stack">
              {p.stack.map((s, idx) => (
                <span key={idx} className="pill small">{s}</span>
              ))}
            </div>
          )}
          <p>{p.summary}</p>
          <div className="card-actions">
            {p.demo && (
              <a 
                className="btn small" 
                href={p.demo} 
                target="_blank" 
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="View live demo"
              >
                Demo
              </a>
            )}
            {p.repo && (
              <a 
                className="btn small outline" 
                href={p.repo} 
                target="_blank" 
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="View GitHub repository"
              >
                Repo
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
