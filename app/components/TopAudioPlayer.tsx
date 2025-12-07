'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePlayer } from '../context/PlayerContext';
import Link from 'next/link';

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
  const hasLoadedDefault = useRef(false);

  // Charger le dernier show par défaut
  useEffect(() => {
    const loadDefaultShow = async () => {
      if (hasLoadedDefault.current || currentShow) return;
      
      try {
        const res = await fetch('https://api.mixcloud.com/StillFM/cloudcasts/?limit=1');
        const data = await res.json();
        
        if (data.data && data.data.length > 0) {
          const latestShow = data.data[0];
          playShow({
            key: latestShow.key,
            name: latestShow.name,
            url: latestShow.url,
            img: latestShow.pictures?.extra_large
          });
          hasLoadedDefault.current = true;
        }
      } catch (e) {
        console.error('Error loading default show:', e);
      }
    };

    loadDefaultShow();
  }, [currentShow, playShow]);

  useMixcloudScript(() => {
    if (iframeRef.current && !widgetRef.current) {
      initWidget();
    }
  });

  const initWidget = useCallback(() => {
    if (!iframeRef.current || !(window as any).Mixcloud) return;

    const widget = (window as any).Mixcloud.PlayerWidget(iframeRef.current);
    widgetRef.current = widget;

    widget.ready.then(() => {
      setIsReady(true);
      console.log("Mixcloud Widget Ready");
    });
  }, []);

  useEffect(() => {
    if (widgetRef.current && currentShow) {
      widgetRef.current.load(currentShow.key, true).then(() => {
        if (isPlaying) {
          widgetRef.current.play();
        }
      });
    }
  }, [currentShow]);

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
      
      {/* Iframe Mixcloud (caché mais fonctionnel) */}
      <iframe
        ref={iframeRef}
        src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&autoplay=0&feed=${encodeURIComponent(currentShow.key)}`}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        allow="autoplay; encrypted-media"
      />
      
      {/* Custom UI noir minimaliste */}
      <div className="w-full flex items-center justify-between px-6">
        
        {/* Gauche : Play/Pause + Info */}
        <div className="flex items-center gap-4">
          
          {/* Bouton Play/Pause */}
          <button
            onClick={togglePlay}
            disabled={!isReady}
            className="w-10 h-10 border border-white hover:bg-white hover:text-black transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed group shrink-0"
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

          {/* Info du show */}
          <div className="flex flex-col justify-center">
            <div className="text-xs uppercase tracking-wider font-bold text-white line-clamp-1 max-w-[200px] md:max-w-[400px]">
              {currentShow.name}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-gray-500">
              {isReady ? (isPlaying ? '● Playing' : '● Paused') : 'Loading...'}
            </div>
          </div>
        </div>

        {/* Droite : Links */}
        <div className="flex items-center gap-3">
          
          {/* Badge "Back to Live" */}
          <Link
            href="/"
            className="text-[10px] uppercase tracking-wider px-3 py-1 border border-white/30 text-white/70 hover:bg-white hover:text-black hover:border-white transition-all hidden md:block"
          >
            ← Back to Live
          </Link>

          {/* Link to Mixcloud */}
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
    </div>
  );
}
