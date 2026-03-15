import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { concepts } from '../data/concepts';
import { useProgress } from '../hooks/useProgress';

const ParentMode = () => {
  const { isVisited, visitedCount } = useProgress();
  const visited = concepts.filter((c) => isVisited(c.id));
  const total = concepts.length;

  return (
    <div className="min-h-screen px-4 pt-8 pb-4 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">👨‍👩‍👧</span>
          <div>
            <h1 className="text-2xl font-black text-white">מצב הורים</h1>
            <p className="text-purple-300/60 text-sm">מדריך לליווי אופק בחוויה</p>
          </div>
        </div>
      </motion.div>

      {/* About the app */}
      <motion.div
        className="rounded-2xl p-5 mb-4 border border-purple-500/30"
        style={{ background: 'linear-gradient(135deg, #2d1b4e30, #1a2040)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-purple-300 font-bold mb-2">על האפליקציה</h2>
        <p className="text-purple-200/70 text-sm leading-relaxed">
          אפליקציה זו עוצבה עבור אופק לחקור את "היסטוריה קצרה של הזמן" של סטיבן הוקינג.
          היא מחולקת ל-13 עולמות מושגיים, עם הסברים בעברית פשוטה, ויזואליזציות אינטראקטיביות,
          ושכבת הורים עם הנחיות לשיחה.
        </p>
      </motion.div>

      {/* Progress summary */}
      <motion.div
        className="rounded-2xl p-5 mb-4 border border-blue-800/40"
        style={{ background: 'linear-gradient(135deg, #1a2040, #141830)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-blue-300 font-bold mb-3">התקדמות אופק</h2>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-black text-blue-400">{visitedCount}/{total}</div>
          <div>
            <div className="text-sm text-white">עולמות נחקרו</div>
            <div className="text-xs text-blue-300/50">{Math.round((visitedCount / total) * 100)}% מהספר</div>
          </div>
        </div>
        {visited.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visited.map((c) => (
              <span key={c.id} className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: c.color + '20', color: c.color, border: `1px solid ${c.color}40` }}>
                {c.emoji} {c.titleHe}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Tips */}
      <motion.div
        className="rounded-2xl p-5 mb-4 border border-green-500/20"
        style={{ background: 'rgba(16,185,129,0.06)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-green-400 font-bold mb-3">💡 טיפים לחוויה טובה</h2>
        <ul className="space-y-2">
          {[
            'בכל עולם מושגי יש טאב "הורים" עם מדריך ספציפי לאותו מושג',
            'המושגים המסומנים ⚡ מתקדמים – אל תלחצו אם הילד לא מוכן',
            'העודדו את אופק לשחק עם הסליידרים וכפתורים האינטראקטיביים',
            'שאלות הוריות בכל עולם יכולות לשמש כנקודת פתיחה לשיחה',
            'המסע המודרך (🚀) עוקב אחרי הסדר המקורי של הספר',
          ].map((tip, i) => (
            <li key={i} className="flex gap-2 text-sm text-green-200/70">
              <span className="text-green-400 flex-shrink-0">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Per-concept parent guides */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h2 className="text-sm font-bold text-blue-300/60 mb-3">מדריכי הורים לכל עולם</h2>
        <div className="space-y-2">
          {concepts.map((c) => (
            <Link key={c.id} to={`/concept/${c.slug}`}>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:bg-white/5 transition-all">
                <span className="text-xl flex-shrink-0">{c.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: c.color }}>{c.titleHe}</div>
                  <div className="text-xs text-blue-300/40 truncate">{c.parentGuideHe.slice(0, 60)}...</div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {c.isAbstract && <span className="text-xs text-orange-400">⚡</span>}
                  {isVisited(c.id) && <span className="text-xs text-green-400">✓</span>}
                  <span className="text-blue-400 text-xs">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* About Hawking */}
      <motion.div
        className="mt-5 p-4 rounded-2xl border border-white/10"
        style={{ background: 'rgba(255,255,255,0.03)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-sm font-bold text-white mb-2">על הספר</h2>
        <p className="text-xs text-blue-300/50 leading-relaxed">
          "היסטוריה קצרה של הזמן" פורסם ב-1988 ונמכר ביותר מ-25 מיליון עותקים.
          הוקינג כתב אותו במטרה להסביר את הפיזיקה המודרנית לקהל הרחב.
          הספר עוסק בקוסמולוגיה, תורת הקוונטים, תיאוריית המיתרים, והחיפוש אחרי "תיאוריית הכל".
        </p>
      </motion.div>
    </div>
  );
};

export default ParentMode;
