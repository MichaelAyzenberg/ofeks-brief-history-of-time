import { useState } from 'react';
import { motion } from 'framer-motion';

const forces = [
  {
    name: 'כבידה',
    nameEn: 'Gravity',
    color: '#60a5fa',
    strength: 4,
    range: 'אינסופי',
    description: 'מחזיקה כוכבים, כוכבי לכת וגלקסיות. החלש ביותר אבל פועל על הכל!',
    carrier: 'גרביטון (תיאורטי)',
    emoji: '🌍',
  },
  {
    name: 'אלקטרומגנטי',
    nameEn: 'Electromagnetic',
    color: '#fbbf24',
    strength: 36,
    range: 'אינסופי',
    description: 'אחראי לאור, חשמל, מגנטיות. מחזיק אלקטרונים באטומים.',
    carrier: 'פוטון',
    emoji: '⚡',
  },
  {
    name: 'גרעיני חזק',
    nameEn: 'Strong Nuclear',
    color: '#ef4444',
    strength: 100,
    range: '10⁻¹⁵ מטר',
    description: 'החזק ביותר! מחזיק פרוטונים ונייטרונים בגרעין האטום.',
    carrier: 'גלואון',
    emoji: '💪',
  },
  {
    name: 'גרעיני חלש',
    nameEn: 'Weak Nuclear',
    color: '#a78bfa',
    strength: 0.8,
    range: '10⁻¹⁸ מטר',
    description: 'אחראי לדעיכה רדיואקטיבית. הופך נייטרונים לפרוטונים.',
    carrier: 'W ו-Z בוזונים',
    emoji: '☢️',
  },
];

const ParticlesForces = () => {
  const [selected, setSelected] = useState<number | null>(0);
  const [showOrbit, setShowOrbit] = useState(true);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Atom visualization */}
      {showOrbit && (
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* nucleus */}
          <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'radial-gradient(circle, #ef4444, #7f1d1d)', boxShadow: '0 0 20px #ef444460' }}>
            <span className="text-xs text-white font-bold">He</span>
          </div>

          {/* electron orbits */}
          {[48, 72, 90].map((r, i) => (
            <div key={i}
              className="absolute rounded-full border border-blue-400/20"
              style={{ width: r * 2, height: r * 2 }} />
          ))}

          {/* animated electrons */}
          {[0, 120, 240].map((startAngle, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: '#60a5fa',
                boxShadow: '0 0 8px #60a5fa',
                originX: '50%',
                originY: '50%',
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3 + i * 0.7,
                repeat: Infinity,
                ease: 'linear',
              }}
              initial={{ rotate: startAngle }}
            >
              <div
                className="absolute w-3 h-3 rounded-full bg-blue-400"
                style={{ transform: `translateX(${48 + i * 24}px)` }}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Forces grid */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
        {forces.map((f, i) => (
          <button
            key={i}
            onClick={() => setSelected(selected === i ? null : i)}
            className="p-3 rounded-xl text-right transition-all duration-200 border"
            style={{
              background: selected === i ? f.color + '20' : 'rgba(26,32,64,0.6)',
              borderColor: selected === i ? f.color + '80' : '#2a356040',
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-lg">{f.emoji}</span>
              <span className="text-xs font-bold" style={{ color: f.color }}>{f.name}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-blue-300/40">עוצמה:</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${f.strength}%`, background: f.color }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xs p-3 rounded-xl border text-xs space-y-1"
          style={{ background: forces[selected].color + '10', borderColor: forces[selected].color + '40' }}
        >
          <div className="font-medium" style={{ color: forces[selected].color }}>
            {forces[selected].name} – {forces[selected].nameEn}
          </div>
          <div className="text-blue-200/70">{forces[selected].description}</div>
          <div className="text-blue-300/50">טווח: {forces[selected].range}</div>
          <div className="text-blue-300/50">חלקיק נשא: {forces[selected].carrier}</div>
        </motion.div>
      )}

      <button
        onClick={() => setShowOrbit((s) => !s)}
        className="text-xs text-blue-400/60 underline"
      >
        {showOrbit ? 'הסתר' : 'הצג'} מודל אטום
      </button>
    </div>
  );
};

export default ParticlesForces;
