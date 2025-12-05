'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import LandingAudioPlayer from './components/LandingAudioPlayer';
import { usePlayer } from './context/PlayerContext';

export default function LandingPage() {
  const { isPlaying: isRadioPlaying, togglePlay: toggleRadio } = usePlayer();
    
  const [isLive, setIsLive] = useState(false);  
  const [watchMode, setWatchMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerInitialized = useRef(false);
  const twitchPlayerRef = useRef<any>(null);

  // --- 1. INITIALISATION DU PLAYER TWITCH ET VÉRIFICATION DES PARENTS ---
  useEffect(() => {
    if (playerInitialized.current) return;

    const initTwitchPlayer = () => {
      // S'assurer que l'objet Twitch global et l'élément d'ancrage sont disponibles
      if ((window as any).Twitch && document.getElementById('twitch-embed')) {
        playerInitialized.current = true;
          
        // --- LOGIQUE DE VÉRIFICATION DES PARENTS (CRITIQUE) ---
        const parents = ['localhost', '127.0.0.1', 'still-fm.vercel.app', 'www.stillfm.com', 'stillfm.com'];
        if (typeof window !== 'undefined' && !parents.includes(window.location.hostname)) {
            parents.push(window.location.hostname);
        }

        console.log('🔗 Parents autorisés pour Twitch:', parents);
        console.log('💻 Hôte actuel:', window.location.hostname);
        // --------------------------------------------------------

        const options = {
          width: '100%',
          height: '100%',
          channel: 'bertarose',
          parent: parents,
          autoplay: true,
          muted: true,      
          controls: false,
        };

        try {
            const player = new (window as any).Twitch.Player('twitch-embed', options);
            twitchPlayerRef.current = player;
            console.log('☑️ Twitch Player instance créée.', player);

            player.addEventListener((window as any).Twitch.Player.READY, () => {
              console.log('✅ Twitch player ready.');
              player.setMuted(true);
              player.play().catch((err: any) => console.warn('Twitch play failed (autoplay restriction):', err));
            });

            player.addEventListener((window as any).Twitch.Player.ONLINE, () => {
              console.log('🔴 Twitch est ONLINE (via Player Event).');
              setIsLive(true);
            });
            
            player.addEventListener((window as any).Twitch.Player.OFFLINE, () => {
              console.log('⚫ Twitch est OFFLINE (via Player Event).');
              setIsLive(false);
            });
            
            player.addEventListener((window as any).Twitch.Player.PLAYING, () => {
              console.log('▶️ Twitch est PLAYING (via Player Event).');
              setIsLive(true);
            });

        } catch (error) {
            console.error('❌ ERREUR FATALE: La création de Twitch.Player a échoué. Vérifiez le domaine "parent".', error);
            playerInitialized.current = false; // Permettre une nouvelle tentative
        }
      } else {
        console.log('⚠️ En attente du script Twitch ou de l\'élément "twitch-embed"...');
      }
    };

    // Logique de chargement du script Twitch
    if (!(window as any).Twitch) {
      if (!document.getElementById('twitch-js')) {
        const script = document.createElement('script');
        script.id = 'twitch-js';
        script.src = 'https://player.twitch.tv/js/embed/v1.js';
        script.async = true;
        script.onload = initTwitchPlayer;
        document.body.appendChild(script);
      }
    } else {
      initTwitchPlayer();
    }
  }, []);

  // --- 2. VÉRIFICATION API (Source de secours) ---
  useEffect(() => {
    const checkTwitchViaAPI = async () => {
      try {
        const res = await fetch('https://decapi.me/twitch/uptime/bertarose');
        const text = await res.text();
          
        console.log('📡 Twitch API check:', text);
          
        if (text.includes('offline') || text.includes('error')) {
          console.log('⚫ API confirme: OFFLINE');
          setIsLive(false);
        } else {
          console.log('🔴 API confirme: ONLINE. (Durée: ' + text + ')');
          setIsLive(true);
          // Ajouté un log pour confirmer que l'état est mis à jour
          console.log('✨ setIsLive(true) appelé via API.'); 
        }
      } catch (e) {
        console.error('❌ Erreur lors de la vérification de l\'API Twitch:', e);
      }
    };

    const initialTimeout = setTimeout(checkTwitchViaAPI, 3000);
    const interval = setInterval(checkTwitchViaAPI, 60000);
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // --- 3. GESTION DU MODE WATCH STREAM ---
  const handleWatchStream = () => {
    console.log('🎬 Activating watch mode');

    if (!twitchPlayerRef.current) {
        console.error('❌ Twitch Player non initialisé. Impossible d\'activer le mode Watch.');
        return;
    }
    
    if (isRadioPlaying) {
        toggleRadio();
        console.log('Stopping radio...');
    }
    
    twitchPlayerRef.current.setMuted(false);
    twitchPlayerRef.current.setVolume(1.0);
    twitchPlayerRef.current.play().catch((err: any) => console.warn('Twitch play failed (user interaction failed):', err));
    setWatchMode(true);
    console.log('✅ Watch mode activé. Mute: OFF, Volume: 1.0');
  };

  const handleCloseWatch = () => {
    console.log('⏹️ Closing watch mode');
    setWatchMode(false);
    if (twitchPlayerRef.current) {
      twitchPlayerRef.current.setMuted(true);
      twitchPlayerRef.current.setVolume(0.5);
    }
  };

  // --- 4. ANIMATION ÉTOILES (Non modifiée) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      x: number; y: number; size: number; speedX: number; speedY: number; opacity: number;
      canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D;
      constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas; this.ctx = ctx;
        this.x = Math.random() * this.canvas.width; this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25; this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.3;
      }
      update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x > this.canvas.width) this.x = 0; if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0; if (this.y < 0) this.y = this.canvas.height;
      }
      draw() {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        this.ctx.beginPath(); this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); this.ctx.fill();
      }
    }

    const particleCount = 150; const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) { particles.push(new Particle(canvas, ctx)); }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      particles.forEach((pA, indexA) => {
        particles.slice(indexA + 1).forEach(pB => {
          const dx = pA.x - pB.x; const dy = pA.y - pB.y;
          const distance = Math.sqrt(dx*dx + dy*dy);
          if (distance < 100) {
            ctx.strokeStyle = `rgba(255,255,255,${0.1*(1-distance/100)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(pA.x,pA.y); ctx.lineTo(pB.x,pB.y); ctx.stroke();
          }
        });
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // --- 5. RENDU JSX ---
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">

      {/* 🎥 BACKGROUND VIDEO - Seulement si OFFLINE */}
      {!isLive && (
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="/video.mov"
          autoPlay
          loop
          muted
          playsInline
        />
      )}

      {/* 🔴 TWITCH EMBED - Seulement si LIVE */}
      {isLive && (
        <div 
          className={`absolute inset-0 overflow-hidden transition-all duration-500 ${
            watchMode ? 'z-[60]' : 'z-0'
          }`}
        >
          <div 
            id="twitch-embed" 
            className={`w-full h-full transition-all duration-1000 ${
              watchMode 
                ? 'grayscale-0 opacity-100 pointer-events-auto' 
                : 'grayscale contrast-125 opacity-60 pointer-events-none'
            }`}
          />
        </div>
      )}

      {/* ✨ CANVAS ÉTOILES - Caché en watch mode */}
      {!watchMode && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-1 pointer-events-none mix-blend-screen opacity-50"
        />
      )}

      {/* 🌑 Dark Overlay - Caché en watch mode */}
      {!watchMode && (
        <div className="absolute inset-0 bg-black/30 z-3 pointer-events-none" />
      )}

      {/* 📄 CONTENU PRINCIPAL - Caché en watch mode */}
      {!watchMode && (
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white font-mono px-4">
          
          {/* INDICATEUR LIVE */}
          <div className="mb-6 flex items-center gap-3 backdrop-blur-sm px-4 py-2 rounded-full bg-black/40 border border-white/10">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-200">
              {isLive ? 'LIVE ON AIR' : 'OFFLINE'}
            </span>
          </div>

          {/* TITRE */}
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-bold uppercase tracking-tighter mb-8 md:mb-12 drop-shadow-2xl mix-blend-overlay opacity-90 select-none text-center">
            STILL FM
          </h1>

          {/* BOUTONS */}
          <div className="flex flex-col gap-4 items-center w-full max-w-sm">
              
            <Link 
              href="/home"
              className="w-full group relative overflow-hidden"
            >
              <div className="border-2 border-white px-8 py-4 text-sm uppercase tracking-[0.2em] text-center transition-all duration-500 hover:bg-white hover:text-black backdrop-blur-md bg-black/30 font-bold">
                Enter Site
              </div>
            </Link>

            {isLive && (
              <button 
                onClick={handleWatchStream}
                className="w-full border-2 border-green-500 text-green-400 px-8 py-4 text-sm uppercase tracking-[0.2em] text-center transition-all duration-500 hover:bg-green-500 hover:text-black backdrop-blur-md bg-black/30 font-bold animate-pulse hover:animate-none cursor-pointer"
              >
                Watch Stream
              </button>
            )}
          </div>

          <p className="mt-6 text-[10px] uppercase tracking-widest text-gray-400 opacity-70 text-center">
            Montreal Underground Radio
          </p>
        </div>
      )}

      {/* 🎵 AUDIO PLAYER - Caché en watch mode */}
      {!watchMode && (
        <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto z-50">
          <LandingAudioPlayer />
        </div>
      )}

      {/* ❌ BOUTON FERMER - Visible SEULEMENT en watch mode */}
      {watchMode && (
        <button 
          onClick={handleCloseWatch}
          className="fixed top-4 right-4 md:top-6 md:right-6 z-[100] border-2 border-white/50 text-white px-6 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer backdrop-blur-sm bg-black/30 font-bold"
        >
          ✕ Close
        </button>
      )}
    </div>
  );
}
