import React, { useEffect, useRef } from "react";

// Cursor-following glow with smooth trail and parallax softly blending on top.
// Drawn inside section's .net-bg; does NOT change page background.
export default function CursorAura({
  theme = "dark",
  trail = 12,
  size = 220,
  ease = 0.18,
  lagFactor = 0.7,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef();
  const ptsRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999, inside: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const parent = canvas.parentElement;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = parent.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(200, Math.floor(rect.height || window.innerHeight * 0.45));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paletteDark = [
      "rgba(96, 165, 250, 0.18)", // blue-400
      "rgba(56, 189, 248, 0.16)", // sky-400
      "rgba(167, 139, 250, 0.14)", // violet-400
    ];
    const paletteLight = [
      "rgba(59, 130, 246, 0.10)",
      "rgba(56, 189, 248, 0.09)",
      "rgba(99, 102, 241, 0.08)",
    ];

    const colors = theme === "light" ? paletteLight : paletteDark;

    // init trail points
    ptsRef.current = Array.from({ length: trail }, () => ({ x: -9999, y: -9999 }));

    const step = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // ease first point toward mouse
      if (mouseRef.current.inside) {
        const head = ptsRef.current[0];
        if (head.x < -9990) {
          head.x = mouseRef.current.x; head.y = mouseRef.current.y;
        } else {
          head.x += (mouseRef.current.x - head.x) * ease;
          head.y += (mouseRef.current.y - head.y) * ease;
        }
        // propagate lag to trail
        for (let i = 1; i < ptsRef.current.length; i++) {
          const prev = ptsRef.current[i - 1];
          const p = ptsRef.current[i];
          const k = Math.pow(lagFactor, i);
          if (p.x < -9990) { p.x = prev.x; p.y = prev.y; }
          p.x += (prev.x - p.x) * (ease * k);
          p.y += (prev.y - p.y) * (ease * k);
        }
      }

      // draw layered radial glows along the trail
      for (let i = ptsRef.current.length - 1; i >= 0; i--) {
        const p = ptsRef.current[i];
        if (p.x < -9990) continue;
        const t = i / (ptsRef.current.length - 1);
        const r = size * (0.55 + 0.65 * (1 - t));
        for (let c = 0; c < colors.length; c++) {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
          grd.addColorStop(0, colors[c]);
          grd.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.inside = (
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom
      );
    };
    const onLeave = () => { mouseRef.current.inside = false; };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [ease, lagFactor, size, theme, trail]);

  return <canvas ref={canvasRef} className="net-canvas" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />;
}
