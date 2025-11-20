'use client';

import { useState, useEffect, useRef } from 'react';
import { usePlayer, Show } from '../context/PlayerContext';

// Hook pour charger le script API Mixcloud
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

export default function AudioPlayer() {
  const { currentShow, isPlaying, togglePlay, playShow } = usePlayer();
  const [isReady, setIsReady] = useState(false);
  const widgetRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Charger un show par défaut (Le dernier) si aucun n'est sélectionné
  useEffect(() => {
    const fetchLatest = async () => {
      if (!currentShow) {
        try {
          const res = await fetch('https://api.mixcloud.com/StillFM/cloudcasts/?limit=1');
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            const latest = data.data[0];
            // On initialise le contexte avec ce show
            playShow({
               key: latest.key,
               name: latest.name,
               url: latest.url
            }); 
          }
        } catch (e) { console.error(e); }
      }
    };
    fetchLatest();
  }, []);

  // Initialiser le Widget
  useMixcloudScript(() => {
    if (iframeRef.current && !widgetRef.current && (window as any).Mixcloud) {
      const widget = (window as any).Mixcloud.PlayerWidget(iframeRef.current);
      widgetRef.current = widget;
      widget.ready.then(() => {
        setIsReady(true);
        // On ne force pas la lecture ici pour éviter l'autoplay bloqué
      });
    }
  });

  // Réaction : Changement de Show ou Play/Pause
  useEffect(() => {
    if (widgetRef.current && isReady && currentShow) {
        // Si la clé est différente, on charge
        widgetRef.current.load(currentShow.key, isPlaying).then(() => {
             if (isPlaying) widgetRef.current.play();
             else widgetRef.current.pause();
        });
    }
  }, [currentShow, isPlaying, isReady]);

  // UI si pas de show
  if (!currentShow) return null;

  return (
    <>
      {/* Widget Invisible (Moteur Audio) */}
      <iframe
        ref={iframeRef}
        src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(currentShow.key)}`}
        className="absolute opacity-0 pointer-events-none"
        allow="autoplay"
      />

      {/* UI du Lecteur (Visible en bas à gauche) */}
      <div className="fixed bottom-6 left-6 z-50 backdrop-blur-md bg-black/90 border border-white/20 hover:border-white/40 transition-all duration-300 px-5 py-3 font-mono max-w-sm group">
        <div className="flex items-center gap-4">
          {/* Bouton Play/Pause Local */}
          <button
            onClick={togglePlay}
            className="relative w-9 h-9 border border-white/40 hover:border-white hover:bg-white/10 transition-all duration-200 flex items-center justify-center shrink-0"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <div className="flex gap-1">
                <div className="w-[3px] h-4 bg-white" />
                <div className="w-[3px] h-4 bg-white" />
              </div>
            ) : (
              <div className="w-0 h-0 border-l-[10px] border-l-white border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent ml-[2px]" />
            )}
          </button>

          {/* Infos */}
          <div className="flex-1 min-w-0">
            <div className="text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1 font-medium">
              Now Playing
            </div>
            <div className="text-[13px] text-white truncate leading-tight">
              {currentShow.name}
            </div>
          </div>

          {/* Indicateur Live */}
          <div className={`w-2 h-2 rounded-full shrink-0 ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-500/50'}`} />
        </div>

        <a 
          href={currentShow.url}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2 text-[9px] text-white/40 hover:text-white/70 uppercase tracking-wider block"
        >
          View on Mixcloud →
        </a>
      </div>
    </>
  );
}
