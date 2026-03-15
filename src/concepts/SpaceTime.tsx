import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const W = 280;
const H = 280;
const CX = W / 2;
const CY = H / 2;

interface Point { x: number; y: number; }

const SpaceTime = () => {
  const [objectPos, setObjectPos] = useState<Point>({ x: CX - 60, y: CY + 60 });
  const [trail, setTrail] = useState<Point[]>([{ x: CX - 60, y: CY + 60 }]);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const getSVGPoint = useCallback((clientX: number, clientY: number): Point | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * W,
      y: ((clientY - rect.top) / rect.height) * H,
    };
  }, []);

  const handleMouseDown = () => { dragging.current = true; };
  const handleMouseUp = () => { dragging.current = false; };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    const pt = getSVGPoint(e.clientX, e.clientY);
    if (!pt) return;
    setObjectPos(pt);
    setTrail((prev) => [...prev.slice(-40), pt]);
  }, [getSVGPoint]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const pt = getSVGPoint(touch.clientX, touch.clientY);
    if (!pt) return;
    setObjectPos(pt);
    setTrail((prev) => [...prev.slice(-40), pt]);
  }, [getSVGPoint]);

  const reset = () => {
    setObjectPos({ x: CX - 60, y: CY + 60 });
    setTrail([{ x: CX - 60, y: CY + 60 }]);
  };

  // light cone lines from current position
  const lightConeAngle = 35;
  const coneHeight = 80;
  const rad = (lightConeAngle * Math.PI) / 180;
  const dx = coneHeight * Math.tan(rad);

  // trail path
  const trailPath = trail.length > 1
    ? `M ${trail[0].x} ${trail[0].y} ` + trail.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xs text-blue-300/60 text-center">
        גרור את החלקיק ציר X = מרחב, ציר Y = זמן
      </div>
      <svg
        ref={svgRef}
        width={W}
        height={H}
        className="rounded-xl cursor-crosshair touch-none"
        style={{ background: 'rgba(26,32,64,0.8)', border: '1px solid #2a356060' }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        {/* grid */}
        {Array.from({ length: 7 }).map((_, i) => {
          const x = (i + 1) * (W / 8);
          const y = (i + 1) * (H / 8);
          return (
            <g key={i} opacity={0.15}>
              <line x1={x} y1={0} x2={x} y2={H} stroke="#60a5fa" strokeWidth={0.5} />
              <line x1={0} y1={y} x2={W} y2={y} stroke="#60a5fa" strokeWidth={0.5} />
            </g>
          );
        })}

        {/* axes */}
        <line x1={CX} y1={0} x2={CX} y2={H} stroke="#a78bfa" strokeWidth={1.5} opacity={0.6} />
        <line x1={0} y1={CY} x2={W} y2={CY} stroke="#60a5fa" strokeWidth={1.5} opacity={0.6} />

        {/* axis labels */}
        <text x={W - 8} y={CY - 6} fill="#60a5fa" fontSize={10} textAnchor="end" opacity={0.7}>מרחב</text>
        <text x={CX + 6} y={12} fill="#a78bfa" fontSize={10} opacity={0.7}>זמן</text>

        {/* light cone */}
        <polygon
          points={`
            ${objectPos.x},${objectPos.y}
            ${objectPos.x - dx},${objectPos.y - coneHeight}
            ${objectPos.x + dx},${objectPos.y - coneHeight}
          `}
          fill="#fbbf24"
          opacity={0.12}
        />
        <line
          x1={objectPos.x} y1={objectPos.y}
          x2={objectPos.x - dx} y2={objectPos.y - coneHeight}
          stroke="#fbbf24" strokeWidth={1.5} opacity={0.5} strokeDasharray="4,3"
        />
        <line
          x1={objectPos.x} y1={objectPos.y}
          x2={objectPos.x + dx} y2={objectPos.y - coneHeight}
          stroke="#fbbf24" strokeWidth={1.5} opacity={0.5} strokeDasharray="4,3"
        />
        <text x={objectPos.x} y={objectPos.y - coneHeight - 4} fill="#fbbf24" fontSize={9} textAnchor="middle" opacity={0.7}>חרוט האור</text>

        {/* worldline trail */}
        {trailPath && (
          <path d={trailPath} fill="none" stroke="#f97316" strokeWidth={2} opacity={0.7} strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* object */}
        <motion.circle
          cx={objectPos.x}
          cy={objectPos.y}
          r={10}
          fill="#60a5fa"
          style={{ filter: 'drop-shadow(0 0 8px #60a5fa)' }}
        />
      </svg>

      <button
        onClick={reset}
        className="px-4 py-1.5 rounded-full text-xs font-medium border border-blue-500/30 text-blue-300 hover:bg-blue-900/30 transition-all"
      >
        איפוס מסלול
      </button>

      <p className="text-xs text-blue-300/50 text-center max-w-xs">
        הקו הכתום הוא "קו עולמי" – מסלולו של האובייקט במרחב-זמן. חרוט האור מראה עד איפה אפשר להגיע במהירות האור.
      </p>
    </div>
  );
};

export default SpaceTime;
