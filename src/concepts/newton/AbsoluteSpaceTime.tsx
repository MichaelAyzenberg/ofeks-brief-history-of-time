import { useState, useEffect, useRef } from 'react';

const W = 280;
const H = 160;
const G = 9.81;
const BUCKET_LEFT = 30;
const BUCKET_RIGHT = W - 30;
const BUCKET_WIDTH = BUCKET_RIGHT - BUCKET_LEFT; // 220
const BUCKET_BOTTOM = H - 20;
const BUCKET_TOP = 20;
const BUCKET_HEIGHT = BUCKET_BOTTOM - BUCKET_TOP; // 120
const CENTER_X = W / 2;
const BUCKET_HALF = BUCKET_WIDTH / 2; // 110 px = 1 unit "radius" for display

// Number of spinning dots on water surface
const NUM_DOTS = 8;

export default function AbsoluteSpaceTime() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const angleRef = useRef<number>(0);

  const [omega, setOmega] = useState(0);
  const omegaRef = useRef(0);

  useEffect(() => {
    omegaRef.current = omega;
  }, [omega]);

  // Returns the parabola height in pixels above bucket floor for a given
  // horizontal pixel offset from center (px), mapping physical radius r ∈ [0, 1].
  // Physical: h(r) = ω²r²/(2g), r in meters (we treat BUCKET_HALF px = 1 m)
  // We scale the result to pixels: max possible rise = ω²·1²/(2g), mapped to BUCKET_HEIGHT
  const parabolaHeightPx = (pixelOffset: number, w: number): number => {
    const r = pixelOffset / BUCKET_HALF; // normalised radius [0..1]
    const h_phys = (w * w * r * r) / (2 * G); // metres
    return h_phys * BUCKET_HEIGHT; // scale: 1 m → BUCKET_HEIGHT px
  };

  // Height of centre dip below rim (pixels)
  const rimHeightPx = (w: number): number => parabolaHeightPx(BUCKET_HALF, w);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let alive = true;

    const draw = (_ts: number) => {
      if (!alive) return;
      const w = omegaRef.current;

      // Rotate dots
      const rotSpeed = w * 0.6; // visual rotation rate
      angleRef.current += rotSpeed * (1 / 60);

      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, W, H);

      // ── Bucket walls ──────────────────────────────────────────────────
      const wallThickness = 5;
      ctx.fillStyle = '#f59e0b';
      // Left wall
      ctx.fillRect(BUCKET_LEFT - wallThickness, BUCKET_TOP, wallThickness, BUCKET_HEIGHT + wallThickness);
      // Right wall
      ctx.fillRect(BUCKET_RIGHT, BUCKET_TOP, wallThickness, BUCKET_HEIGHT + wallThickness);
      // Floor
      ctx.fillRect(BUCKET_LEFT - wallThickness, BUCKET_BOTTOM, BUCKET_WIDTH + wallThickness * 2, wallThickness);

      // ── Compute water surface ─────────────────────────────────────────
      // The parabola vertex (centre) is at some height above the floor.
      // Conservation of water: the volume under the parabola is constant.
      // Flat level at ω=0 → water fill height BUCKET_HEIGHT * 0.5 (50%)
      const flatFill = BUCKET_HEIGHT * 0.5; // pixels
      // Rise at edge = rimHeightPx(w). Centre drops by half that (paraboloid volume).
      const edgeRise = rimHeightPx(w);
      const centreY_above_floor = flatFill - edgeRise / 2; // pixels above floor

      // Build parabola path (x pixel → y canvas)
      const waterPoints: { x: number; y: number }[] = [];
      const steps = 80;
      let centreDry = false;

      for (let i = 0; i <= steps; i++) {
        const px = BUCKET_LEFT + (i / steps) * BUCKET_WIDTH; // canvas x
        const offset = px - CENTER_X; // signed pixel offset from centre
        const riseAtX = parabolaHeightPx(Math.abs(offset), w); // px above centre
        const yAboveFloor = centreY_above_floor + riseAtX;

        let canvasY: number;
        if (yAboveFloor <= 0) {
          // Centre is dry – clamp to floor
          canvasY = BUCKET_BOTTOM;
          if (i === Math.floor(steps / 2)) centreDry = true;
        } else {
          canvasY = BUCKET_BOTTOM - Math.min(yAboveFloor, BUCKET_HEIGHT);
        }
        waterPoints.push({ x: px, y: canvasY });
      }

      // Fill water
      ctx.beginPath();
      ctx.moveTo(BUCKET_LEFT, BUCKET_BOTTOM);
      for (const pt of waterPoints) ctx.lineTo(pt.x, pt.y);
      ctx.lineTo(BUCKET_RIGHT, BUCKET_BOTTOM);
      ctx.closePath();

      const waterGrd = ctx.createLinearGradient(0, BUCKET_TOP, 0, BUCKET_BOTTOM);
      waterGrd.addColorStop(0, '#60a5fa');
      waterGrd.addColorStop(1, '#1d4ed8');
      ctx.fillStyle = waterGrd;
      ctx.fill();

      // Water surface line
      ctx.beginPath();
      ctx.moveTo(waterPoints[0].x, waterPoints[0].y);
      for (const pt of waterPoints) ctx.lineTo(pt.x, pt.y);
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Dry floor in centre (if applicable)
      if (centreDry) {
        // find dry range
        let dryLeft = CENTER_X, dryRight = CENTER_X;
        for (const pt of waterPoints) {
          if (pt.y >= BUCKET_BOTTOM - 1) {
            if (pt.x < CENTER_X) dryLeft = pt.x;
            if (pt.x > CENTER_X) { dryRight = pt.x; break; }
          }
        }
        ctx.fillStyle = '#1a0a00';
        ctx.fillRect(dryLeft, BUCKET_BOTTOM - 3, dryRight - dryLeft, 4);
        ctx.fillStyle = '#92400e';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('DRY', CENTER_X, BUCKET_BOTTOM - 6);
      }

      // ── Spinning dots on water surface ───────────────────────────────
      if (w > 0.05) {
        for (let d = 0; d < NUM_DOTS; d++) {
          const baseAngle = (d / NUM_DOTS) * Math.PI * 2 + angleRef.current;
          // Radial position: vary dots from 20% to 90% of half-width
          const radialFrac = 0.25 + 0.6 * ((d % 3) / 2);
          const dotOffset = radialFrac * BUCKET_HALF; // px offset from centre
          const dotX = CENTER_X + Math.cos(baseAngle) * dotOffset;

          if (dotX < BUCKET_LEFT + 2 || dotX > BUCKET_RIGHT - 2) continue;

          // Find y on water surface at dotX
          const rise = parabolaHeightPx(Math.abs(dotX - CENTER_X), w);
          const yAboveFloor = centreY_above_floor + rise;
          const dotY = Math.max(BUCKET_TOP + 2, BUCKET_BOTTOM - Math.min(yAboveFloor, BUCKET_HEIGHT));

          if (dotY >= BUCKET_BOTTOM) continue;

          const alpha = 0.5 + 0.5 * Math.sin(baseAngle);
          ctx.beginPath();
          ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(186, 230, 253, ${alpha})`;
          ctx.fill();
        }
      }

      // ── Flat-level ghost line (ω=0 reference) ────────────────────────
      if (w > 0.3) {
        const flatY = BUCKET_BOTTOM - flatFill;
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(148,163,184,0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(BUCKET_LEFT, flatY);
        ctx.lineTo(BUCKET_RIGHT, flatY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(148,163,184,0.5)';
        ctx.font = '8px monospace';
        ctx.textAlign = 'right';
        ctx.fillText('ω=0 level', BUCKET_RIGHT - 2, flatY - 2);
      }

      // ── Label ─────────────────────────────────────────────────────────
      ctx.fillStyle = '#8b949e';
      ctx.font = '8.5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText("Newton: concave surface proves rotation", CENTER_X, 14);
      ctx.fillText("relative to Absolute Space", CENTER_X, 24);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const edgeCm = ((omega * omega * 1) / (2 * G) * 100).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', fontFamily: 'monospace' }}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ borderRadius: 8, border: '1px solid #30363d', display: 'block' }}
      />

      {/* Slider */}
      <div style={{ width: W, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ color: '#8b949e', fontSize: 11, display: 'flex', flexDirection: 'column', gap: 3 }}>
          Rotation speed:&nbsp;
          <span style={{ color: '#f59e0b' }}>ω = {omega.toFixed(2)} rad/s</span>
          <input
            type="range" min={0} max={5} step={0.05} value={omega}
            onChange={e => setOmega(Number(e.target.value))}
            style={{ accentColor: '#f59e0b', width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#484f58', fontSize: 9, marginTop: -2 }}>
            <span>0 (still)</span>
            <span>5 rad/s (fast)</span>
          </div>
        </label>

        {/* Formula readout */}
        <div style={{
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 6,
          padding: '8px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ color: '#8b949e', fontSize: 10 }}>Formula:</span>
            <span style={{ color: '#a78bfa', fontSize: 11 }}>h = ω²r²/2g</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ color: '#8b949e', fontSize: 10 }}>Wall rise (r = 1 m):</span>
            <span style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700 }}>
              {edgeCm} cm
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ color: '#8b949e', fontSize: 10 }}>g =</span>
            <span style={{ color: '#38bdf8', fontSize: 11 }}>9.81 m/s²</span>
          </div>
        </div>
      </div>
    </div>
  );
}
