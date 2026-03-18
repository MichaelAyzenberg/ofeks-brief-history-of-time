import { useState, useEffect, useRef, useCallback } from 'react';

const W = 280;
const H = 220;
const G = 9.8;
const DT = 1 / 60;
const BALL_R = 10;
const PIXEL_PER_METER = 18; // visual scaling
const NUM_PARTICLES = 18;

type DragMode = 'stokes' | 'newton';

type Particle = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  displaced: boolean;
};

function makeParticles(): Particle[] {
  const pts: Particle[] = [];
  const cols = 3;
  const rows = 6;
  for (let i = 0; i < NUM_PARTICLES; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const bx = 30 + col * ((W - 60) / (cols - 1));
    const by = 25 + row * ((H - 40) / (rows - 1));
    pts.push({ x: bx, y: by, baseX: bx, baseY: by, vx: 0, vy: 0, displaced: false });
  }
  return pts;
}

const FluidResistance = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // Physics state in refs to avoid re-render on each frame
  const ballYRef = useRef<number>(BALL_R + 2); // metres from top (0 = very top)
  const ballVRef = useRef<number>(0); // m/s downward positive
  const particlesRef = useRef<Particle[]>(makeParticles());
  const modeRef = useRef<DragMode>('stokes');
  const massRef = useRef<number>(2);
  const timeRef = useRef<number>(0);

  const [mode, setMode] = useState<DragMode>('stokes');
  const [mass, setMass] = useState<number>(2);

  // Sync refs whenever state changes
  useEffect(() => {
    modeRef.current = mode;
    massRef.current = mass;
    // reset ball
    ballYRef.current = BALL_R + 2;
    ballVRef.current = 0;
    particlesRef.current = makeParticles();
    timeRef.current = 0;
  }, [mode, mass]);

  const getTerminalVel = useCallback((m: number, dm: DragMode): number => {
    if (dm === 'stokes') {
      const b = 0.5;
      return (m * G) / b;
    } else {
      const c = 0.02;
      return Math.sqrt((m * G) / c);
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const m = massRef.current;
    const dm = modeRef.current;
    const b = 0.5;
    const c = 0.02;
    const vTerm = getTerminalVel(m, dm);

    // Physics step
    const v = ballVRef.current;
    const dragF = dm === 'stokes' ? -b * v : -c * v * Math.abs(v);
    const netF = m * G + dragF;
    const accel = netF / m;
    ballVRef.current = v + accel * DT;
    // Convert: 1 visual pixel = 1/PIXEL_PER_METER metres
    ballYRef.current += ballVRef.current * DT * PIXEL_PER_METER;
    timeRef.current += DT;

    const ballY = ballYRef.current;
    const ballX = W / 2;

    // Reset ball when it reaches bottom
    if (ballY > H - BALL_R - 2) {
      ballYRef.current = BALL_R + 2;
      ballVRef.current = 0;
      particlesRef.current = makeParticles();
      timeRef.current = 0;
    }

    // Update fluid particles
    const pts = particlesRef.current;
    for (const p of pts) {
      const dx = p.x - ballX;
      const dy = p.y - ballY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = 28; // px radius of influence

      if (dist < influence) {
        if (dm === 'stokes') {
          // Smooth laminar: gently push aside
          const angle = Math.atan2(dy, dx);
          const push = (1 - dist / influence) * 1.8;
          p.vx += Math.cos(angle) * push;
          p.vy += Math.sin(angle) * push * 0.4;
        } else {
          // Turbulent: random scatter
          const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.5;
          const push = (1 - dist / influence) * 3.5;
          p.vx += Math.cos(angle) * push;
          p.vy += Math.sin(angle) * push;
        }
        p.displaced = true;
      }

      // Spring back to base position (damped)
      const restoreK = dm === 'stokes' ? 0.04 : 0.015;
      const damp = dm === 'stokes' ? 0.88 : 0.92;
      p.vx += (p.baseX - p.x) * restoreK;
      p.vy += (p.baseY - p.y) * restoreK;
      p.vx *= damp;
      p.vy *= damp;
      p.x += p.vx;
      p.y += p.vy;

      // Add small random drift for turbulent mode
      if (dm === 'newton' && p.displaced) {
        p.x += (Math.random() - 0.5) * 0.4;
        p.y += (Math.random() - 0.5) * 0.4;
      }
    }

    // --- Render ---
    ctx.clearRect(0, 0, W, H);

    // Dark background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    // Fluid column (leave 40px on right for velocity bar)
    const fluidW = W - 45;
    const fluidGrad = ctx.createLinearGradient(0, 0, fluidW, 0);
    fluidGrad.addColorStop(0, 'rgba(29,78,216,0.25)');
    fluidGrad.addColorStop(0.5, 'rgba(29,78,216,0.18)');
    fluidGrad.addColorStop(1, 'rgba(29,78,216,0.25)');
    ctx.fillStyle = fluidGrad;
    ctx.fillRect(0, 0, fluidW, H);

    // Fluid column border
    ctx.strokeStyle = 'rgba(59,130,246,0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, fluidW - 1, H - 1);

    // Fluid particles
    for (const p of pts) {
      const distToBall = Math.sqrt((p.x - ballX) ** 2 + (p.y - ballY) ** 2);
      const nearBall = distToBall < 30;
      if (dm === 'stokes') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = nearBall ? 'rgba(147,197,253,0.75)' : 'rgba(96,165,250,0.4)';
        ctx.fill();
      } else {
        // Turbulent: slightly elongated flicker
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, 2.5, 1.5, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fillStyle = nearBall ? 'rgba(253,186,116,0.7)' : 'rgba(96,165,250,0.35)';
        ctx.fill();
      }
    }

    // Streamlines in Stokes mode
    if (dm === 'stokes') {
      ctx.save();
      ctx.strokeStyle = 'rgba(59,130,246,0.12)';
      ctx.lineWidth = 0.8;
      for (let sx = 15; sx < fluidW - 10; sx += 22) {
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        // Simple curved streamline around ball
        const dxFromBall = sx - ballX;
        for (let sy = 0; sy <= H; sy += 4) {
          const dyFromBall = sy - ballY;
          const r2 = dxFromBall * dxFromBall + dyFromBall * dyFromBall;
          const deflect = r2 < 1800 ? (dxFromBall * BALL_R * BALL_R * 12) / (r2 + 100) : 0;
          ctx.lineTo(sx + deflect, sy);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    // Ball shadow
    const shadowGrad = ctx.createRadialGradient(ballX, ballY + BALL_R + 2, 0, ballX, ballY + BALL_R + 2, BALL_R * 1.5);
    shadowGrad.addColorStop(0, 'rgba(0,0,0,0.4)');
    shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.ellipse(ballX, ballY + BALL_R + 1, BALL_R * 1.2, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = shadowGrad;
    ctx.fill();

    // Ball (gold)
    const ballGrad = ctx.createRadialGradient(ballX - 3, ballY - 3, 1, ballX, ballY, BALL_R);
    ballGrad.addColorStop(0, '#fde68a');
    ballGrad.addColorStop(0.5, '#f59e0b');
    ballGrad.addColorStop(1, '#b45309');
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = ballGrad;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ball highlight
    ctx.beginPath();
    ctx.arc(ballX - 3, ballY - 3, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fill();

    // --- Velocity bar (right side) ---
    const barX = W - 38;
    const barW = 14;
    const barH = H - 20;
    const barY = 10;

    // Bar background
    ctx.fillStyle = 'rgba(15,23,42,0.8)';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = 'rgba(148,163,184,0.25)';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(barX, barY, barW, barH);

    // Bar fill (velocity / terminal velocity)
    const curV = Math.abs(ballVRef.current);
    const fillRatio = Math.min(curV / vTerm, 1);
    const fillH = fillRatio * barH;

    const barFill = ctx.createLinearGradient(0, barY + barH - fillH, 0, barY + barH);
    barFill.addColorStop(0, '#f59e0b');
    barFill.addColorStop(1, '#d97706');
    ctx.fillStyle = barFill;
    ctx.fillRect(barX, barY + barH - fillH, barW, fillH);

    // Terminal velocity dashed line
    ctx.setLineDash([2, 2]);
    ctx.strokeStyle = 'rgba(239,68,68,0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(barX - 4, barY);
    ctx.lineTo(barX + barW + 4, barY);
    ctx.stroke();
    ctx.setLineDash([]);

    // "v" label
    ctx.font = 'bold 8px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText('v', barX + barW / 2, barY + barH + 9);

    // --- Speed readouts at bottom of fluid column ---
    ctx.textAlign = 'left';
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`v = ${curV.toFixed(1)} m/s`, 5, H - 14);
    ctx.fillStyle = 'rgba(239,68,68,0.85)';
    ctx.fillText(`v\u209C = ${vTerm.toFixed(1)} m/s`, 5, H - 4);

    rafRef.current = requestAnimationFrame(draw);
  }, [getTerminalVel]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  const termVel = getTerminalVel(mass, mode);

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          background: '#0d1117',
          border: '1px solid #1d4ed830',
          borderRadius: '8px',
          display: 'block',
        }}
      />

      <div className="flex flex-col gap-2 w-full max-w-[280px]">
        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setMode('stokes')}
            style={{
              flex: 1,
              padding: '5px 0',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: mode === 'stokes' ? 700 : 400,
              cursor: 'pointer',
              background: mode === 'stokes' ? 'rgba(59,130,246,0.25)' : 'rgba(15,23,42,0.6)',
              border: mode === 'stokes' ? '1px solid #3b82f6' : '1px solid #1e3a5f',
              color: mode === 'stokes' ? '#93c5fd' : '#64748b',
              transition: 'all 0.15s',
            }}
          >
            Stokes (laminar)
          </button>
          <button
            onClick={() => setMode('newton')}
            style={{
              flex: 1,
              padding: '5px 0',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: mode === 'newton' ? 700 : 400,
              cursor: 'pointer',
              background: mode === 'newton' ? 'rgba(245,158,11,0.2)' : 'rgba(15,23,42,0.6)',
              border: mode === 'newton' ? '1px solid #f59e0b' : '1px solid #3a2a0a',
              color: mode === 'newton' ? '#fbbf24' : '#64748b',
              transition: 'all 0.15s',
            }}
          >
            Newton (turbulent)
          </button>
        </div>

        {/* Mass slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ color: '#94a3b8', fontSize: '11px' }}>Ball mass</label>
            <span style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 700 }}>{mass.toFixed(1)} kg</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={0.1}
            value={mass}
            onChange={e => setMass(parseFloat(e.target.value))}
            style={{ accentColor: '#f59e0b', width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#475569', fontSize: '10px' }}>1 kg</span>
            <span style={{ color: '#475569', fontSize: '10px' }}>5 kg</span>
          </div>
        </div>

        {/* Info row */}
        <div style={{
          background: 'rgba(29,78,216,0.08)',
          border: '1px solid #1d4ed820',
          borderRadius: '6px',
          padding: '5px 8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: '#64748b', fontSize: '10px' }}>
            {mode === 'stokes' ? 'F_drag = b·v' : 'F_drag = c·v²'}
          </span>
          <span style={{ color: '#fbbf24', fontSize: '10px', fontWeight: 600 }}>
            v_terminal = {termVel.toFixed(1)} m/s
          </span>
        </div>
      </div>

      <p style={{ color: '#64748b', fontSize: '10px', textAlign: 'center', maxWidth: '280px', lineHeight: 1.6 }}>
        Terminal velocity: where drag = gravity. Newton proved turbulent drag ∝ v²
      </p>
    </div>
  );
};

export default FluidResistance;
