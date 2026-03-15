import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { concepts } from '../data/concepts';
import { useProgress } from '../hooks/useProgress';
import ProgressBar from '../components/ProgressBar';

const Home = () => {
  const { visitedCount, favoriteCount, isVisited } = useProgress();
  const totalConcepts = concepts.length;
  const progressPct = (visitedCount / totalConcepts) * 100;

  const recentConcepts = concepts.slice(0, 4);

  return (
    <div className="min-h-screen px-4 pt-8 pb-4 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-5xl mb-3 animate-float">🌌</div>
        <h1 className="text-3xl font-black text-white mb-1 leading-tight">
          היסטוריה קצרה של הזמן
        </h1>
        <p className="text-blue-300/60 text-sm">עם אופק</p>
      </motion.div>

      {/* Progress card */}
      <motion.div
        className="rounded-2xl p-5 mb-5 border border-blue-800/40"
        style={{ background: 'linear-gradient(135deg, #1a2040, #141830)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-white font-bold text-lg">המסע שלך</div>
            <div className="text-blue-300/60 text-xs">
              {visitedCount} מתוך {totalConcepts} עולמות נחקרו
            </div>
          </div>
          <div className="text-3xl font-black text-blue-400">
            {Math.round(progressPct)}%
          </div>
        </div>
        <ProgressBar value={progressPct} color="#60a5fa" />

        <div className="flex gap-4 mt-3 text-xs text-blue-300/50">
          <span>⭐ {favoriteCount} מועדפים</span>
          <span>🔭 {visitedCount} שנחקרו</span>
          <span>📖 {totalConcepts - visitedCount} נותרו</span>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        className="grid grid-cols-2 gap-3 mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link to="/journey">
          <div className="rounded-2xl p-4 border border-blue-700/40 hover:border-blue-600/60 transition-all"
            style={{ background: 'linear-gradient(135deg, #1e3a5f, #1a2040)' }}>
            <div className="text-2xl mb-2">🚀</div>
            <div className="font-bold text-sm text-blue-300">מסע מודרך</div>
            <div className="text-xs text-blue-400/50 mt-0.5">מפרק 1 עד 13</div>
          </div>
        </Link>
        <Link to="/explore">
          <div className="rounded-2xl p-4 border border-purple-700/40 hover:border-purple-600/60 transition-all"
            style={{ background: 'linear-gradient(135deg, #2d1b4e, #1a2040)' }}>
            <div className="text-2xl mb-2">🗺️</div>
            <div className="font-bold text-sm text-purple-300">חקירה חופשית</div>
            <div className="text-xs text-purple-400/50 mt-0.5">בחר את העולם שלך</div>
          </div>
        </Link>
      </motion.div>

      {/* Concepts preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-base">עולמות לחקור</h2>
          <Link to="/explore" className="text-xs text-blue-400 hover:text-blue-300">
            כולם →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {recentConcepts.map((concept, i) => (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              <Link to={`/concept/${concept.slug}`}>
                <div
                  className="rounded-xl p-3 border transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${concept.color}15, #1a2040)`,
                    borderColor: isVisited(concept.id) ? concept.color + '60' : '#2a3560',
                  }}
                >
                  <div className="text-2xl mb-1">{concept.emoji}</div>
                  <div className="text-xs font-bold" style={{ color: concept.color }}>
                    {concept.titleHe}
                  </div>
                  <div className="text-xs text-blue-300/40 mt-0.5">פרק {concept.chapterNumber}</div>
                  {isVisited(concept.id) && (
                    <div className="text-xs text-green-400 mt-1">✓ נחקר</div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Hawking quote */}
      <motion.div
        className="mt-5 p-4 rounded-2xl border border-white/10"
        style={{ background: 'rgba(255,255,255,0.03)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-xs text-blue-300/50 italic leading-relaxed text-center">
          "זכור להסתכל על הכוכבים ולא למטה לרגליך. נסה להבין את מה שאתה רואה."
        </p>
        <p className="text-xs text-blue-300/30 text-center mt-1">– סטיבן הוקינג</p>
      </motion.div>
    </div>
  );
};

export default Home;
