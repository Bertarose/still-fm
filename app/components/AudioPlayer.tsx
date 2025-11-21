'use client';

import { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

// Hook pour charger le script API Mixcloud
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

export default function AudioPlayer() {
  const { currentShow, isPlaying, togglePlay, playShow } = usePlayer();
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const widgetRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Charger un show par défaut
  useEffect(() => {
    const fetchLatest = async () => {
      if (!currentShow) {
        try {
          const res = await fetch('https://api.mixcloud.com/StillFM/cloudcasts/?limit=1');
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            const latest = data.data[0];
            playShow({
               key: latest.key,
               name: latest.name,
               url: latest.url,
               img: latest.pictures?.extra_large
            }); 
          }
        } catch (e) { 
          console.error('Error fetching latest show:', e); 
        }
      }
    };
    fetchLatest();
  }, [currentShow, playShow]);

  // Initialiser le Widget
  useMixcloudScript(() => {
    if (iframeRef.current && !widgetRef.current && (window as any).Mixcloud) {
      const widget = (window as any).Mixcloud.PlayerWidget(iframeRef.current);
      widgetRef.current = widget;
      
      widget.ready.then(() => {
        console.log('Mixcloud widget ready!');
        setIsReady(true);
        
        // Event listeners
        widget.events.progress.on((progress: number) => {
          setCurrentTime(progress);
        });

        widget.events.ended.on(() => {
          console.log('Show ended');
        });
      });
    }
  });

  // Changement de Show ou Play/Pause
  useEffect(() => {
    if (widgetRef.current && isReady && currentShow) {
      console.log('Loading show:', currentShow.key, 'Playing:', isPlaying);
      
      widgetRef.current.load(currentShow.key, isPlaying).then(() => {
        // Récupérer la durée du show
        widgetRef.current.getDuration().then((d: number) => {
          setDuration(d);
        });
        
        if (isPlaying) {
          widgetRef.current.play().then(() => {
            console.log('Playing...');
          }).catch((e: any) => {
            console.error('Play error:', e);
          });
        } else {
          widgetRef.current.pause();
        }
      }).catch((e: any) => {
        console.error('Load error:', e);
      });
    }
  }, [currentShow, isPlaying, isReady]);

  // Format time helper
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Seek to position
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!widgetRef.current || !isReady || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    widgetRef.current.seek(newTime).then(() => {
      setCurrentTime(newTime);
    }).catch((e: any) => {
      console.error('Seek error:', e);
    });
  };

  if (!currentShow) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Widget Invisible */}
      <iframe
        ref={iframeRef}
        src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(currentShow.key)}`}
        className="absolute opacity-0 pointer-events-none"
        allow="autoplay"
      />

      {/* Player UI */}
      <div className="fixed bottom-6 left-6 z-50 backdrop-blur-md bg-black/95 border border-white/20 hover:border-white/40 transition-all duration-300 font-mono w-80 group">
        
        {/* Progress Bar */}
        <div 
          className="h-1 bg-white/10 cursor-pointer relative overflow-hidden hover:h-2 transition-all"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-white/80 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Main Content */}
        <div className="p-4">
          <div className="flex items-center gap-4 mb-3">
            
            {/* Artwork */}
            {currentShow.img && (
              <div className="w-12 h-12 shrink-0 border border-white/20 overflow-hidden">
                <img 
                  src={currentShow.img} 
                  alt={currentShow.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1">
                Now Playing
              </div>
              <div className="text-[11px] text-white truncate leading-tight">
                {currentShow.name}
              </div>
            </div>

            {/* Live indicator */}
            <div className={`w-2 h-2 rounded-full shrink-0 ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-500/50'}`} />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-8 h-8 border border-white/40 hover:border-white hover:bg-white/10 transition-all flex items-center justify-center shrink-0"
              aria-label={isPlaying ? 'Pause' : 'Play'}
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

            {/* Time */}
            <div className="text-[9px] text-white/50 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Mixcloud Link */}
            <a 
              href={currentShow.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-[9px] text-white/40 hover:text-white/70 uppercase tracking-wider transition-colors"
            >
              View →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
