import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const forces = [
  { name: 'כבידה', color: '#60a5fa', emoji: '🌍', angle: 225 },
  { name: 'אלקטרומגנטי', color: '#fbbf24', emoji: '⚡', angle: 315 },
  { name: 'גרעיני חזק', color: '#ef4444', emoji: '💪', angle: 45 },
  { name: 'גרעיני חלש', color: '#a78bfa', emoji: '☢️', angle: 135 },
];

const unificationStages = [
  { energy: 0, label: 'היום', unified: [], description: 'ארבעה כוחות נפרדים' },
  { energy: 30, label: 'אלקטרו-חלש', unified: [1, 3], description: 'אלקטרומגנטי + גרעיני חלש מתאחדים' },
  { energy: 60, label: 'GUT', unified: [1, 2, 3], description: 'שלושה כוחות מתאחדים (תיאוריה)' },
  { energy: 100, label: 'תיאוריית הכל', unified: [0, 1, 2, 3], description: 'כל הכוחות – כוח אחד!' },
];

const Unification = () => {
  const [energy, setEnergy] = useState(0);

  const stage = unificationStages.reduce((prev, curr) =>
    energy >= curr.energy ? curr : prev
  );

  const isUnified = (i: number) => stage.unified.includes(i);
  const allUnified = stage.unified.length === 4;

  const R = 70;
  const CX = 140;
  const CY = 110;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-64 h-52">
        <svg width={280} height={220} className="absolute inset-0 rounded-xl"
          style={{ background: 'rgba(10,14,26,0.9)' }}>

          {/* Connecting lines when unified */}
          {!allUnified && stage.unified.length > 0 && stage.unified.map((fi, idx) => {
            const f = forces[fi];
            const rad = (f.angle * Math.PI) / 180;
            const x = CX + Math.cos(rad) * R;
            const y = CY + Math.sin(rad) * R;
            return (
              <line key={idx}
                x1={x} y1={y} x2={CX} y2={CY}
                stroke={f.color} strokeWidth={1.5} opacity={0.4}
                strokeDasharray="3,4"
              />
            );
          })}

          {/* Force icons */}
          {forces.map((f, i) => {
            const rad = (f.angle * Math.PI) / 180;
            const x = allUnified ? CX : CX + Math.cos(rad) * R;
            const y = allUnified ? CY : CY + Math.sin(rad) * R;
            const unified = isUnified(i);

            return (
              <motion.g key={i}
                animate={{ x: allUnified ? CX - x : 0, y: allUnified ? CY - y : 0 }}
                transition={{ type: 'spring', stiffness: 80 }}
              >
                <circle cx={x} cy={y} r={unified && !allUnified ? 20 : 18}
                  fill={`${f.color}30`}
                  stroke={f.color}
                  strokeWidth={unified ? 2 : 1}
                  opacity={unified || allUnified ? 1 : 0.4}
                  style={{ filter: unified || allUnified ? `drop-shadow(0 0 8px ${f.color})` : 'none' }}
                />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={14}>
                  {f.emoji}
                </text>
              </motion.g>
            );
          })}

          {/* Center unified glow */}
          {allUnified && (
            <motion.circle
              cx={CX} cy={CY} r={40}
              fill="none"
              stroke="url(#unifiedGrad)"
              strokeWidth={3}
              initial={{ r: 20, opacity: 0 }}
              animate={{ r: [35, 45, 35], opacity: 0.6 }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}

          <defs>
            <radialGradient id="unifiedGrad">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f97316" />
            </radialGradient>
          </defs>
        </svg>

        {/* Stage label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.label}
            className="absolute bottom-2 left-0 right-0 text-center"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-xs font-bold text-yellow-400">{stage.label}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={stage.description}
          className="text-xs text-blue-300/70 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {stage.description}
        </motion.p>
      </AnimatePresence>

      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-blue-300/60 mb-2">
          <span>אנרגיה נמוכה (היום)</span>
          <span>אנרגיה עצומה (ביג-בנג)</span>
        </div>
        <input
          type="range" min={0} max={100} value={energy}
          onChange={(e) => setEnergy(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: '#fbbf24' }}
        />
      </div>

      {/* Force status */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
        {forces.map((f, i) => (
          <div key={i} className="text-center">
            <div className="text-lg">{f.emoji}</div>
            <div className="text-xs mt-0.5" style={{ color: isUnified(i) || allUnified ? f.color : '#4a5a80' }}>
              {f.name}
            </div>
            {(isUnified(i) || allUnified) && (
              <div className="text-xs text-green-400">✓</div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-blue-300/50 text-center max-w-xs">
        הגרד את הסליידר לאנרגיה גבוהה יותר – ראה איך הכוחות מתאחדים. בביג-בנג כולם היו כוח אחד!
      </p>
    </div>
  );
};

export default Unification;
