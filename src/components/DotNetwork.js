import React, { useEffect, useRef } from "react";

// Interactive dots network with click-to-add nodes. Mouse acts as a virtual node.
export default function DotNetwork({
  density = 0.00012, // nodes per pixel
  maxConnections = 4,
  linkDistance = 140,
  nodeRadius = 2,
  lineColor = "rgba(108,162,255,0.35)",
  nodeColor = "#6ca2ff",
  attract = false,
  attractStrength = 0.22,
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const pointsRef = useRef([]);
  const rafRef = useRef();

  // Resize and initialize points based on canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = Math.max(260, parent.clientHeight);
      seedPoints();
    };

    const seedPoints = () => {
      const { width, height } = canvas;
      const count = Math.floor(width * height * density);
      pointsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      }));
    };

    const step = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Move and bounce
      for (const p of pointsRef.current) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      // Draw connections
      for (let i = 0; i < pointsRef.current.length; i++) {
        const a = pointsRef.current[i];
        let connected = 0;
        for (let j = i + 1; j < pointsRef.current.length; j++) {
          const b = pointsRef.current[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDistance * linkDistance) {
            const alpha = 1 - Math.sqrt(d2) / linkDistance;
            ctx.strokeStyle = lineColor.replace(/\b0\.35\b/, String(0.15 + 0.5 * alpha));
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            connected++;
            if (connected >= maxConnections) break;
          }
        }
      }

      // Draw connections to mouse as a virtual node for responsiveness
      if (mouseRef.current.x > -9990) {
        for (let i = 0; i < pointsRef.current.length; i++) {
          const p = pointsRef.current[i];
          const dx = p.x - mouseRef.current.x, dy = p.y - mouseRef.current.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDistance * linkDistance) {
            const alpha = 1 - Math.sqrt(d2) / linkDistance;
            ctx.strokeStyle = lineColor.replace(/\b0\.35\b/, String(0.25 + 0.6 * alpha));
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();
          }
        }
      }

      // Draw points (attraction or repulsion to mouse)
      for (const p of pointsRef.current) {
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          const fx = (dx / dist) * attractStrength;
          const fy = (dy / dist) * attractStrength;
          if (attract) {
            // Move towards mouse
            p.x -= fx; p.y -= fy;
          } else {
            // Move away from mouse
            p.x += fx; p.y += fy;
          }
        }
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [density, nodeColor, nodeRadius, lineColor, linkDistance, maxConnections]);

  // Mouse and clicks via window to stay responsive even when canvas is covered
  useEffect(() => {
    const onMove = (e) => {
      const canvas = canvasRef.current;
      const r = canvas.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        mouseRef.current.x = e.clientX - r.left;
        mouseRef.current.y = e.clientY - r.top;
      } else {
        mouseRef.current.x = -9999; mouseRef.current.y = -9999;
      }
    };
    const onLeave = () => { mouseRef.current.x = -9999; mouseRef.current.y = -9999; };
    const onClick = (e) => {
      const canvas = canvasRef.current;
      const r = canvas.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        const x = e.clientX - r.left; const y = e.clientY - r.top;
        pointsRef.current.push({ x, y, vx: (Math.random()-0.5)*0.6, vy: (Math.random()-0.5)*0.6 });
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className="net-wrap">
      <canvas ref={canvasRef} className="net-canvas" />
    </div>
  );
}
