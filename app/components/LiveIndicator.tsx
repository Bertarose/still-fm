'use client';

import { useState, useEffect } from 'react';

interface LiveIndicatorProps {
  twitchUsername?: string;
}

export default function LiveIndicator({ twitchUsername = 'bertarose' }: LiveIndicatorProps) {
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        // Note: L'API Twitch nécessite une clé API.
        // Pour l'instant, on va utiliser une approche simple avec le player embed
        // qui nous indique si le stream est actif
        
        // Alternative simple: on peut vérifier si l'iframe Twitch charge un stream
        // Pour un vrai check, il faudrait une API key Twitch
        
        // Pour démo, on simule avec un check basique
        // Dans un vrai projet, tu aurais besoin de setup l'API Twitch
        
        setIsLive(false); // Par défaut offline
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking live status:', error);
        setIsLive(false);
        setIsLoading(false);
      }
    };

    checkLiveStatus();
    
    // Recheck toutes les 60 secondes
    const interval = setInterval(checkLiveStatus, 60000);
    
    return () => clearInterval(interval);
  }, [twitchUsername]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
        <span className="text-[10px] uppercase tracking-wider text-gray-400">
          Checking...
        </span>
      </div>
    );
  }

  return (
    <a
      href={`https://www.twitch.tv/${twitchUsername}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 hover:opacity-70 transition-opacity"
    >
      <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
      <span className={`text-[10px] uppercase tracking-wider ${isLive ? 'text-green-400' : 'text-gray-400'}`}>
        {isLive ? 'STREAM ONLINE' : 'STREAM OFFLINE'}
      </span>
    </a>
  );
}
