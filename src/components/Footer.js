import React from "react";
import { Link } from "react-router-dom";

export default function Footer({ email, phone, location }) {
  return (
    <footer className="site-footer">
      <div
        className="footer-parallax"
        aria-hidden="true"
      />
      <div className="container">
        <div className="foot-grid">
          <span>{location}</span>
          <a href={`mailto:${email}`}>{email}</a>
          <a href={`tel:${phone}`}>{phone}</a>
        </div>
        <div className="btn-row" style={{ marginTop: 12 }}>
          <Link className="btn small" to="/resume">View Resume</Link>
          <a className="btn small outline" href="/resume.pdf" download>Download Resume</a>
        </div>
        <p className="muted small">© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}
