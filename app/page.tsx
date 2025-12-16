'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import LandingAudioPlayer from './components/LandingAudioPlayer';
import InstallPWA from './components/InstallPWA';
import { usePlayer } from '@/app/context/PlayerContext';

export default function LandingPage() {
  const { isPlaying } = usePlayer();

  const [isLive, setIsLive] = useState(false);
  const [watchMode, setWatchMode] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const twitchRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 🔴 TWITCH STATUS
  useEffect(() => {
    const checkTwitchStatus = async () => {
      try {
        const res = await fetch('https://decapi.me/twitch/uptime/bertarose');
        const text = await res.text();
        setIsLive(
          !text.toLowerCase().includes('offline') &&
          !text.toLowerCase().includes('error')
        );
      } catch {
        setIsLive(false);
      }
    };

    checkTwitchStatus();
    const interval = setInterval(checkTwitchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🎥 LOAD TWITCH SCRIPT
  useEffect(() => {
    if ((window as any).Twitch) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://player.twitch.tv/js/embed/v1.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  // 🎥 INIT PLAYER
  useEffect(() => {
    if (!scriptLoaded || !isLive || twitchRef.current) return;

    const player = new (window as any).Twitch.Player('twitch-embed', {
      channel: 'bertarose',
      width: '100%',
      height: '100%',
      muted: true,
      autoplay: true,
      parent: [window.location.hostname],
    });

    twitchRef.current = player;
  }, [scriptLoaded, isLive]);

  const openVideo = useCallback(() => {
    twitchRef.current?.setMuted(false);
    setWatchMode(true);
  }, []);

  const closeVideo = useCallback(() => {
    twitchRef.current?.setMuted(true);
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

      <InstallPWA />

      {isLive && (
        <div
          id="twitch-embed"
          className={`absolute inset-0 transition-opacity duration-700 ${
            watchMode ? 'z-30 opacity-100' : 'z-0 opacity-70'
          }`}
        />
      )}

      {!isLive && (
        <video
          src="/video.mov"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      {!watchMode && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 mix-blend-screen opacity-40"
        />
      )}

      {/* LOGO — disappears once radio plays */}
      {!watchMode && !isPlaying && (
        <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
          <Image
            src="/Stillfm logo-white.png"
            alt="Still FM"
            width={600}
            height={200}
            className="w-[280px] md:w-[480px]"
            priority
          />
        </div>
      )}

      {!watchMode && (
        <div className="fixed bottom-0 left-0 right-0 md:left-4 md:bottom-4 z-50">
          <LandingAudioPlayer
            isLive={isLive}
            onWatchVideo={openVideo}
            onCloseVideo={closeVideo}
          />
        </div>
      )}

      {watchMode && (
        <button
          onClick={closeVideo}
          className="fixed top-6 right-6 z-50 bg-black/80 border border-white/50 px-6 py-3 text-sm uppercase tracking-widest font-bold text-white hover:bg-white hover:text-black transition-all"
        >
          ✕ Close Stream
        </button>
      )}
    </div>
  );
}
