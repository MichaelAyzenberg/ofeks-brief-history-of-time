interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  className?: string;
  label?: string;
}

const ProgressBar = ({ value, color = '#60a5fa', className = '', label }: ProgressBarProps) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1 text-xs text-blue-300/70">
          <span>{label}</span>
          <span>{Math.round(value)}%</span>
        </div>
      )}
      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, value)}%`, background: color }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
