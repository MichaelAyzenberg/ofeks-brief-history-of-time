import { useState, useEffect, useRef, useCallback } from 'react';

const W = 280;
const H = 200;
const CX = W / 2;
const CY = H / 2;
const RADIUS = 80;

function polygonPerimeter(n: number): number {
  // Side length of inscribed regular n-gon in circle of radius R
  const sideLen = 2 * RADIUS * Math.sin(Math.PI / n);
  return n * sideLen;
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  n: number,
) {
  ctx.clearRect(0, 0, W, H);

  // Dark background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, W, H);

  // Draw gap highlight (arc segments between polygon edges and circle) first so it sits under polygon
  ctx.save();
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2; // start at top

  for (let i = 0; i < n; i++) {
    const a1 = startAngle + i * angleStep;
    const a2 = startAngle + (i + 1) * angleStep;

    const x1 = CX + RADIUS * Math.cos(a1);
    const y1 = CY + RADIUS * Math.sin(a1);
    const x2 = CX + RADIUS * Math.cos(a2);
    const y2 = CY + RADIUS * Math.sin(a2);

    // Fill the gap region: path from chord to arc
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.arc(CX, CY, RADIUS, a2, a1, true);
    ctx.closePath();
    ctx.fillStyle = 'rgba(239,68,68,0.30)';
    ctx.fill();
  }
  ctx.restore();

  // Draw circle
  ctx.beginPath();
  ctx.arc(CX, CY, RADIUS, 0, 2 * Math.PI);
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw inscribed polygon
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const angle = startAngle + (i * 2 * Math.PI) / n;
    const x = CX + RADIUS * Math.cos(angle);
    const y = CY + RADIUS * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Vertex dots
  ctx.fillStyle = '#fcd34d';
  for (let i = 0; i < n; i++) {
    const angle = startAngle + (i * 2 * Math.PI) / n;
    const x = CX + RADIUS * Math.cos(angle);
    const y = CY + RADIUS * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, n <= 24 ? 2.5 : 1.5, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Center dot
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.arc(CX, CY, 2, 0, 2 * Math.PI);
  ctx.fill();

  // Diameter line (faint)
  ctx.beginPath();
  ctx.moveTo(CX - RADIUS, CY);
  ctx.lineTo(CX + RADIUS, CY);
  ctx.strokeStyle = 'rgba(148,163,184,0.25)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Label N
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px monospace';
  ctx.fillText(`N = ${n}`, 8, 16);
}

export default function MethodOfRatios() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const [n, setN] = useState(6);
  const [auto, setAuto] = useState(false);
  const nRef = useRef(n);
  nRef.current = n;

  const perim = polygonPerimeter(n);
  const diameter = 2 * RADIUS;
  const ratio = perim / diameter;
  const errorPct = Math.abs((ratio - Math.PI) / Math.PI) * 100;

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawScene(ctx, n);
  }, [n]);

  // Auto animation
  const stopAuto = useCallback(() => {
    setAuto(false);
    if (animRef.current !== null) {
      clearTimeout(animRef.current);
      animRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!auto) return;

    let current = nRef.current <= 3 ? 3 : nRef.current;

    const step = () => {
      if (current >= 64) {
        stopAuto();
        return;
      }
      current = current < 10 ? current + 1 : current < 30 ? current + 2 : current + 3;
      if (current > 64) current = 64;
      setN(current);
      const delay = current < 12 ? 220 : current < 30 ? 140 : 80;
      animRef.current = window.setTimeout(step, delay);
    };

    // reset to 3 first
    setN(3);
    current = 3;
    animRef.current = window.setTimeout(step, 300);

    return () => {
      if (animRef.current !== null) clearTimeout(animRef.current);
    };
  }, [auto, stopAuto]);

  const handleAutoToggle = () => {
    if (auto) {
      stopAuto();
    } else {
      setAuto(true);
    }
  };

  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: '16px', color: '#e2e8f0', fontFamily: 'sans-serif', maxWidth: 320 }}>
      <h3 style={{ margin: '0 0 10px', fontSize: 15, color: '#f1f5f9', letterSpacing: 0.2 }}>
        Method of First &amp; Last Ratios
      </h3>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ display: 'block', borderRadius: 8, border: '1px solid #1e293b' }}
      />

      {/* Stats */}
      <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.7, color: '#94a3b8' }}>
        <div>
          <span style={{ color: '#f59e0b' }}>Polygon perimeter / diameter</span>
          {' = '}
          <span style={{ color: '#fcd34d', fontWeight: 600 }}>{ratio.toFixed(5)}</span>
        </div>
        <div>
          <span style={{ color: '#3b82f6' }}>π</span>
          {' = 3.14159…  '}
          <span style={{ color: '#ef4444' }}>Error: {errorPct < 0.001 ? '<0.001' : errorPct.toFixed(3)}%</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 12, color: '#94a3b8', minWidth: 34 }}>N={n}</span>
        <input
          type="range"
          min={3}
          max={64}
          value={n}
          disabled={auto}
          onChange={e => { stopAuto(); setN(Number(e.target.value)); }}
          style={{ flex: 1, accentColor: '#f59e0b' }}
        />
        <button
          onClick={handleAutoToggle}
          style={{
            background: auto ? '#ef4444' : '#f59e0b',
            color: '#0f172a',
            border: 'none',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            minWidth: 46,
          }}
        >
          {auto ? 'Stop' : 'Auto'}
        </button>
      </div>

      {/* Explanation */}
      <p style={{ margin: '12px 0 0', fontSize: 11.5, color: '#64748b', lineHeight: 1.6 }}>
        As N→∞, the polygon fills the circle and the ratio → π.{' '}
        <span style={{ color: '#ef4444' }}>Red gaps</span> are the "last ratios" that vanish.
        Newton called this the <em>method of first and last ratios</em> — the foundation of his calculus.
      </p>
    </div>
  );
}
