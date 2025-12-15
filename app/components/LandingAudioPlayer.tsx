'use client';

import { useEffect, useState } from 'react';
import { usePlayer } from '@/app/context/PlayerContext';

type Mode = 'video' | 'radio';

interface Props {
  isLive: boolean;
  onWatchVideo: () => void;
  onCloseVideo: () => void;
}

export default function LandingAudioPlayer({
  isLive,
  onWatchVideo,
  onCloseVideo,
}: Props) {
  const { isPlaying, playShow, togglePlay } = usePlayer();
  const [mode, setMode] = useState<Mode>('radio');

  // 🔁 Synchronisation mode
  useEffect(() => {
    if (mode === 'video') {
      onWatchVideo();
    } else {
      onCloseVideo();
    }
  }, [mode]);

  return (
    <div className="
      w-full md:w-96
      bg-black/95 backdrop-blur-xl
      border-t md:border border-white/20
      md:rounded-xl shadow-2xl
      font-mono
      select-none
      z-40
    ">
      <div className="p-4">

        {/* TITRE */}
        <div className="mb-4 text-center pointer-events-none">
          <div className="text-[9px] uppercase tracking-[0.25em] text-white/40">
            Still FM
          </div>
          <div className="text-sm font-bold text-white">
            Montreal Underground Radio
          </div>
        </div>

        {/* TOGGLE */}
        <div className="flex items-center justify-between mb-4 px-2">
          <button
            onClick={() => setMode('video')}
            className={`text-xs uppercase tracking-wider px-3 py-2 rounded transition
              ${mode === 'video'
                ? 'bg-white text-black font-bold'
                : 'text-white/50 hover:text-white'}
            `}
          >
            Live Video
          </button>

          {/* SWITCH */}
          <div
            className="relative w-14 h-7 flex-shrink-0"
            onClick={() => setMode(mode === 'video' ? 'radio' : 'video')}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full" />
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform
                ${mode === 'radio' ? 'translate-x-7' : 'translate-x-1'}
              `}
            />
          </div>

          <button
            onClick={() => setMode('radio')}
            className={`text-xs uppercase tracking-wider px-3 py-2 rounded transition
              ${mode === 'radio'
                ? 'bg-white text-black font-bold'
                : 'text-white/50 hover:text-white'}
            `}
          >
            Radio
          </button>
        </div>

        {/* ACTION PRINCIPALE */}
        <div className="mb-3">
          {mode === 'video' ? (
            <button
              onClick={onWatchVideo}
              disabled={!isLive}
              className="
                w-full py-3 border border-white/50
                text-xs uppercase tracking-widest
                hover:bg-white hover:text-black
                transition disabled:opacity-30
              "
            >
              {isLive ? 'Watch Live' : 'Offline'}
            </button>
          ) : (
            <button
              onClick={togglePlay}
              className="
                w-full py-3 border border-white/50
                text-xs uppercase tracking-widest
                hover:bg-white hover:text-black
                transition
              "
            >
              {isPlaying ? 'Pause Radio' : 'Listen Live'}
            </button>
          )}
        </div>

        {/* STATUS */}
        <div className="text-center text-[10px] text-white/60 mb-4">
          {mode === 'video'
            ? isLive ? '🔴 Live on air' : '⚫ Offline'
            : isPlaying ? '📻 Playing live radio' : '📻 Radio'}
        </div>

        {/* CTA ENTER */}
        <a
          href="/home"
          className="
            block w-full text-center
            py-3 border border-white/30
            text-xs uppercase tracking-[0.25em]
            text-white/70 hover:bg-white hover:text-black
            transition
          "
        >
          Enter Archive →
        </a>
      </div>
    </div>
  );
}
