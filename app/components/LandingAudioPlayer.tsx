‘use client’;

import { useState, useEffect, useRef } from ‘react’;
import Link from ‘next/link’;

const RADIO_STREAM_URL = process.env.NEXT_PUBLIC_RADIO_URL || ‘’;
const RADIO_ENABLED = !!RADIO_STREAM_URL;

interface LandingAudioPlayerProps {
isLive: boolean;
}

export default function LandingAudioPlayer({ isLive }: LandingAudioPlayerProps) {
const [source, setSource] = useState<‘twitch’ | ‘radio’>(‘twitch’);
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

```
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
```

}, []);

// Switch entre Twitch et Radio
const handleSwitch = (toRadio: boolean) => {
setSource(toRadio ? ‘radio’ : ‘twitch’);
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
if (source === ‘twitch’) {
return isLive
? ‘🔴 Live now’
: ‘⚫ Stream offline’;
} else {
return isRadioOnline
? ‘📻 Radio live’
: (RADIO_ENABLED ? ‘⚠ Radio offline’ : ‘📻 Coming soon’);
}
};

const currentName = source === ‘twitch’
? ‘Still FM - Live Stream’
: ‘Still FM - Radio’;

// Ne rien afficher pendant check initial
if (isCheckingTwitch) {
return null;
}

const canInteract = source === ‘twitch’ ? isLive : (RADIO_ENABLED && isRadioOnline);

return (
<>
{/* Audio HTML5 pour la radio */}
{RADIO_ENABLED && (
<audio ref={radioRef} src={RADIO_STREAM_URL} preload="none" className="hidden" />
)}

```
  {/* ✅ PLAYER - CONTROL CENTER COMPLET */}
  <div className="backdrop-blur-md bg-black/95 border border-white/20 hover:border-white/40 transition-all duration-300 font-mono w-full md:w-96 rounded-lg overflow-hidden shadow-2xl">
    
    <div className="p-4">
      
      {/* Titre */}
      <div className="mb-3">
        <div className="text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1">
          {source === 'twitch' ? 'Live Stream' : 'Radio Stream'}
        </div>
        <div className="text-[11px] text-white leading-tight font-bold">
          {currentName}
        </div>
      </div>

      {/* ✅ BOUTON PRINCIPAL - WATCH ou PLAY */}
      <div className="mb-3">
        {source === 'twitch' ? (
          // BOUTON WATCH pour Twitch
          <button
            onClick={handleWatchTwitch}
            disabled={!isLive}
            className="w-full border border-white/40 hover:border-white hover:bg-white hover:text-black transition-all py-3 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
          >
            <div className="w-0 h-0 border-l-[10px] border-l-current border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent" />
            <span className="text-[10px] uppercase tracking-wider font-bold">
              {isLive ? 'Watch Stream' : 'Offline'}
            </span>
          </button>
        ) : (
          // BOUTON PLAY pour Radio
          <button
            onClick={handlePlayRadio}
            disabled={!isRadioOnline}
            className="w-full border border-white/40 hover:border-white hover:bg-white hover:text-black transition-all py-3 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
          >
            {isPlaying ? (
              <>
                <div className="flex gap-1">
                  <div className="w-[3px] h-4 bg-current" />
                  <div className="w-[3px] h-4 bg-current" />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold">Pause</span>
              </>
            ) : (
              <>
                <div className="w-0 h-0 border-l-[10px] border-l-current border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent" />
                <span className="text-[10px] uppercase tracking-wider font-bold">
                  {isRadioOnline ? 'Play Radio' : (RADIO_ENABLED ? 'Offline' : 'Coming Soon')}
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Status */}
      <div className="text-[9px] text-white/60 text-center mb-3">
        {getStatusMessage()}
      </div>

      {/* ✅ TOGGLE TWITCH/RADIO */}
      <div className="flex items-center justify-between py-3 border-y border-white/10">
        
        {/* Twitch */}
        <button
          onClick={() => handleSwitch(false)}
          className={`flex items-center gap-1.5 transition-all ${
            source === 'twitch' ? 'opacity-100' : 'opacity-40 hover:opacity-60'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${
            source === 'twitch' 
              ? (isLive ? 'bg-purple-500 animate-pulse' : 'bg-purple-900') 
              : 'bg-white/20'
          }`} />
          <span className={`text-[10px] uppercase ${
            source === 'twitch' ? 'text-white font-bold' : 'text-white/40'
          }`}>
            Twitch
          </span>
        </button>

        {/* Toggle Visual */}
        <div className="relative w-14 h-7">
          <div className="w-full h-full bg-white/20 rounded-full"></div>
          <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${
            source === 'radio' ? 'translate-x-7' : 'translate-x-0'
          }`}></div>
        </div>

        {/* Radio */}
        <button
          onClick={() => handleSwitch(true)}
          className={`flex items-center gap-1.5 transition-all ${
            source === 'radio' ? 'opacity-100' : 'opacity-40 hover:opacity-60'
          }`}
        >
          <span className={`text-[10px] uppercase ${
            source === 'radio' ? 'text-white font-bold' : 'text-white/40'
          }`}>
            Radio
          </span>
          <div className={`w-1.5 h-1.5 rounded-full ${
            source === 'radio' 
              ? (isRadioOnline ? 'bg-green-400 animate-pulse' : (RADIO_ENABLED ? 'bg-red-500' : 'bg-white/20')) 
              : 'bg-white/20'
          }`} />
        </button>
      </div>

      {/* ✅ ENTER ARCHIVE LINK */}
      <Link 
        href="/home"
        className="block text-center pt-3 group"
      >
        <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider text-white/50 hover:text-white transition-all">
          <span>Enter Archive</span>
          <svg 
            className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" 
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
