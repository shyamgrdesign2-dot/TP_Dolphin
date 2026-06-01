import { useEffect, useRef } from "react";

/* Siri-style ribbon visualizer — ported from VoiceRx-L's VoiceRxSiriWaveform.
   The original is wired to a live WebAudio AnalyserNode; this POC has no mic,
   so we synthesize organic "speech energy" frequency data per frame. The draw
   math (3 bezier channels, additive blend, glow) matches the reference 1:1. */

const opts = {
  glow: 26,
  // softened to harmonise with the deep-violet hero — pastel, not neon
  color1: [167, 139, 250], // soft violet
  color2: [129, 140, 248], // soft indigo
  color3: [203, 159, 231], // soft lavender-pink
  fillOpacity: 0.28,
  blend: "lighter",
  shift: 14,
  width: 23,
  amp: 0.3,
};

const shuffle = [1, 3, 0, 4, 2];
const range = (n) => Array.from(Array(n).keys());
const pickFreq = (channel, i, freqs) => freqs[2 * channel + shuffle[i] * 6] ?? 0;
const ampScale = (i) => ((3 - Math.abs(2 - i)) / 3) * opts.amp;

function drawChannelPath(ctx, channel, WIDTH, HEIGHT, freqs) {
  const color = channel === 0 ? opts.color1 : channel === 1 ? opts.color2 : opts.color3;
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, 0);
  gradient.addColorStop(0, `rgba(${color[0]},${color[1]},${color[2]},0)`);
  gradient.addColorStop(0.2, `rgba(${color[0]},${color[1]},${color[2]},${opts.fillOpacity})`);
  gradient.addColorStop(0.8, `rgba(${color[0]},${color[1]},${color[2]},${opts.fillOpacity})`);
  gradient.addColorStop(1, `rgba(${color[0]},${color[1]},${color[2]},0)`);

  ctx.fillStyle = gradient;
  ctx.shadowColor = `rgba(${color[0]},${color[1]},${color[2]},0.3)`;
  ctx.shadowBlur = opts.glow;
  ctx.globalCompositeOperation = opts.blend;

  const m = HEIGHT / 2;
  const offset = (WIDTH - 15 * opts.width) / 2;
  const x = range(15).map((i) => offset + channel * opts.shift + i * opts.width);
  const y = range(5).map((i) => Math.max(0, m - ampScale(i) * pickFreq(channel, i, freqs)));
  const h = 2 * m;

  ctx.beginPath();
  ctx.moveTo(0, m);
  ctx.lineTo(x[0], m + 1);
  ctx.bezierCurveTo(x[1], m + 1, x[2], y[0], x[3], y[0]);
  ctx.bezierCurveTo(x[4], y[0], x[4], y[1], x[5], y[1]);
  ctx.bezierCurveTo(x[6], y[1], x[6], y[2], x[7], y[2]);
  ctx.bezierCurveTo(x[8], y[2], x[8], y[3], x[9], y[3]);
  ctx.bezierCurveTo(x[10], y[3], x[10], y[4], x[11], y[4]);
  ctx.bezierCurveTo(x[12], y[4], x[12], m, x[13], m);
  ctx.lineTo(WIDTH, m + 1);
  ctx.lineTo(x[13], m - 1);
  ctx.bezierCurveTo(x[12], m, x[12], h - y[4], x[11], h - y[4]);
  ctx.bezierCurveTo(x[10], h - y[4], x[10], h - y[3], x[9], h - y[3]);
  ctx.bezierCurveTo(x[8], h - y[3], x[8], h - y[2], x[7], h - y[2]);
  ctx.bezierCurveTo(x[6], h - y[2], x[6], h - y[1], x[5], h - y[1]);
  ctx.bezierCurveTo(x[4], h - y[1], x[4], h - y[0], x[3], h - y[0]);
  ctx.bezierCurveTo(x[2], h - y[0], x[1], m, x[0], m);
  ctx.lineTo(0, m);
  ctx.fill();
}

function drawIdleLine(ctx, WIDTH, HEIGHT) {
  const m = HEIGHT / 2;
  const pad = Math.min(20, WIDTH * 0.06);
  const g = ctx.createLinearGradient(pad, m, WIDTH - pad, m);
  g.addColorStop(0, `rgba(${opts.color1.join(",")},0.7)`);
  g.addColorStop(0.5, `rgba(${opts.color2.join(",")},0.7)`);
  g.addColorStop(1, `rgba(${opts.color3.join(",")},0.7)`);
  ctx.strokeStyle = g;
  ctx.lineWidth = 1.2;
  ctx.lineCap = "round";
  ctx.globalCompositeOperation = "source-over";
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(pad, m);
  ctx.lineTo(WIDTH - pad, m);
  ctx.stroke();
}

export function SiriWaveform({ active = true, className = "" }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const freqsRef = useRef(new Float32Array(32));
  const activeRef = useRef(active);
  const dimsRef = useRef({ w: 240, h: 80 });

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const apply = () => {
      const r = el.getBoundingClientRect();
      dimsRef.current = { w: Math.max(120, Math.floor(r.width)), h: Math.max(56, Math.floor(r.height)) };
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prev = freqsRef.current;

    const tick = (tMs) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const { w: lw, h: lh } = dimsRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = Math.max(120, Math.floor(lw * dpr));
      const H = Math.max(56, Math.floor(lh * dpr));
      canvas.width = W;
      canvas.height = H;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, lw, lh);

      const t = tMs / 1000;
      if (activeRef.current) {
        // organic speech: slow swell × syllable flutter, with a baseline so the
        // ribbon always reads as a full waveform rather than a thin line.
        // calmer than before: steadier envelope, slower & gentler flutter, and
        // heavier smoothing so the ribbon breathes rather than wobbles.
        const env = 0.84 + 0.16 * (0.5 + 0.5 * Math.sin(t * 1.2 + 0.4));
        for (let i = 0; i < 32; i++) {
          const flutter = 0.5 + 0.5 * Math.sin(t * (1.7 + (i % 5) * 0.45) + i * 0.9);
          const slow = 0.5 + 0.5 * Math.sin(t * 0.75 + i * 0.4);
          const taper = 1 - Math.abs((i % 6) - 2.5) / 5;
          const target = env * (0.66 + 0.34 * flutter * slow) * taper * 188;
          prev[i] = prev[i] * 0.82 + target * 0.18;
        }
        drawChannelPath(ctx, 0, lw, lh, prev);
        drawChannelPath(ctx, 1, lw, lh, prev);
        drawChannelPath(ctx, 2, lw, lh, prev);
      } else {
        for (let i = 0; i < 32; i++) prev[i] *= 0.85;
        drawIdleLine(ctx, lw, lh);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`} aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
