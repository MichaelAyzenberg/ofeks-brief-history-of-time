import { NavLink, useNavigate } from 'react-router-dom';
import { useBook } from '../context/BookContext';
import { useTheme } from '../context/ThemeContext';

const Navigation = () => {
  const { isNewton } = useBook();
  const { isDark, toggleTheme, C } = useTheme();
  const navigate = useNavigate();

  const hawkingItems = [
    { to: '/home', label: 'בית', icon: '🏠', exact: true },
    { to: '/journey', label: 'מסע', icon: '🚀', exact: false },
    { to: '/explore', label: 'חקירה', icon: '🗺️', exact: false },
    { to: '/scientists', label: 'מדענים', icon: '🔬', exact: false },
    { to: '/progress', label: 'התקדמות', icon: '⭐', exact: false },
  ];

  const newtonItems = [
    { to: '/home', label: 'Home', icon: '🏛️', exact: true },
    { to: '/journey', label: 'Journey', icon: '📜', exact: false },
    { to: '/explore', label: 'Explore', icon: '🗺️', exact: false },
    { to: '/progress', label: 'Progress', icon: '⭐', exact: false },
  ];

  const navItems = isNewton ? newtonItems : hawkingItems;
  const activeColor = isDark ? '#60a5fa' : '#2563eb';
  const inactiveColor = isDark ? 'rgba(191,219,254,0.5)' : 'rgba(30,42,74,0.5)';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ background: C.nav, backdropFilter: 'blur(12px)', borderTop: C.navBorder, transition: 'background 0.3s ease' }}
    >
      <div className="max-w-2xl mx-auto flex items-center justify-around px-1 py-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[46px]"
            style={({ isActive }) => ({
              color: isActive ? activeColor : inactiveColor,
              background: isActive ? (isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)') : 'transparent',
            })}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="text-[10px] font-medium leading-none">{item.label}</span>
          </NavLink>
        ))}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[46px]"
          style={{ color: inactiveColor }}
          title={isDark ? 'Day mode' : 'Night mode'}
        >
          <span className="text-lg leading-none">{isDark ? '☀️' : '🌙'}</span>
          <span className="text-[10px] font-medium leading-none">{isDark ? (isNewton ? 'Day' : 'יום') : (isNewton ? 'Night' : 'לילה')}</span>
        </button>

        {/* Book switcher */}
        <button
          onClick={() => navigate('/')}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[46px]"
          style={{ color: inactiveColor }}
          title="Switch book"
        >
          <span className="text-lg leading-none">📚</span>
          <span className="text-[10px] font-medium leading-none">
            {isNewton ? 'Books' : 'ספרים'}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
