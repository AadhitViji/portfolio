import React from "react";

export default function Footer({ email, phone, location }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="foot-grid">
          <span>{location}</span>
          <a href={`mailto:${email}`}>{email}</a>
          <a href={`tel:${phone}`}>{phone}</a>
        </div>
        <p className="muted small">© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}
