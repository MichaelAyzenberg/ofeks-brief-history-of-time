import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { scientists } from '../data/scientists';

const eras = [
  { id: 'all', label: 'הכל' },
  { id: 'ancient', label: 'עתיקים' },
  { id: 'classical', label: 'קלאסיים' },
  { id: 'modern', label: 'מודרניים' },
  { id: 'nobel', label: '🏅 נובל' },
];

function getEra(years: string): string {
  if (years.includes('לפנה"ס')) return 'ancient';
  const match = years.match(/(\d{4})/);
  if (!match) return 'modern';
  const year = parseInt(match[1]);
  if (year < 1850) return 'classical';
  return 'modern';
}

const Scientists = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = scientists.filter((s) => {
    const matchEra =
      filter === 'all' ||
      (filter === 'nobel' ? !!s.nobelYear : getEra(s.years) === filter);
    const matchSearch =
      !search ||
      s.nameHe.includes(search) ||
      s.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      s.taglineHe.includes(search);
    return matchEra && matchSearch;
  });

  return (
    <div className="min-h-screen max-w-lg mx-auto px-4 pt-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-black text-white mb-1">המדענים</h1>
        <p className="text-xs text-blue-300/50">
          {scientists.length} מדענים שעיצבו את הפיזיקה
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חפש מדען..."
          className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-blue-300/30 outline-none border border-blue-900/40"
          style={{ background: 'rgba(255,255,255,0.05)', direction: 'rtl' }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/40 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Era filters */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
        {eras.map((era) => (
          <button
            key={era.id}
            onClick={() => setFilter(era.id)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all duration-200 font-medium"
            style={
              filter === era.id
                ? { background: '#60a5fa30', borderColor: '#60a5fa60', color: '#60a5fa' }
                : { background: 'transparent', borderColor: '#ffffff15', color: '#7a8ab0' }
            }
          >
            {era.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="text-xs text-blue-300/40 mb-3">
        {filtered.length} מדענים
      </div>

      {/* Grid */}
      <div className="space-y-2 pb-4">
        {filtered.map((scientist, i) => (
          <motion.div
            key={scientist.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ scale: 1.01, x: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/scientist/${scientist.id}`)}
            className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer"
            style={{
              background: `${scientist.color}08`,
              borderColor: `${scientist.color}25`,
            }}
          >
            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{
                background: `${scientist.color}18`,
                border: `1px solid ${scientist.color}35`,
                boxShadow: `0 0 12px ${scientist.color}18`,
              }}
            >
              {scientist.emoji}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-bold text-white leading-tight">
                  {scientist.nameHe}
                </span>
                {scientist.nobelYear && (
                  <span className="text-xs text-yellow-400/80">🏅</span>
                )}
              </div>
              <div
                className="text-xs truncate mb-0.5"
                style={{ color: scientist.color + 'cc' }}
              >
                {scientist.taglineHe}
              </div>
              <div className="text-xs text-blue-300/35">
                {scientist.years} · {scientist.nationality}
              </div>
            </div>

            <div className="text-blue-400/30 text-xs flex-shrink-0">←</div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-blue-300/30">
          <div className="text-3xl mb-2">🔭</div>
          <div className="text-sm">לא נמצאו מדענים</div>
        </div>
      )}
    </div>
  );
};

export default Scientists;
