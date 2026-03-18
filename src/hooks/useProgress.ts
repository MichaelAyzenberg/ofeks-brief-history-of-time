import { useState, useCallback, useEffect } from 'react';

interface ProgressData {
  visited: string[];
  favorites: string[];
  journeyProgress: number;
  lastVisited?: string;
}

const defaultProgress: ProgressData = {
  visited: [],
  favorites: [],
  journeyProgress: 0,
};

const loadProgress = (storageKey: string): ProgressData => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    return defaultProgress;
  }
};

const saveProgress = (storageKey: string, data: ProgressData) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch {
    // ignore
  }
};

export const useProgress = (storageKey = 'ofek-progress') => {
  const [progress, setProgress] = useState<ProgressData>(() => loadProgress(storageKey));

  // Reload progress when storageKey changes (book switch)
  useEffect(() => {
    setProgress(loadProgress(storageKey));
  }, [storageKey]);

  useEffect(() => {
    saveProgress(storageKey, progress);
  }, [storageKey, progress]);

  const markVisited = useCallback((conceptId: string) => {
    setProgress((prev) => {
      if (prev.visited.includes(conceptId)) return prev;
      return {
        ...prev,
        visited: [...prev.visited, conceptId],
        lastVisited: conceptId,
        journeyProgress: Math.max(prev.journeyProgress, prev.visited.length + 1),
      };
    });
  }, []);

  const toggleFavorite = useCallback((conceptId: string) => {
    setProgress((prev) => {
      const isFav = prev.favorites.includes(conceptId);
      return {
        ...prev,
        favorites: isFav
          ? prev.favorites.filter((id) => id !== conceptId)
          : [...prev.favorites, conceptId],
      };
    });
  }, []);

  const isVisited = useCallback(
    (conceptId: string) => progress.visited.includes(conceptId),
    [progress.visited]
  );

  const isFavorite = useCallback(
    (conceptId: string) => progress.favorites.includes(conceptId),
    [progress.favorites]
  );

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
  }, []);

  return {
    progress,
    markVisited,
    toggleFavorite,
    isVisited,
    isFavorite,
    resetProgress,
    visitedCount: progress.visited.length,
    favoriteCount: progress.favorites.length,
  };
};
