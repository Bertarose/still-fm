'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isLive, setIsLive] = useState(false);
  const [showVideo, setShowVideo] = useState(true);

  // Check if stream is live
useEffect(() => {
  // Only run on client side
  if (typeof window === 'undefined') return;
  
  const checkLiveStatus = async () => {
    try {
      // Pour l'instant, on met toujours offline
      // Tu pourras ajouter la vraie API plus tard
      setIsLive(false);
      
      /* Commenté pour l'instant - nécessite Twitch API credentials
      const response = await fetch(
        'https://api.twitch.tv/helix/streams?user_login=stillfmradio',
        {
          headers: {
            'Client-ID': 'YOUR_TWITCH_CLIENT_ID',
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
          }
        }
      );
      const data = await response.json();
      setIsLive(data.data && data.data.length > 0);
      */
    } catch (error) {
      console.error('Error checking live status:', error);
      setIsLive(false);
    }
  };

  checkLiveStatus();
  const interval = setInterval(checkLiveStatus, 60000);
  return () => clearInterval(interval);
}, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Video Background */}
      {showVideo && (
        <div className="absolute inset-0 w-full h-full">
          {isLive ? (
            // Twitch Live Stream
            <iframe
              src="https://player.twitch.tv/?channel=stillfmradio&parent=localhost&parent=still-fm.vercel.app&parent=www.stillfm.com&parent=stillfm.com&muted=true&autoplay=true"
              className="w-full h-full object-cover"
              allowFullScreen
              style={{ border: 'none' }}
            />
          ) : (
            // Offline Video Loop (remplace avec ton URL de vidéo)
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/videos/offline-loop.mp4" type="video/mp4" />
            </video>
          )}
        </div>
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white font-mono">
        
        {/* Live/Offline Indicator */}
        <div className="mb-8 flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-xs uppercase tracking-widest">
            {isLive ? 'LIVE NOW' : 'OFFLINE'}
          </span>
        </div>

        {/* Logo/Title */}
        <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-widest mb-16">
          STILL FM
        </h1>

        {/* Enter Button */}
        <Link 
          href="/home"
          className="group relative"
        >
          <div className="border-2 border-white px-12 py-4 text-sm uppercase tracking-widest transition-all duration-300 hover:bg-white hover:text-black">
            Enter Site
          </div>
        </Link>

        {/* Subtitle */}
        <p className="mt-8 text-xs uppercase tracking-wider text-gray-300">
          Montreal Underground Radio
        </p>
      </div>

      {/* Skip Video Button (optional) */}
      <button
        onClick={() => setShowVideo(false)}
        className="absolute bottom-8 right-8 z-20 text-xs uppercase tracking-wider text-white/50 hover:text-white transition-colors"
      >
        Skip Video
      </button>
    </div>
  );
}
    }
  };

  checkLiveStatus();
  const interval = setInterval(checkLiveStatus, 60000);
  return () => clearInterval(interval);
}, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Video Background */}
      {showVideo && (
        <div className="absolute inset-0 w-full h-full">
          {isLive ? (
            // Twitch Live Stream
            <iframe
              src="https://player.twitch.tv/?channel=stillfmradio&parent=localhost&parent=still-fm.vercel.app&parent=www.stillfm.com&parent=stillfm.com&muted=true&autoplay=true"
              className="w-full h-full object-cover"
              allowFullScreen
              style={{ border: 'none' }}
            />
          ) : (
            // Offline Video Loop (remplace avec ton URL de vidéo)
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/videos/offline-loop.mp4" type="video/mp4" />
            </video>
          )}
        </div>
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white font-mono">
        
        {/* Live/Offline Indicator */}
        <div className="mb-8 flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-xs uppercase tracking-widest">
            {isLive ? 'LIVE NOW' : 'OFFLINE'}
          </span>
        </div>

        {/* Logo/Title */}
        <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-widest mb-16">
          STILL FM
        </h1>

        {/* Enter Button */}
        <Link 
          href="/home"
          className="group relative"
        >
          <div className="border-2 border-white px-12 py-4 text-sm uppercase tracking-widest transition-all duration-300 hover:bg-white hover:text-black">
            Enter Site
          </div>
        </Link>

        {/* Subtitle */}
        <p className="mt-8 text-xs uppercase tracking-wider text-gray-300">
          Montreal Underground Radio
        </p>
      </div>

      {/* Skip Video Button (optional) */}
      <button
        onClick={() => setShowVideo(false)}
        className="absolute bottom-8 right-8 z-20 text-xs uppercase tracking-wider text-white/50 hover:text-white transition-colors"
      >
        Skip Video
      </button>
    </div>
  );
}
