import { useState, useEffect, useRef, useCallback } from 'react';

const W = 280;
const H = 240;
const G = 1;

// Static star positions (computed once, not in render)
const STARS: [number, number][] = [
  [12, 18], [45, 8], [90, 22], [140, 12], [190, 28],
  [240, 14], [265, 45], [270, 160], [255, 210], [200, 235],
  [130, 232], [60, 228], [18, 200], [8, 100], [22, 60],
];

function massRadius(m: number): number {
  return 6 + Math.sqrt(m) * 1.5;
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number, fromY: number,
  toX: number, toY: number,
  color: string,
) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return;

  const ux = dx / len;
  const uy = dy / len;
  const headLen = 8;
  const headAngle = Math.PI / 6;

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Arrowhead
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLen * (ux * Math.cos(headAngle) - uy * Math.sin(headAngle)),
    toY - headLen * (uy * Math.cos(headAngle) + ux * Math.sin(headAngle)),
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLen * (ux * Math.cos(headAngle) + uy * Math.sin(headAngle)),
    toY - headLen * (uy * Math.cos(headAngle) - ux * Math.sin(headAngle)),
  );
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

const UniversalGravitation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const draggingRef = useRef<1 | 2 | null>(null);

  // Positions stored as refs for drag (updated without re-render)
  const pos1Ref = useRef({ x: 70, y: 120 });
  const pos2Ref = useRef({ x: 210, y: 120 });

  // Copies for display in the formula box (updated via setState)
  const [pos1, setPos1] = useState({ x: 70, y: 120 });
  const [pos2, setPos2] = useState({ x: 210, y: 120 });
  const [m1, setM1] = useState(50);
  const [m2, setM2] = useState(30);

  const m1Ref = useRef(50);
  const m2Ref = useRef(30);

  useEffect(() => { m1Ref.current = m1; }, [m1]);
  useEffect(() => { m2Ref.current = m2; }, [m2]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const p1 = pos1Ref.current;
    const p2 = pos2Ref.current;
    const mass1 = m1Ref.current;
    const mass2 = m2Ref.current;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    const F = r > 1 ? G * mass1 * mass2 / (r * r) : 0;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#050810';
    ctx.fillRect(0, 0, W, H);

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for (const [sx, sy] of STARS) {
      ctx.beginPath();
      ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dashed line connecting masses (gravitational field line)
    if (r > 1) {
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = 'rgba(148,163,184,0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      // Distance label
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2 - 10;
      ctx.font = '9px sans-serif';
      ctx.fillStyle = 'rgba(148,163,184,0.6)';
      ctx.textAlign = 'center';
      ctx.fillText(`r = ${r.toFixed(1)} px`, midX, midY);
      ctx.textAlign = 'left';
    }

    // Force arrows (only if not too close / too far)
    if (r >= 30 && r > 1) {
      const ux = dx / r;
      const uy = dy / r;
      // Cap arrow length at 60px, use log scale
      const rawLen = Math.log(F + 1) * 12;
      const arrowLen = Math.min(rawLen, 60);

      const r1 = massRadius(mass1);
      const r2 = massRadius(mass2);

      // Arrow on mass 1: points toward mass 2
      const a1StartX = p1.x + ux * r1;
      const a1StartY = p1.y + uy * r1;
      drawArrow(ctx, a1StartX, a1StartY, a1StartX + ux * arrowLen, a1StartY + uy * arrowLen, '#f59e0b');

      // Arrow on mass 2: points toward mass 1
      const a2StartX = p2.x - ux * r2;
      const a2StartY = p2.y - uy * r2;
      drawArrow(ctx, a2StartX, a2StartY, a2StartX - ux * arrowLen, a2StartY - uy * arrowLen, '#60a5fa');
    }

    // Mass 1 (amber/gold)
    const rad1 = massRadius(mass1);
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 14;
    const g1 = ctx.createRadialGradient(p1.x - rad1 * 0.3, p1.y - rad1 * 0.3, 0, p1.x, p1.y, rad1);
    g1.addColorStop(0, '#fef3c7');
    g1.addColorStop(0.5, '#f59e0b');
    g1.addColorStop(1, '#92400e');
    ctx.beginPath();
    ctx.arc(p1.x, p1.y, rad1, 0, Math.PI * 2);
    ctx.fillStyle = g1;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.font = 'bold 9px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('m₁', p1.x, p1.y + 3);
    ctx.textAlign = 'left';

    // Mass 2 (blue)
    const rad2 = massRadius(mass2);
    ctx.shadowColor = '#3b82f6';
    ctx.shadowBlur = 14;
    const g2 = ctx.createRadialGradient(p2.x - rad2 * 0.3, p2.y - rad2 * 0.3, 0, p2.x, p2.y, rad2);
    g2.addColorStop(0, '#dbeafe');
    g2.addColorStop(0.5, '#3b82f6');
    g2.addColorStop(1, '#1e3a8a');
    ctx.beginPath();
    ctx.arc(p2.x, p2.y, rad2, 0, Math.PI * 2);
    ctx.fillStyle = g2;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.font = 'bold 9px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('m₂', p2.x, p2.y + 3);
    ctx.textAlign = 'left';

    // Too close warning
    if (r < 30 && r > 1) {
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#fca5a5';
      ctx.textAlign = 'center';
      ctx.fillText('⚠ Too close', W / 2, H - 12);
      ctx.textAlign = 'left';
    }

    rafRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [render]);

  // ---- Drag interaction ----
  const getCanvasPos = useCallback((clientX: number, clientY: number): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const handlePointerDown = useCallback((clientX: number, clientY: number) => {
    const { x, y } = getCanvasPos(clientX, clientY);
    const p1 = pos1Ref.current;
    const p2 = pos2Ref.current;
    const d1 = Math.hypot(x - p1.x, y - p1.y);
    const d2 = Math.hypot(x - p2.x, y - p2.y);
    const r1 = massRadius(m1Ref.current);
    const r2 = massRadius(m2Ref.current);
    if (d1 < r1 + 8 && d1 <= d2) draggingRef.current = 1;
    else if (d2 < r2 + 8) draggingRef.current = 2;
    else draggingRef.current = null;
  }, [getCanvasPos]);

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!draggingRef.current) return;
    const { x, y } = getCanvasPos(clientX, clientY);
    const clampedX = Math.max(20, Math.min(W - 20, x));
    const clampedY = Math.max(20, Math.min(H - 20, y));
    if (draggingRef.current === 1) {
      pos1Ref.current = { x: clampedX, y: clampedY };
      setPos1({ x: clampedX, y: clampedY });
    } else {
      pos2Ref.current = { x: clampedX, y: clampedY };
      setPos2({ x: clampedX, y: clampedY });
    }
  }, [getCanvasPos]);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = null;
  }, []);

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => handlePointerDown(e.clientX, e.clientY);
  const onMouseMove = (e: React.MouseEvent) => handlePointerMove(e.clientX, e.clientY);
  const onMouseUp = () => handlePointerUp();

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
  };
  const onTouchEnd = () => handlePointerUp();

  // Compute display values
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  const r = Math.sqrt(dx * dx + dy * dy);
  const F = r > 1 ? G * m1 * m2 / (r * r) : 0;
  const tooClose = r < 30;

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          background: '#050810',
          border: '1px solid #f59e0b30',
          borderRadius: '8px',
          display: 'block',
          cursor: 'grab',
          touchAction: 'none',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      {/* Sliders */}
      <div className="flex flex-col gap-2 w-full max-w-[280px]">
        <div className="flex gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <label style={{ color: '#f59e0b', fontSize: '11px' }}>
              m₁ = <span style={{ fontWeight: 700 }}>{m1}</span>
            </label>
            <input
              type="range" min={10} max={100} step={1} value={m1}
              onChange={e => setM1(parseInt(e.target.value))}
              style={{ accentColor: '#f59e0b', width: '100%' }}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label style={{ color: '#60a5fa', fontSize: '11px' }}>
              m₂ = <span style={{ fontWeight: 700 }}>{m2}</span>
            </label>
            <input
              type="range" min={10} max={100} step={1} value={m2}
              onChange={e => setM2(parseInt(e.target.value))}
              style={{ accentColor: '#60a5fa', width: '100%' }}
            />
          </div>
        </div>

        {/* Force formula box */}
        <div style={{
          background: 'rgba(245,158,11,0.07)',
          border: `1px solid ${tooClose ? '#fca5a530' : '#f59e0b30'}`,
          borderRadius: '8px',
          padding: '6px 12px',
          textAlign: 'center',
        }}>
          {tooClose ? (
            <span style={{ color: '#fca5a5', fontSize: '12px', fontWeight: 600 }}>
              ⚠ Too close to compute
            </span>
          ) : (
            <span style={{ color: '#fbbf24', fontSize: '12px', fontFamily: 'monospace' }}>
              F = G · m₁m₂ / r² = <span style={{ fontWeight: 700 }}>{F.toFixed(2)}</span>
            </span>
          )}
        </div>

        <div style={{ color: '#94a3b8', fontSize: '10px', textAlign: 'center' }}>
          r = {r.toFixed(1)} px
        </div>
      </div>

      <p style={{ color: '#94a3b8', fontSize: '11px', textAlign: 'center', maxWidth: '280px', lineHeight: 1.5 }}>
        Drag either mass to change the distance. Force doubles when mass doubles — quadruples when distance halves.
        F = Gm₁m₂/r²
      </p>
    </div>
  );
};

export default UniversalGravitation;
