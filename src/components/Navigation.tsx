import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'בית', icon: '🏠', exact: true },
  { to: '/journey', label: 'מסע', icon: '🚀', exact: false },
  { to: '/explore', label: 'חקירה', icon: '🗺️', exact: false },
  { to: '/scientists', label: 'מדענים', icon: '🔬', exact: false },
  { to: '/progress', label: 'התקדמות', icon: '⭐', exact: false },
  { to: '/parent', label: 'הורים', icon: '👨‍👩‍👧', exact: false },
];

const Navigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-blue-900/40"
      style={{ background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-2xl mx-auto flex items-center justify-around px-1 py-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[46px] ${
                isActive
                  ? 'text-blue-400 bg-blue-900/30'
                  : 'text-blue-200/50 hover:text-blue-300 hover:bg-white/5'
              }`
            }
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="text-[10px] font-medium leading-none">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
