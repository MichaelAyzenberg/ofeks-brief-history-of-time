import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBook, type BookId } from '../context/BookContext';
import StarField from '../components/StarField';

const books = [
  {
    id: 'hawking' as BookId,
    title: 'היסטוריה קצרה של הזמן',
    titleEn: "A Brief History of Time",
    author: 'סטיבן הוקינג',
    authorEn: 'Stephen Hawking',
    subtitle: 'עם אופק',
    subtitleEn: 'For Ofek',
    emoji: '🌌',
    description: 'מסע מודרך דרך 13 עולמות של פיזיקה מודרנית — עבור ילדים סקרנים',
    descriptionEn: 'A guided journey through 13 worlds of modern physics — for curious kids',
    color: '#60a5fa',
    gradient: 'linear-gradient(135deg, #1e3a5f, #141830)',
    border: '#60a5fa40',
    tag: '🇮🇱 עברית · ילדים',
    concepts: 13,
  },
  {
    id: 'newton' as BookId,
    title: "Newton's Principia",
    titleEn: 'Philosophiæ Naturalis Principia Mathematica',
    author: 'Isaac Newton',
    authorEn: '1687',
    subtitle: 'For Michael',
    subtitleEn: 'MSc Systems Engineering · BSc Mechanical Engineering',
    emoji: '⚖️',
    description: 'Ten key concepts from all three Books of the Principia — for engineers who want the original.',
    descriptionEn: 'Laws of motion, orbital mechanics, fluid resistance, gravity — from Newton\'s own mathematical framework.',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #3d2200, #1a1200)',
    border: '#f59e0b40',
    tag: '🇬🇧 English · Adult',
    concepts: 10,
  },
];

const BookSelect = () => {
  const { setBook, bookId } = useBook();
  const navigate = useNavigate();

  const handleSelect = (id: BookId) => {
    setBook(id);
    navigate('/home');
  };

  return (
    <div className="min-h-screen relative" style={{ background: '#0a0e1a' }}>
      <StarField />
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
              className="w-full text-left rounded-2xl p-5 border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: book.gradient,
                borderColor: bookId === book.id ? book.color : book.border,
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
                    boxShadow: `0 0 15px ${book.color}20`,
                  }}
                >
                  {book.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: `${book.color}15`,
                        color: book.color,
                        border: `1px solid ${book.color}30`,
                      }}
                    >
                      {book.tag}
                    </span>
                    {bookId === book.id && (
                      <span className="text-xs text-green-400 font-medium">✓ active</span>
                    )}
                  </div>

                  <h2
                    className="text-lg font-black leading-tight mb-0.5"
                    style={{ color: book.color }}
                  >
                    {book.title}
                  </h2>
                  <p className="text-xs text-blue-300/50 mb-1">{book.author}</p>
                  <p className="text-xs text-blue-300/40 italic mb-2">{book.subtitle}</p>
                  <p className="text-xs text-blue-200/60 leading-relaxed">
                    {book.description}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-blue-300/30">
                      {book.concepts} concepts
                    </span>
                    <span className="text-xs font-bold" style={{ color: book.color }}>
                      Open →
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          className="mt-8 text-xs text-blue-300/25 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          You can switch books anytime from the home screen
        </motion.p>
      </div>
    </div>
  );
};

export default BookSelect;
