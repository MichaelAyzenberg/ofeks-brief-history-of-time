import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBook } from '../context/BookContext';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../hooks/useProgress';

const Journey = () => {
  const { concepts, progressKey, isNewton } = useBook();
  const { C } = useTheme();
  const { isVisited, isFavorite, visitedCount } = useProgress(progressKey);
  const sorted = [...concepts].sort((a, b) => a.chapterNumber - b.chapterNumber);
  const nextIndex = sorted.findIndex((c) => !isVisited(c.id));

  const title = isNewton ? 'Guided Journey' : 'מסע מודרך';
  const subtitle = isNewton
    ? "Follow Newton's Principia book by book"
    : 'עקוב אחרי ספר הוקינג פרק אחר פרק';
  const accentColor = isNewton ? '#f59e0b' : '#60a5fa';

  return (
    <div className="min-h-screen px-4 pt-8 pb-4 max-w-lg mx-auto">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-black text-white mb-1">{title}</h1>
        <p className="text-blue-300/60 text-sm">{subtitle}</p>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 h-1.5 rounded-full" style={{ background: C.border + '60' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(visitedCount / sorted.length) * 100}%`, background: accentColor }}
            />
          </div>
          <span className="text-xs text-blue-300/60">{visitedCount}/{sorted.length}</span>
        </div>
      </motion.div>

      <div className="relative">
        <div className="absolute right-6 top-0 bottom-0 w-0.5" style={{ background: C.border + '60' }} />

        <div className="space-y-3">
          {sorted.map((concept, i) => {
            const visited = isVisited(concept.id);
            const fav = isFavorite(concept.id);
            const isNext = i === nextIndex;

            return (
              <motion.div
                key={concept.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link to={`/concept/${concept.slug}`}>
                  <div
                    className="relative mr-14 rounded-2xl p-4 border transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      background: visited
                        ? `linear-gradient(135deg, ${concept.color}18, ${C.card2})`
                        : C.cardGrad,
                      borderColor: visited
                        ? concept.color + '60'
                        : isNext ? concept.color + '80' : C.border,
                      boxShadow: isNext ? `0 0 0 1px ${concept.color}60` : undefined,
                    }}
                  >
                    {/* chapter marker */}
                    <div
                      className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                      style={{
                        background: visited ? concept.color : C.bg,
                        borderColor: concept.color,
                        color: visited ? '#0a0e1a' : concept.color,
                        zIndex: 10,
                      }}
                    >
                      {visited ? '✓' : concept.chapterNumber}
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{concept.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-blue-300/40">{concept.chapterLabel}</span>
                          {fav && <span className="text-yellow-400 text-xs">★</span>}
                          {isNext && !visited && (
                            <span
                              className="text-xs px-1.5 py-0.5 rounded-full"
                              style={{ background: `${concept.color}20`, color: concept.color }}
                            >
                              {isNewton ? 'next' : 'הבא'}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm mt-0.5" style={{ color: concept.color }}>
                          {concept.titleHe}
                        </h3>
                        <p className="text-xs text-blue-300/50 mt-1 line-clamp-1">{concept.layer1He}</p>
                        {concept.isAbstract && (
                          <span className="text-xs text-orange-400/60 mt-0.5 block">
                            {isNewton ? '⚡ Advanced' : '⚡ מושג מתקדם'}
                          </span>
                        )}
                      </div>
                      {visited && (
                        <div
                          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: concept.color }}
                        >
                          <span className="text-xs text-black font-bold">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {visitedCount === sorted.length && (
        <motion.div
          className="mt-6 p-5 rounded-2xl text-center border border-yellow-500/30"
          style={{ background: C.cardGrad }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-yellow-400 font-bold text-lg">
            {isNewton ? 'Journey Complete!' : 'השלמת את המסע!'}
          </div>
          <div className="text-blue-300/60 text-xs mt-1">
            {isNewton
              ? "You've explored all of Newton's Principia."
              : 'חקרת את כל עולמות הוקינג'}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Journey;
