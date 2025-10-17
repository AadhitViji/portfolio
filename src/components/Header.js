import React from "react";

export default function Header({ name, links, theme, onToggleTheme }) {
  return (
    <header className="site-header">
      <a className="brand" href="#home">{name}</a>
      <nav className="nav">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#experience">Experience</a>
        <a href="#education">Education</a>
        <a href="#skills">Skills</a>
        <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
        <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <button
          type="button"
          className="btn small outline"
          onClick={onToggleTheme}
          aria-label="Toggle light/dark theme"
        >
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </nav>
    </header>
  );
}
