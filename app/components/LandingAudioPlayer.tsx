'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

interface LandingAudioPlayerProps {
  isLive: boolean;
  onWatchVideo: () => void;
  onCloseVideo: () => void;
}

const LAST_MIXCLOUD_KEY = '/StillFM/2023-07-23-dante-maxwell-sk7-cooper-richardson-le-keyhole-ep-18-160bpm-edition-part-4/';

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
  const [currentTitle, setCurrentTitle] = useState('Loading...');
  
  const widgetRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  const handleTogglePlay = () => {
    if (!widgetRef.current || !isReady) return;
    
    if (isPlaying) {
      widgetRef.current.pause();
    } else {
      widgetRef.current.play();
    }
  };

  return (
    <>
      {/* Widget Mixcloud invisible */}
      <iframe
        ref={iframeRef}
        src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(LAST_MIXCLOUD_KEY)}`}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        allow="autoplay"
      />

      {/* UI Player */}
      <div className="w-full md:w-auto backdrop-blur-md bg-black/90 border border-white/20 hover:border-white/40 transition-all duration-300 font-mono">
        <div className="p-4 md:p-6">
          
          {/* Titre */}
          <div className="mb-4">
            <div className="text-[9px] text-white/50 uppercase tracking-[0.15em] mb-2">
              Latest Mixcloud Show
            </div>
            <div className="text-xs md:text-sm text-white leading-tight">
              Dante Maxwell, SK7, Cooper Richardson @ Le Keyhole
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex items-center gap-4 mb-4">
            
            {/* Play/Pause */}
            <button
              onClick={handleTogglePlay}
              disabled={!isReady}
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
              {isReady ? '● Mixcloud Ready' : 'Loading...'}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            
            {/* Watch Live (si disponible) */}
            {isLive && (
              <button
                onClick={onWatchVideo}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2"
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Watch Live Stream
              </button>
            )}

            {/* Enter Site */}
            <Link
              href="/home"
              className="flex-1 bg-white hover:bg-gray-200 text-black px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all text-center"
            >
              Enter Site →
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
