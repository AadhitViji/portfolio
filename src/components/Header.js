import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header({ name, links, theme, onToggleTheme, onOpenContact }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isResume = location.pathname.startsWith('/resume');

  return (
    <header className="site-header">
      <Link className="brand" to="/">{name}</Link>
      <nav className="nav">
        {isResume ? (
          <>
            <button
              type="button"
              className="btn small"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              Go Back
            </button>
            <button
              type="button"
              className="btn small outline"
              onClick={onToggleTheme}
              aria-label="Toggle light/dark theme"
            >
              {theme === 'light' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zm9-10v-2h-3v2h3zm-4.24-8.16l1.79-1.8-1.41-1.41-1.8 1.79 1.42 1.42zM12 6a6 6 0 100 12 6 6 0 000-12zm7.66 12.24l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zM4.24 17.66l-1.79 1.8 1.41 1.41 1.8-1.79-1.42-1.42z"/>
                </svg>
              )}
            </button>
          </>
        ) : (
          <>
            <Link className="btn small outline" to="/#about">About</Link>
            <Link className="btn small outline" to="/#projects">Projects</Link>
            <Link className="btn small outline" to="/#experience">Experience</Link>
            <Link className="btn small outline" to="/#education">Education</Link>
            <Link className="btn small outline" to="/#skills">Skills</Link>
            <Link className="btn small" to="/resume">Resume</Link>
            <a className="btn small outline" href={links.github} target="_blank" rel="noreferrer">GitHub</a>
            <a className="btn small outline" href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <button type="button" className="btn small" onClick={onOpenContact} aria-label="Open contact dialog">Contact</button>
            <button
              type="button"
              className="btn small outline"
              onClick={onToggleTheme}
              aria-label="Toggle light/dark theme"
            >
              {theme === 'light' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zm9-10v-2h-3v2h3zm-4.24-8.16l1.79-1.8-1.41-1.41-1.8 1.79 1.42 1.42zM12 6a6 6 0 100 12 6 6 0 000-12zm7.66 12.24l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zM4.24 17.66l-1.79 1.8 1.41 1.41 1.8-1.79-1.42-1.42z"/>
                </svg>
              )}
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
