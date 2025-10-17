import React, { useEffect, useRef } from "react";

// Lightweight pastel fluid simulation rendered inside a canvas.
// This draws on a white canvas without touching the page/background styles.
// Low-res grid simulated and upscaled for performance.
export default function FluidSim({
  gridW = 96,
  gridH = 54,
  dt = 0.016,
  vorticity = 20,
  jacobiIters = 16,
  splatRadius = 10,
  fade = 0.01,
  alpha = 0.16,
  palette = [
    [0.82, 0.94, 1.0],
    [0.90, 1.0, 0.92],
    [1.0, 0.90, 0.96],
    [1.0, 0.97, 0.86],
  ],
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef();
  const stateRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // DPR-aware sizing
    const resize = () => {
      const parent = canvas.parentElement;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = parent.getBoundingClientRect();
      const fallbackH = parent.parentElement ? parent.parentElement.getBoundingClientRect().height : 0;
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(260, Math.floor(rect.height || fallbackH || window.innerHeight * 0.45));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const makeField = (w, h, c = 2) => new Float32Array(w * h * c);
    const idx = (x, y, c, W) => (y * W + x) * c;

    const init = () => {
      const W = gridW;
      const H = gridH;
      stateRef.current = {
        W,
        H,
        u: makeField(W, H, 2), // velocity (u,v)
        p: makeField(W, H, 1), // pressure
        div: makeField(W, H, 1),
        dye: makeField(W, H, 3), // RGB
        tmp: makeField(W, H, 3),
      };
    };

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    const addSplat = (sx, sy, rad) => {
      const S = stateRef.current;
      const { W, H, u, dye } = S;
      const cx = clamp(Math.floor((sx / canvas.clientWidth) * W), 0, W - 1);
      const cy = clamp(Math.floor((sy / canvas.clientHeight) * H), 0, H - 1);
      const r2 = rad * rad;
      const c = palette[(Math.random() * palette.length) | 0];
      for (let y = Math.max(0, cy - rad); y < Math.min(H, cy + rad); y++) {
        for (let x = Math.max(0, cx - rad); x < Math.min(W, cx + rad); x++) {
          const dx = x - cx;
          const dy = y - cy;
          const d2 = dx * dx + dy * dy;
          if (d2 <= r2) {
            const f = Math.exp(-d2 / (rad * rad));
            const ii = idx(x, y, 2, W);
            // add a bit of spin
            u[ii + 0] += -dy * 0.03 * f;
            u[ii + 1] += dx * 0.03 * f;
            const di = idx(x, y, 3, W);
            dye[di + 0] += c[0] * alpha * f;
            dye[di + 1] += c[1] * alpha * f;
            dye[di + 2] += c[2] * alpha * f;
          }
        }
      }
    };

    const advect = () => {
      const S = stateRef.current;
      const { W, H, u, dye, tmp } = S;
      tmp.fill(0);
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const ui = idx(x, y, 2, W);
          const vx = u[ui + 0];
          const vy = u[ui + 1];
          let px = x - vx * dt;
          let py = y - vy * dt;
          px = clamp(px, 0.5, W - 1.5);
          py = clamp(py, 0.5, H - 1.5);
          const x0 = Math.floor(px); const y0 = Math.floor(py);
          const x1 = x0 + 1; const y1 = y0 + 1;
          const sx = px - x0; const sy = py - y0;
          const w00 = (1 - sx) * (1 - sy);
          const w10 = sx * (1 - sy);
          const w01 = (1 - sx) * sy;
          const w11 = sx * sy;
          const d00 = idx(x0, y0, 3, W);
          const d10 = idx(x1, y0, 3, W);
          const d01 = idx(x0, y1, 3, W);
          const d11 = idx(x1, y1, 3, W);
          const ti = idx(x, y, 3, W);
          tmp[ti + 0] = dye[d00 + 0] * w00 + dye[d10 + 0] * w10 + dye[d01 + 0] * w01 + dye[d11 + 0] * w11;
          tmp[ti + 1] = dye[d00 + 1] * w00 + dye[d10 + 1] * w10 + dye[d01 + 1] * w01 + dye[d11 + 1] * w11;
          tmp[ti + 2] = dye[d00 + 2] * w00 + dye[d10 + 2] * w10 + dye[d01 + 2] * w01 + dye[d11 + 2] * w11;
        }
      }
      // swap
      S.dye.set(tmp);
    };

    const computeDivergence = () => {
      const S = stateRef.current;
      const { W, H, u, div } = S;
      for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
          const l = idx(x - 1, y, 2, W);
          const r = idx(x + 1, y, 2, W);
          const b = idx(x, y - 1, 2, W);
          const t = idx(x, y + 1, 2, W);
          const di = idx(x, y, 1, W);
          div[di] = 0.5 * ((u[r] - u[l]) + (u[t + 1] - u[b + 1]));
        }
      }
    };

    const pressureJacobi = () => {
      const S = stateRef.current;
      const { W, H, p, div } = S;
      for (let iter = 0; iter < jacobiIters; iter++) {
        for (let y = 1; y < H - 1; y++) {
          for (let x = 1; x < W - 1; x++) {
            const di = idx(x, y, 1, W);
            const pl = idx(x - 1, y, 1, W);
            const pr = idx(x + 1, y, 1, W);
            const pb = idx(x, y - 1, 1, W);
            const pt = idx(x, y + 1, 1, W);
            p[di] = (div[di] + p[pl] + p[pr] + p[pb] + p[pt]) / 4;
          }
        }
      }
    };

    const subtractPressureGradient = () => {
      const S = stateRef.current;
      const { W, H, u, p } = S;
      for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
          const ui = idx(x, y, 2, W);
          const pl = idx(x - 1, y, 1, W);
          const pr = idx(x + 1, y, 1, W);
          const pb = idx(x, y - 1, 1, W);
          const pt = idx(x, y + 1, 1, W);
          u[ui + 0] -= 0.5 * (p[pr] - p[pl]);
          u[ui + 1] -= 0.5 * (p[pt] - p[pb]);
        }
      }
    };

    const vorticityConfinement = () => {
      const S = stateRef.current;
      const { W, H, u } = S;
      for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
          const l = idx(x - 1, y, 2, W);
          const r = idx(x + 1, y, 2, W);
          const b = idx(x, y - 1, 2, W);
          const t = idx(x, y + 1, 2, W);
          const ui = idx(x, y, 2, W);
          const curl = (u[r + 1] - u[l + 1] - (u[t] - u[b])) * 0.5;
          const Nx = Math.abs(u[r + 1] - u[l + 1]);
          const Ny = Math.abs(u[t] - u[b]);
          const len = Math.max(1e-5, Math.sqrt(Nx * Nx + Ny * Ny));
          const fx = (Ny / len) * (curl > 0 ? 1 : -1) * (vorticity * dt * 0.002);
          const fy = (Nx / len) * (curl > 0 ? -1 : 1) * (vorticity * dt * 0.002);
          u[ui + 0] += fx;
          u[ui + 1] += fy;
        }
      }
    };

    const fadeDye = () => {
      const { dye, W, H } = stateRef.current;
      for (let i = 0; i < W * H * 3; i++) dye[i] *= (1 - fade);
    };

    const render = () => {
      const { dye, W, H } = stateRef.current;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      // do NOT paint a solid background; keep transparency so page bg shows through
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      const img = ctx.createImageData(W, H);
      let p = 0;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const di = idx(x, y, 3, W);
          const r = clamp(dye[di + 0], 0, 1);
          const g = clamp(dye[di + 1], 0, 1);
          const b = clamp(dye[di + 2], 0, 1);
          // slight gamma to avoid blown highlights
          const rr = Math.pow(r, 0.9);
          const gg = Math.pow(g, 0.9);
          const bb = Math.pow(b, 0.9);
          img.data[p++] = (rr * 255) | 0;
          img.data[p++] = (gg * 255) | 0;
          img.data[p++] = (bb * 255) | 0;
          // semi-transparent to blend with page background
          const a = Math.min(255, 190 + ((rr + gg + bb) / 3) * 55);
          img.data[p++] = a | 0;
        }
      }
      // Upscale to full canvas
      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const octx = off.getContext("2d");
      octx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(off, 0, 0, w, h);
    };

    const step = () => {
      // subtle continuous feed near center to keep motion alive
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (Math.random() < 0.6) {
        addSplat(w * (0.45 + Math.random() * 0.1), h * (0.45 + Math.random() * 0.1), splatRadius * 0.9);
      }
      vorticityConfinement();
      computeDivergence();
      pressureJacobi();
      subtractPressureGradient();
      advect();
      fadeDye();
      render();
      rafRef.current = requestAnimationFrame(step);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      addSplat(x, y, splatRadius);
    };

    const onTouch = (e) => {
      for (const t of e.touches) {
        const rect = canvas.getBoundingClientRect();
        const x = t.clientX - rect.left;
        const y = t.clientY - rect.top;
        addSplat(x, y, splatRadius);
      }
    };

    init();
    resize();
    // seed a few pastel splats so it's visible immediately
    const seed = () => {
      const w = canvas.clientWidth || canvas.getBoundingClientRect().width || 800;
      const h = canvas.clientHeight || canvas.getBoundingClientRect().height || 400;
      for (let i = 0; i < 8; i++) {
        addSplat(Math.random() * w, Math.random() * h, splatRadius * (1.1 + Math.random() * 1.2));
      }
    };
    seed();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    step();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [alpha, dt, fade, gridH, gridW, jacobiIters, palette, splatRadius, vorticity]);

  return <canvas ref={canvasRef} className="net-canvas" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />;
}
