import { useState, useMemo, useEffect, useRef } from 'react';

const W = 280;
const H = 240;

interface Galaxy {
  id: number;
  baseX: number;
  baseY: number;
  color: string;
  size: number;
}

const ExpandingUniverse = () => {
  const [time, setTime] = useState(50);
  const [animating, setAnimating] = useState(false);
  const animRef = useRef<number | null>(null);
  const timeRef = useRef(time);
  timeRef.current = time;

  const galaxies = useMemo<Galaxy[]>(() => {
    const seed = [
      { bx: 0, by: 0 }, { bx: 0.3, by: 0.2 }, { bx: -0.4, by: -0.1 },
      { bx: -0.2, by: 0.4 }, { bx: 0.5, by: -0.3 }, { bx: -0.5, by: 0.3 },
      { bx: 0.1, by: -0.5 }, { bx: 0.6, by: 0.5 }, { bx: -0.6, by: -0.4 },
      { bx: 0.8, by: 0.1 }, { bx: -0.8, by: 0.2 }, { bx: 0.2, by: 0.8 },
    ];
    const colors = ['#60a5fa', '#a78bfa', '#34d399', '#fbbf24', '#f97316', '#ec4899'];
    return seed.map((s, i) => ({
      id: i,
      baseX: s.bx,
      baseY: s.by,
      color: colors[i % colors.length],
      size: 3 + (i % 3),
    }));
  }, []);

  const scale = time / 50; // 0.02 to 2

  const getPos = (g: Galaxy) => ({
    x: W / 2 + g.baseX * (W / 2) * scale,
    y: H / 2 + g.baseY * (H / 2) * scale,
  });

  const getRedshift = (g: Galaxy) => {
    const dist = Math.sqrt(g.baseX * g.baseX + g.baseY * g.baseY);
    const redAmount = Math.min(dist * (scale - 1) * 0.8, 1);
    return redAmount;
  };

  useEffect(() => {
    if (animating) {
      const step = () => {
        if (timeRef.current >= 100) {
          setAnimating(false);
          return;
        }
        setTime((t) => Math.min(100, t + 0.5));
        animRef.current = requestAnimationFrame(step);
      };
      animRef.current = requestAnimationFrame(step);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [animating]);

  const toggleAnim = () => {
    if (time >= 100) setTime(1);
    setAnimating((a) => !a);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={W}
        height={H}
        className="rounded-xl"
        style={{ background: 'rgba(10,14,26,0.95)', border: '1px solid #2a356060' }}
      >
        {/* connection lines from center */}
        {galaxies.map((g) => {
          const pos = getPos(g);
          const red = getRedshift(g);
          const lineColor = `rgb(${Math.round(100 + red * 100)}, ${Math.round(100 - red * 60)}, ${Math.round(200 - red * 150)})`;
          if (Math.abs(g.baseX) + Math.abs(g.baseY) < 0.05) return null;
          return (
            <line
              key={g.id}
              x1={W / 2} y1={H / 2}
              x2={pos.x} y2={pos.y}
              stroke={lineColor}
              strokeWidth={0.5}
              opacity={0.2}
              strokeDasharray="3,6"
            />
          );
        })}

        {/* galaxies */}
        {galaxies.map((g) => {
          const pos = getPos(g);
          const red = getRedshift(g);
          const r = Math.round(100 + red * 155);
          const gr = Math.round(150 - red * 100);
          const b = Math.round(255 - red * 200);
          const color = `rgb(${r},${gr},${b})`;

          if (pos.x < -20 || pos.x > W + 20 || pos.y < -20 || pos.y > H + 20) return null;

          return (
            <g key={g.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={g.size + 4}
                fill={color}
                opacity={0.08}
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r={g.size}
                fill={color}
                opacity={0.9}
                style={{ filter: `drop-shadow(0 0 4px ${color})` }}
              />
            </g>
          );
        })}

        {/* Milky Way label */}
        <text x={W / 2 + 8} y={H / 2 - 8} fill="#60a5fa" fontSize={8} opacity={0.7}>שביל החלב</text>
      </svg>

      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-blue-300/60 mb-2">
          <span>ביג-בנג</span>
          <span className="font-medium text-blue-300">{Math.round(time * 140_000_000 / 100).toLocaleString()} שנה</span>
          <span>היום</span>
        </div>
        <input
          type="range" min={1} max={100} value={time}
          onChange={(e) => { setAnimating(false); setTime(Number(e.target.value)); }}
          className="w-full"
        />
      </div>

      <button
        onClick={toggleAnim}
        className="px-4 py-1.5 rounded-full text-xs font-medium border border-blue-500/30 text-blue-300 hover:bg-blue-900/30 transition-all"
      >
        {animating ? 'עצור' : time >= 100 ? 'שחק מחדש' : 'הפעל התרחבות'}
      </button>

      <p className="text-xs text-blue-300/50 text-center max-w-xs">
        שים לב: ככל שגלקסיה רחוקה יותר, היא מתאדמת (אפקט דופלר). כולן מתרחקות מכולן!
      </p>
    </div>
  );
};

export default ExpandingUniverse;
