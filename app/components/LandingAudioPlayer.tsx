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
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // 🔁 Sync mode → video / radio
  useEffect(() => {
    if (mode === 'video') {
      onWatchVideo();
    } else {
      onCloseVideo();
    }
  }, [mode, onWatchVideo, onCloseVideo]);

  // 🔊 Stop "connecting…" once audio plays
  useEffect(() => {
    if (isPlaying) setIsConnecting(false);
  }, [isPlaying]);

  // ======================
  // MINIMIZED (DESKTOP)
  // ======================
  if (isMinimized) {
    return (
      <div className="hidden md:block w-96 bg-black/95 backdrop-blur-xl border border-white/20 shadow-2xl font-mono">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 flex items-center justify-center border border-white/20">
              <span className="text-white text-xs font-bold">SF</span>
            </div>
            <div>
              <div className="text-[9px] text-white/40 uppercase tracking-wider">
                Still FM
              </div>
              <div className="text-xs text-white font-medium">
                Montreal Radio
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
              }`}
            />

            <button
              onClick={() => setIsMinimized(false)}
              className="border border-white/30 px-3 py-1.5 text-[10px] uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/5 hover:border-white/40 transition-all"
            >
              Expand ↑
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ======================
  // FULL PLAYER
  // ======================
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
      {/* Minimize (desktop only) */}
      <button
        onClick={() => setIsMinimized(true)}
        className="hidden md:block absolute -top-8 right-0 bg-black/90 border border-white/20 px-3 py-1 text-[10px] uppercase tracking-wider text-white/60 hover:text-white hover:border-white/40 transition-all"
      >
        Minimize ↓
      </button>

      <div className="p-5 md:p-6">

        {/* TITLE */}
        <div className="mb-5 text-center pointer-events-none">
          <div className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1">
            Still FM
          </div>
          <div className="text-xs md:text-sm font-bold text-white">
            Montreal Underground Radio
          </div>
        </div>

        {/* TOGGLE (secondary before interaction) */}
        <div
          className={`flex items-center justify-between mb-5 px-2 transition-opacity
            ${!hasInteracted ? 'opacity-50' : 'opacity-100'}
          `}
        >
          <button
            onClick={() => {
              setHasInteracted(true);
              setMode('video');
            }}
            className={`text-xs md:text-sm uppercase tracking-wider px-4 py-2 rounded transition
              ${
                mode === 'video'
                  ? 'bg-white text-black font-bold'
                  : 'text-white/50 hover:text-white'
              }
            `}
          >
            Live Video
          </button>

          <div
            className="relative w-16 h-8 flex-shrink-0 cursor-pointer"
            onClick={() => {
              setHasInteracted(true);
              setMode(mode === 'video' ? 'radio' : 'video');
            }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full" />
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-lg
                ${mode === 'radio' ? 'translate-x-8' : 'translate-x-1'}
              `}
            />
          </div>

          <button
            onClick={() => {
              setHasInteracted(true);
              setMode('radio');
            }}
            className={`text-xs md:text-sm uppercase tracking-wider px-4 py-2 rounded transition
              ${
                mode === 'radio'
                  ? 'bg-white text-black font-bold'
                  : 'text-white/50 hover:text-white'
              }
            `}
          >
            Radio
          </button>
        </div>

        {/* PRIMARY ACTION */}
        <div className="mb-4">
          {mode === 'video' ? (
            <button
              onClick={onWatchVideo}
              disabled={!isLive}
              className="
                w-full py-3 md:py-4 border border-white/50
                text-xs md:text-sm uppercase tracking-widest font-bold
                text-white [-webkit-text-fill-color:white]
                hover:bg-white hover:text-black
                transition disabled:opacity-30 disabled:cursor-not-allowed
              "
            >
              {isLive ? 'Watch Live Stream' : 'Stream Offline'}
            </button>
          ) : (
            <button
              onClick={() => {
                setHasInteracted(true);
                setIsConnecting(true);
                if (mode !== 'radio') setMode('radio');
                togglePlay();
              }}
              className="
                w-full py-3 md:py-4 border border-white/50
                text-xs md:text-sm uppercase tracking-widest font-bold
                text-white [-webkit-text-fill-color:white]
                hover:bg-white hover:text-black
                transition
              "
            >
              {isConnecting
                ? 'Connecting…'
                : isPlaying
                ? 'Pause Radio'
                : '▶︎ Listen Live'}
            </button>
          )}
        </div>

        {/* STATUS */}
        <div className="text-center text-xs md:text-sm text-white/60 mb-5 font-medium">
          {mode === 'video'
            ? isLive
              ? '🔴 Live video is on air'
              : '⚫ Stream currently offline'
            : isConnecting
            ? 'Connecting to live stream…'
            : isPlaying
            ? '📻 You’re listening live'
            : 'Tap to start listening'}
        </div>

        {/* CTA */}
        <a
          href="/home"
          className="
            block w-full text-center
            py-3 md:py-4 border border-white/30
            text-xs md:text-sm uppercase tracking-[0.25em] font-bold
            text-white/70 hover:bg-white hover:text-black
            transition
          "
        >
          {isLive ? 'Explore Shows & Archive →' : 'Browse Shows & Archive →'}
        </a>
      </div>
    </div>
  );
}
