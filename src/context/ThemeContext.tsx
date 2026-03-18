import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ThemeId = 'dark' | 'light';

export const DARK = {
  bg: '#0a0e1a',
  card: '#1a2040',
  card2: '#141830',
  cardGrad: 'linear-gradient(135deg, #1a2040, #141830)',
  nav: 'rgba(10,14,26,0.95)',
  navBorder: '1px solid rgba(42,53,96,0.4)',
  border: '#2a3560',
  borderFaint: '#2a356040',
  inputBg: 'rgba(255,255,255,0.05)',
  starField: true,
};

export const LIGHT = {
  bg: '#eef2ff',
  card: '#ffffff',
  card2: '#f0f4ff',
  cardGrad: 'linear-gradient(135deg, #ffffff, #f0f4ff)',
  nav: 'rgba(240,244,255,0.97)',
  navBorder: '1px solid rgba(199,210,254,0.6)',
  border: '#c7d2fe',
  borderFaint: '#c7d2fe40',
  inputBg: 'rgba(255,255,255,0.7)',
  starField: false,
};

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
  C: typeof DARK;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const loadTheme = (): ThemeId => {
  const raw = localStorage.getItem('app-theme');
  return raw === 'light' ? 'light' : 'dark';
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeId>(loadTheme);

  const isDark = theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light-mode');
    } else {
      root.classList.remove('dark');
      root.classList.add('light-mode');
    }
    document.body.style.background = isDark ? '#0a0e1a' : '#eef2ff';
  }, [isDark]);

  const toggleTheme = () => {
    const next: ThemeId = isDark ? 'light' : 'dark';
    localStorage.setItem('app-theme', next);
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, C: isDark ? DARK : LIGHT }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
