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
        console.log('🔴 Landing Twitch status:', isOnline ? 'ONLINE ✅' : 'OFFLINE ⚫');
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
    script.onload = () => {
      console.log('✅ Twitch script loaded');
      setScriptLoaded(true);
    };
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
    if (!scriptLoaded || !isLive || !(window as any).Twitch || twitchRef.current) return;

    let retryCount = 0;
    const maxRetries = 10;

    const initTwitch = () => {
      const embedDiv = document.getElementById('twitch-embed');
      
      if (!embedDiv) {
        console.log(`⏳ Waiting for embed div... (attempt ${retryCount + 1}/${maxRetries})`);
        
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(initTwitch, 200);
        }
        return;
      }

      try {
        console.log('🎥 Initializing Twitch player...');
        
        const player = new (window as any).Twitch.Player('twitch-embed', {
          channel: 'bertarose',
          width: '100%',
          height: '100%',
          muted: true,
          autoplay: true,
          parent: [window.location.hostname, 'localhost', '127.0.0.1', 'still-fm.vercel.app', 'www.stillfm.com', 'stillfm.com'],
        });

        twitchRef.current = player;

        player.addEventListener((window as any).Twitch.Player.READY, () => {
          console.log('✅ Twitch player ready');
          setPlayerReady(true);
          
          // 🎯 ASTUCE : Ajouter du CSS pour accélérer la disparition des contrôles
          const style = document.createElement('style');
          style.innerHTML = `
            /* Force les contrôles Twitch à disparaître plus vite */
            #twitch-embed iframe {
              pointer-events: auto !important;
            }
            
            /* Cache le curseur après 0.5s au lieu de 3s */
            #twitch-embed {
              cursor: none;
            }
            
            #twitch-embed:hover {
              cursor: none;
            }
          `;
          document.head.appendChild(style);
          
          // 🎯 Simuler l'inactivité en enlevant le focus de l'iframe après 500ms
          setTimeout(() => {
            const iframe = document.querySelector('#twitch-embed iframe') as HTMLElement;
            if (iframe) {
              // Créer un événement mouseleave pour forcer les contrôles à disparaître
              const event = new MouseEvent('mouseleave', { bubbles: true });
              iframe.dispatchEvent(event);
              console.log('👻 Simulating inactivity to hide controls');
            }
          }, 500);
        });

        player.addEventListener((window as any).Twitch.Player.ONLINE, () => setIsLive(true));
        player.addEventListener((window as any).Twitch.Player.OFFLINE, () => setIsLive(false));
      } catch (error) {
        console.error('❌ Twitch player init error:', error);
      }
    };

    setTimeout(initTwitch, 500);

    return () => {
      if (twitchRef.current?.destroy) {
        twitchRef.current.destroy();
        twitchRef.current = null;
      }
    };
  }, [scriptLoaded, isLive]);

  const openVideo = useCallback(() => {
    console.log('🎬 Opening fullscreen video...');
    if (!twitchRef.current) return;
    twitchRef.current.setMuted(false);
    setWatchMode(true);
    
    // Re-simuler l'inactivité après ouverture fullscreen
    setTimeout(() => {
      const iframe = document.querySelector('#twitch-embed iframe') as HTMLElement;
      if (iframe) {
        const event = new MouseEvent('mouseleave', { bubbles: true });
        iframe.dispatchEvent(event);
      }
    }, 500);
  }, []);

  const closeVideo = useCallback(() => {
    console.log('🛑 Closing fullscreen...');
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

  // 🎯 Forcer les contrôles à disparaître périodiquement
  useEffect(() => {
    if (!playerReady || !isLive) return;
    
    const hideControls = () => {
      const iframe = document.querySelector('#twitch-embed iframe') as HTMLElement;
      if (iframe) {
        const event = new MouseEvent('mouseleave', { bubbles: true });
        iframe.dispatchEvent(event);
      }
    };
    
    // Répéter toutes les 2 secondes pour garder les contrôles cachés
    const interval = setInterval(hideControls, 2000);
    
    return () => clearInterval(interval);
  }, [playerReady, isLive]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">

      <InstallPWA />

      {/* TWITCH EMBED */}
      {isLive && (
        <div className={`absolute inset-0 ${watchMode ? 'z-30' : 'z-0'}`}>
          <div 
            id="twitch-embed" 
            className={`w-full h-full transition-opacity duration-700 ${
              watchMode ? 'opacity-100' : 'opacity-70'
            }`}
          />
          
          {/* Overlay qui force les contrôles à rester cachés en bloquant le hover */}
          <div 
            className="absolute inset-0 pointer-events-auto"
            style={{ 
              background: 'transparent',
              zIndex: 1
            }}
            onMouseEnter={(e) => {
              // Empêche le hover sur l'iframe Twitch
              e.preventDefault();
            }}
          />
        </div>
      )}

      {/* FALLBACK VIDEO */}
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

      {/* CANVAS */}
      {!watchMode && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 mix-blend-screen opacity-40"
        />
      )}

      {/* LOGO */}
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

      {/* CLOSE BUTTON */}
      {watchMode && (
        <button
          onClick={closeVideo}
          className="fixed top-6 right-6 z-50 bg-black/80 backdrop-blur-sm border border-white/50 px-6 py-3 text-sm uppercase tracking-widest font-bold text-white hover:bg-white hover:text-black transition-all shadow-lg"
        >
          ✕ Close Stream
        </button>
      )}
    </div>
  );
}
