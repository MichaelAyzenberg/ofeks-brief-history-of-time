import { useState } from 'react';
import { motion } from 'framer-motion';
import { concepts } from '../data/concepts';
import { useProgress } from '../hooks/useProgress';
import ConceptCard from '../components/ConceptCard';

const categories = [
  { id: 'all', label: 'הכל' },
  { id: 'space', label: 'מרחב וכוכבים', ids: ['scale-universe', 'space-time', 'curved-spacetime', 'expanding-universe', 'stars-collapse', 'black-holes', 'wormholes'] },
  { id: 'quantum', label: 'קוונטים', ids: ['uncertainty-principle', 'particles-forces', 'antimatter', 'hawking-radiation'] },
  { id: 'big', label: 'שאלות גדולות', ids: ['arrow-of-time', 'unification'] },
  { id: 'abstract', label: 'מושגים מתקדמים', ids: concepts.filter((c) => c.isAbstract).map((c) => c.id) },
];

const ExploreMap = () => {
  const { isVisited, isFavorite } = useProgress();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const activeCategory = categories.find((c) => c.id === filter);
  const filtered = concepts.filter((c) => {
    const matchCategory =
      filter === 'all' || (activeCategory?.ids && activeCategory.ids.includes(c.id));
    const matchSearch =
      !search ||
      c.titleHe.includes(search) ||
      c.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      c.layer1He.includes(search);
    return matchCategory && matchSearch;
  });

  const visited = filtered.filter((c) => isVisited(c.id)).length;

  return (
    <div className="min-h-screen px-4 pt-8 pb-4 max-w-lg mx-auto">
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-black text-white mb-1">חקירה חופשית</h1>
        <p className="text-blue-300/60 text-sm">13 עולמות לגלות – בחר לאן ללכת</p>

        {/* Search */}
        <div className="relative mt-3">
          <input
            type="text"
            placeholder="חפש מושג..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-blue-300/30 outline-none focus:border-blue-500/50 transition-all"
            dir="rtl"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/40 hover:text-blue-300"
            >
              ×
            </button>
          )}
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border"
            style={{
              background: filter === cat.id ? '#3b82f6' : 'transparent',
              borderColor: filter === cat.id ? '#3b82f6' : '#2a356060',
              color: filter === cat.id ? 'white' : '#7a8ab0',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      {!search && (
        <div className="text-xs text-blue-300/40 mb-3">
          {visited}/{filtered.length} נחקרו בקטגוריה זו
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {filtered.map((concept, i) => (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <ConceptCard
                concept={concept}
                isVisited={isVisited(concept.id)}
                isFavorite={isFavorite(concept.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 text-blue-300/30">
          <div className="text-4xl mb-2">🔭</div>
          <div className="text-sm">לא נמצאו תוצאות</div>
        </div>
      )}
    </div>
  );
};

export default ExploreMap;
