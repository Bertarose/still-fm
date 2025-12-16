'use client';

import { usePlayer } from '../context/PlayerContext';
import { useEffect, useRef } from 'react';

export default function TopAudioPlayer() {
  const { currentShow, playShow, isPlaying } = usePlayer();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<any>(null);
  const isInitialized = useRef(false);

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
            title: latestShow.name, 
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

  // Initialiser le widget Mixcloud
  useEffect(() => {
    if (!iframeRef.current || isInitialized.current) return;

    const checkWidget = () => {
      if ((window as any).Mixcloud && iframeRef.current) {
        try {
          const widget = (window as any).Mixcloud.PlayerWidget(iframeRef.current);
          widgetRef.current = widget;
          isInitialized.current = true;

          widget.ready.then(() => {
            console.log('✅ Mixcloud widget ready');
          });
        } catch (e) {
          console.error('❌ Widget init error:', e);
        }
      } else {
        setTimeout(checkWidget, 500);
      }
    };

    // Charger le script Mixcloud si nécessaire
    if (!(window as any).Mixcloud) {
      const script = document.createElement('script');
      script.src = 'https://www.mixcloud.com/media/js/widgetApi.js';
      script.async = true;
      script.onload = checkWidget;
      document.body.appendChild(script);
    } else {
      checkWidget();
    }
  }, []);

  // ✅ AUTO-PLAY : Quand currentShow change ET isPlaying = true
  useEffect(() => {
    if (!widgetRef.current || !currentShow) return;

    console.log('🎵 Loading show:', currentShow.title, 'Auto-play:', isPlaying);
    
    try {
      widgetRef.current.load(currentShow.key, isPlaying); // ✅ Auto-play si isPlaying = true
    } catch (e) {
      console.error('❌ Error loading show:', e);
    }
  }, [currentShow, isPlaying]);

  if (!currentShow) {
    return (
      <div className="w-full bg-black border-b border-white font-mono h-[60px] md:h-[70px] flex items-center justify-center">
        <span className="text-white text-xs md:text-sm uppercase animate-pulse tracking-wider font-medium">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-black border-b border-white font-mono h-[60px] md:h-[70px] relative overflow-hidden">
      {/* Iframe Mixcloud avec widget API */}
      <iframe
        ref={iframeRef}
        width="100%"
        height="70"
        src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(currentShow.key)}`}
        frameBorder="0"
        allow="autoplay"
        className="scale-110 md:scale-100 origin-top"
        title="Mixcloud Player"
      />
    </div>
  );
}
