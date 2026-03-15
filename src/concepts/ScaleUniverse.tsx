import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const scales = [
  { label: 'אדם', labelEn: 'Human', size: 1.8, unit: 'מטר', color: '#60a5fa', description: '1.8 מטר' },
  { label: 'כדור הארץ', labelEn: 'Earth', size: 12742, unit: 'ק״מ', color: '#34d399', description: '12,742 ק״מ' },
  { label: 'מערכת השמש', labelEn: 'Solar System', size: 9e9, unit: 'ק״מ', color: '#fbbf24', description: '9 מיליארד ק״מ' },
  { label: 'שביל החלב', labelEn: 'Milky Way', size: 1e18, unit: 'ק״מ', color: '#a78bfa', description: '100,000 שנות אור' },
  { label: 'היקום הנצפה', labelEn: 'Observable Universe', size: 8.8e23, unit: 'ק״מ', color: '#f97316', description: '93 מיליארד שנות אור' },
];

const ScaleUniverse = () => {
  const [scaleIndex, setScaleIndex] = useState(0);

  const current = scales[scaleIndex];

  const ringCount = scaleIndex + 2;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* animated rings */}
        {Array.from({ length: ringCount }).map((_, i) => (
          <motion.div
            key={`${scaleIndex}-${i}`}
            className="absolute rounded-full border"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 - i * 0.06 }}
            transition={{ duration: 0.6, delay: i * 0.08, type: 'spring' }}
            style={{
              width: `${(i + 1) * (200 / ringCount)}px`,
              height: `${(i + 1) * (200 / ringCount)}px`,
              borderColor: current.color,
              borderWidth: 1,
            }}
          />
        ))}

        {/* center dot */}
        <motion.div
          key={scaleIndex}
          className="relative z-10 rounded-full flex items-center justify-center text-xs font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={{
            width: 60,
            height: 60,
            background: `radial-gradient(circle, ${current.color}cc, ${current.color}44)`,
            boxShadow: `0 0 20px ${current.color}88`,
          }}
        >
          <span className="text-white text-center leading-tight text-xs">{current.label}</span>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={scaleIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center"
        >
          <div className="text-2xl font-bold mb-1" style={{ color: current.color }}>
            {current.description}
          </div>
          <div className="text-sm text-blue-300/60">{current.labelEn}</div>
        </motion.div>
      </AnimatePresence>

      {/* scale selector */}
      <div className="flex gap-2 flex-wrap justify-center">
        {scales.map((s, i) => (
          <button
            key={i}
            onClick={() => setScaleIndex(i)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              background: scaleIndex === i ? s.color : 'transparent',
              color: scaleIndex === i ? '#0a0e1a' : s.color,
              border: `1px solid ${s.color}60`,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-blue-300/50 text-center max-w-xs">
        לחץ על כל סולם כדי לזום לתוך היקום
      </p>
    </div>
  );
};

export default ScaleUniverse;
