import { useState, useEffect, useRef } from 'react';

const W = 280;
const H = 240;

interface Photon {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  captured: boolean;
  escaped: boolean;
  trail: { x: number; y: number }[];
}

let nextId = 0;

const BlackHoles = () => {
  const [photons, setPhotons] = useState<Photon[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photonsRef = useRef<Photon[]>([]);
  const frameRef = useRef<number | null>(null);
  const [bhMass, setBhMass] = useState(50);

  photonsRef.current = photons;

  const BH_X = W / 2;
  const BH_Y = H / 2;
  const horizonRadius = 20 + (bhMass / 100) * 20;

  const shootPhoton = () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2.5;
    const spawnDist = 120;
    const newPhoton: Photon = {
      id: nextId++,
      x: BH_X + Math.cos(angle) * spawnDist,
      y: BH_Y + Math.sin(angle) * spawnDist,
      vx: -Math.cos(angle) * speed,
      vy: -Math.sin(angle) * speed,
      captured: false,
      escaped: false,
      trail: [],
    };
    setPhotons((prev) => [...prev.slice(-8), newPhoton]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tick = () => {
      ctx.clearRect(0, 0, W, H);

      // Draw accretion disk
      const gradient = ctx.createRadialGradient(BH_X, BH_Y, horizonRadius, BH_X, BH_Y, horizonRadius * 2.5);
      gradient.addColorStop(0, 'rgba(249,115,22,0.6)');
      gradient.addColorStop(0.5, 'rgba(251,191,36,0.3)');
      gradient.addColorStop(1, 'rgba(251,191,36,0)');
      ctx.beginPath();
      ctx.ellipse(BH_X, BH_Y, horizonRadius * 2.5, horizonRadius * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Gravitational lensing ring
      ctx.beginPath();
      ctx.arc(BH_X, BH_Y, horizonRadius * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(251,191,36,0.2)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Black hole
      const bhGrad = ctx.createRadialGradient(BH_X, BH_Y, 0, BH_X, BH_Y, horizonRadius);
      bhGrad.addColorStop(0, '#000000');
      bhGrad.addColorStop(0.7, '#000000');
      bhGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(BH_X, BH_Y, horizonRadius, 0, Math.PI * 2);
      ctx.fillStyle = bhGrad;
      ctx.fill();

      // Update and draw photons
      setPhotons((prev) => {
        return prev
          .filter((p) => !p.captured && !p.escaped)
          .map((p) => {
            const dx = BH_X - p.x;
            const dy = BH_Y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // gravitational influence
            const grav = (bhMass / 50) * 8000 / (dist * dist + 100);
            const newVx = p.vx + (dx / dist) * grav * 0.02;
            const newVy = p.vy + (dy / dist) * grav * 0.02;

            const newX = p.x + newVx;
            const newY = p.y + newVy;
            const newTrail = [...p.trail.slice(-20), { x: p.x, y: p.y }];

            // draw trail
            if (newTrail.length > 1) {
              ctx.beginPath();
              ctx.moveTo(newTrail[0].x, newTrail[0].y);
              newTrail.forEach((pt) => ctx.lineTo(pt.x, pt.y));
              ctx.strokeStyle = 'rgba(250,204,21,0.6)';
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }

            // draw photon
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#fbbf24';
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#fbbf24';
            ctx.fill();
            ctx.shadowBlur = 0;

            const captured = dist < horizonRadius + 2;
            const escaped = newX < -10 || newX > W + 10 || newY < -10 || newY > H + 10;

            return { ...p, x: newX, y: newY, vx: newVx, vy: newVy, trail: newTrail, captured, escaped };
          });
      });

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [bhMass, horizonRadius, BH_X, BH_Y]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-xl cursor-pointer"
        style={{ background: '#050810', border: '1px solid #2a356060' }}
        onClick={shootPhoton}
      />

      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-blue-300/60 mb-2">
          <span>מסה קטנה</span>
          <span>מסה ענקית</span>
        </div>
        <input type="range" min={10} max={100} value={bhMass}
          onChange={(e) => setBhMass(Number(e.target.value))}
          className="w-full" style={{ accentColor: '#7c3aed' }} />
      </div>

      <button
        onClick={shootPhoton}
        className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all"
        style={{ background: 'linear-gradient(135deg, #fbbf24, #f97316)' }}
      >
        ירה קרן אור!
      </button>

      <p className="text-xs text-blue-300/50 text-center max-w-xs">
        לחץ כדי לירות פוטון (חלקיק אור) לכיוון החור השחור. האם יברח או יילכד?
      </p>
    </div>
  );
};

export default BlackHoles;
