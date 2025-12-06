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

export default function LandingAudioPlayer() {
  const { currentShow, isPlaying, playShow, togglePlay } = usePlayer();
  const [isReady, setIsReady] = useState(false);
  
  const widgetRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Charger le dernier show Mixcloud au montage
  useEffect(() => {
    const loadDefaultShow = async () => {
      if (currentShow) return; // Ne charger que si vide
      
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

    const timer = setTimeout(loadDefaultShow, 1000);
    return () => clearTimeout(timer);
  }, []); // Seulement au premier montage

  // Initialiser le widget Mixcloud
  const initWidget = useCallback(() => {
    if (!iframeRef.current || widgetRef.current || !(window as any).Mixcloud) return;

    console.log('🎵 Initializing Mixcloud widget...');
    const widget = (window as any).Mixcloud.PlayerWidget(iframeRef.current);
    widgetRef.current = widget;

    widget.ready.then(() => {
      console.log('✅ Widget ready');
      setIsReady(true);
    });

    widget.events.pause.on(() => {
      console.log('⏸️ Paused');
    });

    widget.events.play.on(() => {
      console.log('▶️ Playing');
    });
  }, []);

  useMixcloudScript(initWidget);

  // Charger le show dans le widget (SANS autoplay)
  useEffect(() => {
    if (widgetRef.current && currentShow && isReady) {
      console.log('📀 Loading show:', currentShow.name);
      widgetRef.current.load(currentShow.key, false); // false = PAS d'autoplay
    }
  }, [currentShow, isReady]);

  // Contrôler play/pause quand l'utilisateur clique
  useEffect(() => {
    if (widgetRef.current && isReady) {
      if (isPlaying) {
        console.log('▶️ User clicked Play');
        widgetRef.current.play();
      } else {
        console.log('⏸️ User clicked Pause');
        widgetRef.current.pause();
      }
    }
  }, [isPlaying, isReady]);

  const handleToggle = () => {
    console.log('🎵 Toggle:', isPlaying ? 'pause' : 'play');
    togglePlay();
  };

  const currentName = currentShow?.name || 'Loading...';

  return (
    <>
      {/* Iframe Mixcloud caché */}
      <iframe
        ref={iframeRef}
        src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(currentShow?.key || '/StillFM/')}`}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        allow="autoplay"
      />

      {/* Player UI */}
      <div className="backdrop-blur-md bg-black/95 border-t md:border border-white/20 hover:border-white/40 transition-all duration-300 font-mono w-full md:w-96 md:rounded-lg overflow-hidden">
        
        <div className="p-3 md:p-4">
          
          {/* Titre du show */}
          <div className="mb-2">
            <div className="text-[8px] md:text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1">
              Now Playing
            </div>
            <div className="text-[10px] md:text-[11px] text-white leading-tight line-clamp-1">
              {currentName}
            </div>
          </div>

          {/* Contrôles Play/Pause */}
          <div className="flex items-center gap-2">
            
            {/* Bouton Play/Pause */}
            <button
              onClick={handleToggle}
              disabled={!isReady}
              className="w-8 h-8 md:w-10 md:h-10 border border-white/40 hover:border-white hover:bg-white/10 transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              {isPlaying ? (
                // Icône Pause
                <div className="flex gap-1">
                  <div className="w-[2px] md:w-[3px] h-3 md:h-4 bg-white" />
                  <div className="w-[2px] md:w-[3px] h-3 md:h-4 bg-white" />
                </div>
              ) : (
                // Icône Play
                <div className="w-0 h-0 border-l-[8px] md:border-l-[10px] border-l-white border-t-[6px] md:border-t-[7px] border-t-transparent border-b-[6px] md:border-b-[7px] border-b-transparent ml-[2px]" />
              )}
            </button>

            {/* Status */}
            <div className="flex-1 text-[8px] md:text-[9px] text-white/50">
              {isReady ? (isPlaying ? '● Playing' : '● Ready') : 'Loading...'}
            </div>

            {/* Lien Mixcloud */}
            {currentShow && (
              <a 
                href={currentShow.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[8px] md:text-[9px] text-white/40 hover:text-white/70 uppercase hidden sm:block"
              >
                View →
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
