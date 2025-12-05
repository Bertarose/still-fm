'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Show {
  key: string;
  name: string;
  url: string;
  img?: string;
}

interface PlayerContextType {
  currentShow: Show | null;
  isPlaying: boolean;
  playShow: (show: Show) => void;
  togglePlay: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentShow, setCurrentShow] = useState<Show | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playShow = (show: Show) => {
    setCurrentShow(show);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <PlayerContext.Provider value={{ currentShow, isPlaying, playShow, togglePlay }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
}
