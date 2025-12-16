'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import LandingAudioPlayer from './components/LandingAudioPlayer';
import InstallPWA from './components/InstallPWA';

export default function LandingPage() {
  const [isLive, setIsLive] = useState(false);
  const [watchMode, setWatchMode] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [playerMinimized, setPlayerMinimized] = useState(false);
  const twitchRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 🎥 TWITCH SCRIPT LOADING
  useEffect(() => {
    if ((window as any).Twitch) {
      setScriptLoaded(true);
      return;
    }

    const id = 'twitch-embed-script';
    if (document.getElementById(id)) {
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = 'https://player.twitch.tv/js/embed/v1.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById(id);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // 🎥 TWITCH PLAYER INIT
  useEffect(() => {
    if (!scriptLoaded || !(window as any).Twitch || twitchRef.current) return;

    try {
      const player = new (window as any).Twitch.Player('twitch-embed', {
        channel: 'bertarose',
        width: '100%',
        height: '100%',
        muted: true,
        autoplay: false,
        parent: [window.location.hostname, 'localhost', '127.0.0.1', 'still-fm.vercel.app', 'www.stillfm.com', 'stillfm.com'],
      });

      twitchRef.current = player;

      player.addEventListener((window as any).Twitch.Player.ONLINE, () => setIsLive(true));
      player.addEventListener((window as any).Twitch.Player.OFFLINE, () => setIsLive(false));
    } catch (error) {
      console.error('Twitch player initialization error:', error);
    }

    return () => {
      if (twitchRef.current?.destroy) {
        twitchRef.current.destroy();
        twitchRef.current = null;
      }
    };
  }, [scriptLoaded]);

  const openVideo = useCallback(() => {
    if (!twitchRef.current) return;
    twitchRef.current.setMuted(false);
    twitchRef.current.play();
    setWatchMode(true);
  }, []);

  const closeVideo = useCallback(() => {
    if (!twitchRef.current) return;
    twitchRef.current.setMuted(true);
    setWatchMode(false);
  }, []);

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

    let animationId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">

      {/* INSTALL APP BUTTON */}
      <InstallPWA />

      {/* TWITCH */}
      {isLive && watchMode && scriptLoaded && (
        <div className="absolute inset-0 transition-opacity duration-700 opacity-100 z-20">
          <div id="twitch-embed" className="w-full h-full" />
        </div>
      )}

      {/* FALLBACK VIDEO */}
      {!watchMode && (
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

      {/* LOGO - Plus haut et plus petit sur mobile */}
      {!watchMode && (
        <div className="fixed inset-0 z-20 flex flex-col items-center justify-center text-white pointer-events-none -translate-y-12 md:-translate-y-8">
          <Image
            src="/Stillfm logo-white.png"
            alt="Still FM"
            width={600}
            height={200}
            className="w-[220px] md:w-[500px]"
            priority
          />
        </div>
      )}

      {/* PLAYER - Avec bouton minimize */}
      {!watchMode && (
        <div className={`fixed left-0 right-0 md:left-4 z-50 transition-all duration-300 ${
          playerMinimized 
            ? 'bottom-0 md:bottom-4' 
            : 'bottom-0 md:bottom-4'
        }`}>
          
          {/* Bouton Minimize - Desktop seulement */}
          {!playerMinimized && (
            <button
              onClick={() => setPlayerMinimized(true)}
              className="hidden md:block absolute -top-8 right-4 bg-black/90 border border-white/20 px-3 py-1 text-[10px] uppercase tracking-wider text-white/70 hover:text-white hover:border-white/40 transition-all"
            >
              Minimize ↓
            </button>
          )}

          {/* Player minimisé */}
          {playerMinimized ? (
            <div className="hidden md:block w-96 bg-black/95 backdrop-blur-xl border border-white/20 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">SF</span>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider">Still FM</div>
                    <div className="text-xs text-white font-bold">Montreal Radio</div>
                  </div>
                </div>
                <button
                  onClick={() => setPlayerMinimized(false)}
                  className="border border-white/30 px-3 py-1 text-[10px] uppercase tracking-wider text-white/70 hover:text-white hover:border-white/40 transition-all"
                >
                  Expand ↑
                </button>
              </div>
            </div>
          ) : (
            <LandingAudioPlayer
              isLive={isLive}
              onWatchVideo={openVideo}
              onCloseVideo={closeVideo}
            />
          )}
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
