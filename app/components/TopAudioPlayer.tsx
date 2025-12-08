'use client';

import { usePlayer } from '../context/PlayerContext';
import { useEffect } from 'react';

export default function TopAudioPlayer() {
  const { currentShow, playShow } = usePlayer();

  // Charger le dernier show par défaut
  useEffect(() => {
    const loadDefaultShow = async () => {
      if (currentShow) return;
      
      try {
        console.log('🔄 Loading latest show...');
        const res = await fetch('https://api.mixcloud.com/StillFM/cloudcasts/?limit=1');
        const data = await res.json();
        
        if (data.data && data.data.length > 0) {
          const latestShow = data.data[0];
          console.log('✅ Loaded:', latestShow.name);
          playShow({
            key: latestShow.key,
            name: latestShow.name,
            url: latestShow.url,
            img: latestShow.pictures?.extra_large
          });
        }
      } catch (e) {
        console.error('❌ Error loading show:', e);
      }
    };

    const timer = setTimeout(loadDefaultShow, 1000);
    return () => clearTimeout(timer);
  }, [currentShow, playShow]);

  if (!currentShow) {
    return (
      <div className="w-full bg-black border-b border-white font-mono h-[60px] flex items-center justify-center">
        <span className="text-white text-xs uppercase animate-pulse tracking-wider">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-black border-b border-white font-mono h-[60px] relative overflow-hidden">
      {/* Iframe Mixcloud standard - Simple et qui fonctionne */}
      <iframe
        width="100%"
        height="60"
        src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(currentShow.key)}`}
        frameBorder="0"
        allow="autoplay"
      />
    </div>
  );
}
