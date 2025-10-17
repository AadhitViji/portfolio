import React from "react";

export default function Experience({ items }) {
  return (
    <div className="list">
      {items.map((x, i) => (
        <div key={i} className="list-item">
          <div className="list-head">
            <h3>{x.title}</h3>
            <span className="muted">{x.type}</span>
            <span className="muted">{x.period}</span>
          </div>
          <p className="muted">{x.org}</p>
          {x.bullets && (
            <ul className="bullets">
              {x.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
