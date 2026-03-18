import { type ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';
import StarField from './StarField';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { C } = useTheme();
  return (
    <div className="min-h-screen relative" style={{ background: C.bg, transition: 'background 0.3s ease' }}>
      {C.starField && <StarField />}
      <div className="relative z-10 pb-24">
        {children}
      </div>
      <Navigation />
    </div>
  );
};

export default Layout;
