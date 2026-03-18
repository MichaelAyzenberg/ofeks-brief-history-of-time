import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBook } from '../context/BookContext';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../hooks/useProgress';
import ConceptCard from '../components/ConceptCard';

const hawkingCategories = [
  { id: 'all', label: 'הכל' },
  { id: 'space', label: 'מרחב וכוכבים', ids: ['scale-universe', 'space-time', 'curved-spacetime', 'expanding-universe', 'stars-collapse', 'black-holes', 'wormholes'] },
  { id: 'quantum', label: 'קוונטים', ids: ['uncertainty-principle', 'particles-forces', 'antimatter', 'hawking-radiation'] },
  { id: 'big', label: 'שאלות גדולות', ids: ['arrow-of-time', 'unification'] },
];

const newtonCategories = [
  { id: 'all', label: 'All' },
  { id: 'book1', label: 'Book I — Mechanics', ids: ['laws-of-motion', 'absolute-space-time', 'method-of-ratios', 'centripetal-force'] },
  { id: 'book2', label: 'Book II — Fluids', ids: ['fluid-resistance', 'speed-of-sound'] },
  { id: 'book3', label: 'Book III — World', ids: ['universal-gravitation', 'moon-test', 'figure-of-earth', 'cometary-orbits'] },
  { id: 'advanced', label: 'Advanced' },
];

const ExploreMap = () => {
  const { concepts, progressKey, isNewton } = useBook();
  const { isDark, C } = useTheme();
  const { isVisited, isFavorite } = useProgress(progressKey);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const categories = isNewton ? newtonCategories : hawkingCategories;
  const accentColor = isNewton ? '#f59e0b' : '#3b82f6';

  const activeCategory = categories.find((c) => c.id === filter);
  const filtered = concepts.filter((c) => {
    let matchCategory = false;
    if (filter === 'all') matchCategory = true;
    else if (filter === 'advanced') matchCategory = c.isAbstract;
    else if (activeCategory?.ids) matchCategory = activeCategory.ids.includes(c.id);

    const matchSearch =
      !search ||
      c.titleHe.toLowerCase().includes(search.toLowerCase()) ||
      c.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      c.layer1He.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  const visited = filtered.filter((c) => isVisited(c.id)).length;

  const title = isNewton ? 'Free Exploration' : 'חקירה חופשית';
  const subtitle = isNewton
    ? `${concepts.length} concepts — choose where to go`
    : `${concepts.length} עולמות לגלות – בחר לאן ללכת`;
  const searchPlaceholder = isNewton ? 'Search concept...' : 'חפש מושג...';

  return (
    <div className="min-h-screen px-4 pt-8 pb-4 max-w-lg mx-auto">
      <motion.div className="mb-5" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-white mb-1">{title}</h1>
        <p className="text-blue-300/60 text-sm">{subtitle}</p>

        <div className="relative mt-3">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm border text-white outline-none transition-all"
            style={{
              background: C.inputBg,
              borderColor: C.border + '60',
              color: isDark ? '#c8d4f0' : '#1e2a4a',
            }}
            dir={isNewton ? 'ltr' : 'rtl'}
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
              background: filter === cat.id ? accentColor : 'transparent',
              borderColor: filter === cat.id ? accentColor : C.border + '60',
              color: filter === cat.id ? 'white' : isDark ? '#7a8ab0' : '#4b5563',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {!search && (
        <div className="text-xs text-blue-300/40 mb-3">
          {visited}/{filtered.length} {isNewton ? 'explored in this category' : 'נחקרו בקטגוריה זו'}
        </div>
      )}

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
          <div className="text-sm">{isNewton ? 'No results' : 'לא נמצאו תוצאות'}</div>
        </div>
      )}
    </div>
  );
};

export default ExploreMap;
