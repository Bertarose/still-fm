// app/context/PlayerContext.tsx
'use client';
import React, { createContext, useContext, useState } from 'react';

interface PlayerContextType {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  isLive: boolean;
  setIsLive: (live: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  return (
    <PlayerContext.Provider value={{ isPlaying, play, pause, isLive, setIsLive }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
}
