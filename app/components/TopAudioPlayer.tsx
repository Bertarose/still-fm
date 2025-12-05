'use client';

import { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

export default function TopAudioPlayer() {
  const { currentShow } = usePlayer();

  if (!currentShow) {
    return (
      <div className="w-full bg-black border-b border-white font-mono h-[60px] flex items-center justify-center">
        <span className="text-white text-xs uppercase animate-pulse tracking-wider">
          Waiting for signal...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-black border-b border-white font-mono h-[80px] relative">
      
      {/* Info du show au-dessus de l'iframe */}
      <div className="absolute top-2 left-6 z-10 pointer-events-none">
        <div className="text-[10px] uppercase tracking-wider text-white/70">
          Now Playing
        </div>
      </div>

      {/* Iframe Mixcloud native */}
      <iframe
        width="100%"
        height="80"
        src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(currentShow.key)}`}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        className="w-full h-full"
      />
    </div>
  );
}
