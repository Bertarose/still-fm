'use client';

import { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

interface AudioPlayerProps {
  src?: string; // URL de la radio (Oracle Cloud / Icecast)
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const { currentShow, isPlaying, togglePlay, playShow } = usePlayer();
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [radioOnline, setRadioOnline] = useState(true);

  const widgetRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- Initialisation Mixcloud ---
  useEffect(() => {
    if (!currentShow) {
      fetch('https://api.mixcloud.com/StillFM/cloudcasts/?limit=1')
        .then(res => res.json())
        .then(data => {
          if (data.data && data.data.length > 0) {
            const latest = data.data[0];
            playShow({
              key: latest.key,
              name: latest.name,
              url: latest.url,
              img: latest.pictures?.extra_large
            });
          }
        }).catch(console.error);
    }
  }, [currentShow, playShow]);

  useEffect(() => {
    if (iframeRef.current && !widgetRef.current && (window as any).Mixcloud) {
      const widget = (window as any).Mixcloud.PlayerWidget(iframeRef.current);
      widgetRef.current = widget;

      widget.ready.then(() => {
        setIsReady(true);
        widget.events.progress.on((progress: number) => setCurrentTime(progress));
      });
    }
  }, []);

  // --- Audio Oracle / Icecast ---
  useEffect(() => {
    if (!src) return;

    const audio = new Audio(src);
    audio.crossOrigin = 'anonymous';
    audio.autoplay = isPlaying;
    audio.loop = true;
    audioRef.current = audio;

    audio.oncanplay = () => setRadioOnline(true);
    audio.onerror = () => setRadioOnline(false);

    if (isPlaying) audio.play().catch(() => console.warn('Autoplay blocked'));

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [src, isPlaying]);

  // --- Play/Pause toggle ---
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
    }
    if (widgetRef.current && isReady && currentShow) {
      isPlaying ? widgetRef.current.play() : widgetRef.current.pause();
    }
  }, [isPlaying, currentShow, isReady]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Render ---
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Mixcloud iframe (invisible) */}
      {currentShow && (
        <iframe
          ref={iframeRef}
          src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(currentShow.key)}`}
          className="absolute opacity-0 pointer-events-none"
          allow="autoplay"
        />
      )}

      {/* Player UI */}
      <div className="fixed bottom-6 left-6 z-50 backdrop-blur-md bg-black/95 border border-white/20 w-80 font-mono p-4">
        
        {/* Progress */}
        <div className="h-1 bg-white/10 relative overflow-hidden mb-3">
          <div className="h-full bg-white/80" style={{ width: `${progress}%` }} />
        </div>

        {/* Content */}
        <div className="flex items-center gap-4">
          {/* Artwork */}
          {currentShow?.img && (
            <div className="w-12 h-12 border overflow-hidden">
              <img src={currentShow.img} alt={currentShow.name} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 text-white text-[11px] truncate">
            {currentShow ? currentShow.name : 'Still FM Radio'}
          </div>

          {/* Live / Radio indicator */}
          <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-500/50'}`} />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={togglePlay}
            className="w-8 h-8 border border-white/40 hover:border-white flex items-center justify-center"
          >
            {isPlaying ? (
              <div className="flex gap-1">
                <div className="w-[3px] h-3 bg-white" />
                <div className="w-[3px] h-3 bg-white" />
              </div>
            ) : (
              <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-[2px]" />
            )}
          </button>

          <div className="text-[9px] text-white/50">
            {radioOnline ? 'Radio Online' : 'Offline'}
          </div>
        </div>
      </div>
    </>
  );
}
