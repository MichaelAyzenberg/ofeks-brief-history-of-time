import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Phase = 'nebula' | 'mainsequence' | 'giant' | 'collapse' | 'remnant';

interface StarState {
  phase: Phase;
  label: string;
  color: string;
  size: number;
  description: string;
}

const getStarStates = (mass: number): StarState[] => {
  const isSmall = mass < 40;
  const isMedium = mass < 70;

  return [
    { phase: 'nebula', label: 'ענן גז', color: '#a78bfa', size: 60, description: 'ענן גז ואבק מתכנס בגלל כבידה' },
    { phase: 'mainsequence', label: 'כוכב בוגר', color: isSmall ? '#60a5fa' : isMedium ? '#fbbf24' : '#ef4444', size: isSmall ? 35 : isMedium ? 45 : 55, description: `שורף מימן במשך ${isSmall ? '50' : isMedium ? '10' : '1'} מיליארד שנה` },
    { phase: 'giant', label: isSmall ? 'ננס לבן' : 'ענק אדום', color: isSmall ? '#c8d4f0' : '#f97316', size: isSmall ? 20 : 70, description: isSmall ? 'הכוכב מקרר ומצטנן' : 'התפוצצות ענקית, מאיר מיליארד פעמים יותר' },
    { phase: 'collapse', label: 'קריסה', color: '#7c3aed', size: 15, description: 'כבידה גוברת על לחץ הגז' },
    {
      phase: 'remnant',
      label: isSmall ? 'ננס לבן' : isMedium ? 'כוכב נייטרונים' : 'חור שחור',
      color: isSmall ? '#c8d4f0' : isMedium ? '#06b6d4' : '#000000',
      size: isSmall ? 12 : isMedium ? 8 : 5,
      description: isSmall ? 'שרידי כוכב קר ודחוס' : isMedium ? 'ספירת נייטרונים, 1 ת"מ לכ"מ²' : 'חור שחור – כבידה אינסופית!'
    },
  ];
};

const StarsCollapse = () => {
  const [mass, setMass] = useState(50);
  const [phaseIndex, setPhaseIndex] = useState(0);

  const states = getStarStates(mass);
  const current = states[phaseIndex];

  const next = () => setPhaseIndex((i) => Math.min(states.length - 1, i + 1));
  const prev = () => setPhaseIndex((i) => Math.max(0, i - 1));

  const isBlackHole = mass >= 70 && phaseIndex === states.length - 1;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Star display */}
      <div className="relative w-64 h-48 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(10,14,26,0.95)', border: '1px solid #2a356060' }}>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${mass}-${phaseIndex}`}
            className="relative flex items-center justify-center"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {current.phase === 'nebula' ? (
              // Nebula - fuzzy cloud
              <div className="relative">
                {[0, 30, 60, 90, 120, 150].map((angle, i) => (
                  <div key={i}
                    className="absolute rounded-full"
                    style={{
                      width: 40 + i * 5,
                      height: 30 + i * 3,
                      background: `radial-gradient(circle, ${current.color}40, transparent)`,
                      transform: `rotate(${angle}deg) translate(${i * 8}px)`,
                      top: -20,
                      left: -20,
                    }} />
                ))}
                <div className="w-10 h-10 rounded-full"
                  style={{ background: `radial-gradient(circle, ${current.color}, ${current.color}60)` }} />
              </div>
            ) : isBlackHole ? (
              // Black hole with accretion disk
              <div className="relative">
                <div className="absolute rounded-full opacity-30 animate-spin"
                  style={{
                    width: 80, height: 20,
                    background: 'linear-gradient(90deg, #f97316, #ef4444, transparent)',
                    top: -10, left: -20,
                    animationDuration: '3s',
                  }} />
                <div className="w-12 h-12 rounded-full"
                  style={{
                    background: 'black',
                    boxShadow: '0 0 20px #7c3aed, 0 0 40px #4c1d9540',
                  }} />
              </div>
            ) : (
              // Regular star
              <motion.div
                animate={{ scale: current.phase === 'mainsequence' ? [1, 1.05, 1] : 1 }}
                transition={{ repeat: current.phase === 'mainsequence' ? Infinity : 0, duration: 2 }}
                className="rounded-full"
                style={{
                  width: current.size * 2,
                  height: current.size * 2,
                  background: `radial-gradient(circle, white, ${current.color}, ${current.color}80)`,
                  boxShadow: `0 0 ${current.size}px ${current.color}, 0 0 ${current.size * 2}px ${current.color}40`,
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* phase label */}
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <span className="text-xs font-bold" style={{ color: current.color }}>{current.label}</span>
        </div>
      </div>

      <p className="text-xs text-blue-300/60 text-center max-w-xs">{current.description}</p>

      {/* phase dots */}
      <div className="flex gap-2">
        {states.map((s, i) => (
          <button key={i} onClick={() => setPhaseIndex(i)}
            className="w-2 h-2 rounded-full transition-all"
            style={{ background: i === phaseIndex ? s.color : '#2a3560' }} />
        ))}
      </div>

      {/* controls */}
      <div className="flex gap-3">
        <button onClick={prev} disabled={phaseIndex === 0}
          className="px-4 py-1.5 rounded-full text-xs font-medium border border-blue-500/30 text-blue-300 hover:bg-blue-900/30 disabled:opacity-30 transition-all">
          ← קודם
        </button>
        <button onClick={next} disabled={phaseIndex === states.length - 1}
          className="px-4 py-1.5 rounded-full text-xs font-medium border border-blue-500/30 text-blue-300 hover:bg-blue-900/30 disabled:opacity-30 transition-all">
          הבא →
        </button>
      </div>

      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-blue-300/60 mb-2">
          <span>כוכב קטן (כמו השמש)</span>
          <span>ענק</span>
        </div>
        <input type="range" min={5} max={100} value={mass}
          onChange={(e) => { setMass(Number(e.target.value)); setPhaseIndex(0); }}
          className="w-full" />
        <div className="text-xs text-center mt-1 text-blue-300/50">
          תוצאה: {mass < 40 ? 'ננס לבן' : mass < 70 ? 'כוכב נייטרונים' : 'חור שחור'}
        </div>
      </div>
    </div>
  );
};

export default StarsCollapse;
