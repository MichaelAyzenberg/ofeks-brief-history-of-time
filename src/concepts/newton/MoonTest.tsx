import { useState, useEffect, useRef, useCallback } from 'react';

const W = 280;
const H = 200;
const EARTH_X = W / 2;
const EARTH_Y = H / 2;
const EARTH_R = 20;
const MOON_R = 8;
const BASE_ORBIT_R = 90; // canvas px for 1× distance

// Real values
const G_SURFACE = 9.81;       // m/s² at Earth surface
const A_MOON_BASE = 0.00272;  // m/s² at Moon's actual distance (1×)

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  dx: number, dy: number,
  color: string,
  label: string,
  labelSide: 'right' | 'left' = 'right',
) {
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.8;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y + dy);
  ctx.stroke();

  // Arrowhead
  const angle = Math.atan2(dy, dx);
  const headLen = 7;
  ctx.beginPath();
  ctx.moveTo(x + dx, y + dy);
  ctx.lineTo(
    x + dx - headLen * Math.cos(angle - Math.PI / 6),
    y + dy - headLen * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    x + dx - headLen * Math.cos(angle + Math.PI / 6),
    y + dy - headLen * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();

  // Label
  ctx.fillStyle = color;
  ctx.font = '9.5px monospace';
  const lx = labelSide === 'right' ? x + dx + 4 : x + dx - 4;
  const textAlign = labelSide === 'right' ? 'left' : 'right';
  ctx.textAlign = textAlign as CanvasTextAlign;
  ctx.fillText(label, lx, y + dy + 4);

  ctx.restore();
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  moonAngle: number,
  multiplier: number,
) {
  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, W, H);

  // Stars (deterministic)
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  const starSeeds = [
    [14, 22], [52, 8], [88, 31], [130, 15], [170, 27], [220, 9], [255, 18],
    [10, 55], [45, 72], [240, 60], [265, 45], [100, 180], [200, 185],
    [30, 170], [150, 190], [60, 130], [240, 120],
  ];
  for (const [sx, sy] of starSeeds) {
    ctx.beginPath();
    ctx.arc(sx, sy, 0.8, 0, 2 * Math.PI);
    ctx.fill();
  }

  const orbitR = BASE_ORBIT_R * multiplier;

  // Clamp orbit display so Moon stays near canvas edge
  const displayOrbitR = Math.min(orbitR, Math.min(EARTH_X, EARTH_Y) - MOON_R - 4);

  // Dashed orbital path
  ctx.save();
  ctx.beginPath();
  ctx.arc(EARTH_X, EARTH_Y, displayOrbitR, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(148,163,184,0.35)';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Earth
  const earthGrad = ctx.createRadialGradient(
    EARTH_X - 6, EARTH_Y - 6, 2,
    EARTH_X, EARTH_Y, EARTH_R,
  );
  earthGrad.addColorStop(0, '#60a5fa');
  earthGrad.addColorStop(1, '#1d4ed8');
  ctx.beginPath();
  ctx.arc(EARTH_X, EARTH_Y, EARTH_R, 0, 2 * Math.PI);
  ctx.fillStyle = earthGrad;
  ctx.fill();

  // g arrow (downward from Earth surface, visual length ~40px)
  const G_ARROW_LEN = 40;
  drawArrow(
    ctx,
    EARTH_X, EARTH_Y + EARTH_R,
    0, G_ARROW_LEN,
    '#f59e0b',
    `g=9.81`,
    'right',
  );

  // Moon position
  const moonX = EARTH_X + displayOrbitR * Math.cos(moonAngle);
  const moonY = EARTH_Y + displayOrbitR * Math.sin(moonAngle);

  // Moon acceleration arrow toward Earth — visually tiny (max 8px at 1×)
  const aMoon = A_MOON_BASE / (multiplier * multiplier);
  // Scale: g=9.81 → 40px, so a_moon at 1× → 40 * (0.00272/9.81) ≈ 0.011px (too tiny)
  // Use logarithmic visual scale so it's visible but clearly smaller
  const moonArrowLen = Math.max(3, 8 / (multiplier * multiplier));
  const dx = EARTH_X - moonX;
  const dy = EARTH_Y - moonY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / dist;
  const uy = dy / dist;

  drawArrow(
    ctx,
    moonX, moonY,
    ux * moonArrowLen, uy * moonArrowLen,
    '#f59e0b',
    `a=${aMoon.toFixed(5)}`,
    moonX > EARTH_X ? 'right' : 'left',
  );

  // Moon
  const moonGrad = ctx.createRadialGradient(
    moonX - 2, moonY - 2, 1,
    moonX, moonY, MOON_R,
  );
  moonGrad.addColorStop(0, '#cbd5e1');
  moonGrad.addColorStop(1, '#64748b');
  ctx.beginPath();
  ctx.arc(moonX, moonY, MOON_R, 0, 2 * Math.PI);
  ctx.fillStyle = moonGrad;
  ctx.fill();

  // Distance line (faint)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(EARTH_X, EARTH_Y);
  ctx.lineTo(moonX, moonY);
  ctx.strokeStyle = 'rgba(148,163,184,0.20)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  // Multiplier label
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`${multiplier.toFixed(1)}× dist`, 6, 14);
}

export default function MoonTest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const angleRef = useRef(0);
  const [multiplier, setMultiplier] = useState(1);
  const multiplierRef = useRef(multiplier);
  multiplierRef.current = multiplier;

  const aMoon = A_MOON_BASE / (multiplier * multiplier);
  const ratio = G_SURFACE / aMoon;
  // At 1×: d_moon/r_earth ≈ 60, so ratio ≈ 3600
  const distRatio = 60 * multiplier; // nominal ratio

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Slower orbit at larger distance (Kepler T²∝r³, ω∝r^(-3/2))
    const angularSpeed = 0.008 / Math.pow(multiplierRef.current, 1.5);
    angleRef.current += angularSpeed;

    drawScene(ctx, angleRef.current, multiplierRef.current);
    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [animate]);

  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: '16px', color: '#e2e8f0', fontFamily: 'sans-serif', maxWidth: 320 }}>
      <h3 style={{ margin: '0 0 10px', fontSize: 15, color: '#f1f5f9', letterSpacing: 0.2 }}>
        The Moon Test
      </h3>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ display: 'block', borderRadius: 8, border: '1px solid #1e293b' }}
      />

      {/* Accelerations */}
      <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.75, color: '#94a3b8' }}>
        <div>
          <span style={{ color: '#f59e0b' }}>g</span> at Earth surface ={' '}
          <span style={{ color: '#fcd34d', fontWeight: 600 }}>9.81 m/s²</span>
        </div>
        <div>
          <span style={{ color: '#f59e0b' }}>a</span> at Moon ({multiplier.toFixed(1)}× dist) ={' '}
          <span style={{ color: '#fcd34d', fontWeight: 600 }}>{aMoon.toFixed(5)} m/s²</span>
        </div>
        <div style={{ marginTop: 4 }}>
          <span style={{ color: '#3b82f6' }}>g / a</span> ={' '}
          <span style={{ color: '#fcd34d', fontWeight: 600 }}>{ratio.toFixed(1)}</span>
          {'  ≈  '}
          <span style={{ color: '#3b82f6' }}>({distRatio.toFixed(0)})²</span>
          {'  '}
          <span style={{ color: '#4ade80' }}>✓</span>
        </div>
      </div>

      {/* Formula */}
      <div style={{
        marginTop: 8,
        padding: '6px 10px',
        background: '#1e293b',
        borderRadius: 6,
        fontSize: 11.5,
        fontFamily: 'monospace',
        color: '#94a3b8',
        lineHeight: 1.7,
      }}>
        <span style={{ color: '#3b82f6' }}>g/a</span>
        {' = (d_moon / r_earth)² = ('}
        <span style={{ color: '#fcd34d' }}>{distRatio.toFixed(0)}</span>
        {')² = '}
        <span style={{ color: '#fcd34d' }}>{(distRatio * distRatio).toFixed(0)}</span>
        {' '}
        <span style={{ color: '#4ade80' }}>✓</span>
      </div>

      {/* Slider */}
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 12, color: '#94a3b8', minWidth: 52 }}>{multiplier.toFixed(1)}× dist</span>
        <input
          type="range"
          min={1}
          max={4}
          step={0.1}
          value={multiplier}
          onChange={e => setMultiplier(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#3b82f6' }}
        />
        <span style={{ fontSize: 11, color: '#64748b', minWidth: 28 }}>4×</span>
      </div>

      <p style={{ margin: '12px 0 0', fontSize: 11.5, color: '#64748b', lineHeight: 1.6 }}>
        Newton: the same force that makes apples fall holds the Moon in orbit.
        Double the distance → <span style={{ color: '#f59e0b' }}>¼ the acceleration</span>. Inverse square law confirmed.
      </p>
    </div>
  );
}
