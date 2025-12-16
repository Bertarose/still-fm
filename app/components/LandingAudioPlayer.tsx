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
  const { isPlaying, togglePlay } = usePlayer();
  const [mode, setMode] = useState<Mode>('radio');

  // 🔁 Synchronisation mode
  useEffect(() => {
    if (mode === 'video') {
      onWatchVideo();
    } else {
      onCloseVideo();
    }
  }, [mode, onWatchVideo, onCloseVideo]);

  return (
    <div
      className="
        w-full md:w-96
        bg-black/95 backdrop-blur-xl
        border-t md:border border-white/20
        shadow-2xl
        font-mono
        select-none
        z-40
        relative
      "
    >
      <div className="p-5 md:p-6">

        {/* TITRE */}
        <div className="mb-5 text-center pointer-events-none">
          <div className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1">
            Still FM
          </div>
          <div className="text-xs md:text-sm font-bold text-white">
            Montreal Underground Radio
          </div>
        </div>

        {/* TOGGLE */}
        <div className="flex items-center justify-between mb-5 px-2">
          <button
            onClick={() => setMode('video')}
            className={`text-xs md:text-sm uppercase tracking-wider px-4 py-2 rounded transition
              ${
                mode === 'video'
                  ? 'bg-white text-black font-bold'
                  : 'text-white/50 hover:text-white/90 hover:bg-white/10'
              }
            `}
          >
            Live Video
          </button>

          <div
            className="relative w-16 h-8 flex-shrink-0 cursor-pointer"
            onClick={() => setMode(mode === 'video' ? 'radio' : 'video')}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full" />
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-lg
                ${mode === 'radio' ? 'translate-x-8' : 'translate-x-1'}
              `}
            />
          </div>

          <button
            onClick={() => setMode('radio')}
            className={`text-xs md:text-sm uppercase tracking-wider px-4 py-2 rounded transition
              ${
                mode === 'radio'
                  ? 'bg-white text-black font-bold'
                  : 'text-white/50 hover:text-white/90 hover:bg-white/10'
              }
            `}
          >
            Radio
          </button>
        </div>

        {/* ACTION PRINCIPALE */}
        <div className="mb-4">
          {mode === 'video' ? (
            <button
              onClick={onWatchVideo}
              disabled={!isLive}
              className="
                w-full py-3 md:py-4 border border-white/50
                text-xs md:text-sm uppercase tracking-widest font-bold
                text-white
                hover:bg-white/10 hover:text-white/90
                transition disabled:opacity-30 disabled:cursor-not-allowed
              "
            >
              {isLive ? 'Watch Live Stream' : 'Stream Offline'}
            </button>
          ) : (
            <button
              onClick={togglePlay}
              className="
                w-full py-3 md:py-4 border border-white/50
                text-xs md:text-sm uppercase tracking-widest font-bold
                text-white
                hover:bg-white/10 hover:text-white/90
                transition
              "
            >
              {isPlaying ? 'Pause Radio' : 'Play Live Radio'}
            </button>
          )}
        </div>

        {/* STATUS */}
        <div className="text-center text-xs md:text-sm text-white/60 mb-5 font-medium">
          {mode === 'video'
            ? isLive
              ? '🔴 Live Stream Active'
              : '⚫ Stream Offline'
            : isPlaying
            ? '📻 Playing Live'
            : '📻 Radio Ready'}
        </div>

        {/* CTA */}
        <a
          href="/home"
          className="
            block w-full text-center
            py-3 md:py-4 border border-white/30
            text-xs md:text-sm uppercase tracking-[0.25em] font-bold
            text-white/70 hover:bg-white/10 hover:text-white/90
            transition
          "
        >
          {isLive ? 'Explore Shows & Archive →' : 'Browse Shows & Archive →'}
        </a>
      </div>
    </div>
  );
}
