import React from "react";

export default function ContactModal({ open, onClose, profile }) {
  if (!open) return null;
  const { email, phone, location, links } = profile || {};
  return (
    <div
      className="contact-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      aria-hidden="true"
    >
      <div
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Contact details"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--card)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 20,
          width: "min(520px, 92vw)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 20 }}>Contact</h3>
          <button type="button" className="btn small outline" onClick={onClose} aria-label="Close contact dialog">Close</button>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <div><span className="muted small">Location</span><div>{location}</div></div>
          <div><span className="muted small">Email</span><div><a href={`mailto:${email}`}>{email}</a></div></div>
          <div><span className="muted small">Phone</span><div><a href={`tel:${phone}`}>{phone}</a></div></div>
        </div>

        <div className="card-actions" style={{ marginTop: 16 }}>
          <a className="btn small" href={`mailto:${email}`}>Email</a>
          <a className="btn small outline" href={`tel:${phone}`}>Call</a>
          {links?.linkedin && (
            <a className="btn small outline" href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          )}
          {links?.github && (
            <a className="btn small outline" href={links.github} target="_blank" rel="noreferrer">GitHub</a>
          )}
        </div>
      </div>
    </div>
  );
}
