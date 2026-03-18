import { useState, useEffect, useRef, useCallback } from 'react';

const W = 280;
const H = 160;
const BALL_RADIUS = 10;
const TRAIL_LEN = 30;
const DT = 1 / 60;

type Vec2 = { x: number; y: number };

export default function LawsOfMotion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    x: W / 2,
    vx: 0,
    trail: [] as Vec2[],
    running: true,
  });
  const rafRef = useRef<number>(0);

  const [force, setForce] = useState(30);
  const [mass, setMass] = useState(3);
  const [liveVx, setLiveVx] = useState(0);
  const [applyDir, setApplyDir] = useState<0 | 1 | -1>(0);
  const applyDirRef = useRef<0 | 1 | -1>(0);

  const accel = force / mass;

  const applyForce = useCallback((dir: 1 | -1) => {
    applyDirRef.current = dir;
    setApplyDir(dir);
    setTimeout(() => {
      applyDirRef.current = 0;
      setApplyDir(0);
    }, 300);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const s = stateRef.current;
    s.running = true;

    const draw = () => {
      if (!s.running) return;

      // Physics
      const dir = applyDirRef.current;
      if (dir !== 0) {
        s.vx += dir * (force / mass) * DT;
      }
      s.x += s.vx * DT;

      // Wall bounce
      if (s.x - BALL_RADIUS <= 0) {
        s.x = BALL_RADIUS;
        s.vx = Math.abs(s.vx);
      }
      if (s.x + BALL_RADIUS >= W) {
        s.x = W - BALL_RADIUS;
        s.vx = -Math.abs(s.vx);
      }

      // Trail
      s.trail.push({ x: s.x, y: H / 2 });
      if (s.trail.length > TRAIL_LEN) s.trail.shift();

      setLiveVx(s.vx);

      // Draw background
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, W, H);

      // Track line
      ctx.strokeStyle = '#30363d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(BALL_RADIUS, H / 2);
      ctx.lineTo(W - BALL_RADIUS, H / 2);
      ctx.stroke();

      // Wall markers
      ctx.strokeStyle = '#f59e0b55';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(BALL_RADIUS, 20);
      ctx.lineTo(BALL_RADIUS, H - 20);
      ctx.moveTo(W - BALL_RADIUS, 20);
      ctx.lineTo(W - BALL_RADIUS, H - 20);
      ctx.stroke();
      ctx.setLineDash([]);

      // Trail
      for (let i = 0; i < s.trail.length; i++) {
        const alpha = (i / s.trail.length) * 0.6;
        const r = BALL_RADIUS * (0.3 + 0.7 * (i / s.trail.length));
        ctx.beginPath();
        ctx.arc(s.trail[i].x, s.trail[i].y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
        ctx.fill();
      }

      // Ball glow
      const grd = ctx.createRadialGradient(s.x, H / 2, 0, s.x, H / 2, BALL_RADIUS * 2.5);
      grd.addColorStop(0, 'rgba(245,158,11,0.35)');
      grd.addColorStop(1, 'rgba(245,158,11,0)');
      ctx.beginPath();
      ctx.arc(s.x, H / 2, BALL_RADIUS * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Ball
      const ballGrd = ctx.createRadialGradient(s.x - 3, H / 2 - 3, 1, s.x, H / 2, BALL_RADIUS);
      ballGrd.addColorStop(0, '#fde68a');
      ballGrd.addColorStop(1, '#d97706');
      ctx.beginPath();
      ctx.arc(s.x, H / 2, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = ballGrd;
      ctx.fill();

      // Force arrow when applying
      if (dir !== 0) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.fillStyle = '#ef4444';
        const ax = s.x + dir * (BALL_RADIUS + 4);
        const ay = H / 2;
        const arrowLen = 24;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax + dir * arrowLen, ay);
        ctx.stroke();
        // arrowhead
        ctx.beginPath();
        ctx.moveTo(ax + dir * arrowLen, ay);
        ctx.lineTo(ax + dir * (arrowLen - 7), ay - 5);
        ctx.lineTo(ax + dir * (arrowLen - 7), ay + 5);
        ctx.closePath();
        ctx.fill();
      }

      // Labels at top
      ctx.fillStyle = '#8b949e';
      ctx.font = '9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('2nd Law: F = ma', 6, 14);
      ctx.textAlign = 'right';
      ctx.fillText('3rd Law: wall bounce = reaction', W - 6, 14);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      s.running = false;
      cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [force, mass]);

  const momentum = liveVx * mass;
  const displayA = accel.toFixed(1);
  const displayV = liveVx.toFixed(2);
  const displayP = momentum.toFixed(2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', fontFamily: 'monospace' }}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ borderRadius: 8, border: '1px solid #30363d', display: 'block' }}
      />

      {/* Controls */}
      <div style={{ width: W, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Force buttons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button
            onMouseDown={() => applyForce(-1)}
            style={{
              background: applyDir === -1 ? '#ef4444' : '#21262d',
              color: '#e6edf3',
              border: '1px solid #30363d',
              borderRadius: 6,
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'monospace',
              transition: 'background 0.15s',
            }}
          >
            ← Apply Force
          </button>
          <button
            onClick={() => {
              const s = stateRef.current;
              s.x = W / 2;
              s.vx = 0;
              s.trail = [];
            }}
            style={{
              background: '#21262d',
              color: '#8b949e',
              border: '1px solid #30363d',
              borderRadius: 6,
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: 11,
              fontFamily: 'monospace',
            }}
          >
            Reset
          </button>
          <button
            onMouseDown={() => applyForce(1)}
            style={{
              background: applyDir === 1 ? '#ef4444' : '#21262d',
              color: '#e6edf3',
              border: '1px solid #30363d',
              borderRadius: 6,
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'monospace',
              transition: 'background 0.15s',
            }}
          >
            Apply Force →
          </button>
        </div>

        {/* Sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <label style={{ color: '#8b949e', fontSize: 11, display: 'flex', flexDirection: 'column', gap: 3 }}>
            Force: <span style={{ color: '#f59e0b' }}>{force} N</span>
            <input
              type="range" min={10} max={100} value={force}
              onChange={e => setForce(Number(e.target.value))}
              style={{ accentColor: '#f59e0b', width: '100%' }}
            />
          </label>
          <label style={{ color: '#8b949e', fontSize: 11, display: 'flex', flexDirection: 'column', gap: 3 }}>
            Mass: <span style={{ color: '#f59e0b' }}>{mass} kg</span>
            <input
              type="range" min={1} max={10} value={mass}
              onChange={e => setMass(Number(e.target.value))}
              style={{ accentColor: '#f59e0b', width: '100%' }}
            />
          </label>
        </div>

        {/* Live readouts */}
        <div style={{
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 6,
          padding: '8px 12px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 8,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#8b949e', fontSize: 10, marginBottom: 2 }}>a = F/m</div>
            <div style={{ color: '#f59e0b', fontSize: 15, fontWeight: 700 }}>{displayA}</div>
            <div style={{ color: '#484f58', fontSize: 9 }}>m/s²</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#8b949e', fontSize: 10, marginBottom: 2 }}>velocity</div>
            <div style={{ color: '#38bdf8', fontSize: 15, fontWeight: 700 }}>{displayV}</div>
            <div style={{ color: '#484f58', fontSize: 9 }}>m/s</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#8b949e', fontSize: 10, marginBottom: 2 }}>p = mv</div>
            <div style={{ color: '#a78bfa', fontSize: 15, fontWeight: 700 }}>{displayP}</div>
            <div style={{ color: '#484f58', fontSize: 9 }}>kg·m/s</div>
          </div>
        </div>
      </div>
    </div>
  );
}
