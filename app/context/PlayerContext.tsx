// app/context/PlayerContext.tsx
'use client';
import React, { createContext, useContext, useState, useRef } from 'react';

export interface Show {
  key: string;
  title: string;
  url: string;
  img?: string;
}

interface PlayerContextType {
  currentShow: Show | null;
  isPlaying: boolean;
  playShow: (show: Show) => void;
  togglePlay: () => void;
  isLive: boolean;
  setIsLive: (live: boolean) => void;
  twitchPlayer: any;
  setTwitchPlayer: (player: any) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentShow, setCurrentShow] = useState<Show | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [twitchPlayer, setTwitchPlayer] = useState<any>(null);

  const playShow = (show: Show) => {
    setCurrentShow(show);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentShow,
        isPlaying,
        playShow,
        togglePlay,
        isLive,
        setIsLive,
        twitchPlayer,
        setTwitchPlayer
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
}
