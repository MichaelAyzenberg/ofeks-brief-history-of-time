import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBook, type BookId } from '../context/BookContext';
import { useTheme } from '../context/ThemeContext';
import StarField from '../components/StarField';

const books = [
  {
    id: 'hawking' as BookId,
    title: 'היסטוריה קצרה של הזמן',
    author: 'סטיבן הוקינג',
    subtitle: 'עם אופק',
    emoji: '🌌',
    description: 'מסע מודרך דרך 13 עולמות של פיזיקה מודרנית — עבור ילדים סקרנים',
    color: '#60a5fa',
    tag: '🇮🇱 עברית · ילדים',
    concepts: 13,
  },
  {
    id: 'newton' as BookId,
    title: "Newton's Principia",
    author: 'Isaac Newton · 1687',
    subtitle: 'For Michael',
    emoji: '⚖️',
    description: "Ten key concepts from all three Books — Laws of Motion, Orbital Mechanics, Fluid Resistance, Gravity — at engineer level.",
    color: '#f59e0b',
    tag: '🇬🇧 English · Adult',
    concepts: 10,
  },
];

const BookSelect = () => {
  const { setBook, bookId } = useBook();
  const { isDark, toggleTheme, C } = useTheme();
  const navigate = useNavigate();

  const handleSelect = (id: BookId) => {
    setBook(id);
    navigate('/home');
  };

  return (
    <div className="min-h-screen relative" style={{ background: C.bg, transition: 'background 0.3s ease' }}>
      {isDark && <StarField />}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">

        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-4xl mb-3">📚</div>
          <h1 className="text-2xl font-black text-white mb-2">בחר ספר</h1>
          <p className="text-blue-300/50 text-sm">Select your book · בחר את הספר שלך</p>
        </motion.div>

        {/* Book cards */}
        <div className="w-full max-w-sm space-y-4">
          {books.map((book, i) => (
            <motion.button
              key={book.id}
              onClick={() => handleSelect(book.id)}
              className="w-full text-left rounded-2xl p-5 border transition-all duration-200"
              style={{
                background: C.cardGrad,
                borderColor: bookId === book.id ? book.color : C.border,
                boxShadow: bookId === book.id ? `0 0 20px ${book.color}30` : undefined,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{
                    background: `${book.color}15`,
                    border: `1px solid ${book.color}40`,
                  }}
                >
                  {book.emoji}
                </div>

                <div className="flex-1 min-w-0" dir={book.id === 'newton' ? 'ltr' : 'rtl'}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: `${book.color}15`, color: book.color, border: `1px solid ${book.color}30` }}
                    >
                      {book.tag}
                    </span>
                    {bookId === book.id && (
                      <span className="text-xs text-green-400 font-medium">✓ active</span>
                    )}
                  </div>

                  <h2 className="text-lg font-black leading-tight mb-0.5" style={{ color: book.color }}>
                    {book.title}
                  </h2>
                  <p className="text-xs text-blue-300/50 mb-0.5">{book.author}</p>
                  <p className="text-xs text-blue-300/40 italic mb-2">{book.subtitle}</p>
                  <p className="text-xs text-blue-200/60 leading-relaxed">{book.description}</p>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-blue-300/30">{book.concepts} concepts</span>
                    <span className="text-xs font-bold" style={{ color: book.color }}>Open →</span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Theme toggle + footer */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all"
            style={{
              background: C.card,
              borderColor: C.border,
              color: isDark ? '#93c5fd' : '#2563eb',
            }}
          >
            <span>{isDark ? '☀️' : '🌙'}</span>
            <span>{isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}</span>
          </button>
          <p className="text-xs text-blue-300/25 text-center">
            You can also switch modes from the navigation bar
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BookSelect;
