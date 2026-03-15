import { useState, useEffect, useRef } from 'react';

const W = 280;
const H = 200;

const UncertaintyPrinciple = () => {
  const [positionCertainty, setPositionCertainty] = useState(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  // momentum certainty is inversely related
  const momentumCertainty = 100 - positionCertainty;

  const posSpread = (100 - positionCertainty) / 100 * 80 + 5;
  const momSpread = (100 - momentumCertainty) / 100 * 80 + 5;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      timeRef.current += 0.04;
      ctx.clearRect(0, 0, W, H);

      // Draw position probability cloud
      const cx = W / 2;
      const cy = H / 2;

      // wavefunction visualization
      const points = 200;
      const waveScale = momSpread / 30;

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(96,165,250,0.6)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * W;
        const normX = (x - cx) / (posSpread * 2);
        const gaussian = Math.exp(-normX * normX * 2);
        const wave = Math.cos(normX * waveScale * 10 + timeRef.current * 3) * gaussian;
        const y = cy + wave * 50;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // position probability blob
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, posSpread * 2);
      gradient.addColorStop(0, 'rgba(96,165,250,0.3)');
      gradient.addColorStop(1, 'rgba(96,165,250,0)');
      ctx.beginPath();
      ctx.ellipse(cx, cy, posSpread * 2, 30, 0, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // particle indicator (fuzzy dot)
      const fuzziness = posSpread / 10;
      for (let j = 0; j < 5; j++) {
        const ox = (Math.sin(timeRef.current * (j + 1) * 1.3) * fuzziness);
        const oy = (Math.cos(timeRef.current * (j + 1) * 0.9) * fuzziness);
        ctx.beginPath();
        ctx.arc(cx + ox, cy + oy, 4 + j * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${0.8 - j * 0.15})`;
        ctx.fill();
      }

      // momentum arrow
      const arrowLen = (momentumCertainty / 100) * 60;
      const arrowX = cx + Math.cos(timeRef.current * 0.5) * (posSpread * 1.5);
      ctx.save();
      ctx.translate(arrowX, cy - 60);
      ctx.strokeStyle = 'rgba(167,139,250,0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-arrowLen / 2, 0);
      ctx.lineTo(arrowLen / 2, 0);
      ctx.stroke();
      // arrowhead
      ctx.fillStyle = 'rgba(167,139,250,0.7)';
      ctx.beginPath();
      ctx.moveTo(arrowLen / 2, 0);
      ctx.lineTo(arrowLen / 2 - 8, -4);
      ctx.lineTo(arrowLen / 2 - 8, 4);
      ctx.fill();
      ctx.restore();

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [posSpread, momSpread, momentumCertainty]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-xl"
        style={{ background: 'rgba(26,32,64,0.8)', border: '1px solid #2a356060' }}
      />

      <div className="w-full max-w-xs space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-blue-400">מיקום ידוע</span>
            <span className="text-blue-300/60">{positionCertainty}%</span>
          </div>
          <input
            type="range" min={5} max={95} value={positionCertainty}
            onChange={(e) => setPositionCertainty(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: '#60a5fa' }}
          />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-purple-400">מומנטום ידוע</span>
            <span className="text-blue-300/60">{momentumCertainty}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${momentumCertainty}%`, background: '#a78bfa' }}
            />
          </div>
        </div>
      </div>

      <div className="text-center text-xs font-mono p-2 rounded-lg bg-white/5 border border-white/10">
        <span className="text-blue-400">Δx</span>
        <span className="text-white/60"> · </span>
        <span className="text-purple-400">Δp</span>
        <span className="text-white/60"> ≥ </span>
        <span className="text-yellow-400">ℏ/2</span>
      </div>

      <p className="text-xs text-blue-300/50 text-center max-w-xs">
        הגרד את הסליידר – ככל שמיקום החלקיק מדויק יותר, המהירות שלו הופכת לאי-ודאית יותר!
      </p>
    </div>
  );
};

export default UncertaintyPrinciple;
