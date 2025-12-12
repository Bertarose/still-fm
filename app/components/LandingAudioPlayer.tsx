'use client';

import { useState, useEffect, useRef } from 'react';

// ✅ FIX: Use env variable instead of hardcoded localhost
const RADIO_STREAM_URL = process.env.NEXT_PUBLIC_RADIO_URL || '';
const RADIO_ENABLED = !!RADIO_STREAM_URL; // Auto-disable si pas d'URL

export default function LandingAudioPlayer() {
  const [source, setSource] = useState<'twitch' | 'radio'>('twitch');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTwitchLive, setIsTwitchLive] = useState(false);
  const [isRadioOnline, setIsRadioOnline] = useState(false);
  
  const radioRef = useRef<HTMLAudioElement>(null);

  // Vérifier si Twitch est live
  useEffect(() => {
    const checkTwitch = async () => {
      try {
        const res = await fetch('https://decapi.me/twitch/uptime/bertarose');
        const text = await res.text();
        setIsTwitchLive(!(text.includes('offline') || text.includes('error')));
      } catch {
        setIsTwitchLive(false);
      }
    };
    checkTwitch();
    const interval = setInterval(checkTwitch, 60000);
    return () => clearInterval(interval);
  }, []);

  // ✅ FIX: Only check radio if enabled
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

  // Toggle Play/Pause pour Radio
  const handleToggle = () => {
    if (source === 'radio' && radioRef.current) {
      if (isPlaying) {
        radioRef.current.pause();
        setIsPlaying(false);
      } else {
        radioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  // ✅ IMPROVED: Clearer status messages
  const getStatusMessage = () => {
    if (source === 'twitch') {
      return isTwitchLive 
        ? '🔴 Live - Use "Watch Stream" button above' 
        : '⚫ Stream offline';
    } else {
      return isRadioOnline 
        ? '📻 Radio live' 
        : '⚠ Radio offline';
    }
  };

  const currentName = source === 'twitch'
    ? 'Still FM - Twitch Stream'
    : 'Still FM - Radio Stream';

  // ✅ Don't show player if Twitch live (use Watch Stream button instead)
  if (source === 'twitch' && isTwitchLive) {
    return null;
  }

  // ✅ Don't show player if no radio and Twitch offline
  if (!RADIO_ENABLED && !isTwitchLive) {
    return null;
  }

  return (
    <>
      {/* Audio HTML5 pour la radio */}
      {RADIO_ENABLED && (
        <audio ref={radioRef} src={RADIO_STREAM_URL} preload="none" className="hidden" />
      )}

      {/* Player UI - ✅ SIMPLIFIED */}
      <div className="backdrop-blur-md bg-black/95 border-t md:border border-white/20 hover:border-white/40 transition-all duration-300 font-mono w-full md:w-96 md:rounded-lg overflow-hidden">
        
        <div className="p-3 md:p-4">
          
          {/* Titre */}
          <div className="mb-2">
            <div className="text-[8px] md:text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1">
              Audio Stream
            </div>
            <div className="text-[10px] md:text-[11px] text-white leading-tight line-clamp-1">
              {currentName}
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex items-center gap-3 mb-2">
            
            {/* Bouton Play/Pause (seulement pour Radio) */}
            {source === 'radio' && RADIO_ENABLED && (
              <button
                onClick={handleToggle}
                disabled={!isRadioOnline}
                className="w-8 h-8 md:w-10 md:h-10 border border-white/40 hover:border-white hover:bg-white/10 transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                {isPlaying ? (
                  // Pause
                  <div className="flex gap-1">
                    <div className="w-[2px] md:w-[3px] h-3 md:h-4 bg-white" />
                    <div className="w-[2px] md:w-[3px] h-3 md:h-4 bg-white" />
                  </div>
                ) : (
                  // Play
                  <div className="w-0 h-0 border-l-[8px] md:border-l-[10px] border-l-white border-t-[6px] md:border-t-[7px] border-t-transparent border-b-[6px] md:border-b-[7px] border-b-transparent ml-[2px]" />
                )}
              </button>
            )}

            {/* Status - ✅ CLEARER */}
            <div className="flex-1 text-[9px] md:text-[10px] text-white/70">
              {getStatusMessage()}
            </div>
          </div>

          {/* Switch Twitch/Radio - ✅ ONLY IF RADIO ENABLED */}
          {RADIO_ENABLED && (
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              
              {/* Twitch */}
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${source === 'twitch' ? (isTwitchLive ? 'bg-purple-500 animate-pulse' : 'bg-purple-900') : 'bg-white/20'}`} />
                <span className={`text-[9px] md:text-[10px] uppercase ${source === 'twitch' ? 'text-white font-bold' : 'text-white/40'}`}>
                  Twitch
                </span>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer mx-2">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={source === 'radio'}
                  onChange={(e) => handleSwitch(e.target.checked)}
                />
                <div className="w-12 h-6 md:w-14 md:h-7 bg-white/20 rounded-full peer transition-all peer-checked:bg-white/30"></div>
                <span className="absolute left-1 top-1 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow-lg transform transition-transform peer-checked:translate-x-6 md:peer-checked:translate-x-7"></span>
              </label>

              {/* Radio */}
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] md:text-[10px] uppercase ${source === 'radio' ? 'text-white font-bold' : 'text-white/40'}`}>
                  Radio
                </span>
                <div className={`w-1.5 h-1.5 rounded-full ${source === 'radio' ? (isRadioOnline ? 'bg-green-400 animate-pulse' : 'bg-red-500') : 'bg-white/20'}`} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
