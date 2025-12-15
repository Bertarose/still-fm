'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import LandingAudioPlayer from './components/LandingAudioPlayer';
import InstallPWA from './components/InstallPWA';

export default function LandingPage() {
  const [isLive, setIsLive] = useState(false);
  const [watchMode, setWatchMode] = useState(false);
  const twitchRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 🎥 TWITCH INIT
  useEffect(() => {
    if ((window as any).Twitch) {
      const player = new (window as any).Twitch.Player('twitch-embed', {
        channel: 'bertarose',
        width: '100%',
        height: '100%',
        muted: true,
        autoplay: false,
        parent: [window.location.hostname],
      });

      twitchRef.current = player;

      player.addEventListener('ONLINE', () => setIsLive(true));
      player.addEventListener('OFFLINE', () => setIsLive(false));
    } else {
      const script = document.createElement('script');
      script.src = 'https://player.twitch.tv/js/embed/v1.js';
      script.onload = () => location.reload();
      document.body.appendChild(script);
    }
  }, []);

  const openVideo = () => {
    if (!twitchRef.current) return;
    twitchRef.current.setMuted(false);
    twitchRef.current.play();
    setWatchMode(true);
  };

  const closeVideo = () => {
    if (!twitchRef.current) return;
    twitchRef.current.setMuted(true);
    setWatchMode(false);
  };

  // 🌌 CANVAS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">

      {/* INSTALL APP BUTTON (maintenant en haut à gauche) */}
      <InstallPWA />

      {/* TWITCH */}
      {isLive && watchMode && (
        <div
          className="absolute inset-0 transition-opacity duration-700 opacity-100 z-20"
        >
          <div id="twitch-embed" className="w-full h-full" />
        </div>
      )}

      {/* FALLBACK VIDEO */}
      {!isLive && !watchMode && (
        <video
          src="/video.mov"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      {/* CANVAS */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 mix-blend-screen opacity-40"
      />

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
          <LandingAudioPlayer
            isLive={isLive}
            onWatchVideo={openVideo}
            onCloseVideo={closeVideo}
          />
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
