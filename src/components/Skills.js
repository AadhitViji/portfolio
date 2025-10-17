import React from "react";

const icon = (label) => {
  const l = String(label).toLowerCase();
  if (/(typescript|ts)/.test(l)) return "🟦";
  if (/javascript|js/.test(l)) return "🟨";
  if (/python/.test(l)) return "🐍";
  if (/c\+\+/.test(l)) return "➕";
  if (/\bc\b(?!\+\+)/.test(l)) return "🧩";
  if (/html/.test(l)) return "📄";
  if (/css/.test(l)) return "🎨";
  if (/react/.test(l)) return "⚛️";
  if (/node/.test(l)) return "🟩";
  if (/express/.test(l)) return "🚏";
  if (/mongo/.test(l)) return "🍃";
  if (/firebase/.test(l)) return "🔥";
  if (/\.net|asp/.test(l)) return "🧱";
  if (/git/.test(l)) return "🔧";
  if (/sql/.test(l)) return "🗄️";
  return "🔹";
};

export default function Skills({ skills }) {
  const Pill = ({ txt }) => (
    <span className="pill"><span className="pill-ico" aria-hidden>{icon(txt)}</span>{txt}</span>
  );
  return (
    <div className="skills">
      <div>
        <h3>Languages</h3>
        <div className="pillset">{skills.languages.map((s, i) => <Pill key={i} txt={s} />)}</div>
      </div>
      <div>
        <h3>Frameworks & Libraries</h3>
        <div className="pillset">{skills.frameworks.map((s, i) => <Pill key={i} txt={s} />)}</div>
      </div>
      <div>
        <h3>Other</h3>
        <div className="pillset">{skills.other.map((s, i) => <Pill key={i} txt={s} />)}</div>
      </div>
    </div>
  );
}
