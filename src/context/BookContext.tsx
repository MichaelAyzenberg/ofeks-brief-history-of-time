import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { concepts as hawkingConcepts, type Concept } from '../data/concepts';
import { principiaConcepts } from '../data/principia';

export type BookId = 'hawking' | 'newton';

interface BookContextValue {
  bookId: BookId;
  setBook: (id: BookId) => void;
  concepts: Concept[];
  getConceptBySlug: (slug: string) => Concept | undefined;
  getRelatedConcepts: (concept: Concept) => Concept[];
  progressKey: string;
  isNewton: boolean;
  isHawking: boolean;
}

const BookContext = createContext<BookContextValue | null>(null);

const loadBookId = (): BookId => {
  const raw = localStorage.getItem('active-book');
  return raw === 'newton' ? 'newton' : 'hawking';
};

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [bookId, setBookId] = useState<BookId>(loadBookId);

  const setBook = (id: BookId) => {
    localStorage.setItem('active-book', id);
    setBookId(id);
  };

  const isNewton = bookId === 'newton';
  const isHawking = bookId === 'hawking';

  // Sync document direction and language with active book
  useEffect(() => {
    document.documentElement.dir = isNewton ? 'ltr' : 'rtl';
    document.documentElement.lang = isNewton ? 'en' : 'he';
  }, [isNewton]);
  const currentConcepts = isNewton ? principiaConcepts : hawkingConcepts;
  const progressKey = isNewton ? 'newton-progress' : 'ofek-progress';

  const getConceptBySlug = (slug: string) =>
    currentConcepts.find((c) => c.slug === slug);

  const getRelatedConcepts = (concept: Concept): Concept[] =>
    concept.relatedConcepts
      .map((id) => currentConcepts.find((c) => c.id === id))
      .filter(Boolean) as Concept[];

  return (
    <BookContext.Provider
      value={{
        bookId,
        setBook,
        concepts: currentConcepts,
        getConceptBySlug,
        getRelatedConcepts,
        progressKey,
        isNewton,
        isHawking,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBook = () => {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error('useBook must be used within BookProvider');
  return ctx;
};
