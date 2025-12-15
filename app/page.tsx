'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import LandingAudioPlayer from './components/LandingAudioPlayer';
import { usePlayer } from './context/PlayerContext';

export default function LandingPage() {
  const { isLive, setIsLive, twitchPlayer, setTwitchPlayer } = usePlayer();
  const [watchMode, setWatchMode] = useState(false);

  // 🎥 Initialisation Twitch
  useEffect(() => {
    const loadTwitch = () => {
      if ((window as any).Twitch && document.getElementById('twitch-embed')) {
        const player = new (window as any).Twitch.Player('twitch-embed', {
          channel: 'bertarose',
          width: '100%',
          height: '100%',
          muted: true,
          autoplay: false,
          parent: [window.location.hostname],
        });
        setTwitchPlayer(player);

        player.addEventListener('ONLINE', () => setIsLive(true));
        player.addEventListener('OFFLINE', () => setIsLive(false));
      } else {
        const script = document.createElement('script');
        script.src = 'https://player.twitch.tv/js/embed/v1.js';
        script.onload = loadTwitch;
        document.body.appendChild(script);
      }
    };
    loadTwitch();
  }, [setIsLive, setTwitchPlayer]);

  const openVideo = () => {
    if (!twitchPlayer) return;
    twitchPlayer.setMuted(false);
    twitchPlayer.play();
    setWatchMode(true);
  };

  const closeVideo = () => {
    if (!twitchPlayer) return;
    twitchPlayer.setMuted(true);
    setWatchMode(false);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">

      {/* TWITCH */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          watchMode ? 'opacity-100 z-20' : 'opacity-40 z-0'
        }`}
      >
        <div id="twitch-embed" className="w-full h-full" />
      </div>

      {/* LOGO */}
      {!watchMode && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
          <Image
            src="/Stillfm logo-white.png"
            alt="Still FM"
            width={600}
            height={200}
            className="w-[280px] md:w-[500px]"
            priority
          />
        </div>
      )}

      {/* PLAYER */}
      {!watchMode && (
        <div className="fixed bottom-0 left-0 right-0 md:left-4 md:bottom-4 z-50">
          <LandingAudioPlayer onWatchVideo={openVideo} onCloseVideo={closeVideo} />
        </div>
      )}

      {/* CLOSE VIDEO */}
      {watchMode && (
        <button
          onClick={closeVideo}
          className="
            fixed top-4 right-4 z-50
            border border-white/50
            px-4 py-2 text-xs uppercase tracking-widest
            text-white hover:bg-white hover:text-black
            transition
          "
        >
          Close
        </button>
      )}
    </div>
  );
}
