'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const RADIO_STREAM_URL = process.env.NEXT_PUBLIC_RADIO_URL || '';
const RADIO_ENABLED = !!RADIO_STREAM_URL;

interface LandingAudioPlayerProps {
  isLive: boolean;
}

export default function LandingAudioPlayer({ isLive }: LandingAudioPlayerProps) {
  const [source, setSource] = useState<'twitch' | 'radio'>('twitch');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRadioOnline, setIsRadioOnline] = useState(false);
  const [isCheckingTwitch, setIsCheckingTwitch] = useState(true);
  
  const radioRef = useRef<HTMLAudioElement>(null);

  // Marquer comme vérifié après un court délai
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingTwitch(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Vérifier si radio online (si activée)
  useEffect(() => {
    if (!RADIO_ENABLED) {
      setIsRadioOnline(false);
      return;
    }

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

  // Switch entre Twitch et Radio
  const handleSwitch = (toRadio: boolean) => {
    setSource(toRadio ? 'radio' : 'twitch');
    setIsPlaying(false);
    if (radioRef.current) {
      radioRef.current.pause();
    }
  };

  // WATCH TWITCH
  const handleWatchTwitch = () => {
    if ((window as any).openTwitchWatch) {
      (window as any).openTwitchWatch();
    }
  };

  // PLAY RADIO
  const handlePlayRadio = () => {
    if (radioRef.current) {
      if (isPlaying) {
        radioRef.current.pause();
        setIsPlaying(false);
      } else {
        radioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  // Status message
  const getStatusMessage = () => {
    if (source === 'twitch') {
      return isLive 
        ? '🔴 Live now' 
        : '⚫ Stream offline';
    } else {
      return isRadioOnline 
        ? '📻 Radio live' 
        : (RADIO_ENABLED ? '⚠ Radio offline' : '📻 Coming soon');
    }
  };

  const currentName = source === 'twitch'
    ? 'Still FM - Live Stream'
    : 'Still FM - Radio';

  // Ne rien afficher pendant check initial
  if (isCheckingTwitch) {
    return null;
  }

  return (
    <>
      {/* Audio HTML5 pour la radio */}
      {RADIO_ENABLED && (
        <audio ref={radioRef} src={RADIO_STREAM_URL} preload="none" className="hidden" />
      )}

      {/* PLAYER - MOBILE RESPONSIVE */}
      <div className="backdrop-blur-md bg-black/95 border-t border-white/20 transition-all duration-300 font-mono w-full md:w-96 md:rounded-lg overflow-hidden shadow-2xl md:border">
        
        <div className="p-4 md:p-4">
          
          {/* Titre */}
          <div className="mb-3">
            <div className="text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1">
              {source === 'twitch' ? 'Live Stream' : 'Radio Stream'}
            </div>
            <div className="text-sm md:text-[11px] text-white leading-tight font-bold">
              {currentName}
            </div>
          </div>

          {/* BOUTON PRINCIPAL - RESPONSIVE */}
          <div className="mb-3">
            {source === 'twitch' ? (
              // BOUTON WATCH pour Twitch
              <button
                onClick={handleWatchTwitch}
                disabled={!isLive}
                className="w-full border-2 border-white/60 hover:border-white hover:bg-white hover:text-black transition-all py-4 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
              >
                <div className="w-0 h-0 border-l-[12px] border-l-current border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent" />
                <span className="text-sm md:text-[10px] uppercase tracking-wider font-bold">
                  {isLive ? 'Watch Stream' : 'Offline'}
                </span>
              </button>
            ) : (
              // BOUTON PLAY pour Radio
              <button
                onClick={handlePlayRadio}
                disabled={!isRadioOnline}
                className="w-full border-2 border-white/60 hover:border-white hover:bg-white hover:text-black transition-all py-4 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
              >
                {isPlaying ? (
                  <>
                    <div className="flex gap-1">
                      <div className="w-[3px] h-5 bg-current" />
                      <div className="w-[3px] h-5 bg-current" />
                    </div>
                    <span className="text-sm md:text-[10px] uppercase tracking-wider font-bold">Pause</span>
                  </>
                ) : (
                  <>
                    <div className="w-0 h-0 border-l-[12px] border-l-current border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent" />
                    <span className="text-sm md:text-[10px] uppercase tracking-wider font-bold">
                      {isRadioOnline ? 'Play Radio' : (RADIO_ENABLED ? 'Offline' : 'Coming Soon')}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Status */}
          <div className="text-[10px] md:text-[9px] text-white/60 text-center mb-3">
            {getStatusMessage()}
          </div>

          {/* TOGGLE TWITCH/RADIO - CLICKABLE */}
          <div className="flex items-center justify-between py-3 border-y border-white/10">
            
            {/* Twitch - BUTTON CLICKABLE */}
            <button
              onClick={() => handleSwitch(false)}
              className={`flex items-center gap-2 transition-all py-2 px-3 rounded ${
                source === 'twitch' ? 'opacity-100 bg-white/10' : 'opacity-50 hover:opacity-80'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                source === 'twitch' 
                  ? (isLive ? 'bg-purple-500 animate-pulse' : 'bg-purple-900') 
                  : 'bg-white/20'
              }`} />
              <span className={`text-xs md:text-[10px] uppercase ${
                source === 'twitch' ? 'text-white font-bold' : 'text-white/40'
              }`}>
                Twitch
              </span>
            </button>

            {/* Toggle Visual - AUSSI CLICKABLE */}
            <button
              onClick={() => handleSwitch(source === 'twitch')}
              className="relative w-16 h-8 md:w-14 md:h-7 focus:outline-none"
            >
              <div className="w-full h-full bg-white/20 rounded-full"></div>
              <div className={`absolute top-1 left-1 w-6 h-6 md:w-5 md:h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${
                source === 'radio' ? 'translate-x-8 md:translate-x-7' : 'translate-x-0'
              }`}></div>
            </button>

            {/* Radio - BUTTON CLICKABLE */}
            <button
              onClick={() => handleSwitch(true)}
              className={`flex items-center gap-2 transition-all py-2 px-3 rounded ${
                source === 'radio' ? 'opacity-100 bg-white/10' : 'opacity-50 hover:opacity-80'
              }`}
            >
              <span className={`text-xs md:text-[10px] uppercase ${
                source === 'radio' ? 'text-white font-bold' : 'text-white/40'
              }`}>
                Radio
              </span>
              <div className={`w-2 h-2 rounded-full ${
                source === 'radio' 
                  ? (isRadioOnline ? 'bg-green-400 animate-pulse' : (RADIO_ENABLED ? 'bg-red-500' : 'bg-white/20')) 
                  : 'bg-white/20'
              }`} />
            </button>
          </div>

          {/* ENTER ARCHIVE LINK - RESPONSIVE */}
          <Link 
            href="/home"
            className="block text-center pt-3 group"
          >
            <div className="flex items-center justify-center gap-2 text-sm md:text-[10px] uppercase tracking-wider text-white/60 hover:text-white transition-all font-bold">
              <span>Enter site</span>
              <svg 
                className="w-4 h-4 md:w-3 md:h-3 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
