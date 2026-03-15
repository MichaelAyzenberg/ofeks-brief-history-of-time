import { useState, useEffect, useRef } from 'react';

const W = 280;
const H = 240;

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isAnti: boolean;
  captured: boolean;
  age: number;
}

let pid = 0;

const HawkingRadiation = () => {
  const [, setParticles] = useState<Particle[]>([]);
  const [escaped, setEscaped] = useState(0);
  const [bhSize, setBhSize] = useState(40);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const escapeRef = useRef(0);

  const BH_X = W / 2;
  const BH_Y = H / 2;
  const horizonR = bhSize * 0.5;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tick = () => {
      ctx.clearRect(0, 0, W, H);

      // BH
      const grad = ctx.createRadialGradient(BH_X, BH_Y, 0, BH_X, BH_Y, horizonR + 20);
      grad.addColorStop(0, '#000');
      grad.addColorStop(0.6, '#000');
      grad.addColorStop(0.85, 'rgba(52,211,153,0.2)');
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(BH_X, BH_Y, horizonR + 20, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(BH_X, BH_Y, horizonR, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();

      // Event horizon ring with glow
      ctx.beginPath();
      ctx.arc(BH_X, BH_Y, horizonR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(52,211,153,0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Spawn particles near horizon
      if (Math.random() < 0.08) {
        const angle = Math.random() * Math.PI * 2;
        const spawnR = horizonR + 5 + Math.random() * 10;
        const isAnti = Math.random() < 0.5;
        const speed = 1.5 + Math.random();
        setParticles((prev) => [
          ...prev.slice(-30),
          {
            id: pid++,
            x: BH_X + Math.cos(angle) * spawnR,
            y: BH_Y + Math.sin(angle) * spawnR,
            vx: isAnti ? -Math.cos(angle) * speed : Math.cos(angle) * speed * 1.2,
            vy: isAnti ? -Math.sin(angle) * speed : Math.sin(angle) * speed * 1.2,
            isAnti,
            captured: false,
            age: 0,
          },
        ]);
      }

      setParticles((prev) => {
        const updated = prev.map((p) => {
          const nx = p.x + p.vx;
          const ny = p.y + p.vy;
          const dist = Math.sqrt((nx - BH_X) ** 2 + (ny - BH_Y) ** 2);
          const captured = p.isAnti && dist < horizonR + 2;
          const outOfBounds = nx < -5 || nx > W + 5 || ny < -5 || ny > H + 5;

          if (!p.isAnti && outOfBounds && !p.captured) {
            escapeRef.current += 1;
            setEscaped(escapeRef.current);
          }

          // draw
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = p.isAnti ? 'rgba(236,72,153,0.9)' : 'rgba(52,211,153,0.9)';
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.isAnti ? '#ec4899' : '#34d399';
          ctx.fill();
          ctx.shadowBlur = 0;

          return { ...p, x: nx, y: ny, age: p.age + 1, captured };
        }).filter((p) => !p.captured && p.age < 100);

        return updated;
      });

      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [horizonR, BH_X, BH_Y]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} width={W} height={H}
        className="rounded-xl"
        style={{ background: '#050810', border: '1px solid #34d39940' }}
      />

      <div className="flex gap-6 text-xs text-center">
        <div>
          <div className="w-3 h-3 rounded-full bg-green-400 mx-auto mb-1" style={{ boxShadow: '0 0 6px #34d399' }} />
          <span className="text-green-400">חלקיק בורח</span>
        </div>
        <div>
          <div className="w-3 h-3 rounded-full bg-pink-400 mx-auto mb-1" style={{ boxShadow: '0 0 6px #ec4899' }} />
          <span className="text-pink-400">אנטי-חלקיק נבלע</span>
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold text-green-400">{escaped}</div>
        <div className="text-xs text-blue-300/50">חלקיקים שברחו (קרינת הוקינג)</div>
      </div>

      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-blue-300/60 mb-2">
          <span>חור שחור קטן (חם יותר)</span>
          <span>חור שחור גדול (קר)</span>
        </div>
        <input type="range" min={20} max={80} value={bhSize}
          onChange={(e) => setBhSize(Number(e.target.value))}
          className="w-full" style={{ accentColor: '#34d399' }}
        />
      </div>

      <p className="text-xs text-blue-300/50 text-center max-w-xs">
        ליד אופק האירועים, זוגות חלקיק-אנטיחלקיק נוצרים. האנטי-חלקיק נבלע; החלקיק בורח – זו קרינת הוקינג!
      </p>
    </div>
  );
};

export default HawkingRadiation;
