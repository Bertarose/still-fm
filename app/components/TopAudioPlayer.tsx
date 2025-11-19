'use client';

import { useState, useEffect } from 'react';

interface MixcloudShow {
  name: string;
  url: string;
  key: string;
}

export default function TopAudioPlayer() {
  const [currentShow, setCurrentShow] = useState<MixcloudShow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="w-full backdrop-blur-md bg-black/90 border border-white/20 px-6 py-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" />
          <span className="text-white/60 text-xs uppercase tracking-wider">Loading Player...</span>
        </div>
      </div>
    );
  }

  if (!currentShow) {
    return null;
  }

  return (
    <div className="w-full backdrop-blur-md bg-black/95 border border-white/20 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white text-xs uppercase tracking-[0.15em]">Now Playing</span>
        </div>
        <a
          href={currentShow.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white/70 text-[10px] uppercase tracking-wider transition-colors"
        >
          View on Mixcloud →
        </a>
      </div>

      {/* Mixcloud Widget */}
      <div className="flex items-center gap-4 px-6 py-4">
        <div className="flex-1 min-w-0">
          <div className="text-white/90 text-sm mb-1 truncate">
            {currentShow.name}
          </div>
          <div className="text-white/50 text-[10px] uppercase tracking-wider">
            Latest Show from Still FM
          </div>
        </div>
        <div className="w-[400px]">
          <iframe
            width="100%"
            height="60"
            src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(currentShow.key)}`}
            frameBorder="0"
            allow="autoplay"
            style={{ background: 'transparent' }}
          />
        </div>
      </div>
    </div>
  );
}
