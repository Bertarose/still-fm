'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AudioPlayer from './components/AudioPlayer';
import { usePlayer } from './context/PlayerContext';

export default function LandingPage() {
  const { isPlaying: isRadioPlaying, togglePlay: toggleRadio } = usePlayer();
  
  const [isLive, setIsLive] = useState(true); 
  const [watchMode, setWatchMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerInitialized = useRef(false);
  const twitchPlayerRef = useRef<any>(null);

  // --- 1. INTÉGRATION TWITCH API ---
  useEffect(() => {
    if (playerInitialized.current) return;

    const initTwitchPlayer = () => {
      if ((window as any).Twitch && document.getElementById('twitch-embed')) {
        playerInitialized.current = true;
        
        const parents = ['localhost', '127.0.0.1', 'still-fm.vercel.app', 'www.stillfm.com', 'stillfm.com'];
        if (typeof window !== 'undefined' && !parents.includes(window.location.hostname)) {
            parents.push(window.location.hostname);
        }

        const options = {
          width: '100%',
          height: '100%',
          channel: 'bertarose',
          parent: parents,
          autoplay: true,
          muted: true,     
          controls: false,
        };

        const player = new (window as any).Twitch.Player('twitch-embed', options);
        twitchPlayerRef.current = player;

        player.addEventListener((window as any).Twitch.Player.READY, () => {
          player.setMuted(true);
          player.play();
        });

        player.addEventListener((window as any).Twitch.Player.ONLINE, () => setIsLive(true));
        player.addEventListener((window as any).Twitch.Player.OFFLINE, () => setIsLive(false));
      }
    };

    if (!document.getElementById('twitch-js')) {
      const script = document.createElement('script');
      script.id = 'twitch-js';
      script.src = 'https://player.twitch.tv/js/embed/v1.js';
      script.async = true;
      script.onload = initTwitchPlayer;
      document.body.appendChild(script);
    } else {
      initTwitchPlayer();
    }
  }, []);

  // Fonction pour activer le mode "Spectateur"
  const handleWatchStream = () => {
    if (twitchPlayerRef.current) {
        if (isRadioPlaying) toggleRadio();
        twitchPlayerRef.current.setMuted(false);
        twitchPlayerRef.current.setVolume(1.0);
        twitchPlayerRef.current.play();
        setWatchMode(true);
    }
  };

  // --- 2. Animation des étoiles ---
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

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">

      {/* === TWITCH LIVE OU VIDÉO OFFLINE === */}
      {isLive ? (
        <div className={`absolute inset-0 overflow-hidden transition-all duration-500 ${watchMode ? 'z-50' : 'z-0'}`}>
          <div 
            id="twitch-embed" 
            className={`w-full h-full object-cover transition-all duration-1000 
              ${watchMode ? 'grayscale-0 pointer-events-auto' : 'grayscale contrast-125 opacity-60 pointer-events-none'}
            `}
          />
        </div>
      ) : (
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="/video.mov"
          autoPlay
          loop
          muted
          playsInline
        />
      )}

      {/* === CANVAS (ÉTOILES) === */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full z-1 pointer-events-none mix-blend-screen transition-opacity duration-500 ${watchMode ? 'opacity-0' : 'opacity-50'}`}
      />

      {/* Dark Overlay */}
      <div className={`absolute inset-0 bg-black/30 z-3 pointer-events-none transition-opacity duration-500 ${watchMode ? 'opacity-0' : 'opacity-100'}`} />

      {/* === CONTENU PRINCIPAL === */}
      <div className={`relative z-10 flex flex-col items-center justify-center h-full text-white font-mono pb-20 transition-all duration-500 ${watchMode ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
        
        {/* INDICATEUR LIVE */}
        <div className="mb-8 flex items-center gap-3 backdrop-blur-sm px-4 py-2 rounded-full bg-black/40 border border-white/10">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-200">
            {isLive ? 'LIVE ON AIR' : 'OFFLINE'}
          </span>
        </div>

        {/* TITRE */}
        <h1 className="text-7xl md:text-9xl font-bold uppercase tracking-tighter mb-12 drop-shadow-2xl mix-blend-overlay opacity-90 select-none">
          STILL FM
        </h1>

        {/* BOUTONS */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
            
          <Link 
            href="/home"
            className="group relative overflow-hidden"
          >
            <div className="border border-white px-12 py-4 text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:bg-white hover:text-black backdrop-blur-md bg-black/30 font-bold">
                Enter Site
            </div>
          </Link>

          {isLive && (
            <button 
              onClick={handleWatchStream}
              className="border border-green-500 text-green-400 px-12 py-4 text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:bg-green-500 hover:text-black backdrop-blur-md bg-black/30 font-bold animate-pulse hover:animate-none cursor-pointer z-50"
            >
              Watch Stream
            </button>
          )}
        </div>

        <p className="mt-8 text-[10px] uppercase tracking-widest text-gray-400 opacity-70">
          Montreal Underground Radio
        </p>
      </div>

      {/* LECTEUR AUDIO FLOTTANT */}
      <div className={`transition-opacity duration-500 ${watchMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <AudioPlayer />
      </div>

      {/* BOUTON RETOUR (Pour quitter le mode Watch) */}
      {watchMode && (
        <button 
          onClick={() => {
              setWatchMode(false);
              if(twitchPlayerRef.current) twitchPlayerRef.current.setMuted(true);
          }}
          className="absolute top-6 right-6 z-[100] border border-white/50 text-white/80 px-6 py-2 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer"
        >
          Close Stream X
        </button>
      )}
    </div>
  );
}
