import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBook } from '../context/BookContext';
import { useProgress } from '../hooks/useProgress';
import { useTheme } from '../context/ThemeContext';

const Progress = () => {
  const { C } = useTheme();
  const { concepts, progressKey, isNewton } = useBook();
  const { isVisited, isFavorite, visitedCount, favoriteCount, resetProgress } = useProgress(progressKey);
  const total = concepts.length;
  const pct = (visitedCount / total) * 100;

  const favorites = concepts.filter((c) => isFavorite(c.id));
  const visited = concepts.filter((c) => isVisited(c.id));
  const remaining = concepts.filter((c) => !isVisited(c.id));

  const handleReset = () => {
    const msg = isNewton
      ? 'Reset all progress for Newton\'s Principia?'
      : 'האם אתה בטוח שרוצה לאפס את כל ההתקדמות?';
    if (window.confirm(msg)) {
      resetProgress();
    }
  };

  const accentColor = isNewton ? '#f59e0b' : '#60a5fa';

  const hawkingBadges = [
    { label: 'סייר', desc: 'ביקר ב-1', emoji: '🌱', earned: visitedCount >= 1 },
    { label: 'חוקר', desc: 'ביקר ב-5', emoji: '🔭', earned: visitedCount >= 5 },
    { label: 'מדען', desc: 'ביקר ב-10', emoji: '🧪', earned: visitedCount >= 10 },
    { label: 'חלוץ', desc: 'ביקר בכולם', emoji: '🏆', earned: visitedCount >= 13 },
    { label: 'אוהב', desc: '3 מועדפים', emoji: '⭐', earned: favoriteCount >= 3 },
    { label: 'קוונטי', desc: 'חקר אנטי-חומר', emoji: '⚛️', earned: isVisited('antimatter') },
  ];

  const newtonBadges = [
    { label: 'Student', desc: 'Read 1 concept', emoji: '📖', earned: visitedCount >= 1 },
    { label: 'Scholar', desc: 'Read 4 concepts', emoji: '🔭', earned: visitedCount >= 4 },
    { label: 'Natural Philosopher', desc: 'Read 7 concepts', emoji: '⚗️', earned: visitedCount >= 7 },
    { label: 'Principia Master', desc: 'Read all 10', emoji: '🏆', earned: visitedCount >= 10 },
    { label: 'Curator', desc: '3 saved', emoji: '⭐', earned: favoriteCount >= 3 },
    { label: 'Analyst', desc: 'Read Speed of Sound', emoji: '🔊', earned: isVisited('speed-of-sound') },
  ];

  const badges = isNewton ? newtonBadges : hawkingBadges;

  return (
    <div className="min-h-screen px-4 pt-8 pb-4 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-black text-white mb-1">
          {isNewton ? 'My Progress' : 'ההתקדמות שלי'}
        </h1>
        <p className="text-blue-300/60 text-sm">
          {isNewton
            ? `Newton's Principia — ${visitedCount} of ${total} concepts explored`
            : 'כמה יקום חקרת עד עכשיו'}
        </p>
      </motion.div>

      {/* Big progress ring */}
      <motion.div
        className="flex items-center gap-6 p-5 rounded-2xl border border-blue-800/40 mb-5"
        style={{ background: C.cardGrad }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="40" fill="none" stroke="#1a2040" strokeWidth="8" />
            <circle
              cx="48" cy="48" r="40"
              fill="none"
              stroke={accentColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-white">{Math.round(pct)}%</span>
          </div>
        </div>
        <div>
          <div className="text-lg font-bold text-white">
            {visitedCount} {isNewton ? 'concepts' : 'עולמות'}
          </div>
          <div className="text-sm text-blue-300/60">
            {isNewton ? `of ${total} explored` : `מתוך ${total} נחקרו`}
          </div>
          <div className="flex gap-3 mt-2 text-xs text-blue-300/50">
            <span>⭐ {favoriteCount} {isNewton ? 'saved' : 'מועדפים'}</span>
            <span>📖 {remaining.length} {isNewton ? 'left' : 'נותרו'}</span>
          </div>
        </div>
      </motion.div>

      {/* Achievement badges */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-sm font-bold text-blue-300/60 mb-3">
          {isNewton ? 'Achievements' : 'הישגים'}
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {badges.map((badge, i) => (
            <div
              key={i}
              className="rounded-xl p-3 text-center border transition-all"
              style={{
                background: badge.earned ? C.card : C.card2,
                borderColor: badge.earned ? accentColor + '40' : '#1a2040',
                opacity: badge.earned ? 1 : 0.4,
              }}
            >
              <div className="text-2xl mb-1">{badge.emoji}</div>
              <div className="text-xs font-bold text-white">{badge.label}</div>
              <div className="text-xs text-blue-300/40">{badge.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-bold text-blue-300/60 mb-3">
            ⭐ {isNewton ? 'Saved' : 'המועדפים שלי'}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {favorites.map((c) => (
              <Link key={c.id} to={`/concept/${c.slug}`}>
                <div className="rounded-xl p-3 border transition-all hover:scale-105"
                  style={{ background: `${c.color}15`, borderColor: c.color + '50' }}>
                  <span className="text-xl">{c.emoji}</span>
                  <div className="text-xs font-bold mt-1" style={{ color: c.color }}>{c.titleHe}</div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Visited list */}
      {visited.length > 0 && (
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="text-sm font-bold text-blue-300/60 mb-3">
            ✓ {isNewton ? 'Explored' : 'נחקרו'}
          </h2>
          <div className="space-y-1">
            {visited.map((c) => (
              <Link key={c.id} to={`/concept/${c.slug}`}>
                <div className="flex items-center gap-3 p-2.5 rounded-xl border border-white/5 hover:bg-white/5 transition-all">
                  <span className="text-lg">{c.emoji}</span>
                  <span className="text-sm text-blue-200/70 flex-1">{c.titleHe}</span>
                  <span className="text-xs text-green-400">✓</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Remaining */}
      {remaining.length > 0 && (
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-sm font-bold text-blue-300/60 mb-3">
            🔭 {isNewton ? 'Still to explore' : 'לגלות עוד'}
          </h2>
          <div className="space-y-1">
            {remaining.slice(0, 5).map((c) => (
              <Link key={c.id} to={`/concept/${c.slug}`}>
                <div className="flex items-center gap-3 p-2.5 rounded-xl border border-white/5 hover:bg-white/5 transition-all opacity-60">
                  <span className="text-lg">{c.emoji}</span>
                  <span className="text-sm text-blue-200/50 flex-1">{c.titleHe}</span>
                  <span className="text-xs text-blue-400">→</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Reset */}
      <motion.div
        className="mt-8 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="rounded-2xl p-4 border border-red-500/20"
          style={{ background: 'rgba(239,68,68,0.04)' }}>
          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl text-sm font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 active:scale-95 transition-all flex items-center justify-center gap-2"
            style={{ background: 'rgba(239,68,68,0.06)' }}
          >
            <span>🔄</span>
            <span>{isNewton ? 'Reset Progress' : 'איפוס התקדמות'}</span>
          </button>
          <p className="text-xs text-red-400/40 text-center mt-2">
            {isNewton
              ? 'This will clear all progress and saved concepts for this book'
              : 'פעולה זו תמחק את כל ההתקדמות והמועדפים'}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Progress;
