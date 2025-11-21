'use client';
import React, { createContext, useContext, useState } from 'react';

// Définition du type de Show
export interface Show {
  key: string;
  name: string;
  url: string;
  img?: string; // AJOUTÉ: pour l'artwork
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
    // Si c'est déjà le même show, on ne fait rien ou on toggle
    if (currentShow?.key === show.key) {
      setIsPlaying(true); 
    } else {
      setCurrentShow(show);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
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
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
