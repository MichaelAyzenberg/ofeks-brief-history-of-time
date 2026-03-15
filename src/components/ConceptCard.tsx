import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { type Concept } from '../data/concepts';

interface ConceptCardProps {
  concept: Concept;
  isVisited?: boolean;
  isFavorite?: boolean;
  chapterNumber?: boolean;
  compact?: boolean;
}

const ConceptCard = ({
  concept,
  isVisited = false,
  isFavorite = false,
  chapterNumber = true,
  compact = false,
}: ConceptCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        to={`/concept/${concept.slug}`}
        className={`block rounded-2xl border transition-all duration-200 relative overflow-hidden ${
          compact ? 'p-3' : 'p-5'
        }`}
        style={{
          background: `linear-gradient(135deg, #1a2040, #141830)`,
          borderColor: isVisited ? concept.color + '60' : '#2a3560',
        }}
      >
        {/* glow effect */}
        <div
          className="absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-2xl"
          style={{ background: `radial-gradient(circle at 50% 50%, ${concept.color}, transparent 70%)` }}
        />

        <div className="relative">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={compact ? 'text-2xl' : 'text-3xl'}>{concept.emoji}</span>
              <div>
                {chapterNumber && (
                  <div className="text-xs font-medium opacity-50 mb-0.5">
                    פרק {concept.chapterNumber}
                  </div>
                )}
                <h3
                  className={`font-bold leading-tight ${compact ? 'text-sm' : 'text-base'}`}
                  style={{ color: concept.color }}
                >
                  {concept.titleHe}
                </h3>
                {!compact && (
                  <p className="text-xs text-blue-300/50 mt-0.5">{concept.titleEn}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {isFavorite && <span className="text-yellow-400 text-sm">★</span>}
              {isVisited && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: concept.color }}
                />
              )}
            </div>
          </div>

          {!compact && (
            <p className="mt-3 text-xs text-blue-200/60 leading-relaxed line-clamp-2">
              {concept.layer1He}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ConceptCard;
