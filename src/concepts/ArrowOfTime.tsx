import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

type Direction = 'forward' | 'backward' | 'paused';

interface IcePiece {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vr: number;
}

const ArrowOfTime = () => {
  const [entropy, setEntropy] = useState(0); // 0 = ice cube, 100 = melted
  const [direction, setDirection] = useState<Direction>('paused');
  const [pieces, setPieces] = useState<IcePiece[]>([]);
  const dirRef = useRef(direction);
  dirRef.current = direction;
  const entropyRef = useRef(entropy);
  entropyRef.current = entropy;
  const frameRef = useRef<number | null>(null);

  // Generate ice pieces
  useEffect(() => {
    const newPieces = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 100 + (i % 3) * 22,
      y: 90 + Math.floor(i / 3) * 22,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 14 + Math.random() * 6,
      rotation: Math.random() * 30 - 15,
      vr: (Math.random() - 0.5) * 0.5,
    }));
    setPieces(newPieces);
  }, []);

  useEffect(() => {
    const tick = () => {
      const dir = dirRef.current;
      const ent = entropyRef.current;

      if (dir === 'forward' && ent < 100) {
        setEntropy((e) => Math.min(100, e + 0.4));
      } else if (dir === 'backward' && ent > 0) {
        // Can't really go back! Just slow increment
        setEntropy((e) => Math.max(0, e - 0.1)); // nature resists
      } else if (dir === 'forward' && ent >= 100) {
        setDirection('paused');
      }

      if (dir !== 'paused') {
        setPieces((prev) => prev.map((p) => {
          const spread = ent / 100;
          return {
            ...p,
            x: p.x + p.vx * spread * 2,
            y: p.y + p.vy * spread * 2 + spread * 0.3,
            rotation: p.rotation + p.vr * spread,
          };
        }));
      }

      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, []);

  const meltFraction = entropy / 100;

  // Ice color interpolation
  const iceR = Math.round(180 + meltFraction * 20);
  const iceG = Math.round(200 + meltFraction * 20);
  const iceB = Math.round(230 - meltFraction * 30);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Scene */}
      <div className="relative w-64 h-48 rounded-xl overflow-hidden"
        style={{ background: 'rgba(26,32,64,0.8)', border: '1px solid #2a356060' }}>

        {/* water puddle */}
        {meltFraction > 0.1 && (
          <div
            className="absolute rounded-full transition-all duration-300"
            style={{
              width: 60 + meltFraction * 100,
              height: 20 + meltFraction * 30,
              background: `rgba(96,165,250,${meltFraction * 0.4})`,
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        )}

        {/* ice pieces */}
        {meltFraction < 0.95 && pieces.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-sm transition-all"
            style={{
              width: p.size * (1 - meltFraction * 0.5),
              height: p.size * (1 - meltFraction * 0.5),
              left: p.x + meltFraction * (Math.sin(p.id * 1.7) * 30),
              top: p.y + meltFraction * (p.id * 5),
              transform: `rotate(${p.rotation + meltFraction * p.id * 20}deg)`,
              background: `rgba(${iceR},${iceG},${iceB},${1 - meltFraction * 0.8})`,
              opacity: 1 - meltFraction * 0.7,
              border: `1px solid rgba(255,255,255,${0.4 - meltFraction * 0.3})`,
            }}
          />
        ))}

        {/* steam effect at high entropy */}
        {meltFraction > 0.6 && (
          <div className="absolute inset-0">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-1 rounded-full"
                style={{
                  height: 20 + i * 10,
                  background: 'linear-gradient(to top, rgba(200,220,255,0.3), transparent)',
                  left: 80 + i * 40,
                  bottom: 40,
                  opacity: meltFraction - 0.6,
                }}
                animate={{ y: [-5, -20], opacity: [meltFraction - 0.6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 + i * 0.5, delay: i * 0.3 }}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-2 right-3 text-xs text-blue-300/40">
          {entropy < 20 ? '🧊 קרח מוצק' : entropy < 60 ? '💧 נמס...' : entropy < 90 ? '🌊 מים' : '♨️ אדים'}
        </div>
      </div>

      {/* Entropy meter */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-blue-300/60 mb-1">
          <span>אנטרופיה (אי-סדר)</span>
          <span className={entropy > 80 ? 'text-orange-400' : 'text-blue-300/60'}>{Math.round(entropy)}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${entropy}%`,
              background: `linear-gradient(90deg, #60a5fa, #f97316)`,
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={() => setDirection('forward')}
          disabled={entropy >= 100}
          className="px-4 py-2 rounded-xl text-xs font-medium text-white transition-all disabled:opacity-30"
          style={{ background: 'linear-gradient(135deg, #f97316, #fbbf24)' }}
        >
          ⏩ קדימה בזמן
        </button>
        <button
          onClick={() => setDirection('backward')}
          className="px-4 py-2 rounded-xl text-xs font-medium text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
        >
          ⏪ אחורה?
        </button>
        <button
          onClick={() => { setDirection('paused'); setEntropy(0); setPieces(prev => prev.map(p => ({ ...p, x: 100 + (p.id % 3) * 22, y: 90 + Math.floor(p.id / 3) * 22 }))); }}
          className="px-3 py-2 rounded-xl text-xs border border-blue-500/30 text-blue-300"
        >
          ↺
        </button>
      </div>

      <p className="text-xs text-blue-300/50 text-center max-w-xs">
        נסה ללחוץ "אחורה בזמן" – הטבע מתנגד! האנטרופיה לא אוהבת לרדת. זה למה הזמן נע רק קדימה.
      </p>
    </div>
  );
};

export default ArrowOfTime;
