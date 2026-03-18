import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBook } from '../context/BookContext';
import { getScientistsByIds } from '../data/scientists';
import { useProgress } from '../hooks/useProgress';
import ConceptCard from '../components/ConceptCard';
import ScientistCard from '../components/ScientistCard';

// BookExample expandable component
const BookExample = ({ example, color }: { example: { title: string; text: string }; color: string }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="rounded-xl border overflow-hidden cursor-pointer"
      style={{ borderColor: color + '25', background: color + '06' }}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className="text-xs font-bold flex-1" style={{ color }}>{example.title}</span>
        <motion.span
          className="text-blue-400/50 text-xs flex-shrink-0"
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ←
        </motion.span>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-0">
              <p className="text-xs text-blue-200/70 leading-relaxed">{example.text}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Lazy load interactive concept visuals (Hawking book)
const ScaleUniverse = lazy(() => import('../concepts/ScaleUniverse'));
const SpaceTime = lazy(() => import('../concepts/SpaceTime'));
const CurvedSpacetime = lazy(() => import('../concepts/CurvedSpacetime'));
const ExpandingUniverse = lazy(() => import('../concepts/ExpandingUniverse'));
const UncertaintyPrinciple = lazy(() => import('../concepts/UncertaintyPrinciple'));
const ParticlesForces = lazy(() => import('../concepts/ParticlesForces'));
const Antimatter = lazy(() => import('../concepts/Antimatter'));
const StarsCollapse = lazy(() => import('../concepts/StarsCollapse'));
const BlackHoles = lazy(() => import('../concepts/BlackHoles'));
const HawkingRadiation = lazy(() => import('../concepts/HawkingRadiation'));
const ArrowOfTime = lazy(() => import('../concepts/ArrowOfTime'));
const Wormholes = lazy(() => import('../concepts/Wormholes'));
const Unification = lazy(() => import('../concepts/Unification'));

const conceptVisuals: Record<string, React.ComponentType> = {
  'scale-universe': ScaleUniverse,
  'space-time': SpaceTime,
  'curved-spacetime': CurvedSpacetime,
  'expanding-universe': ExpandingUniverse,
  'uncertainty-principle': UncertaintyPrinciple,
  'particles-forces': ParticlesForces,
  'antimatter': Antimatter,
  'stars-collapse': StarsCollapse,
  'black-holes': BlackHoles,
  'hawking-radiation': HawkingRadiation,
  'arrow-of-time': ArrowOfTime,
  'wormholes': Wormholes,
  'unification': Unification,
};

type TabId = 'explanation' | 'interactive' | 'deeper' | 'parent';

const ConceptWorld = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getConceptBySlug, getRelatedConcepts, progressKey, isNewton } = useBook();
  const concept = getConceptBySlug(slug || '');
  const { markVisited, toggleFavorite, isVisited, isFavorite } = useProgress(progressKey);
  const [activeTab, setActiveTab] = useState<TabId>('explanation');

  useEffect(() => {
    if (concept) {
      markVisited(concept.id);
      setActiveTab('explanation');
      window.scrollTo(0, 0);
    }
  }, [concept?.id]);

  if (!concept) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🔭</div>
          <div className="text-white text-lg font-bold">
            {isNewton ? 'Concept not found' : 'עולם לא נמצא'}
          </div>
          <Link to="/explore" className="text-blue-400 text-sm mt-2 block">
            {isNewton ? '← Back to Explore' : 'חזור לחקירה'}
          </Link>
        </div>
      </div>
    );
  }

  const related = getRelatedConcepts(concept);
  const Visual = conceptVisuals[concept.slug];
  const visited = isVisited(concept.id);
  const fav = isFavorite(concept.id);
  const conceptScientists = getScientistsByIds(concept.scientistIds || []);

  // Tab labels — English for Newton, Hebrew for Hawking
  const tabs: { id: TabId; label: string; emoji: string }[] = isNewton
    ? [
        { id: 'explanation', label: 'Overview', emoji: '💡' },
        { id: 'interactive', label: 'Visual', emoji: '🎮' },
        { id: 'deeper', label: 'Deep Dive', emoji: '🔭' },
        { id: 'parent', label: 'Context', emoji: '⚙️' },
      ]
    : [
        { id: 'explanation', label: 'מה זה?', emoji: '💡' },
        { id: 'interactive', label: 'נסה!', emoji: '🎮' },
        { id: 'deeper', label: 'עוד', emoji: '🔭' },
        { id: 'parent', label: 'הורים', emoji: '👨‍👩‍👧' },
      ];

  // Labels within content
  const L = {
    explanation: isNewton ? 'Introduction' : 'ההסבר',
    keyFacts: isNewton ? 'Key Facts' : 'עובדות מרכזיות',
    bookExamples: isNewton ? '📖 From the Book' : '📖 דוגמאות מהספר',
    funFact: isNewton ? '🤯 Remarkable Fact' : '🤯 עובדה מדהימה',
    quoteBy: isNewton ? 'Newton wrote' : 'הוקינג אמר',
    quoteAttrib: isNewton ? '— Isaac Newton' : '— סטיבן הוקינג',
    interactive: isNewton ? 'Interactive' : 'חקירה אינטראקטיבית',
    interactiveBtn: isNewton ? '🎮 Try it!' : '🎮 נסה בעצמך!',
    advancedDetails: isNewton ? 'Advanced Analysis' : 'פרטים נוספים',
    history: isNewton ? '📜 Historical Context' : '📜 ההיסטוריה',
    scientists: isNewton ? '🔬 Key Scientists' : '🔬 המדענים',
    related: isNewton ? 'Related Topics' : 'עולמות קשורים',
    contextMode: isNewton ? 'Engineering Context' : 'מצב הורים',
    contextTag1: isNewton ? '✓ Foundational' : '✓ נגיש לילדים',
    contextTagAdv: isNewton ? '⚠️ Advanced' : '⚠️ מושג מורכב',
    discussionPrompts: isNewton ? '💬 Discussion Questions' : '💬 שאלות לשיחה עם אופק',
    visited: isNewton ? '✓ Read' : '✓ נחקר',
    advanced: isNewton ? '⚡ Advanced' : '⚡ מתקדם',
    backLink: isNewton ? '← Back' : '← חזרה',
    chapterRef: isNewton
      ? `📖 ${concept.chapterLabel} — Newton's Principia Mathematica`
      : `📖 ${concept.chapterLabel} — "היסטוריה קצרה של הזמן" מאת סטיבן הוקינג`,
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto">
      {/* Header */}
      <div
        className="relative px-4 pt-6 pb-6"
        style={{
          background: `linear-gradient(180deg, ${concept.color}20 0%, transparent 100%)`,
          borderBottom: `1px solid ${concept.color}30`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <Link to="/explore" className="text-blue-400/60 hover:text-blue-400 text-sm transition-colors">
            {L.backLink}
          </Link>
          <button
            onClick={() => toggleFavorite(concept.id)}
            className="text-2xl transition-transform active:scale-125"
          >
            {fav ? '⭐' : '☆'}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{
              background: `${concept.color}20`,
              border: `1px solid ${concept.color}40`,
              boxShadow: `0 0 20px ${concept.color}30`,
            }}
          >
            {concept.emoji}
          </div>
          <div>
            <div className="text-xs text-blue-300/50 mb-0.5">{concept.chapterLabel}</div>
            <h1 className="text-2xl font-black text-white leading-tight">{concept.titleHe}</h1>
            <div className="text-xs text-blue-300/40 mt-0.5">{concept.titleEn}</div>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          {visited && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
              {L.visited}
            </span>
          )}
          {concept.isAbstract && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
              {L.advanced}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        className="sticky top-0 z-20 px-4 py-2"
        style={{ background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #2a356030' }}
      >
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl text-xs font-medium transition-all duration-200"
              style={{
                background: activeTab === tab.id ? concept.color + '20' : 'transparent',
                color: activeTab === tab.id ? concept.color : '#7a8ab0',
                border: activeTab === tab.id ? `1px solid ${concept.color}40` : '1px solid transparent',
              }}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4 py-5">
        <AnimatePresence mode="wait">
          {activeTab === 'explanation' && (
            <motion.div
              key="explanation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Main explanation card */}
              <div
                className="rounded-2xl p-5 mb-4 border"
                style={{
                  background: `linear-gradient(135deg, ${concept.color}12, #1a2040)`,
                  borderColor: concept.color + '40',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: concept.color }}>
                    <span className="text-xs text-black font-bold">1</span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: concept.color }}>{L.explanation}</span>
                </div>
                <p className="text-blue-100 text-sm leading-relaxed font-medium">
                  {concept.layer1He}
                </p>
              </div>

              {/* Key facts */}
              {concept.keyFacts && concept.keyFacts.length > 0 && (
                <div className="rounded-2xl p-4 mb-4 border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="text-xs font-bold mb-3" style={{ color: concept.color }}>{L.keyFacts}</div>
                  <div className="space-y-2">
                    {concept.keyFacts.map((fact, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className="text-xs mt-0.5" style={{ color: concept.color }}>◆</span>
                        <p className="text-xs text-blue-200/70 leading-relaxed">{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Book Examples */}
              {concept.bookExamplesHe && concept.bookExamplesHe.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-bold mb-3" style={{ color: concept.color }}>{L.bookExamples}</div>
                  <div className="space-y-2">
                    {concept.bookExamplesHe.map((ex, i) => (
                      <BookExample key={i} example={ex} color={concept.color} />
                    ))}
                  </div>
                </div>
              )}

              {/* Numbers */}
              {concept.numbersHe && concept.numbersHe.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {concept.numbersHe.map((item, i) => (
                    <div key={i} className="rounded-xl p-3 border border-white/10"
                      style={{ background: `${concept.color}08` }}>
                      <div className="text-xs font-bold text-white/90 mb-1">{item.value}</div>
                      <div className="text-xs text-blue-300/50">{item.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Author quote */}
              {concept.hawkingQuote && (
                <div className="rounded-2xl p-4 mb-4 border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="text-xs font-bold text-blue-300/50 mb-2">{L.quoteBy}</div>
                  <p className="text-xs text-blue-300/70 leading-relaxed italic">{concept.hawkingQuote}</p>
                  <div className="text-xs text-blue-400/40 mt-1">{L.quoteAttrib}</div>
                </div>
              )}

              {/* Fun fact */}
              {concept.funFactHe && (
                <div className="rounded-2xl p-4 mb-4 border"
                  style={{ borderColor: concept.color + '30', background: `${concept.color}08` }}>
                  <div className="text-xs font-bold mb-2" style={{ color: concept.color }}>{L.funFact}</div>
                  <p className="text-xs text-blue-200/80 leading-relaxed">{concept.funFactHe}</p>
                </div>
              )}

              {/* Scientists section (Hawking book only) */}
              {!isNewton && conceptScientists.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-bold text-blue-300/60 mb-3">{L.scientists}</div>
                  <div className="space-y-2">
                    {conceptScientists.map((s) => (
                      <ScientistCard key={s.id} scientist={s} />
                    ))}
                  </div>
                </div>
              )}

              {/* Chapter link */}
              <div className="rounded-2xl p-3 border border-white/10 mb-4"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="text-xs text-blue-300/40 leading-relaxed">
                  {L.chapterRef}
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('interactive')}
                className="w-full mt-2 py-3 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all"
                style={{ background: `linear-gradient(135deg, ${concept.color}, ${concept.color}80)` }}
              >
                <span>{L.interactiveBtn}</span>
              </motion.button>
            </motion.div>
          )}

          {activeTab === 'interactive' && (
            <motion.div
              key="interactive"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="rounded-2xl border overflow-hidden mb-4"
                style={{ borderColor: concept.color + '40', background: '#141830' }}>
                <div className="p-3 border-b flex items-center gap-2"
                  style={{ borderColor: concept.color + '20', background: concept.color + '10' }}>
                  <div className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: concept.color }}>
                    <span className="text-xs text-black font-bold">2</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: concept.color }}>{L.interactive}</span>
                </div>
                <div className="p-4">
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-40 text-blue-300/40">
                      <div className="text-center">
                        <div className="text-3xl mb-2">⚙️</div>
                        <div className="text-xs">{isNewton ? 'Loading...' : 'טוען...'}</div>
                      </div>
                    </div>
                  }>
                    {Visual ? (
                      <Visual />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40 text-center">
                        <div className="text-4xl mb-3">{concept.emoji}</div>
                        <p className="text-xs text-blue-300/40 leading-relaxed max-w-xs">
                          {isNewton
                            ? 'Interactive visualization coming soon. Explore the Overview and Deep Dive tabs for detailed analysis.'
                            : 'ויזואליזציה אינטראקטיבית בקרוב.'}
                        </p>
                      </div>
                    )}
                  </Suspense>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'deeper' && (
            <motion.div
              key="deeper"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className="rounded-2xl p-5 mb-4 border"
                style={{
                  background: `linear-gradient(135deg, ${concept.color}08, #1a2040)`,
                  borderColor: concept.color + '30',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: concept.color }}>
                    <span className="text-xs text-black font-bold">3</span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: concept.color }}>{L.advancedDetails}</span>
                </div>
                <p className="text-blue-200/80 text-sm leading-relaxed">
                  {concept.layer3He}
                </p>
              </div>

              {/* History */}
              {concept.historyHe && (
                <div className="rounded-2xl p-4 mb-4 border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="text-xs font-bold text-blue-300/60 mb-2">{L.history}</div>
                  <p className="text-xs text-blue-300/60 leading-relaxed">{concept.historyHe}</p>
                </div>
              )}

              {/* Scientists */}
              {concept.scientistsHe && (
                <div className="rounded-2xl p-4 mb-4 border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="text-xs font-bold text-blue-300/60 mb-2">{L.scientists}</div>
                  <p className="text-xs text-blue-300/60 leading-relaxed">{concept.scientistsHe}</p>
                </div>
              )}

              {/* Related concepts */}
              {related.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-blue-300/60 mb-3">{L.related}</h3>
                  <div className="space-y-2">
                    {related.map((rc) => (
                      <ConceptCard key={rc.id} concept={rc} compact />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'parent' && (
            <motion.div
              key="parent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className="rounded-2xl p-5 mb-4 border"
                style={{
                  borderColor: isNewton ? '#f59e0b30' : '#a855f730',
                  background: isNewton
                    ? 'linear-gradient(135deg, #3d220010, #1a2040)'
                    : 'linear-gradient(135deg, #2d1b4e30, #1a2040)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{isNewton ? '⚙️' : '👨‍👩‍👧'}</span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: isNewton ? '#f59e0b' : '#d8b4fe' }}
                  >
                    {L.contextMode}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full border"
                    style={
                      isNewton
                        ? { background: '#f59e0b15', color: '#f59e0b', borderColor: '#f59e0b30' }
                        : { background: '#a855f720', color: '#d8b4fe', borderColor: '#a855f730' }
                    }
                  >
                    {concept.isAbstract ? L.contextTagAdv : L.contextTag1}
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: isNewton ? '#fef3c7cc' : '#f3e8ffcc' }}
                >
                  {concept.parentGuideHe}
                </p>
              </div>

              {/* Discussion prompts */}
              <div
                className="rounded-2xl p-4 border"
                style={
                  isNewton
                    ? { background: 'rgba(245,158,11,0.06)', borderColor: '#f59e0b30' }
                    : { background: 'rgba(139,92,246,0.08)', borderColor: '#7c3aed30' }
                }
              >
                <h3
                  className="text-sm font-bold mb-3"
                  style={{ color: isNewton ? '#f59e0b' : '#c4b5fd' }}
                >
                  {L.discussionPrompts}
                </h3>
                <div className="space-y-3">
                  {concept.parentPromptsHe.map((prompt, i) => (
                    <div key={i} className="flex gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={
                          isNewton
                            ? { background: '#f59e0b30', color: '#f59e0b' }
                            : { background: '#7c3aed30', color: '#c4b5fd' }
                        }
                      >
                        <span className="text-xs">{i + 1}</span>
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: isNewton ? '#fef3c799' : '#e9d5ff99' }}
                      >
                        {prompt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ConceptWorld;
