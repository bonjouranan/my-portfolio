'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type LoaderContextType = {
  shouldPlayIntro: boolean;
  triggerIntro: () => void;
  resetIntro: () => void;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [shouldPlayIntro, setShouldPlayIntro] = useState(true);

  // 触发播放动画
  const triggerIntro = () => {
    setShouldPlayIntro(true);
  };

  // 动画播完后调用
  const resetIntro = () => {
    setShouldPlayIntro(false);
  };

  return (
    <LoaderContext.Provider value={{ shouldPlayIntro, triggerIntro, resetIntro }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
}
