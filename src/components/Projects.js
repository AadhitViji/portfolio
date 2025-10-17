import React from "react";

export default function Projects({ items }) {
  return (
    <div className="cards">
      {items.map((p, i) => (
        <article key={i} className="card">
          <div className="card-head">
            <h3>{p.title}</h3>
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
          {(p.demo || p.repo) && (
            <div className="card-actions">
              {p.demo && (
                <a className="btn small" href={p.demo} target="_blank" rel="noreferrer">Demo</a>
              )}
              {p.repo && (
                <a className="btn small outline" href={p.repo} target="_blank" rel="noreferrer">Repo</a>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
