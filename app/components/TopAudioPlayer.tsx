'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePlayer } from '../context/PlayerContext';

const useMixcloudScript = (onScriptLoad: () => void) => {
  useEffect(() => {
    if ((window as any).Mixcloud) {
      onScriptLoad();
      return;
    }

    const id = 'mixcloud-widget-api-script';
    if (document.getElementById(id)) return;

    const script = document.createElement('script');
    script.id = id;
    script.src = 'https://www.mixcloud.com/media/js/widgetApi.js';
    script.async = true;
    script.onload = onScriptLoad;
    document.body.appendChild(script);
  }, [onScriptLoad]);
};

export default function TopAudioPlayer() {
  const { currentShow, isPlaying, playShow, togglePlay } = usePlayer();
  const [isReady, setIsReady] = useState(false);
  const widgetRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Charger le dernier show au montage
  useEffect(() => {
    const loadLatestShow = async () => {
      // Ne charger que si pas de show
      if (currentShow) return;
      
      try {
        console.log('🔄 Loading latest show...');
        const res = await fetch('https://api.mixcloud.com/StillFM/cloudcasts/?limit=1');
        const data = await res.json();
        
        if (data.data && data.data.length > 0) {
          const show = data.data[0];
          console.log('✅ Loaded:', show.name);
          playShow({
            key: show.key,
            name: show.name,
            url: show.url,
            img: show.pictures?.extra_large
          });
        }
      } catch (e) {
        console.error('❌ Error loading show:', e);
      }
    };

    // Délai pour laisser le PlayerContext s'initialiser
    const timer = setTimeout(loadLatestShow, 500);
    return () => clearTimeout(timer);
  }, []); // Seulement au montage

  const initWidget = useCallback(() => {
    if (!iframeRef.current || widgetRef.current || !(window as any).Mixcloud) return;

    console.log('🎵 Initializing Mixcloud widget...');
    const widget = (window as any).Mixcloud.PlayerWidget(iframeRef.current);
    widgetRef.current = widget;

    widget.ready.then(() => {
      console.log('✅ Widget ready');
      setIsReady(true);
    });
  }, []);

  useMixcloudScript(initWidget);

  useEffect(() => {
    if (widgetRef.current && currentShow && isReady) {
      console.log('📀 Loading show:', currentShow.name);
      widgetRef.current.load(currentShow.key, true).then(() => {
        console.log('✅ Show loaded');
      });
    }
  }, [currentShow, isReady]);

  useEffect(() => {
    if (widgetRef.current && isReady) {
      if (isPlaying) {
        widgetRef.current.play();
      } else {
        widgetRef.current.pause();
      }
    }
  }, [isPlaying, isReady]);

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
    <div className="w-full bg-black border-b border-white font-mono h-[60px] flex items-center relative overflow-hidden">
      
      {/* Iframe Mixcloud */}
      <iframe
        ref={iframeRef}
        src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(currentShow.key)}`}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        allow="autoplay"
      />
      
      {/* Custom UI */}
      <div className="w-full flex items-center justify-between px-6">
        
        <div className="flex items-center gap-4">
          
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            disabled={!isReady}
            className="w-10 h-10 border border-white hover:bg-white hover:text-black transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            {isPlaying ? (
              <div className="flex gap-1">
                <div className="w-[3px] h-4 bg-white group-hover:bg-black transition-colors" />
                <div className="w-[3px] h-4 bg-white group-hover:bg-black transition-colors" />
              </div>
            ) : (
              <div className="w-0 h-0 border-l-[10px] border-l-white group-hover:border-l-black border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent ml-[2px] transition-colors" />
            )}
          </button>

          {/* Show Info */}
          <div className="flex flex-col justify-center">
            <div className="text-xs uppercase tracking-wider font-bold text-white line-clamp-1 max-w-[300px] md:max-w-[500px]">
              {currentShow.name}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-gray-500">
              {isReady ? (isPlaying ? '● Playing' : '● Paused') : 'Loading...'}
            </div>
          </div>
        </div>

        {/* Mixcloud Link */}
        <a 
          href={currentShow.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] uppercase tracking-wider text-gray-500 hover:text-white transition-colors hidden md:block"
        >
          View on Mixcloud →
        </a>
      </div>
    </div>
  );
}
