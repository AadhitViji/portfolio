import React, { useEffect, useRef } from "react";

// SVG-filter-based gooey blobs that follow the cursor (matches referenced UI approach)
export default function GooeyBlob({
  color = "#ffd369",
  secondary = "#ffb703",
  tertiary = "#ffa600",
  size = [300, 200, 150], // diameters for 3 blobs
  ease = 0.15, // follow ease for leader
  lag = 0.12, // lag for 2nd
  lag2 = 0.1, // lag for 3rd
}) {
  const wrapRef = useRef(null);
  const b1Ref = useRef(null);
  const b2Ref = useRef(null);
  const b3Ref = useRef(null);
  const filterIdRef = useRef("goo-" + Math.random().toString(36).slice(2));
  const pos = useRef({ x: -9999, y: -9999, tx: -9999, ty: -9999, in: false });
  const p2 = useRef({ x: -9999, y: -9999 });
  const p3 = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef();

  useEffect(() => {
    const el = wrapRef.current;
    // Initialize blobs at center so it's visible before mouse moves
    if (el) {
      const r = el.getBoundingClientRect();
      const cx = r.width / 2;
      const cy = r.height / 2;
      pos.current.x = cx; pos.current.y = cy; pos.current.tx = cx; pos.current.ty = cy;
      p2.current.x = cx; p2.current.y = cy; p3.current.x = cx; p3.current.y = cy;
    }
    const onMove = (e) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      pos.current.tx = e.clientX - r.left;
      pos.current.ty = e.clientY - r.top;
      if (pos.current.x === -9999) {
        pos.current.x = pos.current.tx;
        pos.current.y = pos.current.ty;
        p2.current.x = pos.current.tx;
        p2.current.y = pos.current.ty;
        p3.current.x = pos.current.tx;
        p3.current.y = pos.current.ty;
      }
    };
    const onLeave = () => {};

    const step = () => {
      // Always ease toward last target so blobs remain visible
      pos.current.x += (pos.current.tx - pos.current.x) * ease;
      pos.current.y += (pos.current.ty - pos.current.y) * ease;
      p2.current.x += (pos.current.x - p2.current.x) * lag;
      p2.current.y += (pos.current.y - p2.current.y) * lag;
      p3.current.x += (p2.current.x - p3.current.x) * lag2;
      p3.current.y += (p2.current.y - p3.current.y) * lag2;
      if (b1Ref.current) b1Ref.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      if (b2Ref.current) b2Ref.current.style.transform = `translate3d(${p2.current.x}px, ${p2.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      if (b3Ref.current) b3Ref.current.style.transform = `translate3d(${p3.current.x}px, ${p3.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      rafRef.current = requestAnimationFrame(step);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [ease, lag, lag2]);

  return (
    <div className="net-wrap" ref={wrapRef}>
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id={filterIdRef.current}>
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="40" />
            <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -7" />
          </filter>
        </defs>
      </svg>
      <div className="goo-hooks">
        <div className="goo-filter" style={{ filter: `url(#${filterIdRef.current})` }}>
          <div ref={b1Ref} className="goo-b goo-b1" style={{ width: size[0], height: size[0], background: color, boxShadow: `0 0 60px ${color}80` }} />
          <div ref={b2Ref} className="goo-b goo-b2" style={{ width: size[1], height: size[1], background: secondary, boxShadow: `0 0 50px ${secondary}80` }} />
          <div ref={b3Ref} className="goo-b goo-b3" style={{ width: size[2], height: size[2], background: tertiary, boxShadow: `0 0 40px ${tertiary}80` }} />
        </div>
      </div>
    </div>
  );
}
