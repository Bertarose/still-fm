'use client';

import { useState, useEffect, useRef } from 'react';

interface MixcloudShow {
  name: string;
  url: string;
  key: string;
}

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentShow, setCurrentShow] = useState<MixcloudShow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const widgetRef = useRef<HTMLIFrameElement>(null);

  // Fetch latest show from Mixcloud
  useEffect(() => {
    const fetchLatestShow = async () => {
      try {
        const response = await fetch('https://api.mixcloud.com/StillFM/cloudcasts/?limit=1');
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          const latestShow = data.data[0];
          setCurrentShow({
            name: latestShow.name,
            url: latestShow.url,
            key: latestShow.key
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching Mixcloud show:', error);
        setIsLoading(false);
      }
    };

    fetchLatestShow();
  }, []);

  // Handle play/pause with Mixcloud Widget API
  useEffect(() => {
    if (!widgetRef.current) return;

    const widget = widgetRef.current;
    
    // Listen to Mixcloud widget events
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'play') {
        setIsPlaying(true);
      } else if (event.data === 'pause') {
        setIsPlaying(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const togglePlay = () => {
    if (!widgetRef.current) return;
    
    const widget = widgetRef.current.contentWindow;
    if (isPlaying) {
      widget?.postMessage('pause', '*');
      setIsPlaying(false);
    } else {
      widget?.postMessage('play', '*');
      setIsPlaying(true);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed bottom-6 left-6 z-50 backdrop-blur-md bg-black/90 border border-white/20 px-6 py-3 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" />
          <span className="text-white/60 text-[11px] uppercase tracking-wider">Loading...</span>
        </div>
      </div>
    );
  }

  if (!currentShow) {
    return null;
  }

  return (
    <>
      {/* Hidden Mixcloud Widget */}
      <iframe
        ref={widgetRef}
        src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(currentShow.key)}`}
        className="hidden"
        allow="autoplay"
      />

      {/* Visible Player UI */}
      <div className="fixed bottom-6 left-6 z-50 backdrop-blur-md bg-black/90 border border-white/20 hover:border-white/40 transition-all duration-300 px-5 py-3 font-mono max-w-sm group">
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="relative w-9 h-9 border border-white/40 hover:border-white hover:bg-white/10 transition-all duration-200 flex items-center justify-center shrink-0"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              // Pause Icon
              <div className="flex gap-1">
                <div className="w-[3px] h-4 bg-white" />
                <div className="w-[3px] h-4 bg-white" />
              </div>
            ) : (
              // Play Icon
              <div className="w-0 h-0 border-l-[10px] border-l-white border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent ml-[2px]" />
            )}
          </button>

          {/* Now Playing Info */}
          <div className="flex-1 min-w-0">
            <div className="text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1 font-medium">
              Now Playing
            </div>
            <div className="text-[13px] text-white truncate leading-tight">
              {currentShow.name}
            </div>
          </div>

          {/* Live Indicator */}
          <div className={`w-2 h-2 rounded-full shrink-0 ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-500/50'}`} />
        </div>

        {/* Link to Mixcloud (appears on hover) */}
        <a 
          href={currentShow.url}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2 text-[9px] text-white/40 hover:text-white/70 uppercase tracking-wider block"
        >
          View on Mixcloud →
        </a>
      </div>
    </>
  );
}
