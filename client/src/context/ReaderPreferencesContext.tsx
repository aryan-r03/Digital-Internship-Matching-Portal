import React, { createContext, useContext, useState, useEffect } from 'react';

export type ReadingMode = 'vertical' | 'single' | 'double';
export type ReadingDirection = 'rtl' | 'ltr';
export type FilterMode = 'normal' | 'high-contrast' | 'screentone' | 'night';

interface ReaderPreferencesContextType {
  mode: ReadingMode;
  setMode: (mode: ReadingMode) => void;
  direction: ReadingDirection;
  setDirection: (direction: ReadingDirection) => void;
  filter: FilterMode;
  setFilter: (filter: FilterMode) => void;
  showHUD: boolean;
  setShowHUD: (show: boolean) => void;
  toggleHUD: () => void;
  fitToWidth: boolean;
  setFitToWidth: (fit: boolean) => void;
}

const ReaderPreferencesContext = createContext<ReaderPreferencesContextType | undefined>(undefined);

export const ReaderPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ReadingMode>(() => {
    return (localStorage.getItem('manga_reader_mode') as ReadingMode) || 'single';
  });

  const [direction, setDirection] = useState<ReadingDirection>(() => {
    return (localStorage.getItem('manga_reader_direction') as ReadingDirection) || 'rtl';
  });

  const [filter, setFilter] = useState<FilterMode>(() => {
    return (localStorage.getItem('manga_reader_filter') as FilterMode) || 'normal';
  });

  const [showHUD, setShowHUD] = useState<boolean>(true);
  const [fitToWidth, setFitToWidth] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem('manga_reader_mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('manga_reader_direction', direction);
  }, [direction]);

  useEffect(() => {
    localStorage.setItem('manga_reader_filter', filter);
  }, [filter]);

  const toggleHUD = () => setShowHUD((prev) => !prev);

  return (
    <ReaderPreferencesContext.Provider
      value={{
        mode,
        setMode,
        direction,
        setDirection,
        filter,
        setFilter,
        showHUD,
        setShowHUD,
        toggleHUD,
        fitToWidth,
        setFitToWidth,
      }}
    >
      {children}
    </ReaderPreferencesContext.Provider>
  );
};

export function useReaderPreferences() {
  const context = useContext(ReaderPreferencesContext);
  if (!context) {
    throw new Error('useReaderPreferences must be used within ReaderPreferencesProvider');
  }
  return context;
}
