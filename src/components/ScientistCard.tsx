import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Scientist } from '../data/scientists';

interface Props {
  scientist: Scientist;
}

const ScientistCard = ({ scientist }: Props) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02, x: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/scientist/${scientist.id}`)}
      className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
      style={{
        background: `${scientist.color}10`,
        borderColor: `${scientist.color}30`,
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{
          background: `${scientist.color}20`,
          border: `1px solid ${scientist.color}40`,
          boxShadow: `0 0 10px ${scientist.color}20`,
        }}
      >
        {scientist.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-white leading-tight">{scientist.nameHe}</div>
        <div className="text-xs truncate mt-0.5" style={{ color: scientist.color + 'cc' }}>
          {scientist.taglineHe}
        </div>
        <div className="text-xs text-blue-300/40 mt-0.5">{scientist.years}</div>
      </div>
      {scientist.nobelYear && (
        <div className="text-xs text-yellow-400/70 flex-shrink-0 flex flex-col items-center">
          <span>🏅</span>
          <span className="text-xs">{scientist.nobelYear}</span>
        </div>
      )}
      <div className="text-blue-400/40 text-xs flex-shrink-0">←</div>
    </motion.div>
  );
};

export default ScientistCard;
