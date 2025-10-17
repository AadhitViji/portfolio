import React, { useEffect, useRef } from "react";

// Colorful liquid-like field that reacts to the mouse and fades away over time
export default function FluidField({
  colors = ["#7c3aed", "#22d3ee", "#f472b6", "#a3e635", "#60a5fa"],
  fade = 0.045, // global fade each frame (higher = quicker disappearance)
  spawnRate = 2, // drops per mousemove event
  maxRadius = 120,
  backgroundTint = "rgba(8,12,20,0.06)", // darken behind blobs to avoid white look
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, inside: false });
  const dropsRef = useRef([]);
  const rafRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "source-over";

    const resize = () => {
      const parent = canvas.parentElement;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = Math.max(260, parent.clientHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const addDrops = (x, y) => {
      for (let i = 0; i < spawnRate; i++) {
        const c = colors[(Math.random() * colors.length) | 0];
        dropsRef.current.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          r: 8 + Math.random() * 16,
          grow: 0.6 + Math.random() * 0.9,
          life: 1,
          color: c,
        });
      }
    };

    const step = () => {
      const { width, height } = canvas;
      // 1) fade previous frame to create dissipating effect
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${fade})`;
      ctx.fillRect(0, 0, width, height);
      // 2) apply subtle dark tint so white background doesn't overpower
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = backgroundTint;
      ctx.fillRect(0, 0, width, height);
      // 3) draw blobs with additive blending for vibrancy
      ctx.globalCompositeOperation = "lighter";

      // update and draw drops
      for (let i = dropsRef.current.length - 1; i >= 0; i--) {
        const d = dropsRef.current[i];
        d.r = Math.min(maxRadius, d.r + d.grow);
        d.life -= 0.007 + d.r / (maxRadius * 120); // slower fade for small, faster for big
        if (d.life <= 0) {
          dropsRef.current.splice(i, 1);
          continue;
        }
        const grd = ctx.createRadialGradient(d.x, d.y, d.r * 0.12, d.x, d.y, d.r);
        grd.addColorStop(0, hexToRgba(d.color, 0.75 * d.life));
        grd.addColorStop(1, hexToRgba(d.color, 0));
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // gentle auto-spread from last mouse position
      if (mouseRef.current.inside) {
        addDrops(mouseRef.current.x + (Math.random() - 0.5) * 8, mouseRef.current.y + (Math.random() - 0.5) * 8);
      }

      rafRef.current = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(step);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        mouseRef.current.inside = true;
        mouseRef.current.x = e.clientX - r.left;
        mouseRef.current.y = e.clientY - r.top;
        addDrops(mouseRef.current.x, mouseRef.current.y);
      } else {
        mouseRef.current.inside = false;
      }
    };
    const onOut = () => { mouseRef.current.inside = false; };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onOut);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onOut);
    };
  }, [colors, fade, spawnRate, maxRadius]);

  return (
    <div className="net-wrap">
      <canvas ref={canvasRef} className="net-canvas" />
    </div>
  );
}

function hexToRgba(hex, a) {
  const m = hex.replace('#','');
  const bigint = parseInt(m.length === 3 ? m.split('').map(x=>x+x).join('') : m, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${a})`;
}
