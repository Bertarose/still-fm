'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import LandingAudioPlayer from './components/LandingAudioPlayer';
import InstallPWA from './components/InstallPWA';

export default function LandingPage() {
  const [isLive, setIsLive] = useState(false);
  const [watchMode, setWatchMode] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const twitchRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 🔴 VÉRIFICATION DU STATUT TWITCH VIA API
  useEffect(() => {
    const checkTwitchStatus = async () => {
      try {
        const res = await fetch('https://decapi.me/twitch/uptime/bertarose');
        const text = await res.text();
        const isOnline = !text.toLowerCase().includes('offline') && !text.toLowerCase().includes('error');
        console.log('🔴 Twitch status:', isOnline ? 'ONLINE ✅' : 'OFFLINE ⚫');
        setIsLive(isOnline);
      } catch (e) {
        console.error('❌ Erreur Twitch API:', e);
        setIsLive(false);
      }
    };

    checkTwitchStatus();
    const interval = setInterval(checkTwitchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

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

  // 🎥 TWITCH PLAYER INIT - S'initialise dès que le script est chargé
  useEffect(() => {
    if (!scriptLoaded || !(window as any).Twitch || twitchRef.current) return;

    try {
      console.log('🎥 Initializing Twitch player...');
      
      const player = new (window as any).Twitch.Player('twitch-embed', {
        channel: 'bertarose',
        width: '100%',
        height: '100%',
        muted: true,
        autoplay: false,
        parent: [window.location.hostname, 'localhost', '127.0.0.1', 'still-fm.vercel.app', 'www.stillfm.com', 'stillfm.com'],
      });

      twitchRef.current = player;

      // Attendre que le player soit prêt
      player.addEventListener((window as any).Twitch.Player.READY, () => {
        console.log('✅ Twitch player ready');
        setPlayerReady(true);
      });

      player.addEventListener((window as any).Twitch.Player.ONLINE, () => {
        console.log('🔴 Twitch Player Event: ONLINE');
        setIsLive(true);
      });
      
      player.addEventListener((window as any).Twitch.Player.OFFLINE, () => {
        console.log('⚫ Twitch Player Event: OFFLINE');
        setIsLive(false);
      });
    } catch (error) {
      console.error('❌ Twitch player initialization error:', error);
    }

    return () => {
      if (twitchRef.current?.destroy) {
        twitchRef.current.destroy();
        twitchRef.current = null;
      }
    };
  }, [scriptLoaded]);

  const openVideo = useCallback(() => {
    console.log('🎬 Opening video...', { playerReady, twitchPlayer: !!twitchRef.current });
    
    if (!twitchRef.current) {
      console.error('❌ Twitch player not initialized');
      return;
    }
    
    // Activer le son et lancer la lecture
    twitchRef.current.setMuted(false);
    twitchRef.current.play();
    
    // Passer en mode watch
    setWatchMode(true);
    console.log('✅ Watch mode activated');
  }, [playerReady]);

  const closeVideo = useCallback(() => {
    console.log('🛑 Closing video...');
    
    if (!twitchRef.current) return;
    
    twitchRef.current.setMuted(true);
    twitchRef.current.pause();
    setWatchMode(false);
    
    console.log('✅ Watch mode deactivated');
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

      {/* TWITCH EMBED - Toujours présent mais caché si pas en watch mode */}
      <div 
        id="twitch-embed" 
        className={`absolute inset-0 transition-opacity duration-700 z-20 ${
          watchMode ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

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

      {/* PLAYER - Avec minimize intégré */}
      {!watchMode && (
        <div className="fixed bottom-0 left-0 right-0 md:left-4 md:bottom-4 z-50">
          <LandingAudioPlayer
            isLive={isLive}
            onWatchVideo={openVideo}
            onCloseVideo={closeVideo}
          />
        </div>
      )}

      {/* CLOSE VIDEO BUTTON */}
      {watchMode && (
        <button
          onClick={closeVideo}
          className="
            fixed top-6 right-6 z-50
            bg-black/80 backdrop-blur-sm
            border border-white/50
            px-6 py-3 text-sm uppercase tracking-widest font-bold
            text-white hover:bg-white hover:text-black
            transition-all
            shadow-lg
          "
        >
          ✕ Close Stream
        </button>
      )}
    </div>
  );
}
