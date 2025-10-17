import React from "react";
import DotNetwork from "./DotNetwork";

export default function Section({ id, title, children, netProps, bg }) {
  return (
    <section id={id} className="section">
      {bg ? (
        <div className="net-bg">{bg}</div>
      ) : netProps ? (
        <div className="net-bg">
          <DotNetwork {...netProps} />
        </div>
      ) : null}
      <div className="container">
        <h2 className="section-title">{title}</h2>
        {children}
      </div>
    </section>
  );
}
