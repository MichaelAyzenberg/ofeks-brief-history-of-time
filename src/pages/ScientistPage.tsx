import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { getScientistById } from '../data/scientists';
import { concepts } from '../data/concepts';

const ScientistPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scientist = getScientistById(id || '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!scientist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🔬</div>
          <div className="text-white text-lg font-bold">מדען לא נמצא</div>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-400 text-sm mt-2 block mx-auto"
          >
            חזרה
          </button>
        </div>
      </div>
    );
  }

  const relatedConcepts = concepts.filter((c) =>
    scientist.relatedConceptIds.includes(c.id)
  );

  return (
    <div className="min-h-screen max-w-lg mx-auto pb-10">
      {/* Header gradient background */}
      <div
        className="relative px-4 pt-6 pb-8"
        style={{
          background: `linear-gradient(180deg, ${scientist.color}25 0%, transparent 100%)`,
          borderBottom: `1px solid ${scientist.color}30`,
        }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-400/60 hover:text-blue-400 text-sm transition-colors mb-6 flex items-center gap-1"
        >
          → חזרה
        </button>

        {/* Avatar + Names */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-4"
            style={{
              background: `${scientist.color}20`,
              border: `2px solid ${scientist.color}50`,
              boxShadow: `0 0 40px ${scientist.color}40, 0 0 80px ${scientist.color}15`,
            }}
          >
            {scientist.emoji}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl font-black text-white mb-1">{scientist.nameHe}</h1>
            <div className="text-sm text-blue-300/50 mb-3">{scientist.nameEn}</div>

            {/* Badges */}
            <div className="flex gap-2 justify-center flex-wrap mb-3">
              <span
                className="text-xs px-3 py-1 rounded-full border font-medium"
                style={{ background: `${scientist.color}20`, borderColor: `${scientist.color}40`, color: scientist.color }}
              >
                {scientist.years}
              </span>
              <span className="text-xs px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300">
                {scientist.nationality}
              </span>
              {scientist.nobelYear && (
                <span className="text-xs px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
                  🏅 נובל {scientist.nobelYear}
                </span>
              )}
            </div>

            {/* Tagline */}
            <p className="text-sm font-medium" style={{ color: scientist.color }}>
              {scientist.taglineHe}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 space-y-4">

        {/* Discovery */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl p-5 border"
          style={{
            background: `linear-gradient(135deg, ${scientist.color}12, #1a2040)`,
            borderColor: `${scientist.color}40`,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔭</span>
            <span className="text-sm font-bold" style={{ color: scientist.color }}>הגילוי הגדול</span>
          </div>
          <p className="text-sm text-blue-100 leading-relaxed">{scientist.discoveryHe}</p>
        </motion.div>

        {/* Hawking Connection */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-4 border border-blue-500/20"
          style={{ background: 'rgba(96,165,250,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📖</span>
            <span className="text-sm font-bold text-blue-300/70">הקשר לספר של הוקינג</span>
          </div>
          <p className="text-sm text-blue-200/70 leading-relaxed">{scientist.hawkingConnectionHe}</p>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl p-4 border border-white/10"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">👤</span>
            <span className="text-sm font-bold text-blue-300/60">הסיפור האישי</span>
          </div>
          <p className="text-sm text-blue-200/70 leading-relaxed">{scientist.bioHe}</p>
        </motion.div>

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-4 border"
          style={{ borderColor: `${scientist.color}30`, background: `${scientist.color}08` }}
        >
          <div className="text-sm font-bold mb-2" style={{ color: scientist.color }}>
            🤯 עובדה מדהימה
          </div>
          <p className="text-sm text-blue-200/80 leading-relaxed">{scientist.funFactHe}</p>
        </motion.div>

        {/* Quote */}
        {scientist.quoteHe && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl p-4 border border-white/10"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <div className="text-xs font-bold text-blue-300/50 mb-2">ציטוט מפורסם</div>
            <p className="text-sm text-blue-300/70 leading-relaxed italic">{scientist.quoteHe}</p>
            <div className="text-xs text-blue-400/40 mt-2">— {scientist.nameHe}</div>
          </motion.div>
        )}

        {/* Related Concepts */}
        {relatedConcepts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-xs font-bold text-blue-300/50 mb-3">עולמות קשורים</div>
            <div className="space-y-2">
              {relatedConcepts.map((concept) => (
                <Link key={concept.id} to={`/concept/${concept.slug}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer"
                    style={{
                      background: `${concept.color}10`,
                      borderColor: `${concept.color}30`,
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: `${concept.color}20` }}
                    >
                      {concept.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold" style={{ color: concept.color }}>
                        {concept.titleHe}
                      </div>
                      <div className="text-xs text-blue-300/40 truncate">{concept.chapterLabel}</div>
                    </div>
                    <div className="text-blue-400/40 text-xs flex-shrink-0">←</div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScientistPage;
