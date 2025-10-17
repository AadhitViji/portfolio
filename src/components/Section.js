import React from "react";
import DotNetwork from "./DotNetwork";

export default function Section({ id, title, children, netProps }) {
  return (
    <section id={id} className="section">
      {netProps && (
        <div className="net-bg">
          <DotNetwork {...netProps} />
        </div>
      )}
      <div className="container">
        <h2 className="section-title">{title}</h2>
        {children}
      </div>
    </section>
  );
}
