import { type ReactNode } from 'react';
import StarField from './StarField';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen relative" style={{ background: '#0a0e1a' }}>
      <StarField />
      <div className="relative z-10 pb-24">
        {children}
      </div>
      <Navigation />
    </div>
  );
};

export default Layout;
