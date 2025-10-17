import React from "react";
import DotNetwork from "./DotNetwork";

export default function Hero({ profile }) {
  return (
    <section id="home" className="hero">
      <div className="net-bg">
        <DotNetwork />
      </div>
      <div className="hero-inner">
        <h1>{profile.name}</h1>
        <p className="role">{profile.role}</p>
        <p className="summary">{profile.summary}</p>
        <div className="quick">
          <a href={`mailto:${profile.email}`} className="btn">Email</a>
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="btn outline">GitHub</a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="btn outline">LinkedIn</a>
        </div>
      </div>
    </section>
  );
}
