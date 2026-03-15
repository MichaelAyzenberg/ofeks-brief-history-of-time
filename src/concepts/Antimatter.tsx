import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type State = 'idle' | 'approaching' | 'annihilating' | 'annihilated';

const Antimatter = () => {
  const [gameState, setGameState] = useState<State>('idle');
  const [energy, setEnergy] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAnnihilation = () => {
    if (gameState !== 'idle') return;
    setGameState('approaching');
    timerRef.current = setTimeout(() => {
      setGameState('annihilating');
      timerRef.current = setTimeout(() => {
        setGameState('annihilated');
        setEnergy((e) => e + 1);
        timerRef.current = setTimeout(() => {
          setGameState('idle');
        }, 2000);
      }, 800);
    }, 1500);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const electronX = gameState === 'idle' ? 40 : gameState === 'approaching' ? 120 : 140;
  const positronX = gameState === 'idle' ? 240 : gameState === 'approaching' ? 160 : 140;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-64 h-48 rounded-xl overflow-hidden"
        style={{ background: 'rgba(26,32,64,0.8)', border: '1px solid #2a356060' }}>

        <AnimatePresence>
          {gameState === 'annihilating' || gameState === 'annihilated' ? (
            <motion.div
              key="flash"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 1, 0.5, 0], scale: [0.3, 2, 3] }}
              transition={{ duration: 1.2 }}
            >
              <div className="w-40 h-40 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #fffbeb, #fbbf24, #f97316, transparent)',
                  filter: 'blur(10px)',
                }} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* photon lines after annihilation */}
        <AnimatePresence>
          {gameState === 'annihilated' && (
            <>
              {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dy], i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-8 rounded-full"
                  style={{
                    background: '#fbbf24',
                    left: '50%',
                    top: '50%',
                    transformOrigin: 'top center',
                    rotate: `${i * 90 + 45}deg`,
                  }}
                  initial={{ scaleY: 0, opacity: 1 }}
                  animate={{ scaleY: [0, 3], opacity: [1, 0], x: dx * 40, y: dy * 40 }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Electron */}
        {gameState !== 'annihilating' && gameState !== 'annihilated' && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            animate={{ x: electronX }}
            transition={{ duration: gameState === 'approaching' ? 1.5 : 0 }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(circle, #60a5fa, #1d4ed8)', boxShadow: '0 0 12px #60a5fa' }}>
              <span className="text-white text-xs font-bold">e⁻</span>
            </div>
            <div className="text-center text-xs text-blue-400 mt-1 whitespace-nowrap">אלקטרון</div>
          </motion.div>
        )}

        {/* Positron */}
        {gameState !== 'annihilating' && gameState !== 'annihilated' && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            animate={{ x: positronX - 40 }}
            transition={{ duration: gameState === 'approaching' ? 1.5 : 0 }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(circle, #ec4899, #9d174d)', boxShadow: '0 0 12px #ec4899' }}>
              <span className="text-white text-xs font-bold">e⁺</span>
            </div>
            <div className="text-center text-xs text-pink-400 mt-1 whitespace-nowrap">פוזיטרון</div>
          </motion.div>
        )}

        {gameState === 'annihilated' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center">
              <div className="text-2xl">🌟</div>
              <div className="text-xs text-yellow-400 font-bold">אנרגיה טהורה!</div>
              <div className="text-xs text-yellow-300/60">E = mc²</div>
            </div>
          </motion.div>
        )}

        {/* labels */}
        {gameState === 'idle' && (
          <>
            <div className="absolute bottom-2 left-3 text-xs text-blue-300/40">חומר</div>
            <div className="absolute bottom-2 right-3 text-xs text-pink-300/40">אנטי-חומר</div>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={startAnnihilation}
          disabled={gameState !== 'idle'}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: gameState === 'idle' ? 'linear-gradient(135deg, #ec4899, #7c3aed)' : '#1a2040',
            color: gameState === 'idle' ? 'white' : '#4a5a80',
            cursor: gameState === 'idle' ? 'pointer' : 'not-allowed',
          }}
        >
          {gameState === 'idle' ? 'גרום לבטול!' : gameState === 'approaching' ? 'מתקרבים...' : gameState === 'annihilating' ? 'בּוּם! 💥' : 'אנרגיה! ✨'}
        </button>

        {energy > 0 && (
          <div className="text-xs text-yellow-400">
            ⚡ אנרגיה: ×{energy}
          </div>
        )}
      </div>

      <p className="text-xs text-blue-300/50 text-center max-w-xs">
        כשאלקטרון פוגש פוזיטרון (האנטי-אלקטרון), שניהם נעלמים ומשחררים שני פוטוני גמא – אנרגיה טהורה!
      </p>
    </div>
  );
};

export default Antimatter;
