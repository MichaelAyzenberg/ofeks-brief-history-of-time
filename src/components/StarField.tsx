import { useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const StarField = () => {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.6 + 0.2,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {stars.map((star) => (
          <circle
            key={star.id}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="white"
            style={{
              animation: `twinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
              opacity: star.opacity,
            }}
          />
        ))}
      </svg>
      {/* nebula-like blobs */}
      <div
        className="absolute rounded-full blur-3xl opacity-10"
        style={{
          width: '40vw',
          height: '40vw',
          background: 'radial-gradient(circle, #4f46e5, transparent)',
          top: '10%',
          right: '5%',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-10"
        style={{
          width: '30vw',
          height: '30vw',
          background: 'radial-gradient(circle, #7c3aed, transparent)',
          bottom: '20%',
          left: '10%',
        }}
      />
    </div>
  );
};

export default StarField;
