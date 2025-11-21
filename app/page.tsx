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
          controls: false, // On cache les contrôles en mode "fond d'écran"
        };

        const player = new (window as any).Twitch.Player('twitch-embed', options);
        twitchPlayerRef.current = player;

        player.addEventListener((window as any).Twitch.Player.READY, () => {
          console.log("Twitch Ready");
          player.setMuted(true);
          player.play();
        });

        player.addEventListener((window as any).Twitch.Player.ONLINE, () => {
          console.log("Twitch Online");
          setIsLive(true);
        });
        
        player.addEventListener((window as any).Twitch.Player.OFFLINE, () => {
          console.log("Twitch Offline");
          setIsLive(false);
        });
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
        // 1. Couper la radio si elle joue
        if (isRadioPlaying) {
            toggleRadio();
        }
        // 2. Activer le son du stream et forcer la lecture
        twitchPlayerRef.current.setMuted(false);
        twitchPlayerRef.current.setVolume(1.0);
        twitchPlayerRef.current.play(); // Force le play
        
        // 3. Changer l'état visuel
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
      particles.forEach(particle => { particle.update(); particle.draw(); });
      particles.forEach((particleA, indexA) => {
        particles.slice(indexA + 1).forEach(particleB => {
          const dx = particleA.x - particleB.x; const dy = particleA.y - particleB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(particleA.x, particleA.y);
            ctx.lineTo(particleB.x, particleB.y); ctx.stroke();
          }
        });
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', resizeCanvas); };
  }, []);


  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* === CONTAINER TWITCH === */}
      {/* CORRECTION ICI : Ajout de z-50 quand watchMode est actif pour passer DEVANT tout le reste */}
      <div className={`absolute inset-0 overflow-hidden transition-all duration-500 ${watchMode ? 'z-50' : 'z-0'}`}>
        <div 
          id="twitch-embed" 
          className={`w-full h-full object-cover transition-all duration-1000 
            ${isLive ? 'opacity-100' : 'opacity-0'}
            ${watchMode ? 'grayscale-0 pointer-events-auto' : 'grayscale contrast-125 opacity-60 pointer-events-none'}
          `}
        />
      </div>

      {/* === IMAGE DE FOND (Backup) === */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isLive ? 'opacity-0' : 'opacity-80'}`}>
        <img 
          src="/bg.jpg" 
          alt="Background" 
          className="w-full h-full object-cover image-vintage-effect" 
        />
        <div className="absolute inset-0 tv-noise-overlay pointer-events-none opacity-30" />
      </div>

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
            
            {/* BOUTON ENTER SITE */}
            <Link 
            href="/home"
            className="group relative overflow-hidden"
            >
            <div className="border border-white px-12 py-4 text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:bg-white hover:text-black backdrop-blur-md bg-black/30 font-bold">
                Enter Site
            </div>
            </Link>

            {/* BOUTON WATCH STREAM (Seulement si Live) */}
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