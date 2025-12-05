'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePlayer } from '../context/PlayerContext';

const RADIO_STREAM_URL = 'http://localhost:8000/steelfm.mp3';

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
  const [useRadio, setUseRadio] = useState(false);
  const [isRadioOnline, setIsRadioOnline] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const radioRef = useRef<HTMLAudioElement>(null);
  const widgetRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const checkRadio = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(RADIO_STREAM_URL, { 
          method: 'HEAD',
          signal: controller.signal 
        });
        clearTimeout(timeoutId);
        setIsRadioOnline(res.ok);
      } catch {
        setIsRadioOnline(false);
      }
    };
    checkRadio();
    const interval = setInterval(checkRadio, 30000);
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    if (!currentShow && !useRadio) {
      const fetchLatest = async () => {
        try {
          const res = await fetch('https://api.mixcloud.com/StillFM/cloudcasts/?limit=1');
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            playShow({
              key: data.data[0].key,
              name: data.data[0].name,
              url: data.data[0].url,
              img: data.data[0].pictures?.extra_large
            });
          }
        } catch (e) {
          console.error('Error fetching show:', e);
        }
      };
      fetchLatest();
    }
  }, [currentShow, useRadio, playShow]);

  useEffect(() => {
    if (widgetRef.current && currentShow && !useRadio && isReady) {
      widgetRef.current.load(currentShow.key, isPlaying);
    }
  }, [currentShow, useRadio, isReady, isPlaying]);

  useEffect(() => {
    if (widgetRef.current && isReady && !useRadio) {
      if (isPlaying) widgetRef.current.play();
      else widgetRef.current.pause();
    }
  }, [isPlaying, isReady, useRadio]);

  const handleSwitch = (toRadio: boolean) => {
    setUseRadio(toRadio);

    if (toRadio && isRadioOnline) {
      if (widgetRef.current && isReady) widgetRef.current.pause();
      if (radioRef.current) {
        radioRef.current.play().catch(console.error);
      }
      playShow({ 
        key: 'radio-live', 
        name: 'Still FM Radio - Live Stream', 
        url: RADIO_STREAM_URL 
      });
    } else {
      if (radioRef.current) radioRef.current.pause();
      if (currentShow && widgetRef.current && isReady) {
        widgetRef.current.load(currentShow.key, true);
      }
    }
  };

  const handleToggle = () => {
    if (useRadio && radioRef.current) {
      if (isPlaying) radioRef.current.pause();
      else radioRef.current.play().catch(console.error);
    } else if (widgetRef.current && isReady) {
      if (isPlaying) widgetRef.current.pause();
      else widgetRef.current.play();
    }
    togglePlay();
  };

  const currentName = useRadio 
    ? (isRadioOnline ? 'Still FM Radio - Live Stream' : 'Radio Offline')
    : (currentShow?.name || 'Loading...');

  return (
    <>
      <audio ref={radioRef} src={RADIO_STREAM_URL} preload="none" className="hidden" />

      <iframe
        ref={iframeRef}
        src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(currentShow?.key || '/StillFM/')}`}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        allow="autoplay; encrypted-media"
      />

      {/* UI Player - Plus compact sur mobile */}
      <div className="backdrop-blur-md bg-black/95 border-t md:border border-white/20 hover:border-white/40 transition-all duration-300 font-mono w-full md:w-96 md:rounded-lg overflow-hidden">
        
        <div className="p-3 md:p-4">
          
          {/* Titre - Une seule ligne sur mobile */}
          <div className="mb-2">
            <div className="text-[8px] md:text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1">
              Now Playing
            </div>
            <div className="text-[10px] md:text-[11px] text-white leading-tight line-clamp-1">
              {currentName}
            </div>
          </div>

          {/* Contrôles - Plus compacts */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handleToggle}
              disabled={(useRadio && !isRadioOnline) || (!useRadio && !isReady)}
              className="w-8 h-8 md:w-10 md:h-10 border border-white/40 hover:border-white hover:bg-white/10 transition-all flex items-center justify-center disabled:opacity-30 shrink-0"
            >
              {isPlaying ? (
                <div className="flex gap-1">
                  <div className="w-[2px] md:w-[3px] h-3 md:h-4 bg-white" />
                  <div className="w-[2px] md:w-[3px] h-3 md:h-4 bg-white" />
                </div>
              ) : (
                <div className="w-0 h-0 border-l-[8px] md:border-l-[10px] border-l-white border-t-[6px] md:border-t-[7px] border-t-transparent border-b-[6px] md:border-b-[7px] border-b-transparent ml-[2px]" />
              )}
            </button>

            <div className="flex-1 text-[8px] md:text-[9px] text-white/50">
              {useRadio ? (isRadioOnline ? '● Live' : '⚠ Offline') : (isReady ? '● Mixcloud' : 'Loading...')}
            </div>

            {!useRadio && currentShow && (
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

          {/* Switch - Plus compact */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${!useRadio ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`} />
              <span className={`text-[9px] md:text-[10px] uppercase ${!useRadio ? 'text-white font-bold' : 'text-white/40'}`}>
                Mixcloud
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer mx-2">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={useRadio}
                onChange={(e) => handleSwitch(e.target.checked)}
              />
              <div className="w-12 h-6 md:w-14 md:h-7 bg-white/20 rounded-full peer transition-all peer-checked:bg-white/30"></div>
              <span className="absolute left-1 top-1 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow-lg transform transition-transform peer-checked:translate-x-6 md:peer-checked:translate-x-7"></span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] md:text-[10px] uppercase ${useRadio ? 'text-white font-bold' : 'text-white/40'}`}>
                Radio
              </span>
              <div className={`w-1.5 h-1.5 rounded-full ${useRadio ? (isRadioOnline ? 'bg-green-400 animate-pulse' : 'bg-red-500') : 'bg-white/20'}`} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
