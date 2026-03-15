import { useState, useEffect, useRef } from 'react';

const W = 280;
const H = 220;

const Wormholes = () => {
  const [shipPos, setShipPos] = useState(0); // 0-100, traversal progress through wormhole
  const [traveling, setTraveling] = useState(false);
  const [mode, setMode] = useState<'normal' | 'wormhole'>('wormhole');
  const [tripsDone, setTripsDone] = useState(0);
  const frameRef = useRef<number | null>(null);
  const posRef = useRef(0);

  const A = { x: 50, y: 110 };
  const B = { x: 230, y: 110 };
  const wormholeCenter = { x: W / 2, y: H / 2 };

  const startTravel = () => {
    if (traveling) return;
    setShipPos(0);
    posRef.current = 0;
    setTraveling(true);
  };

  useEffect(() => {
    if (!traveling) return;
    const tick = () => {
      posRef.current += mode === 'wormhole' ? 1.5 : 0.5;
      setShipPos(posRef.current);
      if (posRef.current >= 100) {
        setTraveling(false);
        setTripsDone((t) => t + 1);
        return;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [traveling, mode]);

  // Ship position calculation
  const getShipXY = () => {
    const t = shipPos / 100;
    if (mode === 'wormhole') {
      // Goes to wormhole entrance, through it, comes out other side
      if (t < 0.3) {
        // A → wormhole entrance
        const ft = t / 0.3;
        return { x: A.x + (wormholeCenter.x - 20 - A.x) * ft, y: A.y };
      } else if (t < 0.7) {
        // Through wormhole (invisible / tunnel)
        return { x: -50, y: -50 }; // hidden
      } else {
        // Wormhole exit → B
        const ft = (t - 0.7) / 0.3;
        return { x: wormholeCenter.x + 20 + (B.x - wormholeCenter.x - 20) * ft, y: B.y };
      }
    } else {
      // Normal space path (long arc)
      return { x: A.x + (B.x - A.x) * t, y: A.y - Math.sin(t * Math.PI) * 50 };
    }
  };

  const shipXY = getShipXY();
  const inWormhole = mode === 'wormhole' && shipPos > 30 && shipPos < 70;

  // Normal space distance indicator
  const normalDist = Math.round((B.x - A.x) * 0.5);
  const wormholeDist = Math.round(normalDist * 0.15);

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={W} height={H} className="rounded-xl"
        style={{ background: 'rgba(10,14,26,0.95)', border: '1px solid #818cf840' }}>

        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <circle key={i}
            cx={(i * 137.5) % W} cy={(i * 97.3) % H}
            r={0.8 + (i % 3) * 0.4} fill="white" opacity={0.3 + (i % 4) * 0.1}
          />
        ))}

        {/* Normal space arc */}
        {mode === 'normal' && (
          <path
            d={`M ${A.x} ${A.y} Q ${W / 2} ${A.y - 60} ${B.x} ${B.y}`}
            fill="none" stroke="#818cf8" strokeWidth={1.5}
            strokeDasharray="5,5" opacity={0.4}
          />
        )}

        {/* Wormhole tunnel */}
        {mode === 'wormhole' && (
          <>
            <ellipse cx={wormholeCenter.x} cy={wormholeCenter.y} rx={35} ry={50}
              fill="none" stroke="#818cf8" strokeWidth={2} opacity={0.5} />
            <ellipse cx={wormholeCenter.x} cy={wormholeCenter.y} rx={20} ry={35}
              fill="rgba(129,140,248,0.1)" stroke="#818cf8" strokeWidth={1} opacity={0.7} />

            {/* Swirl effect */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <ellipse key={i}
                cx={wormholeCenter.x} cy={wormholeCenter.y}
                rx={15} ry={30}
                fill="none" stroke="rgba(129,140,248,0.2)"
                strokeWidth={0.5}
                transform={`rotate(${angle}, ${wormholeCenter.x}, ${wormholeCenter.y})`}
              />
            ))}

            {/* Connecting lines A → wormhole */}
            <line x1={A.x} y1={A.y} x2={wormholeCenter.x - 20} y2={wormholeCenter.y}
              stroke="#818cf8" strokeWidth={1} strokeDasharray="4,4" opacity={0.4} />
            <line x1={wormholeCenter.x + 20} y1={wormholeCenter.y} x2={B.x} y2={B.y}
              stroke="#818cf8" strokeWidth={1} strokeDasharray="4,4" opacity={0.4} />
          </>
        )}

        {/* Points A and B */}
        <circle cx={A.x} cy={A.y} r={8} fill="#60a5fa" opacity={0.8}
          style={{ filter: 'drop-shadow(0 0 6px #60a5fa)' }} />
        <text x={A.x} y={A.y - 14} fill="#60a5fa" fontSize={9} textAnchor="middle">נקודה א׳</text>

        <circle cx={B.x} cy={B.y} r={8} fill="#34d399" opacity={0.8}
          style={{ filter: 'drop-shadow(0 0 6px #34d399)' }} />
        <text x={B.x} y={B.y - 14} fill="#34d399" fontSize={9} textAnchor="middle">נקודה ב׳</text>

        {/* Ship */}
        {traveling && !inWormhole && (
          <g transform={`translate(${shipXY.x}, ${shipXY.y})`}>
            <text fontSize={16} textAnchor="middle" dominantBaseline="middle">🚀</text>
          </g>
        )}

        {/* Wormhole travel text */}
        {inWormhole && (
          <text x={wormholeCenter.x} y={wormholeCenter.y + 70} fill="#818cf8"
            fontSize={9} textAnchor="middle" opacity={0.7}>
            עובר דרך תולעת-חלל...
          </text>
        )}

        {/* Distance labels */}
        {mode === 'normal' && (
          <text x={W / 2} y={45} fill="#a78bfa" fontSize={9} textAnchor="middle" opacity={0.6}>
            מרחק רגיל: {normalDist} שנות אור
          </text>
        )}
        {mode === 'wormhole' && (
          <text x={W / 2} y={H - 8} fill="#818cf8" fontSize={9} textAnchor="middle" opacity={0.6}>
            מרחק בתולעת: {wormholeDist} שנות אור!
          </text>
        )}
      </svg>

      {/* Mode selector */}
      <div className="flex rounded-xl overflow-hidden border border-indigo-500/30">
        {(['wormhole', 'normal'] as const).map((m) => (
          <button key={m}
            onClick={() => { setMode(m); setShipPos(0); setTraveling(false); }}
            className="px-4 py-2 text-xs font-medium transition-all"
            style={{
              background: mode === m ? '#4f46e5' : 'transparent',
              color: mode === m ? 'white' : '#818cf8',
            }}>
            {m === 'wormhole' ? '🌀 תולעת-חלל' : '🛸 מרחב רגיל'}
          </button>
        ))}
      </div>

      <div className="flex gap-3 items-center">
        <button
          onClick={startTravel}
          disabled={traveling}
          className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #818cf8)' }}
        >
          {traveling ? 'מטייל...' : 'שגר!'}
        </button>
        {tripsDone > 0 && (
          <div className="text-xs text-indigo-400">✓ {tripsDone} טיול{tripsDone > 1 ? 'ות' : ''}</div>
        )}
      </div>

      <p className="text-xs text-blue-300/50 text-center max-w-xs">
        השווה: בתולעת-חלל הנסיעה קצרה פי {Math.round(normalDist / wormholeDist)}! קיצור דרך דרך המרחב-זמן.
      </p>
    </div>
  );
};

export default Wormholes;
