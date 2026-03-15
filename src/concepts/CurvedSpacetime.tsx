import { useState, useMemo } from 'react';

const W = 280;
const H = 240;
const GRID_SIZE = 8;

const CurvedSpacetime = () => {
  const [mass, setMass] = useState(40);

  const cx = W / 2;
  const cy = H / 2;

  // Build distorted grid
  const gridLines = useMemo(() => {
    const lines: { points: string; isH: boolean }[] = [];
    const stepX = W / GRID_SIZE;
    const stepY = H / GRID_SIZE;
    const strength = mass / 100;

    const distort = (px: number, py: number) => {
      const dx = px - cx;
      const dy = py - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) + 1;
      const factor = strength * 1800 / (dist * dist + 200);
      return {
        x: px - (dx / dist) * factor,
        y: py - (dy / dist) * factor,
      };
    };

    // horizontal lines
    for (let row = 0; row <= GRID_SIZE; row++) {
      const y = row * stepY;
      const pts: string[] = [];
      for (let col = 0; col <= GRID_SIZE * 4; col++) {
        const x = (col / 4) * stepX;
        const p = distort(x, y);
        pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
      }
      lines.push({ points: pts.join(' '), isH: true });
    }

    // vertical lines
    for (let col = 0; col <= GRID_SIZE; col++) {
      const x = col * stepX;
      const pts: string[] = [];
      for (let row = 0; row <= GRID_SIZE * 4; row++) {
        const y = (row / 4) * stepY;
        const p = distort(x, y);
        pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
      }
      lines.push({ points: pts.join(' '), isH: false });
    }

    return lines;
  }, [mass, cx, cy]);

  const massRadius = 8 + (mass / 100) * 20;
  const massColor = mass < 30 ? '#60a5fa' : mass < 70 ? '#fbbf24' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={W}
        height={H}
        className="rounded-xl"
        style={{ background: 'rgba(26,32,64,0.8)', border: '1px solid #2a356060' }}
      >
        {gridLines.map((line, i) => (
          <polyline
            key={i}
            points={line.points}
            fill="none"
            stroke={line.isH ? '#4f46e5' : '#2563eb'}
            strokeWidth={0.8}
            opacity={0.5}
          />
        ))}

        {/* central mass */}
        <circle
          cx={cx}
          cy={cy}
          r={massRadius}
          fill={massColor}
          style={{ filter: `drop-shadow(0 0 ${massRadius}px ${massColor})` }}
          opacity={0.9}
        />

        {/* orbit indicator */}
        {mass > 10 && (
          <circle
            cx={cx}
            cy={cy}
            r={massRadius + 30}
            fill="none"
            stroke={massColor}
            strokeWidth={0.8}
            strokeDasharray="3,5"
            opacity={0.3}
          />
        )}
      </svg>

      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-blue-300/60 mb-2">
          <span>מסה קטנה</span>
          <span className="font-medium" style={{ color: massColor }}>{mass}%</span>
          <span>מסה גדולה (חור שחור)</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={mass}
          onChange={(e) => setMass(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: massColor }}
        />
      </div>

      <p className="text-xs text-blue-300/50 text-center max-w-xs">
        הגרד את הסליידר כדי לשנות את המסה. שים לב איך הרשת מתכופפת – ככה כבידה עובדת!
      </p>
    </div>
  );
};

export default CurvedSpacetime;
