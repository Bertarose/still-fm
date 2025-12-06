'use client';

import { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

// 🔧 FIX : Radio désactivée temporairement (pas de serveur local)
const RADIO_STREAM_URL = ''; // Vide = radio désactivée
const RADIO_ENABLED = false; // Set à true quand tu as un vrai stream

export default function LandingAudioPlayer() {
  const { currentShow, isPlaying, playShow, togglePlay } = usePlayer();
  const [useRadio, setUseRadio] = useState(false);
  const [isRadioOnline, setIsRadioOnline] = useState(false);
  
  const radioRef = useRef<HTMLAudioElement>(null);

  // Vérifier si la radio est online (seulement si activée)
  useEffect(() => {
    if (!RADIO_ENABLED || !RADIO_STREAM_URL) {
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

  // Charger le dernier show Mixcloud par défaut
  useEffect(() => {
    const loadDefaultShow = async () => {
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

    const timer = setTimeout(loadDefaultShow, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSwitch = (toRadio: boolean) => {
    if (!RADIO_ENABLED) {
      console.log('⚠️ Radio is disabled');
      return;
    }

    setUseRadio(toRadio);

    if (toRadio && isRadioOnline) {
      if (radioRef.current) {
        radioRef.current.play().catch(console.error);
      }
      playShow({ 
        key: 'radio-live', 
        name: 'Still FM Radio - Live Stream', 
        url: RADIO_STREAM_URL 
      });
    } else {
      if (radioRef.current) {
        radioRef.current.pause();
      }
    }
  };

  const handleToggle = () => {
    if (useRadio && radioRef.current) {
      if (isPlaying) {
        radioRef.current.pause();
      } else {
        radioRef.current.play().catch(console.error);
      }
    }
    togglePlay();
  };

  const currentName = useRadio 
    ? (isRadioOnline ? 'Still FM Radio - Live Stream' : 'Radio Offline')
    : (currentShow?.name || 'Loading...');

  return (
    <>
      {RADIO_ENABLED && RADIO_STREAM_URL && (
        <audio ref={radioRef} src={RADIO_STREAM_URL} preload="none" className="hidden" />
      )}

      <div className="backdrop-blur-md bg-black/95 border-t md:border border-white/20 hover:border-white/40 transition-all duration-300 font-mono w-full md:w-96 md:rounded-lg overflow-hidden">
        
        <div className="p-3 md:p-4">
          
          <div className="mb-2">
            <div className="text-[8px] md:text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1">
              Now Playing
            </div>
            <div className="text-[10px] md:text-[11px] text-white leading-tight line-clamp-1">
              {currentName}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handleToggle}
              disabled={(useRadio && !isRadioOnline) || (!useRadio && !currentShow)}
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
              {useRadio ? (isRadioOnline ? '● Live' : '⚠ Offline') : (currentShow ? '● Ready' : 'Loading...')}
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

          {/* Switch - Caché si radio désactivée */}
          {RADIO_ENABLED && (
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
          )}
        </div>
      </div>

      {currentShow && !useRadio && currentShow.key !== 'radio-live' && (
        <iframe
          key={currentShow.key}
          src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&autoplay=${isPlaying ? '1' : '0'}&feed=${encodeURIComponent(currentShow.key)}`}
          className="hidden"
          allow="autoplay"
        />
      )}
    </>
  );
}
