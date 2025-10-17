import React from "react";

export default function Education({ items }) {
  return (
    <div className="list">
      {items.map((e, i) => (
        <div className="list-item" key={i}>
          <div className="list-head">
            <h3>{e.school}</h3>
            <span className="muted">{e.year}</span>
          </div>
          <p>{e.degree}{e.meta ? ` — ${e.meta}` : ""}</p>
          <p className="muted small">{e.location}</p>
        </div>
      ))}
    </div>
  );
}
