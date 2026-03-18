import { useState, useEffect, useRef, useCallback } from 'react';

const W = 280;
const H = 260;
const a = 60; // semi-major axis in pixels

function getOrbitLabel(e: number): string {
  if (e < 0.3) return 'Nearly circular';
  if (e < 0.6) return 'Ellipse';
  if (e < 0.9) return 'Highly eccentric';
  return 'Near-parabolic';
}

const CometaryOrbits = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const thetaRef = useRef<number>(0);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const eccRef = useRef<number>(0.5);

  const [eccentricity, setEccentricity] = useState(0.5);

  // Keep eccRef in sync so animation loop picks up latest value
  useEffect(() => {
    eccRef.current = eccentricity;
    thetaRef.current = 0;
    trailRef.current = [];
  }, [eccentricity]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const e = eccRef.current;
    const p = a * (1 - e * e); // semi-latus rectum

    // Dynamic sun position: aphelion always at x≈10+margin, perihelion to the right
    const sunX = 10 + a * (1 + e) + 4; // small margin
    const sunY = H / 2;

    // Step angle proportional to 1/r² (equal areas => dθ/dt ∝ 1/r²)
    const r = p / (1 + e * Math.cos(thetaRef.current));
    const dtheta = 0.018 * (p / (r * r)) * a; // scale to reasonable speed

    thetaRef.current += dtheta;
    if (thetaRef.current > 2 * Math.PI) thetaRef.current -= 2 * Math.PI;

    const theta = thetaRef.current;
    const rNow = p / (1 + e * Math.cos(theta));
    const cometX = sunX + rNow * Math.cos(theta);
    const cometY = sunY - rNow * Math.sin(theta);

    // Update trail
    trailRef.current.push({ x: cometX, y: cometY });
    if (trailRef.current.length > 90) trailRef.current.shift();

    // --- Draw ---
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#050810';
    ctx.fillRect(0, 0, W, H);

    // Subtle stars
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    const starSeeds = [
      [20, 30], [60, 20], [100, 15], [150, 40], [220, 25],
      [250, 50], [35, 200], [80, 220], [240, 210], [180, 230],
      [15, 130], [260, 140], [130, 240],
    ];
    for (const [sx, sy] of starSeeds) {
      ctx.beginPath();
      ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Orbit path
    ctx.beginPath();
    let first = true;
    for (let t = 0; t <= Math.PI * 2; t += 0.04) {
      const rp = p / (1 + e * Math.cos(t));
      const px = sunX + rp * Math.cos(t);
      const py = sunY - rp * Math.sin(t);
      if (first) { ctx.moveTo(px, py); first = false; }
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(245,158,11,0.25)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Perihelion / aphelion markers
    const periX = sunX + a * (1 - e);
    const aph = p / (1 + e * Math.cos(Math.PI));
    const aphX = sunX - aph;
    const aphY = sunY;

    ctx.font = '8px sans-serif';
    ctx.fillStyle = 'rgba(251,191,36,0.7)';
    ctx.fillText('perihelion', periX - 10, sunY + 14);
    ctx.fillStyle = 'rgba(96,165,250,0.7)';
    ctx.fillText('aphelion', aphX - 18, aphY - 10);

    // Speed labels
    ctx.font = '7px sans-serif';
    ctx.fillStyle = 'rgba(251,191,36,0.9)';
    ctx.fillText('faster', periX - 8, sunY + 24);
    ctx.fillStyle = 'rgba(96,165,250,0.9)';
    ctx.fillText('slower', aphX - 12, aphY + 20);

    // Comet trail
    const trail = trailRef.current;
    for (let i = 1; i < trail.length; i++) {
      const prog = i / trail.length;
      const alpha = prog * 0.85;
      const r2 = Math.floor(prog * 255);
      const g2 = Math.floor(prog * 220);
      ctx.beginPath();
      ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
      ctx.lineTo(trail[i].x, trail[i].y);
      ctx.strokeStyle = `rgba(${r2},${g2},255,${alpha})`;
      ctx.lineWidth = 1 + prog * 1.5;
      ctx.stroke();
    }

    // Sun glow
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 18);
    sunGrad.addColorStop(0, 'rgba(255,240,100,1)');
    sunGrad.addColorStop(0.4, 'rgba(255,160,20,0.8)');
    sunGrad.addColorStop(1, 'rgba(255,80,0,0)');
    ctx.beginPath();
    ctx.arc(sunX, sunY, 18, 0, Math.PI * 2);
    ctx.fillStyle = sunGrad;
    ctx.fill();

    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#fff7c0';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Comet
    ctx.shadowColor = '#60a5fa';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(cometX, cometY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Area sweep indicator: line from sun to comet
    ctx.beginPath();
    ctx.moveTo(sunX, sunY);
    ctx.lineTo(cometX, cometY);
    ctx.strokeStyle = 'rgba(245,158,11,0.18)';
    ctx.lineWidth = 0.7;
    ctx.stroke();

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  const label = getOrbitLabel(eccentricity);

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

      {/* Controls */}
      <div className="flex flex-col gap-2 w-full max-w-[280px]">
        <div className="flex items-center justify-between">
          <label style={{ color: '#fbbf24', fontSize: '12px' }}>
            Eccentricity: <span style={{ fontWeight: 700 }}>{eccentricity.toFixed(2)}</span>
          </label>
          <span style={{ color: '#94a3b8', fontSize: '11px' }}>{label}</span>
        </div>

        <input
          type="range"
          min={0.05}
          max={0.97}
          step={0.01}
          value={eccentricity}
          onChange={e => setEccentricity(parseFloat(e.target.value))}
          style={{ accentColor: '#f59e0b', width: '100%' }}
        />

        <button
          onClick={() => setEccentricity(0.967)}
          style={{
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid #f59e0b60',
            color: '#fbbf24',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '11px',
            cursor: 'pointer',
            alignSelf: 'flex-start',
          }}
        >
          Halley's Comet (e = 0.967)
        </button>
      </div>

      <p style={{ color: '#94a3b8', fontSize: '11px', textAlign: 'center', maxWidth: '280px', lineHeight: 1.5 }}>
        The comet moves faster near the Sun — equal areas swept in equal times.
        Kepler's Second Law, derived by Newton from mechanics alone.
      </p>
    </div>
  );
};

export default CometaryOrbits;
