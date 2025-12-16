'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

interface LandingAudioPlayerProps {
  isLive: boolean;
  onWatchVideo: () => void;
  onCloseVideo: () => void;
}

const LAST_MIXCLOUD_KEY = '/StillFM/2023-07-23-dante-maxwell-sk7-cooper-richardson-le-keyhole-ep-18-160bpm-edition-part-4/';
const RADIO_STREAM_URL = 'http://radio.stillfm.com:8000/stream';

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

export default function LandingAudioPlayer({ isLive, onWatchVideo, onCloseVideo }: LandingAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [useRadio, setUseRadio] = useState(false);
  const [isRadioOnline, setIsRadioOnline] = useState(false);
  const [isCheckingRadio, setIsCheckingRadio] = useState(true);
  
  const widgetRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const radioRef = useRef<HTMLAudioElement>(null);

  // Vérifier si la radio est en ligne
  useEffect(() => {
    const checkRadio = async () => {
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
        setIsRadioOnline(false);
      } finally {
        setIsCheckingRadio(false);
      }
    };

    checkRadio();
    const interval = setInterval(checkRadio, 30000);
    return () => clearInterval(interval);
  }, []);

  // Initialiser le widget Mixcloud
  const initWidget = useCallback(() => {
    if (!iframeRef.current || widgetRef.current || !(window as any).Mixcloud) return;

    const widget = (window as any).Mixcloud.PlayerWidget(iframeRef.current);
    widgetRef.current = widget;

    widget.ready.then(() => {
      setIsReady(true);
      widget.load(LAST_MIXCLOUD_KEY, false);
      
      widget.events.play.on(() => setIsPlaying(true));
      widget.events.pause.on(() => setIsPlaying(false));
    });
  }, []);

  useMixcloudScript(initWidget);

  // Toggle Play/Pause
  const handleTogglePlay = () => {
    if (useRadio && radioRef.current) {
      if (isPlaying) {
        radioRef.current.pause();
      } else {
        radioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    } else if (!useRadio && widgetRef.current && isReady) {
      if (isPlaying) {
        widgetRef.current.pause();
      } else {
        widgetRef.current.play();
      }
    }
  };

  // Switch Radio/Mixcloud
  const handleSwitch = (toRadio: boolean) => {
    setUseRadio(toRadio);

    if (toRadio) {
      if (isRadioOnline && radioRef.current) {
        if (widgetRef.current && isReady) {
          widgetRef.current.pause();
        }
        radioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    } else {
      if (radioRef.current) {
        radioRef.current.pause();
      }
      if (widgetRef.current && isReady) {
        widgetRef.current.load(LAST_MIXCLOUD_KEY, true);
        setIsPlaying(true);
      }
    }
  };

  const currentTitle = useRadio 
    ? (isRadioOnline ? 'Still FM Radio - Live Stream' : 'Radio Offline')
    : 'Latest Mixcloud Show';

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
        src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(LAST_MIXCLOUD_KEY)}`}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        allow="autoplay"
      />

      {/* UI Player */}
      <div className="w-full md:w-96 backdrop-blur-md bg-black/90 border border-white/20 hover:border-white/40 transition-all duration-300 font-mono">
        <div className="p-4 md:p-6">
          
          {/* Titre */}
          <div className="mb-4">
            <div className="text-[9px] text-white/50 uppercase tracking-[0.15em] mb-2">
              Now Playing
            </div>
            <div className="text-xs md:text-sm text-white leading-tight">
              {currentTitle}
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex items-center gap-4 mb-4">
            
            {/* Play/Pause */}
            <button
              onClick={handleTogglePlay}
              disabled={(useRadio && !isRadioOnline) || (!useRadio && !isReady)}
              className="w-12 h-12 md:w-14 md:h-14 border-2 border-white/40 hover:border-white hover:bg-white/10 transition-all flex items-center justify-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isPlaying ? (
                <div className="flex gap-1.5">
                  <div className="w-1 h-5 bg-white" />
                  <div className="w-1 h-5 bg-white" />
                </div>
              ) : (
                <div className="w-0 h-0 border-l-[14px] border-l-white border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
              )}
            </button>

            {/* Status */}
            <div className="flex-1 text-[10px] text-white/50 uppercase tracking-wider">
              {useRadio ? (
                isCheckingRadio ? 'Checking...' : isRadioOnline ? '● Live Radio' : '⚠ Offline'
              ) : (
                isReady ? '● Mixcloud' : 'Loading...'
              )}
            </div>
          </div>

          {/* Switch Radio / Mixcloud */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
            
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

          {/* Actions */}
          <div className="flex flex-col gap-2">
            
            {/* Watch Live (si disponible) */}
            {isLive && (
              <button
                onClick={onWatchVideo}
                className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2.5 text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2"
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Watch Live Stream
              </button>
            )}

            {/* Enter Site */}
            <Link
              href="/home"
              className="w-full bg-white hover:bg-gray-200 text-black px-4 py-2.5 text-xs uppercase tracking-wider font-bold transition-all text-center"
            >
              Enter Site →
            </Link>
          </div>

          {/* Messages d'erreur */}
          {useRadio && !isRadioOnline && (
            <div className="mt-3 text-[8px] text-red-400/70 uppercase tracking-wider text-center">
              ⚠ Radio stream unavailable
            </div>
          )}
        </div>
      </div>
    </>
  );
}
