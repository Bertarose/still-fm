'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePlayer, Show } from '../context/PlayerContext';

const LAST_MIXCLOUD: Show = {
  key: '/StillFM/2023-07-23-dante-maxwell-sk7-cooper-richardson-le-keyhole-ep-18-160bpm-edition-part-4/',
  name: 'Dante Maxwell, SK7, Cooper Richardson @ Le Keyhole EP.18',
  url: 'https://www.mixcloud.com/StillFM/2023-07-23-dante-maxwell-sk7-cooper-richardson-le-keyhole-ep-18-160bpm-edition-part-4/',
};

const RADIO_STREAM_URL = 'http://localhost:8000/steelfm.mp3'; // ← Change avec ton IP

// Hook pour charger le script Mixcloud (MÊME QUE TopAudioPlayer)
const useMixcloudScript = (onScriptLoad: () => void) => {
  useEffect(() => {
    if ((window as any).Mixcloud) {
      onScriptLoad();
      return;
    }

    const id = 'mixcloud-widget-api-script';
    if (document.getElementById(id)) {
      return; // Déjà en cours de chargement
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = 'https://www.mixcloud.com/media/js/widgetApi.js';
    script.async = true;
    script.onload = onScriptLoad;
    document.body.appendChild(script);
  }, [onScriptLoad]);
};

export default function AudioPlayer() {
  const { currentShow, isPlaying, playShow, togglePlay } = usePlayer();
  const [useRadio, setUseRadio] = useState(false); // Commence sur Mixcloud
  const [isRadioOnline, setIsRadioOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isReady, setIsReady] = useState(false);
  
  const radioRef = useRef<HTMLAudioElement>(null);
  const widgetRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // --- 1. Vérifier si la radio IceCast est online ---
  useEffect(() => {
    const checkRadioStatus = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(RADIO_STREAM_URL, { 
          method: 'HEAD',
          signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        setIsRadioOnline(response.ok);
      } catch (error) {
        console.log('Radio offline');
        setIsRadioOnline(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkRadioStatus();
    const interval = setInterval(checkRadioStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- 2. Initialiser le Widget Mixcloud ---
  const initWidget = useCallback(() => {
    if (!iframeRef.current || widgetRef.current || !(window as any).Mixcloud) return;

    const widget = (window as any).Mixcloud.PlayerWidget(iframeRef.current);
    widgetRef.current = widget;

    widget.ready.then(() => {
      console.log('Mixcloud Widget Ready (Landing)');
      setIsReady(true);
    });
  }, []);

  useMixcloudScript(initWidget);

  // --- 3. Charger le show par défaut ---
  useEffect(() => {
    if (!currentShow && !useRadio) {
      playShow(LAST_MIXCLOUD);
    }
  }, [currentShow, useRadio, playShow]);

  // --- 4. Changement de show Mixcloud ---
  useEffect(() => {
    if (widgetRef.current && currentShow && !useRadio && isReady) {
      widgetRef.current.load(currentShow.key, isPlaying);
    }
  }, [currentShow, useRadio, isReady]);

  // --- 5. Play/Pause Mixcloud ---
  useEffect(() => {
    if (widgetRef.current && isReady && !useRadio) {
      if (isPlaying) {
        widgetRef.current.play();
      } else {
        widgetRef.current.pause();
      }
    }
  }, [isPlaying, isReady, useRadio]);

  // --- 6. Switch entre Radio et Mixcloud ---
  const handleSwitch = (toRadio: boolean) => {
    setUseRadio(toRadio);

    if (toRadio) {
      // Switch vers Radio
      if (isRadioOnline && radioRef.current) {
        // Pause Mixcloud
        if (widgetRef.current && isReady) {
          widgetRef.current.pause();
        }
        // Play Radio
        playShow({ 
          key: 'radio-live', 
          name: 'Still FM Radio - Live Stream', 
          url: RADIO_STREAM_URL 
        });
        radioRef.current.play().catch(console.error);
      }
    } else {
      // Switch vers Mixcloud
      if (radioRef.current) {
        radioRef.current.pause();
      }
      playShow(LAST_MIXCLOUD);
      if (widgetRef.current && isReady) {
        widgetRef.current.load(LAST_MIXCLOUD.key, true);
      }
    }
  };

  // --- 7. Toggle Play/Pause ---
  const handleTogglePlay = () => {
    if (useRadio && radioRef.current) {
      if (isPlaying) {
        radioRef.current.pause();
      } else {
        radioRef.current.play().catch(console.error);
      }
      togglePlay();
    } else if (!useRadio && widgetRef.current && isReady) {
      if (isPlaying) {
        widgetRef.current.pause();
      } else {
        widgetRef.current.play();
      }
      togglePlay();
    }
  };

  // --- 8. Affichage du nom ---
  const currentName = useRadio 
    ? (isRadioOnline ? 'Still FM Radio - Live Stream' : 'Radio Offline')
    : (currentShow?.name || LAST_MIXCLOUD.name);

  return (
    <>
      {/* Audio Element pour Radio */}
      <audio
        ref={radioRef}
        src={RADIO_STREAM_URL}
        preload="none"
        className="hidden"
      />

      {/* Widget Mixcloud invisible */}
      <iframe
        ref={iframeRef}
        src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(LAST_MIXCLOUD.key)}`}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        allow="autoplay; encrypted-media"
      />

      {/* UI du Player */}
      <div className="fixed bottom-6 left-6 z-50 backdrop-blur-md bg-black/90 border border-white/20 hover:border-white/40 transition-all duration-300 font-mono w-96">
        
        <div className="p-4">
          
          {/* Titre du show */}
          <div className="mb-3">
            <div className="text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1">
              Now Playing
            </div>
            <div className="text-[11px] text-white leading-tight line-clamp-2">
              {currentName}
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex items-center gap-3 mb-3">
            
            {/* Bouton Play/Pause */}
            <button
              onClick={handleTogglePlay}
              disabled={(useRadio && !isRadioOnline) || (!useRadio && !isReady)}
              className="w-10 h-10 border border-white/40 hover:border-white hover:bg-white/10 transition-all flex items-center justify-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
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

            {/* Status */}
            <div className="flex-1 text-[9px] text-white/50">
              {useRadio ? (
                isChecking ? 'Checking...' : isRadioOnline ? '● Live Stream' : '⚠ Offline'
              ) : (
                isReady ? '● Mixcloud' : 'Loading...'
              )}
            </div>

            {/* Lien Mixcloud */}
            {!useRadio && (
              <a 
                href={currentShow?.url || LAST_MIXCLOUD.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] text-white/40 hover:text-white/70 uppercase tracking-wider transition-colors"
              >
                View →
              </a>
            )}
          </div>

          {/* Switch Radio / Mixcloud */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            
            {/* Label Mixcloud */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full transition-all ${
                !useRadio ? 'bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-white/20'
              }`} />
              <span className={`text-[10px] uppercase tracking-wider transition-colors ${
                !useRadio ? 'text-white font-bold' : 'text-white/40'
              }`}>
                Mixcloud
              </span>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer mx-4">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={useRadio}
                onChange={(e) => handleSwitch(e.target.checked)}
              />
              <div className="w-14 h-7 bg-white/20 peer-focus:outline-none rounded-full peer transition-all duration-300 peer-checked:bg-white/30"></div>
              <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 peer-checked:translate-x-7"></span>
            </label>

            {/* Label Radio */}
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase tracking-wider transition-colors ${
                useRadio ? 'text-white font-bold' : 'text-white/40'
              }`}>
                Radio
              </span>
              <div className={`w-2 h-2 rounded-full transition-all ${
                useRadio ? (isRadioOnline ? 'bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-red-500') : 'bg-white/20'
              }`} />
            </div>
          </div>

          {/* Messages d'erreur */}
          {useRadio && !isRadioOnline && (
            <div className="mt-2 text-[8px] text-red-400/70 uppercase tracking-wider text-center">
              ⚠ Radio stream unavailable
            </div>
          )}
        </div>
      </div>
    </>
  );
}