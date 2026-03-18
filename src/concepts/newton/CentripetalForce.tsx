import { useState, useEffect, useRef, useCallback } from 'react';

const W = 280;
const H = 260;
const GM = 5000;
const SUN_X = W / 2;
const SUN_Y = H / 2;
const R0 = 70; // initial distance from sun
const V_CIRC = Math.sqrt(GM / R0); // ~8.45
const V_ESC = Math.sqrt(2 * GM / R0); // ~11.95
const DT = 0.15;
const SOFTENING_SQ = 25;
const TRAIL_LEN = 220;

type OrbitState = {
  x: number; y: number;
  vx: number; vy: number;
};

function getOrbitType(vf: number): string {
  if (Math.abs(vf - 1.0) < 0.04) return 'Circular orbit';
  if (vf < 1.0) return 'Elliptical orbit (sub-circular)';
  const ratio = vf / Math.sqrt(2);
  if (Math.abs(ratio - 1.0) < 0.05) return 'Escape velocity — parabolic';
  if (vf > Math.sqrt(2) * 1.04) return 'Hyperbolic — escape trajectory';
  return 'Elliptical orbit (super-circular)';
}

function computeAccel(x: number, y: number): [number, number] {
  const dx = x - SUN_X;
  const dy = y - SUN_Y;
  const r2 = dx * dx + dy * dy + SOFTENING_SQ;
  const r3 = Math.pow(r2, 1.5);
  return [-GM * dx / r3, -GM * dy / r3];
}

function isOffScreen(x: number, y: number): boolean {
  return x < -W * 0.8 || x > W * 1.8 || y < -H * 0.8 || y > H * 1.8;
}

function makeInitialState(vf: number): OrbitState {
  return {
    x: SUN_X + R0,
    y: SUN_Y,
    vx: 0,
    vy: -vf * V_CIRC, // upward (negative y)
  };
}

const CentripetalForce = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const simRef = useRef<OrbitState>(makeInitialState(1.0));
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const vfRef = useRef<number>(1.0);
  const frameRef = useRef<number>(0);

  const [velocityFactor, setVelocityFactor] = useState(1.0);
  const [resetKey, setResetKey] = useState(0);

  const resetSim = useCallback((vf: number) => {
    vfRef.current = vf;
    simRef.current = makeInitialState(vf);
    trailRef.current = [];
    frameRef.current = 0;
  }, []);

  useEffect(() => {
    resetSim(velocityFactor);
  }, [velocityFactor, resetKey, resetSim]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const vf = vfRef.current;
    const sim = simRef.current;

    // Velocity-Verlet step
    const [ax, ay] = computeAccel(sim.x, sim.y);
    const nx = sim.x + sim.vx * DT + 0.5 * ax * DT * DT;
    const ny = sim.y + sim.vy * DT + 0.5 * ay * DT * DT;
    const [ax2, ay2] = computeAccel(nx, ny);
    const nvx = sim.vx + 0.5 * (ax + ax2) * DT;
    const nvy = sim.vy + 0.5 * (ay + ay2) * DT;

    simRef.current = { x: nx, y: ny, vx: nvx, vy: nvy };

    trailRef.current.push({ x: nx, y: ny });
    if (trailRef.current.length > TRAIL_LEN) trailRef.current.shift();
    frameRef.current++;

    // Auto-reset if off screen (after at least 60 frames to avoid immediate reset)
    if (frameRef.current > 80 && isOffScreen(nx, ny)) {
      resetSim(vf);
    }

    // --- Render ---
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#050810';
    ctx.fillRect(0, 0, W, H);

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    const stars = [
      [15, 20], [55, 35], [220, 18], [250, 55], [270, 200],
      [10, 170], [40, 240], [160, 245], [245, 240], [270, 100],
      [90, 10], [200, 8],
    ];
    for (const [sx, sy] of stars) {
      ctx.beginPath();
      ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Trail
    const trail = trailRef.current;
    for (let i = 1; i < trail.length; i++) {
      const prog = i / trail.length;
      const alpha = prog * 0.9;
      const r = Math.floor(255 * prog);
      const g = Math.floor(200 * prog);
      ctx.beginPath();
      ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
      ctx.lineTo(trail[i].x, trail[i].y);
      ctx.strokeStyle = `rgba(${r},${g},80,${alpha})`;
      ctx.lineWidth = 0.8 + prog * 1.4;
      ctx.stroke();
    }

    // Sun
    const sunGrad = ctx.createRadialGradient(SUN_X, SUN_Y, 0, SUN_X, SUN_Y, 20);
    sunGrad.addColorStop(0, 'rgba(255,240,120,1)');
    sunGrad.addColorStop(0.4, 'rgba(255,160,20,0.8)');
    sunGrad.addColorStop(1, 'rgba(255,80,0,0)');
    ctx.beginPath();
    ctx.arc(SUN_X, SUN_Y, 20, 0, Math.PI * 2);
    ctx.fillStyle = sunGrad;
    ctx.fill();

    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(SUN_X, SUN_Y, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#fff7c0';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Planet
    const px = simRef.current.x;
    const py = simRef.current.y;
    ctx.shadowColor = '#60a5fa';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    const planetGrad = ctx.createRadialGradient(px - 1, py - 1, 0, px, py, 5);
    planetGrad.addColorStop(0, '#a0c4ff');
    planetGrad.addColorStop(1, '#2563eb');
    ctx.fillStyle = planetGrad;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Orbit type label on canvas
    const orbitType = getOrbitType(vf);
    ctx.font = 'bold 9px sans-serif';
    ctx.fillStyle = 'rgba(251,191,36,0.85)';
    ctx.fillText(orbitType, 8, 16);

    // Vis-viva label
    ctx.font = '8px sans-serif';
    ctx.fillStyle = 'rgba(148,163,184,0.7)';
    ctx.fillText('vis-viva: v² = GM(2/r − 1/a)', 8, H - 8);

    rafRef.current = requestAnimationFrame(draw);
  }, [resetSim]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  const orbitType = getOrbitType(velocityFactor);

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
        }}
      />

      <div className="flex flex-col gap-2 w-full max-w-[280px]">
        <div className="flex items-center justify-between">
          <label style={{ color: '#fbbf24', fontSize: '12px' }}>
            Initial velocity:{' '}
            <span style={{ fontWeight: 700 }}>{velocityFactor.toFixed(2)} × v_circ</span>
          </label>
          <button
            onClick={() => setResetKey(k => k + 1)}
            style={{
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid #f59e0b60',
              color: '#fbbf24',
              borderRadius: '5px',
              padding: '2px 8px',
              fontSize: '10px',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>

        <input
          type="range"
          min={0.5}
          max={1.6}
          step={0.02}
          value={velocityFactor}
          onChange={e => setVelocityFactor(parseFloat(e.target.value))}
          style={{ accentColor: '#f59e0b', width: '100%' }}
        />

        <div style={{ color: '#94a3b8', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
          <span>0.5×</span>
          <span style={{ color: '#fbbf24' }}>{orbitType}</span>
          <span>1.6×</span>
        </div>

        <div style={{
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid #f59e0b20',
          borderRadius: '6px',
          padding: '4px 8px',
          color: '#94a3b8',
          fontSize: '10px',
        }}>
          v_esc = √2 × v_circ ≈ {V_ESC.toFixed(2)} px/frame &nbsp;|&nbsp; v_circ ≈ {V_CIRC.toFixed(2)} px/frame
        </div>
      </div>

      <p style={{ color: '#94a3b8', fontSize: '11px', textAlign: 'center', maxWidth: '280px', lineHeight: 1.5 }}>
        Changing initial velocity changes the orbit type. At escape velocity (√2 × v_circular),
        the orbit becomes parabolic — Kepler's first law proven by Newton.
      </p>
    </div>
  );
};

export default CentripetalForce;
