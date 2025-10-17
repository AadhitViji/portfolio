import React, { useEffect, useRef } from "react";

// Colorful liquid-like field that reacts to the mouse and fades away over time
export default function FluidField({
  colors = ["#ff6b6b", "#ffd93d", "#6bcBef", "#b46bff", "#6bea9a"],
  fade = 0.06, // global fade each frame (higher = quicker disappearance)
  spawnRate = 1, // drops per mousemove event
  maxRadius = 90,
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
      canvas.width = parent.clientWidth;
      canvas.height = Math.max(260, parent.clientHeight);
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
      // global fade to create dissipating effect
      ctx.fillStyle = `rgba(0,0,0,${fade})`;
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter"; // additive blending for vivid colors

      // update and draw drops
      for (let i = dropsRef.current.length - 1; i >= 0; i--) {
        const d = dropsRef.current[i];
        d.r = Math.min(maxRadius, d.r + d.grow);
        d.life -= 0.008 + d.r / (maxRadius * 100); // slower fade for small, faster for big
        if (d.life <= 0) {
          dropsRef.current.splice(i, 1);
          continue;
        }
        const grd = ctx.createRadialGradient(d.x, d.y, d.r * 0.1, d.x, d.y, d.r);
        grd.addColorStop(0, hexToRgba(d.color, 0.6 * d.life));
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
